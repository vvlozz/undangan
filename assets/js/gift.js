/**
 * ============================================================
 *  GIFT.JS — Interaksi Tambahan Section Gift
 * ============================================================
 *  Data rekening dirender oleh ContentBuilder; modul ini hanya
 *  menangani interaksi memperbesar QR code lewat lightbox.
 */
const Gift = {
  init() {
    const qr = Utils.$(".gift-qr");
    if (!qr) return;
    qr.style.cursor = "zoom-in";
    qr.addEventListener("click", () => {
      Utils.$("#lightbox-image").src = WEDDING_CONFIG.qrImage;
      Utils.$("#lightbox-caption").textContent = "QR Code Hadiah Digital";
      Utils.$("#lightbox").classList.add("open");
      MusicPlayer.playClick();
    });
  },
};
