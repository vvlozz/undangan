/**
 * ============================================================
 *  GALLERY.JS — Grid Galeri & Lightbox
 * ============================================================
 */
const Gallery = {
  init() {
    this._renderGrid();
    this._bindLightbox();
  },

  _renderGrid() {
    const grid = Utils.$("#gallery-grid");
    grid.innerHTML = WEDDING_CONFIG.gallery
      .map(
        (item, idx) => `
        <div class="gallery-item" data-index="${idx}">
          <div class="gallery-photo">
            <img src="${item.src}" alt="${item.caption}" loading="lazy" />
          </div>
          <span class="gallery-caption">${item.caption}</span>
        </div>`
      )
      .join("");

    Utils.$all(".gallery-item", grid).forEach((el) => {
      el.addEventListener("click", () => {
        const idx = Number(el.dataset.index);
        this._openLightbox(idx);
        MusicPlayer.playClick();
      });
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
    const item = WEDDING_CONFIG.gallery[index];
    Utils.$("#lightbox-image").src = item.src;
    Utils.$("#lightbox-caption").textContent = item.caption;
    Utils.$("#lightbox").classList.add("open");
  },

  _closeLightbox() {
    Utils.$("#lightbox").classList.remove("open");
  },
};
