/**
 * ============================================================
 *  CHARACTER.JS — State & Rendering Karakter Pixel
 * ============================================================
 *  Mengelola posisi, arah hadap, dan sprite karakter pria (yang
 *  dapat digerakkan) serta karakter wanita (statis, menunggu).
 *
 *  CATATAN PENTING: setiap karakter terdiri dari 2 lapis elemen:
 *  - `.character` (wrapper)  → diposisikan via transform: translate(x,y) (JS)
 *  - `.character-sprite`     → menampilkan gambar & animasi CSS (bob/breathe)
 *  Pemisahan ini WAJIB karena animasi CSS pada `transform` akan menimpa
 *  nilai transform posisi inline jika diterapkan pada elemen yang sama.
 */
const Character = {
  groom: {
    el: null,
    spriteEl: null,
    x: 0,
    y: 0,
    width: 72,
    height: 108,
    facing: "down",
    moving: false,
    controlsEnabled: true,
  },
  bride: {
    el: null,
    spriteEl: null,
    x: 0,
    y: 0,
    width: 72,
    height: 108,
  },

  init() {
    this.groom.el = Utils.$("#groom-character");
    this.groom.spriteEl = Utils.$(".character-sprite", this.groom.el);
    this.bride.el = Utils.$("#bride-character");
    this.bride.spriteEl = Utils.$(".character-sprite", this.bride.el);

    this._applySpriteSize();
    this._setSprite(this.groom.spriteEl, WEDDING_CONFIG.characters.groom.idle);
    this._setSprite(this.bride.spriteEl, WEDDING_CONFIG.characters.bride.idle);
    this.bride.spriteEl.classList.add("idle-breathe");

    window.addEventListener("resize", () => this._applySpriteSize());
  },

  _applySpriteSize() {
    const cs = getComputedStyle(document.documentElement).getPropertyValue("--character-size").trim();
    const size = parseFloat(cs) || 72;
    this.groom.width = size;
    this.groom.height = size * 1.5;
    this.bride.width = size;
    this.bride.height = size * 1.5;
  },

  _setSprite(spriteEl, src) {
    spriteEl.style.backgroundImage = `url('${src}')`;
  },

  /** Update posisi & tampilan karakter pria setiap frame */
  updateGroom(x, y, facing, moving) {
    this.groom.x = x;
    this.groom.y = y;
    const px = Math.round(x);
    const py = Math.round(y);
    this.groom.el.style.transform = `translate3d(${px}px, ${py}px, 0)`;

    const sprites = WEDDING_CONFIG.characters.groom;

    // Saat berhenti, karakter TETAP memakai sprite arah terakhirnya (bukan
    // pindah ke sprite "idle" menghadap depan). Sebelumnya gambar berganti
    // mendadak di frame berhenti dan sosok kiri/kanan tiba-tiba melebar.
    // (groom_down identik dengan groom_idle, jadi menghadap bawah tak berubah.)
    if (facing !== this.groom.facing) {
      this.groom.facing = facing;
      this._setSprite(this.groom.spriteEl, sprites[facing] || sprites.idle);
    }

    if (moving !== this.groom.moving) {
      this.groom.moving = moving;
      if (moving) this._startWalk(this.groom.spriteEl);
      else this._endWalk(this.groom.spriteEl);
      this._setSprite(this.groom.spriteEl, sprites[this.groom.facing] || sprites.idle);
    }
  },

  _startWalk(spriteEl) {
    clearTimeout(this._settleTimer);
    spriteEl.style.transition = "";
    spriteEl.style.transform = "";
    spriteEl.classList.add("walking");
  },

  /**
   * Hentikan animasi jalan dengan halus. Kalau class "walking" langsung
   * dicabut, sprite yang sedang terangkat (sampai 5px) melompat balik ke 0
   * dalam satu frame. Di sini posisi saat itu "dibekukan" dulu, lalu
   * diturunkan pelan ke 0.
   */
  _endWalk(spriteEl) {
    clearTimeout(this._settleTimer);
    const current = getComputedStyle(spriteEl).transform;
    spriteEl.classList.remove("walking");
    if (!current || current === "none") return;
    spriteEl.style.transition = "none";
    spriteEl.style.transform = current;
    void spriteEl.offsetWidth; // paksa browser mencatat posisi beku tadi
    spriteEl.style.transition = "transform 140ms ease-out";
    spriteEl.style.transform = "translateY(0)";
    this._settleTimer = setTimeout(() => {
      spriteEl.style.transition = "";
      spriteEl.style.transform = "";
    }, 190);
  },

  setBridePosition(x, y) {
    this.bride.x = x;
    this.bride.y = y;
    const px = Math.round(x);
    const py = Math.round(y);
    this.bride.el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
  },

  /** Ganti sprite wanita menjadi versi tersenyum bahagia (dipakai saat cutscene) */
  brideSmile() {
    this._setSprite(this.bride.spriteEl, WEDDING_CONFIG.characters.bride.happy);
    this.bride.spriteEl.classList.remove("idle-breathe");
    gsap.fromTo(
      this.bride.spriteEl,
      { scale: 1 },
      { scale: 1.06, duration: 0.4, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  },

  centerOf(character) {
    return {
      x: character.x + character.width / 2,
      y: character.y + character.height * 0.25,
    };
  },
};
