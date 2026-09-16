# ✅ Checklist Lengkap — Sebelum Undangan Disebar

Daftar semua yang perlu diganti, diurutkan dari **paling penting**.
Centang satu-satu biar tidak ada yang kelewat.

---

## 🔴 WAJIB — situs belum siap dipakai kalau ini belum selesai

### 1. Data acara & pasangan
📄 File: **`assets/js/config.js`** (paling atas, bagian `couple`, `event`, `location`)
- [ ] Nama panggilan & nama lengkap kedua mempelai
- [ ] Tanggal & jam acara (akad + resepsi)
- [ ] Nama lokasi, alamat lengkap, link Google Maps
- [ ] Hashtag pernikahan (kalau dipakai)

### 2. RSVP disambungkan ke Google Sheets
📄 File: **`assets/js/config.js`**, bagian `rsvp.endpoint`
Tanpa ini, ucapan tamu **hilang** begitu tab mereka ditutup — tidak
pernah sampai ke kalian. Panduan lengkap step-by-step (copy-paste,
±5 menit) ada di `README.md` bagian **"RSVP → Google Sheets"**.
- [ ] Sudah bikin Google Sheet + Apps Script
- [ ] Sudah paste URL endpoint ke `config.js`
- [ ] **Sudah dites langsung**: isi form RSVP di situs, cek muncul di spreadsheet

### 3. Title, meta description & preview link (WhatsApp/Instagram)
📄 File: **`index.html`**, baris ±22-31 (paling atas `<head>`)
Ini **4 baris terpisah** yang harus diedit manual satu-satu — tidak
otomatis ikut berubah walau `config.js` sudah diedit, karena WhatsApp/dll
tidak menjalankan JavaScript saat mengambil preview link:
```html
<title>Arka &amp; Saka — Undangan Pernikahan Digital</title>
<meta name="description" content="Undangan pernikahan digital interaktif Arka & Saka" ... />
<meta property="og:title" content="Arka & Saka — Undangan Pernikahan Digital" />
<meta property="og:description" content="Undangan pernikahan digital interaktif Arka & Saka" />
```
- [ ] Keempat baris di atas sudah diganti nama aslinya

### 4. Foto
📄 Folder: **`assets/images/`** — timpa file, **nama file harus tetap sama persis** (termasuk huruf besar/kecil)
- [ ] `hero.jpg` — foto utama di halaman depan
- [ ] `gallery1.jpg` s/d `gallery6.jpg` — foto galeri (boleh kurang dari 6, hapus baris yang tidak dipakai di `config.js` bagian galeri)

### 5. Cerita cinta (love story)
📄 File: **`assets/js/config.js`**, bagian `loveStory`
- [ ] Ganti isi cerita contoh dengan cerita asli kalian (boleh minta saya bantu tulis draft kalau belum sempat)

---

## 🟡 PENTING — bukan bikin error, tapi kalau kelewat kelihatan aneh/kurang niat

### 6. Logo & favicon (2 file BEDA, jangan tertukar)
📄 Folder: **`assets/images/`**
- [ ] `logo.png` — logo hati yang muncul di **layar loading**
- [ ] `favicon.png` — ikon dua cincin yang muncul di **tab browser & preview link**

### 7. Rekening / amplop digital
📄 File: **`assets/js/config.js`**, bagian `gift`
- [ ] Nama bank & nomor rekening
- [ ] `assets/images/qr-placeholder.png` → timpa dengan QR code asli (kalau pakai e-wallet/QRIS)
- [ ] Kalau tidak mau menampilkan amplop digital sama sekali, bisa dikosongkan (tanya saya caranya kalau perlu)

### 8. Nama tamu otomatis di link (opsional tapi bagus dipakai)
Tambahkan `?nama=NamaTamu` di akhir link sebelum dikirim ke tiap tamu,
contoh: `https://situs-kalian.netlify.app?nama=Budi`
→ otomatis muncul "Kepada Yth. Budi" di halaman depan mereka.

---

## 🟢 OPSIONAL — boleh dilewati, situs tetap jalan normal tanpa ini

### 9. Musik & sound effect
📄 Folder: **`assets/music/`**, **`assets/sfx/`**
- [ ] Musik latar (kalau mau ganti dari yang default)
- [ ] Suara langkah kaki, klik tombol, dll — cek nama file di `assets/js/musicPlayer.js` paling atas

### 10. Warna tema
📄 File: **`assets/css/variables.css`**
Saat ini bertema hijau garden outdoor. Kalau mau tema warna lain
(pastel pink, navy formal, dll), tinggal bilang ke saya atau edit
sendiri variabel warnanya di file itu.

### 11. Lebar tampilan "kartu HP"
📄 File: **`assets/css/base.css`** (`#app-frame`, cari `max-width: 480px`)
Situs sengaja dikunci selalu tampil selebar layar HP walau dibuka di
PC. Kalau mau diubah lebarnya, ada catatan lengkap di `README.md`
bagian "Catatan Teknis".

---

## 🧪 Cara Tes Sebelum Disebar

1. Jalankan lokal dulu (`python3 -m http.server 8000`) ATAU langsung
   buka link Netlify yang sudah live.
2. Klik **"Buka Undangan"**, coba gerakkan karakter ke semua section.
3. Isi form **RSVP** dengan data tes → cek muncul di Google Sheet.
4. Share link ke **WhatsApp diri sendiri dulu** → cek preview-nya
   sudah nama yang benar (bukan lagi "Arka & Saka").
5. Buka dari **HP asli** (bukan cuma simulasi di laptop) minimal sekali.

Setelah semua ✅ di atas beres, baru aman disebar ke tamu sungguhan. 💛
