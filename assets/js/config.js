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
    brideName: "Nisa",
    brideFullName: "Khoirunnisa",
    hashtag: "#HANIFoundNisa",
  },

  // -------------------- TANGGAL & WAKTU ACARA --------------------
  event: {
    // Format ISO + offset +07:00 (WIB) agar countdown selalu menghitung ke jam WIB,
    // berapa pun zona waktu perangkat tamu.
    isoDate: "2026-11-15T07:00:00+07:00",
    dateLabel: "Minggu, 15 November 2026",
    akadTime: "07.00 WIB - 09.00 WIB",
    resepsiTime: "10.00 WIB - Selesai",
    location: "KEBON GEDE VENUE",
    address:
      "Jl. Sultan Moh. Mansyur No.687, 35 Ilir, Kec. Ilir Bar. II, Kota Palembang",
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
      childOrder: "Anak pertama dari",
      parents: "Bapak Sufri & Ibu Yuliatin",
      instagram: "",
      photo: "assets/images/groom.jpeg",
      photoPosition: "center",
    },
    bride: {
      fullName: "Nyayu Khoirunnisa, S.Tr.Par",
      childOrder: "Anak keempat dari",
      parents: "Bapak Kgs. Abdur Rozak & Ibu Nyayu Hartika (Almh)",
      instagram: "",
      photo: "assets/images/bride.jpeg",
    },
  },

  // -------------------- LOVE STORY --------------------
  loveStory: [
    {
      year: "September-2017",
      title: "Pertemuan Pertama",
      text: "Sebuah pertemuan sederhana di sebuah warung menjadi awal dari kisah cinta yang membawa kami menuju selamanya. Seiring berjalannya waktu, rasa nyaman tumbuh menjadi cinta, hingga kami memutuskan untuk berjalan bersama dan saling menemani dalam setiap cerita.",
    },
    {
      year: "November-2017",
      title: "Tentang Bertahan",
      text: "Terlalu panjang jika harus diceritakan dari awal... Karena cinta kami bukan tentang bagaimana semuanya dimulai, melainkan tentang bagaimana kami bertahan. Kami hanya dua insan biasa, yang ditakdirkan untuk saling menggenggam, melewati badai, menikmati pelangi, hingga sampai di titik ini.",
    },
    {
      year: "April-2026",
      title: "Meminta Restu",
      text: 'Ribuan tangis, jutaan tawa, menjadi saksi bagaimana kata <strong>"yakin"</strong> terus kami ucapkan untuk menguatkan hati yang sempat rapuh. Bukan sekadar janji yang terucap, tapi langkah yang terus bergerak. Bukan hanya kata yang indah, namun pengorbanan yang nyata. Dengan niat yang tulus, sang pria datang menemui keluarga wanita untuk menyampaikan keseriusan dan memohon restu demi melangkah ke jenjang pernikahan.',
    },
    {
      year: "Mei-2026",
      title: "Kesepakatan Hari Bahagia",
      text: "Hingga pada suatu hari yang penuh haru, kami mempertemukan kedua keluarga untuk bersilaturahmi, menyatukan niat, menyatukan doa-doa dalam satu restu, dan menetapkan tanggal pernikahan sebagai awal perjalanan baru kami.",
    },
    {
      year: "November-2026",
      title: "Hari Bahagia",
      text: "Dan kini, kami mengundang kalian untuk menjadi saksi dimulainya babak baru kehidupan kami.",
    },
  ],

  // -------------------- GALERI FOTO --------------------
  // src = foto besar (lightbox & foto utama), thumb = versi kecil untuk strip
  // yang bergerak. Tanpa caption.
  // Urutan di sini = urutan di strip.
  gallery: [
    {
      src: "assets/images/gallery/g12.jpg",
      thumb: "assets/images/gallery/g12-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g13.jpg",
      thumb: "assets/images/gallery/g13-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g14.jpg",
      thumb: "assets/images/gallery/g14-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g15.jpg",
      thumb: "assets/images/gallery/g15-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g16.jpg",
      thumb: "assets/images/gallery/g16-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g01.jpg",
      thumb: "assets/images/gallery/g01-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g02.jpg",
      thumb: "assets/images/gallery/g02-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g03.jpg",
      thumb: "assets/images/gallery/g03-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g04.jpg",
      thumb: "assets/images/gallery/g04-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g05.jpg",
      thumb: "assets/images/gallery/g05-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g06.jpg",
      thumb: "assets/images/gallery/g06-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g07.jpg",
      thumb: "assets/images/gallery/g07-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g08.jpg",
      thumb: "assets/images/gallery/g08-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g09.jpg",
      thumb: "assets/images/gallery/g09-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g10.jpg",
      thumb: "assets/images/gallery/g10-thumb.jpg",
    },
    {
      src: "assets/images/gallery/g11.jpg",
      thumb: "assets/images/gallery/g11-thumb.jpg",
    },
  ],


  // -------------------- GIFT / AMPLOP DIGITAL --------------------
  gift: [
    {
      bank: "Bank Central Asia",
      accountNumber: "857-307-9947",
      accountName: "Yusran Hanif",
    },
    {
      bank: "Sea Bank",
      accountNumber: "9019-7060-9890",
      accountName: "Khoirunnisa",
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
    // 25 detik (bukan lebih cepat) agar kuota Google Apps Script tidak habis
    // kalau banyak tamu membuka undangan bersamaan. Ucapan yang dikirim tamu
    // itu sendiri tetap langsung tampil di layarnya.
    pollIntervalMs: 25000,
  },
};
