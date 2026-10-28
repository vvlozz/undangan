/**
 * ============================================================
 *  GALLERY.JS — Foto besar + strip thumbnail + Lightbox
 * ============================================================
 *  - Foto besar bisa DIGESER (jari / mouse), atau pakai tombol panah ‹ ›.
 *  - Strip thumbnail berjalan otomatis; ketuk thumbnail → loncat ke foto itu.
 *  - Slide otomatis lanjut tiap AUTO_MS. Setiap interaksi (geser, panah,
 *    thumbnail) mengulang hitungan, jadi slide lanjut sendiri setelah tamu diam.
 *  - Ketuk foto besar → lightbox layar penuh (bisa digeser / panah juga).
 *  Tanpa caption.
 */
const Gallery = {
  index: 0,
  timer: null,
  AUTO_MS: 3000,
  SWIPE_PX: 45,

  init() {
    this.items = WEDDING_CONFIG.gallery || [];
    if (!this.items.length) return;
    this.stage = Utils.$("#gallery-stage");
    this.main = Utils.$("#gallery-main");
    this.backdrop = Utils.$("#gallery-backdrop-img");
    this.lightbox = Utils.$("#lightbox");
    this._renderStrip();
    this._show(0, false);
    this._bindMain();
    this._bindLightbox();
    this._startAuto();
  },

  _renderStrip() {
    const track = Utils.$("#gallery-track");
    const n = this.items.length;
    this.track = track;
    this.marquee = Utils.$("#gallery-marquee");
    // Tiga set berurutan: strip bisa berputar tanpa putus ke kedua arah.
    const html = this.items
      .map(
        (item, idx) => `
        <button type="button" class="gallery-thumb" data-index="${idx}" aria-label="Foto ${idx + 1}">
          <img src="${item.thumb || item.src}" alt="" draggable="false" />
        </button>`
      )
      .join("");
    track.innerHTML = html + html + html;

    // Bingkai tetap di tengah strip; thumbnail foto yang tampil selalu
    // digeser ke dalam bingkai ini.
    this.frame = document.createElement("div");
    this.frame.className = "gallery-frame-box";
    this.frame.setAttribute("aria-hidden", "true");
    this.marquee.appendChild(this.frame);

    track.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery-thumb");
      if (!btn) return;
      this._show(Number(btn.dataset.index), true);
      this._startAuto();
      MusicPlayer.playClick();
    });

    // Setelah geser selesai: kalau sudah keluar dari set tengah, loncat
    // diam-diam ke posisi setara di set tengah.
    track.addEventListener("transitionend", (e) => {
      if (e.target !== track) return;
      if (this.pos < n) this.pos += n;
      else if (this.pos >= 2 * n) this.pos -= n;
      this._centerStrip(false);
    });

    // Ukuran thumbnail baru final setelah gambar termuat / layar berubah
    const recenter = () => this._centerStrip(false);
    track.querySelectorAll("img").forEach((im) => {
      if (!im.complete) im.addEventListener("load", recenter, { once: true });
    });
    window.addEventListener("resize", recenter);
    window.addEventListener("load", recenter);
  },

  // Geser strip supaya thumbnail ke-this.pos berada tepat di tengah bingkai
  _centerStrip(animate) {
    const thumb = this.track.children[this.pos];
    if (!thumb) return;
    const x = thumb.offsetLeft + thumb.offsetWidth / 2;
    const shift = this.marquee.clientWidth / 2 - x;
    this.track.style.transition = animate ? "" : "none";
    this.track.style.transform = `translate3d(${shift}px, 0, 0)`;
    if (!animate) void this.track.offsetWidth;
    // bingkai mengikuti ukuran thumbnail
    this.frame.style.width = `${thumb.offsetWidth + 10}px`;
    this.frame.style.height = `${thumb.offsetHeight + 10}px`;
    Utils.$all(".gallery-thumb", this.track).forEach((el, k) =>
      el.classList.toggle("active", k === this.pos)
    );
  },

  _wrap(i) {
    const n = this.items.length;
    return ((i % n) + n) % n;
  },

  // Ganti foto dengan efek fade (dipakai auto-slide & thumbnail)
  _show(i, animate) {
    const n = this.items.length;
    const old = this.index;
    this.index = this._wrap(i);
    const item = this.items[this.index];
    if (this.pos === undefined) {
      this.pos = n + this.index;
      this._centerStrip(false);
    } else {
      // arah terpendek di lingkaran (mis. dari foto terakhir ke pertama = +1)
      let d = this.index - old;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      this.pos += d;
      this._centerStrip(animate !== false || d !== 0);
    }
    const apply = () => {
      this.backdrop.style.backgroundImage = `url("${item.thumb || item.src}")`;
      this.main.src = item.src;
      this.main.alt = `Foto ${this.index + 1}`;
      this.main.classList.remove("is-fading");
      this.backdrop.classList.remove("is-fading");
    };
    if (!animate) return apply();
    this.main.classList.add("is-fading");
    this.backdrop.classList.add("is-fading");
    const pre = new Image();
    pre.onload = pre.onerror = () => setTimeout(apply, 220);
    pre.src = item.src;
    new Image().src = this.items[this._wrap(this.index + 1)].src;
  },

  // Pindah foto dengan efek geser. dir: +1 = berikutnya, -1 = sebelumnya
  _slide(dir, fromPx = 0) {
    if (this.busy) return;
    this.busy = true;
    const el = this.main;
    const W = this.stage.clientWidth || 400;
    const item = this.items[this._wrap(this.index + dir)];
    const pre = new Image();
    const go = () => {
      el.classList.remove("is-dragging");
      el.classList.add("is-sliding");
      el.style.transform = `translateX(${-dir * W}px)`;
      el.style.opacity = "0";
      setTimeout(() => {
        el.classList.remove("is-sliding");
        this._show(this.index + dir, false);
        el.style.transform = `translateX(${dir * W}px)`;
        void el.offsetWidth; // paksa reflow
        el.classList.add("is-sliding");
        el.style.transform = "translateX(0)";
        el.style.opacity = "1";
        setTimeout(() => {
          el.classList.remove("is-sliding");
          el.style.transform = "";
          el.style.opacity = "";
          this.busy = false;
        }, 240);
      }, 230);
    };
    pre.onload = pre.onerror = go;
    pre.src = item.src;
    new Image().src = this.items[this._wrap(this.index + dir * 2)].src;
  },

  _startAuto() {
    clearInterval(this.timer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    this.timer = setInterval(() => {
      if (this.lightbox.classList.contains("open") || this.dragging) return;
      this._show(this.index + 1, true);
    }, this.AUTO_MS);
  },

  // Geser (jari/mouse) dengan Pointer Events; dipakai foto utama & lightbox
  _bindSwipe(area, { onMove, onEnd, onTap }) {
    let startX = 0, startY = 0, dx = 0, active = false, moved = false;
    area.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".gallery-nav")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      active = true; moved = false; dx = 0;
      startX = e.clientX; startY = e.clientY;
      try { area.setPointerCapture(e.pointerId); } catch (_) {}
    });
    area.addEventListener("pointermove", (e) => {
      if (!active) return;
      dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        this.dragging = true;
      }
      if (moved) onMove(dx);
    });
    const finish = (e, cancelled) => {
      if (!active) return;
      active = false;
      this.dragging = false;
      try { area.releasePointerCapture(e.pointerId); } catch (_) {}
      if (moved) onEnd(cancelled ? 0 : dx);
      else if (!cancelled) onTap();
    };
    area.addEventListener("pointerup", (e) => finish(e, false));
    area.addEventListener("pointercancel", (e) => finish(e, true));
  },

  _bindMain() {
    const el = this.main;
    this._bindSwipe(this.stage, {
      onMove: (dx) => {
        if (this.busy) return;
        this.stage.classList.add("is-dragging");
        el.classList.add("is-dragging");
        el.style.transform = `translateX(${dx}px)`;
      },
      onEnd: (dx) => {
        this.stage.classList.remove("is-dragging");
        el.classList.remove("is-dragging");
        this._startAuto();
        if (this.busy) return;
        if (Math.abs(dx) >= this.SWIPE_PX) {
          this._slide(dx < 0 ? 1 : -1);
        } else {
          el.classList.add("is-sliding");
          el.style.transform = "";
          setTimeout(() => el.classList.remove("is-sliding"), 240);
        }
      },
      onTap: () => {
        this._openLightbox(this.index);
        MusicPlayer.playClick();
      },
    });
    Utils.$("#gallery-prev").addEventListener("click", () => {
      this._slide(-1); this._startAuto(); MusicPlayer.playClick();
    });
    Utils.$("#gallery-next").addEventListener("click", () => {
      this._slide(1); this._startAuto(); MusicPlayer.playClick();
    });
  },

  _bindLightbox() {
    const lb = this.lightbox;
    const img = Utils.$("#lightbox-image");
    Utils.$("#lightbox-close").addEventListener("click", () => this._closeLightbox());
    lb.addEventListener("click", (e) => {
      if (e.target === lb) this._closeLightbox();
    });
    const step = (dir) => {
      this.lbIndex = this._wrap(this.lbIndex + dir);
      img.src = this.items[this.lbIndex].src;
      this.index = this.lbIndex;
      this._show(this.index, false);
      this._startAuto();
    };
    Utils.$("#lightbox-prev").addEventListener("click", () => step(-1));
    Utils.$("#lightbox-next").addEventListener("click", () => step(1));
    this._bindSwipe(lb, {
      onMove: (dx) => {
        if (lb.classList.contains("no-nav")) return;
        img.style.transition = "none";
        img.style.transform = `translateX(${dx}px)`;
      },
      onEnd: (dx) => {
        img.style.transition = "";
        img.style.transform = "";
        if (lb.classList.contains("no-nav")) return;
        if (Math.abs(dx) >= this.SWIPE_PX) step(dx < 0 ? 1 : -1);
      },
      onTap: () => {},
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this._closeLightbox();
      if (!lb.classList.contains("open") || lb.classList.contains("no-nav")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  },

  _openLightbox(index) {
    this.lbIndex = index;
    Utils.$("#lightbox-image").src = this.items[index].src;
    Utils.$("#lightbox-caption").textContent = "";
    this.lightbox.classList.remove("no-nav");
    this.lightbox.classList.add("open");
  },

  _closeLightbox() {
    this.lightbox.classList.remove("open");
  },
};
