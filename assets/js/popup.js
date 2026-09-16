/**
 * ============================================================
 *  POPUP.JS — Popup Dialog Informasi Section
 * ============================================================
 *  Popup muncul di atas karakter pria saat mendekati section
 *  tertentu, dengan animasi fade halus dan auto-hide.
 */
const Popup = {
  el: null,
  textEl: null,
  hideTimeout: null,
  lastShownSection: null,

  init() {
    this.el = Utils.$("#popup-dialog");
    this.textEl = Utils.$("#popup-dialog-text");
  },

  /**
   * Menampilkan popup di atas posisi (x, y) dokumen dengan pesan tertentu.
   * sectionId dipakai agar popup yang sama tidak berulang kali muncul.
   */
  show(sectionId, x, y, message) {
    if (this.lastShownSection === sectionId && this.el.classList.contains("visible")) return;
    this.lastShownSection = sectionId;

    this.textEl.textContent = message;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;

    requestAnimationFrame(() => this.el.classList.add("visible"));

    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => this.hide(), 3200);
  },

  updatePosition(x, y) {
    if (!this.el.classList.contains("visible")) return;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
  },

  hide() {
    this.el.classList.remove("visible");
    clearTimeout(this.hideTimeout);
  },

  /** Reset agar popup section tertentu dapat muncul lagi setelah karakter menjauh & kembali */
  resetTrigger(sectionId) {
    if (this.lastShownSection === sectionId) {
      this.lastShownSection = null;
    }
  },
};
