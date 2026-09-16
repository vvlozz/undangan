/**
 * ============================================================
 *  CONFIG.JS — Pusat Konfigurasi Undangan Digital
 * ============================================================
 *  Edit file ini untuk mengganti seluruh isi undangan tanpa
 *  perlu menyentuh logika di file JS/CSS lainnya.
 *  Ganti juga file di dalam folder /assets/ sesuai kebutuhan
 *  (nama file HARUS tetap sama, cukup timpa isinya).
 * ============================================================
 */

const WEDDING_CONFIG = {
  // -------------------- IDENTITAS PASANGAN --------------------
  couple: {
    groomName: "Hanif",
    groomFullName: "Yusran Hanif",
    brideName: "Nissa",
    brideFullName: "Khoirunnisa",
    hashtag: "#HANIFoundNissa",
  },

  // -------------------- TANGGAL & WAKTU ACARA --------------------
  event: {
    // Format ISO agar mudah dibaca countdown JS
    isoDate: "2026-11-15T10:00:00",
    dateLabel: "Sabtu, 15 November 2026",
    akadTime: "08.00 WIB - Selesai",
    resepsiTime: "11.00 WIB - 14.00 WIB",
    location: "Gedung Kebon Gede (InshaAllah)",
    address: "Jl. blabla",
    mapsUrl: "https://maps.app.goo.gl/zMHQMNzdFqR3dWuUA",
    // Query untuk peta tertanam (embed) di section "Peta Lokasi".
    // Default: dibuat otomatis dari location + address di atas.
    // Bisa ditimpa manual di sini kalau hasil pencarian otomatis kurang akurat.
    mapsEmbedQuery: "",
  },

  // -------------------- KATA PEMBUKA / AYAT --------------------
  opening: {
    label: "Kata Pembuka",
    // Judul ayat yang tampil di kartu (mis. "QS. Ar-Rum Ayat 21").
    // Kosongkan ("") kalau tidak ingin menampilkan judul.
    title: "QS. Ar-Rum Ayat 21",
    arabicText:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
    translation:
      '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."',
    source: "QS. Ar-Rum: 21",
  },

  // -------------------- PROFIL MEMPELAI --------------------
  coupleProfile: {
    groom: {
      fullName: "Yusran Hanif",
      childOrder: "Putra pertama dari",
      parents: "Bapak Sufri & Ibu Yuliatin",
      instagram: "",
      photo: "assets/images/groom.jpeg",
      photoPosition: "center",
    },
    bride: {
      fullName: "Khoirunnisa",
      childOrder: "Putri Ketiga dari",
      parents: "Bapak Abdur Rozak & Ibu Hartika (Almh)",
      instagram: "",
      photo: "assets/images/bride.jpeg",
    },
  },

  // -------------------- LOVE STORY --------------------
  loveStory: [
    {
      year: "2019",
      title: "Pertemuan Pertama",
      text: "Dua orang asing dipertemukan dalam satu kelas yang sama, tanpa tahu bahwa itu adalah awal dari segalanya.",
    },
    {
      year: "2021",
      title: "Menjadi Sepasang Kekasih",
      text: "Setelah melewati banyak percakapan panjang dan momen sederhana, kami memutuskan untuk berjalan bersama.",
    },
    {
      year: "2026",
      title: "Lamaran",
      text: "Di bawah langit senja, sebuah janji terucap untuk melanjutkan perjalanan ini seumur hidup.",
    },
    {
      year: "2026",
      title: "Hari Bahagia",
      text: "Dan kini, kami mengundang kalian untuk menjadi saksi dimulainya babak baru kehidupan kami.",
    },
  ],

  // -------------------- GALERI FOTO --------------------
  // Caption ditulis seperti kutipan singkat (muncul di border foto,
  // gaya polaroid) — ganti sesuai momen di foto masing-masing.
  gallery: [
    { src: "assets/images/gallery1.jpg", caption: "Awal dari segalanya" },
    { src: "assets/images/gallery2.jpg", caption: "Perjalanan kami" },
    { src: "assets/images/gallery3.jpg", caption: "Sesi prewedding" },
    { src: "assets/images/gallery4.jpg", caption: "Hari lamaran" },
    { src: "assets/images/gallery5.jpg", caption: "Bersama keluarga" },
    { src: "assets/images/gallery6.jpg", caption: "Menuju hari bahagia" },
    { src: "assets/images/gallery7.jpg", caption: "Dalam tawa & cerita" },
    { src: "assets/images/gallery8.jpg", caption: "Setiap detik berharga" },
    { src: "assets/images/gallery9.jpg", caption: "Cinta yang bertumbuh" },
    { src: "assets/images/gallery10.jpg", caption: "Selamanya berdua" },
  ],

  // -------------------- GIFT / AMPLOP DIGITAL --------------------
  gift: [
    {
      bank: "Bank Central Asia",
      accountNumber: "843-543-3444",
      accountName: "Muhammad Syukron Akbar",
    },
    {
      bank: "Bank Central Asia",
      accountNumber: "843-543-3444",
      accountName: "Muhammad Syukron Akbar",
    },
  ],
  qrImage: "assets/images/qr-placeholder.png",

  // -------------------- ASET KARAKTER --------------------
  characters: {
    groom: {
      idle: "assets/characters/groom_idle.png",
      down: "assets/characters/groom_down.png",
      up: "assets/characters/groom_up.png",
      left: "assets/characters/groom_left.png",
      right: "assets/characters/groom_right.png",
    },
    bride: {
      idle: "assets/characters/bride_idle.png",
      happy: "assets/characters/bride_happy.png",
    },
  },

  // -------------------- AUDIO --------------------
  // Path musik & SFX TIDAK diatur di sini lagi — sekarang diatur langsung
  // di dalam assets/js/musicPlayer.js (lihat MUSIC_TRACKS & SFX_TRACKS di
  // bagian atas file tersebut) agar lebih mudah diedit dalam satu tempat.

  // -------------------- PESAN POPUP PER SECTION --------------------
  // 'trigger' = id section yang men-trigger popup ketika karakter mendekat
  sectionMessages: {
    hero: "Halo! Terima kasih sudah hadir di hari bahagia kami 💛",
    opening: "Sejenak, mari resapi ayat suci berikut ini.",
    profile: "Kenalan dulu yuk, sama kedua mempelai.",
    detail: "Ini dia detail acaranya — jangan sampai terlewat, ya!",
    map: "Ini lokasinya, semoga tidak nyasar ya!",
    gallery: "Silakan lihat momen-momen terbaik kami berdua.",
    "love-story": "Inilah awal perjalanan kisah cinta kami.",
    rsvp: "Jangan lupa konfirmasi kehadiranmu di sini.",
    guestbook: "Tuliskan ucapan & doa terbaikmu untuk kami di sini.",
    gift: "Terima kasih atas doa dan restunya 🙏",
  },

  // -------------------- PESAN AJAKAN DI AWAL --------------------
  // Muncul otomatis setelah pesan sambutan "Halo!" di hero hilang,
  // mengajak tamu menjelajah & menemukan mempelai wanita. Tulis
  // "{brideName}" — otomatis diganti nama mempelai wanita di atas.
  introInvite: "Yuk, ajak aku menemui {brideName}!",

  // -------------------- TEKS PENUTUP / CUTSCENE --------------------
  closing: {
    message:
      "Perjalanan ini berakhir di sini, dan kehidupan baru kami dimulai bersama.",
    subMessage: "Terima kasih telah menjadi bagian dari perjalanan kami.",
  },

  // -------------------- NAMA TAMU UNDANGAN (via URL) --------------------
  // Menampilkan kotak "Kepada Yth. [Nama Tamu]" di hero, diisi otomatis dari
  // parameter URL saat link undangan dibagikan, contoh:
  //   index.html?nama=Obi
  // Bisa juga pakai parameter "to=" sebagai alternatif nama parameter.
  invitedGuest: {
    label: "Kepada Yth.",
    // Ditampilkan jika tidak ada parameter nama di URL
    fallbackName: "Bapak/Ibu/Saudara/i",
    // Nama parameter URL yang dibaca (urutan prioritas)
    queryParams: ["nama", "to"],
  },

  // -------------------- RSVP: KE MANA DATA DIKIRIM --------------------
  // PENTING: tanpa ini, ucapan/RSVP tamu HANYA muncul di layar tamu itu
  // sendiri dan TIDAK PERNAH sampai ke kalian — hilang begitu tab ditutup.
  //
  // Di sini RSVP disambungkan ke GOOGLE SHEETS (gratis, tanpa batas jumlah
  // submission, tanpa perlu bikin akun layanan pihak ketiga). Caranya ada
  // lengkap step-by-step di README.md bagian "RSVP → Google Sheets".
  // Singkatnya: buat Google Sheet → Extensions > Apps Script → tempel kode
  // yang sudah disediakan di README → Deploy as Web App → salin URL-nya
  // (berakhiran "/exec") → tempel di bawah ini.
  rsvp: {
    endpoint:
      "https://script.google.com/macros/s/AKfycby9FG3iJytnrAjoFh6svO4z5-tUZXkms9XOdTQHAkDSp5L3EhduaFBPGqcsw5noA1iS/exec",
    // Seberapa sering website mengecek ucapan baru dari Google Sheets (dalam
    // milidetik). Buku Tamu akan otomatis update tanpa perlu refresh halaman.
    pollIntervalMs: 8000,
  },
};
