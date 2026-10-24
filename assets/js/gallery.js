/**
 * ============================================================
 *  GALLERY.JS — Foto besar + strip thumbnail bergerak + Lightbox
 * ============================================================
 *  - Strip thumbnail berjalan otomatis (marquee tanpa putus).
 *  - Foto besar di atas strip berganti otomatis & saat thumbnail diketuk.
 *  - Ketuk foto besar → lightbox layar penuh.
 *  Rasio asli tiap foto dipertahankan (landscape tetap landscape).
 */
const Gallery = {
  index: 0,
  timer: null,
  AUTO_MS: 4500,

  init() {
    this.items = WEDDING_CONFIG.gallery || [];
    if (!this.items.length) return;
    this.main = Utils.$("#gallery-main");
    this.backdrop = Utils.$("#gallery-backdrop-img");
    this.caption = Utils.$("#gallery-main-caption");
    this._renderStrip();
    this._show(0, false);
    this._bindMain();
    this._bindLightbox();
    this._startAuto();
  },

  _renderStrip() {
    const track = Utils.$("#gallery-track");
    const html = (set) =>
      this.items
        .map(
          (item, idx) => `
        <button type="button" class="gallery-thumb" data-index="${idx}"
          ${set ? 'aria-hidden="true" tabindex="-1"' : ""}
          aria-label="${item.caption}">
          <img src="${item.thumb || item.src}" alt="${set ? "" : item.caption}" draggable="false" />
        </button>`
        )
        .join("");
    // Dua set berurutan → animasi -50% terlihat berputar tanpa putus
    track.innerHTML = html(0) + html(1);
    track.style.setProperty("--marquee-duration", `${this.items.length * 5}s`);

    // Jalankan animasi setelah semua thumbnail selesai dimuat (atau maks 3 dtk).
    // Di Safari, animasi yang dimulai saat lebar track belum final bisa
    // tidak tergambar sampai layar disentuh.
    const imgs = Array.from(track.querySelectorAll("img"));
    const loaded = Promise.all(
      imgs.map((im) =>
        im.complete
          ? Promise.resolve()
          : new Promise((r) => {
              im.addEventListener("load", r, { once: true });
              im.addEventListener("error", r, { once: true });
            })
      )
    );
    Promise.race([loaded, new Promise((r) => setTimeout(r, 3000))]).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => track.classList.add("is-ready")));
    });

    track.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery-thumb");
      if (!btn) return;
      this._show(Number(btn.dataset.index), true);
      this._startAuto();
      MusicPlayer.playClick();
    });

    // Jeda gerakan saat disentuh / di-hover agar mudah mengetuk
    const marquee = Utils.$("#gallery-marquee");
    const pause = () => marquee.classList.add("is-paused");
    const resume = () => marquee.classList.remove("is-paused");
    marquee.addEventListener("mouseenter", pause);
    marquee.addEventListener("mouseleave", resume);
    marquee.addEventListener("touchstart", pause, { passive: true });
    marquee.addEventListener("touchend", () => setTimeout(resume, 1200), { passive: true });
    marquee.addEventListener("touchcancel", resume, { passive: true });
  },

  _show(i, animate) {
    const n = this.items.length;
    this.index = ((i % n) + n) % n;
    const item = this.items[this.index];
    const apply = () => {
      // Tinggi area foto SENGAJA dibuat tetap (lihat .gallery-stage di CSS).
      // Kalau tingginya mengikuti rasio foto, seluruh halaman di bawah galeri
      // ikut bergeser tiap foto potret <-> landscape berganti. Foto landscape
      // cukup ditaruh di tengah; sisa ruangnya diisi salinan buram fotonya.
      this.backdrop.style.backgroundImage = `url("${item.thumb || item.src}")`;
      this.main.src = item.src;
      this.main.alt = item.caption;
      this.caption.textContent = item.caption;
      this.main.classList.remove("is-fading");
      this.backdrop.classList.remove("is-fading");
    };
    Utils.$all(".gallery-thumb").forEach((el) =>
      el.classList.toggle("active", Number(el.dataset.index) === this.index)
    );
    if (!animate) return apply();
    this.main.classList.add("is-fading");
    this.backdrop.classList.add("is-fading");
    // Muat dulu foto berikutnya agar pergantian mulus
    const pre = new Image();
    pre.onload = pre.onerror = () => setTimeout(apply, 220);
    pre.src = item.src;
    // pra-muat foto sesudahnya
    const next = this.items[(this.index + 1) % n];
    new Image().src = next.src;
  },

  _startAuto() {
    clearInterval(this.timer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    this.timer = setInterval(() => {
      if (Utils.$("#lightbox").classList.contains("open")) return;
      this._show(this.index + 1, true);
    }, this.AUTO_MS);
  },

  _bindMain() {
    Utils.$("#gallery-stage").addEventListener("click", () => {
      this._openLightbox(this.index);
      MusicPlayer.playClick();
    });
  },

  _bindLightbox() {
    const lightbox = Utils.$("#lightbox");
    Utils.$("#lightbox-close").addEventListener("click", () => this._closeLightbox());
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) this._closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this._closeLightbox();
    });
  },

  _openLightbox(index) {
    const item = this.items[index];
    Utils.$("#lightbox-image").src = item.src;
    Utils.$("#lightbox-caption").textContent = item.caption;
    Utils.$("#lightbox").classList.add("open");
  },

  _closeLightbox() {
    Utils.$("#lightbox").classList.remove("open");
  },
};
