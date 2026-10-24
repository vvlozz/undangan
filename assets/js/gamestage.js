/**
 * ============================================================
 *  GAMESTAGE.JS — Game Loop, Kamera, & Deteksi Proximity
 * ============================================================
 *  Modul inti yang menghubungkan input (Controls/Joystick) dengan
 *  pergerakan karakter, kamera yang mengikuti pemain secara halus,
 *  serta pemicu popup section dan cutscene pertemuan.
 */
const GameStage = {
  SPEED: 2.5, // px per frame at 60fps; tuned for responsive navigation
  VELOCITY_SMOOTH_MS: 60, // lama "ease" mulai/berhenti jalan (makin kecil makin responsif)
  POPUP_RADIUS: 230,
  CUTSCENE_RADIUS: 100,

  stage: null,
  frame: null,
  bounds: { width: 0, height: 0 },
  sectionTriggers: [],
  nearSection: null,
  lastFrameTime: 0,
  cutsceneTriggered: false,
  _moveHintDismissed: false,
  _layoutQueued: false,
  _resizeObserver: null,
  _vel: { x: 0, y: 0 },
  _cameraSettling: false,
  _settleFrames: 0,

  init() {
    this.stage = Utils.$("#game-stage");
    this.frame = Utils.$("#app-frame");
    this._recalculateBounds();
    this._placeInitialPositions();

    // Layout measurement is intentionally event-driven. Measuring scrollHeight
    // and getBoundingClientRect() on every animation frame caused layout
    // thrashing, especially on mobile Safari/Chrome while the page was moving.
    window.addEventListener("resize", Utils.debounce(() => this._queueLayoutRefresh(), 120));
    window.addEventListener("load", () => this._queueLayoutRefresh());

    if (window.ResizeObserver && this.frame) {
      this._resizeObserver = new ResizeObserver(() => this._queueLayoutRefresh());
      this._resizeObserver.observe(this.frame);
    }

    // Catch late-loading images/content once without putting measurement work
    // back into the main game loop.
    setTimeout(() => this._queueLayoutRefresh(), 1200);

    requestAnimationFrame((t) => this._loop(t));
  },

  _queueLayoutRefresh() {
    if (this._layoutQueued) return;
    this._layoutQueued = true;
    requestAnimationFrame(() => {
      this._layoutQueued = false;
      this._onResize();
    });
  },

  _recalculateBounds() {
    // Pakai lebar #app-frame (bukan window.innerWidth) supaya karakter &
    // popup tetap terkurung di dalam kartu selebar HP, walau dibuka di PC.
    this.bounds.width = this.stage ? this.stage.offsetWidth : window.innerWidth;
    this.bounds.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

    if (this.stage) this.stage.style.height = `${this.bounds.height}px`;

    // Cache section trigger positions in document coordinates. This removes
    // repeated getBoundingClientRect() calls from the 60fps game loop.
    this.sectionTriggers = Utils.$all("[data-popup]").map((section) => {
      const rect = section.getBoundingClientRect();
      return {
        id: section.dataset.popup,
        centerY: rect.top + window.scrollY + rect.height / 2,
      };
    });
  },

  _placeInitialPositions() {
    // Karakter pria mulai di tengah-bawah section Hero
    const groom = Character.groom;
    groom.x = this.bounds.width / 2 - groom.width / 2;
    groom.y = window.innerHeight * 0.62;
    Character.updateGroom(groom.x, groom.y, "down", false);

    this._placeBride();
  },

  _placeBride() {
    const closingSection = Utils.$("#closing");
    if (!closingSection) return;
    const rect = closingSection.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionBottom = sectionTop + rect.height;
    const bride = Character.bride;

    // Tempatkan pasangan di area tengah section penutup, bukan terlalu dekat
    // tepi bawah. Bride berada sedikit di kanan agar groom + bride membentuk
    // satu komposisi yang terpusat saat cutscene selesai.
    const gap = 20; // Jarak akhir pasangan dibuat lebih dekat agar terasa benar-benar bertemu
    bride.x = this.bounds.width / 2 + gap / 2;
    bride.y = sectionTop + (sectionBottom - sectionTop) * 0.52 - bride.height / 2;
    Character.setBridePosition(bride.x, bride.y);
  },

  _onResize() {
    this._recalculateBounds();
    this._placeBride();
  },

  _loop(timestamp) {
    const dt = this.lastFrameTime ? Math.min((timestamp - this.lastFrameTime) / 16.67, 2.5) : 1;
    this.lastFrameTime = timestamp;

    this._updateMovement(dt);
    this._updateCamera();
    this._checkSectionProximity();
    this._checkCutsceneProximity();

    requestAnimationFrame((t) => this._loop(t));
  },

  _updateMovement(dt) {
    if (Cutscene.isPlaying || !Controls.enabled) {
      this._vel.x = 0;
      this._vel.y = 0;
      return; // input dibekukan selama cutscene / animasi masuk
    }

    const vector = Controls.getVector();
    const groom = Character.groom;
    // Histeresis: ambang START bergerak (0.08) lebih tinggi dari ambang
    // BERHENTI (0.03), supaya input yang bergoyang tipis di sekitar satu
    // ambang tidak membuat karakter gonta-ganti diam<->jalan tiap frame.
    const magnitude = Math.max(Math.abs(vector.x), Math.abs(vector.y));
    const inputActive = groom.moving ? magnitude > 0.03 : magnitude > 0.08;

    // Kecepatan dihaluskan (±60 ms) agar mulai & berhenti terasa mengalir,
    // tidak langsung 0 saat jari dilepas dari joystick. Dibuat tak bergantung
    // pada frame-rate lewat rumus eksponensial.
    const k = 1 - Math.exp(-(dt * 16.67) / this.VELOCITY_SMOOTH_MS);
    const targetX = inputActive ? vector.x : 0;
    const targetY = inputActive ? vector.y : 0;
    this._vel.x += (targetX - this._vel.x) * k;
    this._vel.y += (targetY - this._vel.y) * k;

    const speedNow = Math.max(Math.abs(this._vel.x), Math.abs(this._vel.y));
    const moving = inputActive || speedNow > 0.05;

    if (moving) {
      if (!this._moveHintDismissed) this._dismissMoveHint();

      const nextX = groom.x + this._vel.x * this.SPEED * dt;
      const nextY = groom.y + this._vel.y * this.SPEED * dt;

      // Batas bawah TAMBAHAN: karakter tidak boleh melangkah lebih jauh
      // dari tepi bawah layar yang sedang terlihat saat ini — supaya
      // karakter tidak "kebablasan" turun mendahului scroll halaman
      // (yang mengikutinya secara halus/lerp tiap frame di _updateCamera).
      const viewportFloor = window.scrollY + window.innerHeight - groom.height - 90;

      groom.x = Utils.clamp(nextX, 0, this.bounds.width - groom.width);
      groom.y = Utils.clamp(
        nextY,
        60,
        Math.min(this.bounds.height - groom.height - 40, viewportFloor)
      );

      // Arah hadap hanya diperbarui selama ada input nyata (bukan saat
      // meluncur berhenti). Histeresis: sumbu dominan harus unggul > 0.1,
      // dan kiri/kanan harus melewati 0.08, supaya tidak berkedip.
      let facing = groom.facing;
      if (inputActive) {
        const absX = Math.abs(vector.x);
        const absY = Math.abs(vector.y);
        if (absY > absX + 0.1) {
          facing = vector.y < 0 ? "up" : "down";
        } else if (absX > absY + 0.1) {
          if (vector.x < -0.08) facing = "left";
          else if (vector.x > 0.08) facing = "right";
        }
      }

      if (Math.random() < 0.06 * dt) MusicPlayer.playStep();
      Character.updateGroom(groom.x, groom.y, facing, true);
    } else {
      this._vel.x = 0;
      this._vel.y = 0;
      Character.updateGroom(groom.x, groom.y, groom.facing, false);
    }
  },

  /** Sembunyikan bubble "Gerakkan karakter untuk menjelajah" begitu karakter pertama kali digerakkan */
  _dismissMoveHint() {
    this._moveHintDismissed = true;
    const hint = Utils.$("#move-hint");
    const joystick = Utils.$("#virtual-joystick");
    if (hint) hint.classList.add("dismissed");
    if (joystick) joystick.classList.remove("needs-attention");

    // Kalau pesan ajakan "Yuk, ajak aku menemui ..." kebetulan lagi
    // tampil pas tamu mulai gerak, langsung sembunyikan juga (tidak perlu
    // menunggu auto-hide) supaya tidak menghalangi pandangan saat berjalan.
    if (Popup.lastShownSection === "hero-invite") Popup.hide();
  },

  /**
   * Kamera mengikuti karakter secara halus (lerp). Setelah karakter berhenti,
   * kamera tetap melanjutkan beberapa frame sampai benar-benar sampai target,
   * jadi layar melambat dan berhenti mulus (tidak terhenti mendadak).
   */
  _updateCamera() {
    if (Cutscene.isPlaying || !Controls.enabled) return;

    const moving = Character.groom.moving;
    if (moving) {
      this._cameraSettling = true;
      this._settleFrames = 0;
    } else if (!this._cameraSettling) {
      return;
    }

    const maxScroll = this.bounds.height - window.innerHeight;
    const targetScroll = Utils.clamp(
      Character.groom.y - window.innerHeight * 0.55,
      0,
      Math.max(0, maxScroll)
    );
    const current = window.scrollY;
    const next = current + (targetScroll - current) * 0.38;

    if (Math.abs(next - current) > 0.5) {
      window.scrollTo({ top: Math.round(next), left: 0, behavior: "auto" });
    } else if (!moving) {
      this._cameraSettling = false;
    }

    // Pengaman: jangan pernah "menyelesaikan" lebih dari ~0,7 detik
    if (!moving && ++this._settleFrames > 40) this._cameraSettling = false;
  },

  _checkSectionProximity() {
    if (Cutscene.isPlaying || !Controls.enabled) return;
    const groomCenter = Character.centerOf(Character.groom);

    let closestId = null;
    let closestDist = Infinity;

    this.sectionTriggers.forEach((section) => {
      const dist = Math.abs(groomCenter.y - section.centerY);
      if (dist < this.POPUP_RADIUS && dist < closestDist) {
        closestDist = dist;
        closestId = section.id;
      }
    });

    Character.groom.el.classList.toggle("near-trigger", !!closestId);

    if (closestId && closestId !== this.nearSection) {
      this.nearSection = closestId;
      const message = WEDDING_CONFIG.sectionMessages[closestId];
      if (message) {
        const popupX = Character.groom.x + Character.groom.width / 2;
        const popupY = Character.groom.y - 18;
        Popup.show(closestId, popupX, popupY, message);
      }
    } else if (closestId && closestId === this.nearSection) {
      // Perbarui posisi popup agar tetap mengikuti karakter selama masih dalam radius
      const popupX = Character.groom.x + Character.groom.width / 2;
      const popupY = Character.groom.y - 18;
      Popup.updatePosition(popupX, popupY);
    } else if (!closestId) {
      if (this.nearSection) Popup.resetTrigger(this.nearSection);
      this.nearSection = null;
    }
  },

  _checkCutsceneProximity() {
    if (this.cutsceneTriggered || Cutscene.isPlaying || !Controls.enabled) return;

    const groomCenter = Character.centerOf(Character.groom);
    const brideCenter = Character.centerOf(Character.bride);
    const dist = Utils.distance(groomCenter.x, groomCenter.y, brideCenter.x, brideCenter.y);

    if (dist < this.CUTSCENE_RADIUS) {
      this.cutsceneTriggered = true;
      Cutscene.trigger();
    }
  },
};
