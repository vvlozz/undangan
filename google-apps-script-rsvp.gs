/**
 * ============================================================
 *  GOOGLE APPS SCRIPT — Penerima RSVP ke Google Sheets
 * ============================================================
 *  File ini BUKAN bagian dari situs (tidak di-load oleh
 *  index.html). Ini kode yang harus kalian TEMPEL SENDIRI ke
 *  Google Apps Script (lihat panduan lengkap di README.md,
 *  bagian "RSVP → Google Sheets").
 *
 *  Ringkasnya:
 *  1. Buat Google Sheet baru, beri nama bebas (mis. "RSVP Pernikahan").
 *  2. Di baris pertama (header), isi 5 kolom ini persis:
 *     Timestamp | Nama | Jumlah Tamu | Kehadiran | Ucapan
 *  3. Menu Extensions > Apps Script.
 *  4. Hapus kode default, ganti dengan SELURUH isi file ini.
 *  5. Klik Deploy > New deployment > pilih tipe "Web app".
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  6. Deploy, izinkan akses (klik "Advanced" > "Go to project (unsafe)"
 *     kalau muncul peringatan — ini aman karena scriptnya punya kalian
 *     sendiri, Google cuma belum memverifikasi app pribadi seperti ini).
 *  7. Salin URL Web App yang muncul (berakhiran "/exec").
 *  8. Tempel URL itu ke assets/js/config.js, bagian rsvp.endpoint.
 *
 *  Kalau nanti mengubah kode ini (mis. update dari file ini lagi):
 *  Deploy > Manage deployments > klik ikon pensil di deployment yang
 *  sudah ada > bagian "Version" pilih "New version" > Deploy.
 *  INI PENTING: kalau pilih "New deployment" (bukan edit versi),
 *  URL Web App akan BERUBAH dan config.js harus diupdate lagi.
 *  Cukup edit versi supaya URL tetap sama seperti yang sudah ditempel
 *  di config.js.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.nama || "",
      data.jumlahTamu || "",
      data.kehadiran || "",
      data.ucapan || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet — endpoint BARU untuk mengambil daftar ucapan yang sudah
 * tersimpan di Sheet, dipakai website untuk initial load & polling
 * auto-update Buku Tamu. Tidak mengubah/menghapus apa pun di Sheet,
 * hanya membaca.
 *
 * "id" pada tiap entri = nomor baris di Sheet (baris 1 = header,
 * jadi id mulai dari 2). Dipakai frontend sebagai identifier unik
 * untuk mencegah duplikasi saat polling, karena Sheet saat ini tidak
 * punya kolom ID sendiri — jadi kolom TIDAK perlu diubah.
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const values = sheet.getDataRange().getValues(); // termasuk baris header
    const rows = values.slice(1); // lewati header

    const data = rows
      .map(function (row, idx) {
        return {
          id: String(idx + 2), // nomor baris asli di sheet (header = baris 1)
          timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ""),
          nama: row[1] || "",
          jumlahTamu: row[2] || "",
          kehadiran: row[3] || "",
          ucapan: row[4] || "",
        };
      })
      // buang baris yang benar-benar kosong (mis. baris kosong tak sengaja di Sheet)
      .filter(function (row) {
        return row.nama || row.ucapan;
      });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
