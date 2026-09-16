/**
 * ============================================================
 *  MUSICPLAYER.JS — Kontrol Musik & SFX (Howler.js)
 * ============================================================
 *
 *  🎵 CARA GANTI MUSIK / SUARA:
 *  1. Taruh file musik/suara baru Anda ke folder assets/music/
 *     atau assets/sfx/ (format .mp3, .wav, atau .ogg semua bisa).
 *  2. Ubah nama file pada MUSIC_TRACKS / SFX_TRACKS di bawah ini
 *     agar sesuai dengan nama file yang Anda taruh.
 *  Tidak perlu mengubah kode lain — cukup 2 langkah di atas.
 * ============================================================
 */

// ---------- Musik latar (loop) ----------
const MUSIC_TRACKS = {
  bgm: "assets/music/bgm.mp3", // Musik utama, diputar sejak "Buka Undangan"
  romantic: "assets/music/romantic.mp3", // Musik saat cutscene pertemuan di penutup
};

// ---------- Efek suara (SFX, sekali putar) ----------
const SFX_TRACKS = {
  click: "assets/sfx/click.mp3", // Suara saat tombol/kartu diklik
  step: "assets/sfx/step.mp3", // Suara langkah kaki saat karakter berjalan
};

const MusicPlayer = {
  bgm: null,
  romantic: null,
  sfxClick: null,
  sfxStep: null,
  isPlaying: false,
  currentVolume: 0.6,
  _stepCooldown: false,
  _bgmFallbackTried: false,
  _romanticFallbackTried: false,

  init() {
    // Web Audio API (html5:false) dipakai supaya slider volume berfungsi
    // normal di semua platform (termasuk iOS, yang MENGABAIKAN audio.volume
    // kalau pakai <audio> HTML5 biasa/html5:true). _createBgmHowl/
    // _createRomanticHowl di bawah punya jaring pengaman: kalau load/play
    // gagal (atau macet tanpa error sama sekali selama >2 detik), otomatis
    // dibuat ulang pakai html5:true supaya musik tetap bisa terdengar.
    this.bgm = this._createBgmHowl(false);
    this.romantic = this._createRomanticHowl(false);

    this.sfxClick = new Howl({ src: [SFX_TRACKS.click], volume: 0.5 });
    this.sfxStep = new Howl({ src: [SFX_TRACKS.step], volume: 0.25 });

    this._bindUI();
  },

  _createBgmHowl(html5) {
    return new Howl({
      src: [MUSIC_TRACKS.bgm],
      loop: true,
      volume: this.currentVolume,
      html5,
      onloaderror: (id, err) => this._fallbackBgm(err, "load"),
      onplayerror: (id, err) => this._fallbackBgm(err, "play"),
    });
  },

  _createRomanticHowl(html5) {
    return new Howl({
      src: [MUSIC_TRACKS.romantic],
      loop: true,
      volume: 0,
      html5,
      onloaderror: (id, err) => this._fallbackRomantic(err, "load"),
      onplayerror: (id, err) => this._fallbackRomantic(err, "play"),
    });
  },

  /** Jaring pengaman: pindah ke html5 audio kalau Web Audio gagal load/play BGM */
  _fallbackBgm(err, stage) {
    if (this._bgmFallbackTried) return; // sudah pernah fallback sekali, jangan diulang terus
    this._bgmFallbackTried = true;
    console.warn(`[MusicPlayer] BGM gagal ${stage} lewat Web Audio, fallback ke html5 audio:`, err);
    this.bgm = this._createBgmHowl(true);
    if (this.isPlaying) this.bgm.play(); // lanjutkan muter kalau memang seharusnya sedang jalan
  },

  /** Jaring pengaman yang sama untuk musik romantis (cutscene penutup) */
  _fallbackRomantic(err, stage) {
    if (this._romanticFallbackTried) return;
    this._romanticFallbackTried = true;
    console.warn(`[MusicPlayer] Musik romantis gagal ${stage} lewat Web Audio, fallback ke html5 audio:`, err);
    this.romantic = this._createRomanticHowl(true);
  },

  _bindUI() {
    const toggleBtn = Utils.$("#music-toggle-btn");
    const panel = Utils.$("#music-panel");
    const playPauseBtn = Utils.$("#music-play-pause");
    const playPauseIcon = Utils.$("#play-pause-icon");
    const volumeSlider = Utils.$("#music-volume");

    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("expanded");
    });

    playPauseBtn.addEventListener("click", () => {
      if (this.isPlaying) {
        this.pause();
        playPauseIcon.src = "assets/icons/play.png";
      } else {
        this.play();
        playPauseIcon.src = "assets/icons/pause.png";
      }
    });

    volumeSlider.addEventListener("input", (e) => {
      this.setVolume(e.target.value / 100);
    });
  },

  /** Mulai memutar musik latar (dipanggil setelah tombol "Buka Undangan") */
  play() {
    // Jaring pengaman: di sebagian browser HP, AudioContext bisa dalam
    // keadaan "suspended" walau ini dipanggil dari dalam sentuhan/klik
    // pengguna. resume() eksplisit di sini tidak berbahaya dipanggil
    // walau contextnya sudah aktif (no-op kalau memang sudah "running").
    if (typeof Howler !== "undefined" && Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume();
    }
    if (!this.bgm.playing()) this.bgm.play();
    this.isPlaying = true;
    Utils.$("#music-toggle-btn").classList.remove("paused");

    // Jaring pengaman KEDUA (selain onloaderror/onplayerror di atas):
    // di sebagian device, proses decode Web Audio bisa MACET DIAM-DIAM
    // tanpa pernah memicu error sama sekali. Cek 2 detik kemudian: kalau
    // ternyata masih belum benar-benar bunyi, paksa pindah ke mode html5
    // audio yang jauh lebih sederhana & jarang macet.
    setTimeout(() => {
      if (this.isPlaying && !this._bgmFallbackTried && !this.bgm.playing()) {
        console.warn("[MusicPlayer] BGM belum bunyi setelah 2 detik, paksa fallback ke html5 audio.");
        this._fallbackBgm("timeout, tidak ada error tapi tidak juga bunyi", "timeout");
      }
    }, 2000);
  },

  pause() {
    this.bgm.pause();
    this.romantic.pause();
    this.isPlaying = false;
    Utils.$("#music-toggle-btn").classList.add("paused");
  },

  setVolume(v) {
    this.currentVolume = v;
    this.bgm.volume(v);
  },

  playClick() {
    if (this.sfxClick) this.sfxClick.play();
  },

  playStep() {
    // Cooldown ringan agar tidak terlalu ramai saat bergerak terus-menerus
    if (this._stepCooldown || !this.sfxStep) return;
    this._stepCooldown = true;
    this.sfxStep.play();
    setTimeout(() => (this._stepCooldown = false), 260);
  },

  /**
   * Crossfade halus dari BGM utama ke musik romantis untuk cutscene penutup.
   */
  crossfadeToRomantic(duration = 2500) {
    if (!this.romantic.playing()) this.romantic.play();
    this.romantic.fade(0, this.currentVolume, duration);
    this.bgm.fade(this.currentVolume, 0, duration);
    setTimeout(() => this.bgm.pause(), duration + 100);
  },
};
