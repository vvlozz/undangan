/**
 * ============================================================
 *  VIEWPORTLOCK.JS — Kunci Zoom & Kunci Scroll Manual di Mobile
 * ============================================================
 *  Meta viewport (user-scalable=no) & CSS touch-action sudah mencegah
 *  sebagian besar zoom/scroll, tapi beberapa browser (terutama Safari
 *  iOS versi tertentu & sebagian browser Android) tetap mengizinkan
 *  gesture pinch-zoom, double-tap zoom, ATAU tetap membolehkan swipe
 *  scroll manual walau CSS touch-action sudah diset none — CSS saja
 *  tidak selalu konsisten di semua browser. Modul ini menutup celah
 *  itu di level JavaScript, tanpa mengganggu tombol/link/input, atau
 *  drag di joystick & slider volume musik.
 */
const ViewportLock = {
  lastTouchEnd: 0,

  init() {
    // Cek sekali di awal: true kalau perangkat ini pakai input sentuh
    // (HP/tablet), false kalau mouse (desktop/laptop) — scroll manual
    // dengan mouse/scroll-wheel di desktop TIDAK disentuh sama sekali.
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    // Safari: cegah event gesture pinch-zoom native
    document.addEventListener("gesturestart", (e) => e.preventDefault());
    document.addEventListener("gesturechange", (e) => e.preventDefault());
    document.addEventListener("gestureend", (e) => e.preventDefault());

    // 1) Cegah pinch-zoom dengan 2 jari di browser lain (non-Safari) — semua perangkat.
    // 2) Khusus perangkat sentuh: cegah juga swipe scroll manual dengan 1 jari,
    //    supaya satu-satunya cara berpindah/menjelajah adalah lewat joystick HUD.
    document.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
          return;
        }
        if (!isTouchDevice) return; // desktop/laptop: jangan diutak-atik

        // Kecualikan elemen yang memang butuh gesture sentuhnya sendiri:
        // joystick (drag untuk gerak karakter) & slider volume musik.
        // e.target tetap konsisten ke elemen awal sentuhan dimulai
        // sepanjang gesture ini berlangsung (perilaku baku touch event).
        const needsOwnGesture = e.target.closest(".joystick-base, #virtual-joystick, .music-volume");
        if (!needsOwnGesture) e.preventDefault();
      },
      { passive: false }
    );

    // Cegah double-tap zoom, tanpa memblokir tap tunggal pada tombol/link/input
    document.addEventListener(
      "touchend",
      (e) => {
        const now = Date.now();
        const isInteractive = e.target.closest(
          "button, a, input, select, textarea, .joystick-base, [role='button']"
        );
        if (now - this.lastTouchEnd <= 300 && !isInteractive) {
          e.preventDefault();
        }
        this.lastTouchEnd = now;
      },
      { passive: false }
    );
  },
};
