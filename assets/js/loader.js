/**
 * ============================================================
 *  LOADER.JS — Loading Screen
 * ============================================================
 *  Menampilkan progress bar sembari SUNGGUH-SUNGGUH memuat aset
 *  penting (sprite karakter tiap arah, foto hero) ke cache
 *  browser, baru memudar keluar saat semuanya siap.
 *
 *  PENTING: sprite karakter (pria: idle/up/down/left/right,
 *  wanita: idle/happy) masing-masing adalah FILE GAMBAR TERPISAH.
 *  Kalau tidak di-preload di sini, gambar arah yang belum pernah
 *  dipakai baru di-download browser saat itu juga ketika karakter
 *  pertama kali menghadap ke arah tersebut — inilah yang
 *  menyebabkan karakter "berubah bentuk"/kosong sepersekian detik
 *  saat pertama kali berjalan ke arah baru (mis. saat mendekati
 *  section yang memicu text box popup).
 */
const Loader = {
  captions: [
    "Menyiapkan undangan...",
    "Merangkai kelopak bunga...",
    "Menata jalan cerita...",
    "Hampir siap...",
  ],

  /** Kumpulkan semua path gambar penting yang wajib siap sebelum interaksi dimulai */
  _getPreloadUrls() {
    const chars = WEDDING_CONFIG.characters;
    const urls = [
      ...Object.values(chars.groom),
      ...Object.values(chars.bride),
      "assets/images/hero.jpg",
      // Background section & halaman — di-preload juga supaya tidak ada
      // jeda "flash" abu-abu/kosong saat layar loading hilang dan
      // tombol "Buka Undangan" mulai bisa diklik.
      "assets/images/backgrounds/bg-page.jpg",
      "assets/images/backgrounds/bg-lovestory.png",
      // Dekorasi section Opening (section langsung setelah Hero) — ikut
      // di-preload supaya tidak ada ikon "gambar belum siap/rusak" yang
      // sempat kelihatan kalau bagian atas section ini ter-expose lebih awal.
      "assets/images/stempel.png",
      "assets/effects/ayat-flower-tr.png",
      "assets/effects/ayat-flower-bl.png",
      "assets/images/frame-corner-tr.png",
      "assets/images/frame-corner-bl.png",
    ];
    return [...new Set(urls)];
  },

  /** Preload satu gambar; resolve baik sukses maupun gagal (supaya 1 aset rusak tidak nge-block loading selamanya) */
  _preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
  },

  _preloadAll() {
    return Promise.all(this._getPreloadUrls().map((src) => this._preloadImage(src)));
  },

  init(onComplete) {
    const fill = Utils.$("#loading-bar-fill");
    const caption = Utils.$("#loading-caption");
    const screen = Utils.$("#loading-screen");

    let progress = 0;
    let captionIndex = 0;
    let fakeProgressDone = false;
    let assetsReady = false;

    const tryFinish = () => {
      if (!fakeProgressDone || !assetsReady) return;
      caption.textContent = "Selamat datang!";
      setTimeout(() => {
        screen.classList.add("fade-out");
        // "is-revealed" memicu animasi masuk kartu hero (lihat design.css)
        // TEPAT di momen ini — bukan dari saat halaman dimuat — supaya
        // tamu benar-benar melihat efek fade/slide-nya, selaras dengan
        // layar loading yang memudar, bukan langsung "muncul jadi".
        const main = Utils.$("#main-content");
        main.classList.remove("hidden-until-ready");
        main.classList.add("is-revealed");
        if (onComplete) onComplete();
      }, 450);
    };

    // Animasi progress bar (kosmetik, memberi kesan proses berjalan halus)
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        fill.style.width = "100%";
        fakeProgressDone = true;
        tryFinish();
        return;
      }
      fill.style.width = `${progress}%`;
      captionIndex = Math.min(this.captions.length - 1, Math.floor(progress / 30));
      caption.textContent = this.captions[captionIndex];
    }, 220);

    // Preload aset SUNGGUHAN (sprite tiap arah karakter + foto hero) — baru
    // dianggap selesai setelah benar-benar tersimpan di cache browser.
    this._preloadAll().then(() => {
      assetsReady = true;
      tryFinish();
    });
  },
};
