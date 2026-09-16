# 💌 Undangan Pernikahan Digital — Template Interaktif

Undangan digital dengan karakter pixel yang dapat digerakkan (WASD / Arrow
Keys / joystick virtual di mobile) untuk menjelajahi setiap bagian undangan,
diakhiri dengan cutscene romantis saat bertemu karakter pasangan di penutup.

Dibangun murni dengan **HTML5, CSS3, dan JavaScript (Vanilla ES6+)** —
tanpa framework, tanpa build step. Cukup buka `index.html` di browser.

> 📋 **Mau tahu apa aja yang perlu diganti sebelum disebar ke tamu?**
> Lihat **[`CHECKLIST.md`](./CHECKLIST.md)** — daftar lengkap & terurut
> dari yang paling penting.

---

## 🚀 Cara Menjalankan

Karena browser modern membatasi `fetch`/module lokal dari `file://`,
jalankan lewat server lokal sederhana (pilih salah satu):

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```

Lalu buka `http://localhost:8000` di browser.

### 📤 Deploy ke Netlify (gratis, tanpa build)
1. Buka [app.netlify.com](https://app.netlify.com) → daftar/login (gratis).
2. Di dashboard, pilih **"Add new site" → "Deploy manually"**.
3. Drag & drop **ISI** folder ini (`index.html`, `assets/`, `README.md`)
   ke area upload — pastikan `index.html` ada langsung di dalam apa
   yang kalian upload, jangan sampai ke-nested satu folder lagi di
   dalamnya, atau situsnya akan blank/404.
4. Tunggu proses upload selesai → dapat URL gratis seperti
   `nama-acak.netlify.app`, sudah langsung live.
5. (Opsional) Ganti nama subdomain: **Site settings → Change site name**.
   Custom domain sendiri juga bisa disambungkan di sana.

Cara yang sama berlaku untuk Vercel, GitHub Pages, atau hosting statis
lain — situs ini tidak butuh build step atau server backend apa pun.

### ✅ Checklist Sebelum Link Dibagikan ke Tamu Sungguhan
Semua isi saat ini adalah **data contoh (dummy)** — pastikan sudah diganti:
- [ ] Nama pasangan, tanggal, lokasi, alamat, link Google Maps → `assets/js/config.js`
- [ ] Cerita cinta (love story) → `assets/js/config.js`
- [ ] Foto hero & galeri, logo → timpa file di `assets/images/` (nama file sama)
- [ ] Rekening & QR amplop digital → `assets/js/config.js` + `assets/images/qr-placeholder.png`
- [ ] Musik latar & SFX (opsional) → `assets/music/`, `assets/sfx/`
- [ ] **RSVP disambungkan ke Google Sheets** — lihat bagian 6 di bawah, ini wajib
      supaya ucapan tamu benar-benar sampai ke kalian, bukan cuma tampil
      sesaat di layar tamu itu sendiri.

---

## 🎨 Cara Kustomisasi (Tanpa Menyentuh Logika Website)

### 1. Ganti Data Undangan
Edit **`assets/js/config.js`** — satu-satunya file yang perlu diubah untuk:
- Nama pasangan, tanggal & lokasi acara
- Cerita cinta (love story timeline)
- Daftar foto galeri
- Rekening hadiah digital
- Pesan popup tiap section
- Pesan penutup cutscene

### 2. Ganti Musik & Suara (SFX)
Taruh file musik/suara baru Anda ke folder `assets/music/` atau
`assets/sfx/` (boleh `.mp3`, `.wav`, atau `.ogg`), lalu ubah nama file
pada **`MUSIC_TRACKS`** dan **`SFX_TRACKS`** di bagian paling atas
**`assets/js/musicPlayer.js`**. Tidak perlu menyamakan nama file lama —
cukup tulis nama file baru Anda di sana.

### 3. Ganti Aset Visual Lainnya
Timpa file di dalam folder `assets/` dengan aset asli Anda —
**nama file harus tetap sama** agar tidak perlu mengubah kode:

```
assets/
├── characters/       → sprite karakter (idle, down, up, left, right, happy)
├── images/           → hero.jpg, gallery1-6.jpg, qr-placeholder.png, logo.png
├── icons/             → ikon UI (kalender, lokasi, gift, dst.)
└── effects/           → sprite kelopak bunga, confetti, sparkle
```

> 💡 Rekomendasi ukuran sprite karakter: 128×192px (rasio 2:3), PNG transparan.
> Gambar galeri/hero: rasio 1:1 untuk galeri, potret untuk hero.

### 4. Ganti Warna & Tipografi
Edit variabel di **`assets/css/variables.css`** — seluruh tema warna
(krem, sage, emas, cokelat) dan tipografi terpusat di sana.

### 5. Nama Tamu Undangan Otomatis (via Link)
Undangan menampilkan kotak **"Kepada Yth. [Nama Tamu]"** di bagian hero,
yang otomatis terisi dari parameter URL saat Anda membagikan link ke
tamu berbeda. Cukup tambahkan `?nama=` di akhir link, contoh:

```
index.html?nama=Obi
index.html?nama=Budi%20Santoso   (nama dengan spasi)
```

Jika parameter tidak ada, kotak menampilkan teks fallback default
("Bapak/Ibu/Saudara/i"). Label & teks fallback dapat diubah di
**`assets/js/config.js`** pada bagian `invitedGuest`.

### 6. ⚠️ WAJIB Sebelum Publikasi: Sambungkan RSVP ke Google Sheets
Secara default, ucapan/RSVP yang diisi tamu **hanya tampil di layar
tamu itu sendiri** dan **hilang begitu tab ditutup** — tidak ada
data yang tersimpan atau terkirim ke mana pun. Undangan ini disambungkan
ke **Google Sheets** (gratis, tanpa batas jumlah RSVP, tanpa perlu akun
layanan pihak ketiga) lewat Google Apps Script. Kode script-nya sudah
disiapkan di file **`google-apps-script-rsvp.gs`** (di folder utama) —
tinggal copy-paste, ±5 menit:

1. Buka [sheets.google.com](https://sheets.google.com) → buat Spreadsheet
   baru, kasih nama bebas (mis. "RSVP Pernikahan Arka & Saka").
2. Di baris pertama (header), isi 5 kolom persis seperti ini:
   `Timestamp | Nama | Jumlah Tamu | Kehadiran | Ucapan`
3. Menu **Extensions → Apps Script** (di toolbar Google Sheets).
4. Hapus kode default di editor yang muncul, ganti dengan **seluruh isi**
   file `google-apps-script-rsvp.gs` dari folder ini (copy-paste semua).
5. Klik **Deploy → New deployment**. Pilih ikon gerigi ⚙️ di sebelah
   "Select type" → pilih **Web app**. Lalu isi:
   - **Execute as**: Me (akun Google kalian)
   - **Who has access**: Anyone
6. Klik **Deploy**. Google akan minta izin akses — kalau muncul layar
   "Google hasn't verified this app", klik **Advanced** → **Go to
   project (unsafe)** → **Allow**. Ini aman, karena scriptnya kalian
   sendiri yang buat; Google cuma belum memverifikasi script pribadi
   seperti ini (bukan aplikasi publik).
7. Setelah deploy selesai, salin **URL Web app** yang muncul
   (bentuknya `https://script.google.com/macros/s/AKfycb.../exec`).
8. Tempel URL itu di **`assets/js/config.js`**, bagian paling bawah:
   ```js
   rsvp: {
     endpoint: "https://script.google.com/macros/s/AKfycb.../exec",
   },
   ```

Selesai — setiap tamu isi RSVP, satu baris baru otomatis muncul di
spreadsheet kalian (nama, jumlah tamu, status kehadiran, ucapan,
lengkap dengan waktu submit). Buka spreadsheet-nya kapan saja untuk
lihat/filter/export semua ucapan.

**Kalau nanti mengedit ulang kode Apps Script-nya**, ingat harus
**Deploy → Manage deployments → edit (ikon pensil) → Deploy lagi**
(bukan cuma menyimpan file-nya saja) supaya perubahan aktif di URL
yang sama.

Selama `endpoint` masih kosong, situs tetap berjalan normal (form
tetap bisa diisi tamu, tidak error) — hanya saja datanya tidak
tersimpan ke mana pun, jadi jangan lupa langkah ini sebelum link
undangan dibagikan ke tamu sungguhan.

---

## 🗂️ Struktur Proyek

```
WeddingInvitation/
├── index.html                  → Struktur halaman utama
├── google-apps-script-rsvp.gs   → Kode untuk disalin ke Google Apps Script (lihat bagian 6)
├── assets/
│   ├── css/
│   │   ├── variables.css       → Design tokens (warna, font, spacing)
│   │   ├── base.css            → Reset & utility dasar
│   │   ├── components.css      → Komponen UI (button, popup, joystick, dll)
│   │   ├── character.css       → Game stage & karakter pixel
│   │   ├── sections.css        → Styling tiap section
│   │   └── responsive.css      → Adaptasi tablet & mobile
│   ├── js/
│   │   ├── config.js           → ⭐ Konfigurasi utama (edit di sini)
│   │   ├── utils.js            → Fungsi bantu umum
│   │   ├── guestName.js        → Nama tamu undangan dari parameter URL
│   │   ├── loader.js           → Loading screen
│   │   ├── musicPlayer.js      → Kontrol musik & SFX (Howler.js)
│   │   ├── effects.js          → Efek visual (petal, confetti, sparkle)
│   │   ├── popup.js            → Popup dialog info section
│   │   ├── countdown.js        → Hitung mundur acara
│   │   ├── contentBuilder.js   → Render data config ke DOM
│   │   ├── gallery.js          → Grid galeri & lightbox
│   │   ├── rsvp.js             → Form RSVP (tanpa backend)
│   │   ├── gift.js             → Interaksi QR code
│   │   ├── character.js        → State & render karakter
│   │   ├── controls.js         → Kontrol keyboard (WASD/Arrow)
│   │   ├── joystick.js         → Virtual joystick mobile
│   │   ├── gameStage.js        → Game loop, kamera, deteksi proximity
│   │   ├── cutscene.js         → Cutscene pertemuan romantis
│   │   └── main.js             → Entry point aplikasi
│   ├── characters/ images/ icons/ effects/ music/ sfx/  → Aset (placeholder)
```

---

## 🎮 Cara Kerja Interaksi

1. Pengunjung membuka halaman → loading screen → tekan **"Buka Undangan"**.
2. Karakter pria muncul & musik mulai diputar.
3. Pengunjung menggerakkan karakter dengan **WASD**, **Arrow Keys**, atau
   **joystick virtual** (mobile) untuk menjelajahi tiap section.
4. Saat karakter mendekati sebuah section, muncul **popup dialog** singkat.
5. Di ujung perjalanan (section Penutup), karakter wanita menunggu.
6. Saat karakter pria mendekat, kontrol **otomatis terkunci** dan
   **cutscene** berjalan: langkah terakhir otomatis → karakter wanita
   tersenyum → efek kelopak bunga & konfeti → musik beralih romantis →
   pesan penutup muncul.

---

## ⚙️ Catatan Teknis

- **Library eksternal**: [GSAP](https://gsap.com) (animasi) &
  [Howler.js](https://howlerjs.com) (audio) dimuat via CDN, plus
  Google Fonts (Poppins, Nunito, Cormorant Garamond).
- **Backend ringan tanpa server sendiri**: RSVP dikirim ke Google Sheets
  lewat Apps Script Web App (lihat bagian 6 di atas) — tidak perlu
  server/database sendiri, cukup Google Sheet gratis.
- **Aksesibilitas**: mendukung `prefers-reduced-motion`, fokus keyboard
  yang jelas, dan alt text pada gambar.
- **Performa**: gambar galeri lazy-load, animasi dioptimalkan untuk 60fps,
  CSS & JS modular agar mudah dipangkas sesuai kebutuhan.
- **Tampilan dikunci mode HP**: seluruh halaman dibungkus `#app-frame`
  (lihat `assets/css/base.css`) yang membatasi lebar tampilan maksimal
  480px dan selalu dipusatkan di layar — jadi walau dibuka di PC/laptop,
  tampilannya tetap seperti membuka di HP. Untuk mengubah lebar kartu
  ini, cari `max-width: 480px` di `#app-frame` (base.css) dan
  `calc(50% - 240px)` di beberapa tempat lain (components.css,
  sections.css) — angka 240 adalah setengah dari 480, sesuaikan
  keduanya bersamaan bila lebar diubah.

Selamat mempersiapkan hari bahagia! 💛
