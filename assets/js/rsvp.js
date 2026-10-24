/**
 * ============================================================
 *  RSVP.JS — Form Konfirmasi Kehadiran + Buku Tamu (auto-update)
 * ============================================================
 *  Ucapan langsung dirender ke daftar (#rsvp-list) secara optimis
 *  begitu tamu submit, DAN — kalau WEDDING_CONFIG.rsvp.endpoint
 *  sudah diisi (lihat config.js & README.md bagian "RSVP → Google
 *  Sheets") — juga dikirim ke Google Sheets lewat Apps Script Web
 *  App, supaya datanya beneran tersimpan.
 *
 *  Selain itu, modul ini:
 *  1. Saat halaman pertama dibuka, mengambil (GET) seluruh ucapan
 *     yang sudah tersimpan di Google Sheets dan menampilkannya.
 *  2. Melakukan polling berkala (GET) untuk mendeteksi ucapan baru
 *     dari tamu lain, lalu menambahkannya TANPA reload halaman.
 *  3. Mencegah ucapan yang sama muncul dua kali (baik dari hasil
 *     submit sendiri, maupun dari polling yang berulang).
 *  4. Menampilkan ucapan 4 per halaman (supaya card & background
 *     tidak memanjang tak terbatas), dengan tombol "Lihat ucapan
 *     selanjutnya" untuk membuka 4 ucapan berikutnya.
 *
 *  Catatan teknis - POST: dikirim dengan mode "no-cors" & tanpa
 *  header Content-Type khusus (defaultnya text/plain) karena Google
 *  Apps Script tidak menangani CORS preflight dengan baik untuk POST
 *  JSON biasa. Ini artinya kita tidak bisa membaca respons sukses
 *  dari server (opaque response), jadi pesan sukses ditampilkan
 *  optimis begitu request terkirim tanpa error jaringan.
 *
 *  Catatan teknis - GET: Apps Script Web App menyertakan header CORS
 *  yang benar untuk request GET biasa, jadi response GET BISA dibaca
 *  langsung sebagai JSON (beda dengan POST di atas).
 *
 *  Catatan teknis - anti-duplikasi: Sheet saat ini tidak punya kolom
 *  ID sendiri, dan karena POST pakai "no-cors" kita tidak bisa tahu
 *  ID baris yang baru saja dibuat dari respons server. Karena itu,
 *  entry yang baru disubmit sendiri "dicocokkan" ke data dari Sheet
 *  berdasarkan kombinasi nama + kehadiran + ucapan (bukan ID),
 *  sedangkan entry yang datang lewat polling (submit tamu lain)
 *  dicocokkan berdasarkan ID baris Sheet yang sudah pernah dilihat.
 *
 *  Catatan teknis - pagination: daftar ucapan disimpan di memori
 *  (this._allEntries, urutan terbaru → terlama). Yang dirender ke
 *  DOM hanya "jendela" 4 item sesuai halaman aktif (this._page).
 *  Kalau ada ucapan baru masuk SAAT tamu sedang di halaman pertama
 *  (this._page === 0), halaman itu otomatis diperbarui supaya
 *  ucapan baru langsung kelihatan. Kalau tamu sedang membaca
 *  halaman berikutnya (sudah klik "Lihat ucapan selanjutnya"),
 *  halaman yang sedang dibaca TIDAK diubah begitu saja supaya tidak
 *  mengganggu — ucapan baru akan tetap ada begitu tamu kembali ke
 *  halaman pertama.
 */
const RSVP = {
  entries: [],
  _initialized: false,
  _seenIds: null, // Set id baris Sheet yang sudah pernah dimasukkan ke _allEntries
  _pendingLocalKeys: null, // Map fingerprint(entry lokal) -> waktu kedaluwarsa
  _pollTimer: null,
  _hasLoadedAny: false,
  _listEl: null,
  _statusEl: null,
  _nextBtn: null,

  // -------------------- state pagination --------------------
  _allEntries: null, // array entry ternormalisasi, urutan TERBARU -> TERLAMA
  _page: 0, // halaman aktif, 0-based
  _pageSize: 4,

  // -------------------- batas & pengaman form --------------------
  MAX_NAME: 60, // harus sama dengan maxlength di index.html & BATAS.NAMA di Apps Script
  MAX_MESSAGE: 500, // idem (BATAS.UCAPAN)
  COOLDOWN_MS: 10000, // jeda minimal antar kiriman dari satu perangkat
  _lastSubmitAt: 0,
  _submitting: false,

  init() {
    if (this._initialized) return; // jaga-jaga supaya tidak dobel init (dobel interval/listener)
    this._initialized = true;

    this._seenIds = new Set();
    this._pendingLocalKeys = new Map();
    this._allEntries = [];
    this._listEl = Utils.$("#rsvp-list");
    this._nextBtn = Utils.$("#guestbook-next-btn");

    if (this._nextBtn) {
      this._nextBtn.addEventListener("click", () => this._goToNextPage());
    }

    const form = Utils.$("#rsvp-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleSubmit(form);
    });

    // penghitung huruf ucapan (0/500)
    const msgEl = Utils.$("#rsvp-message");
    const countEl = Utils.$("#rsvp-message-count");
    const updateCount = () => {
      if (countEl && msgEl) countEl.textContent = `${msgEl.value.length}/${this.MAX_MESSAGE}`;
    };
    if (msgEl) msgEl.addEventListener("input", updateCount);
    form.addEventListener("reset", () => setTimeout(updateCount, 0));

    this._loadInitial();
    this._startPolling();
  },

  // -------------------- SUBMIT (tamu mengisi form) --------------------

  async _handleSubmit(form) {
    if (this._submitting) return; // cegah klik ganda saat masih mengirim

    // slice = pengaman kalau maxlength di HTML dilewati
    const name = Utils.$("#rsvp-name").value.trim().slice(0, this.MAX_NAME);
    const guest = Utils.$("#rsvp-guest").value;
    const attend = Utils.$("#rsvp-attend").value;
    const message = Utils.$("#rsvp-message").value.trim().slice(0, this.MAX_MESSAGE);
    const honeypot = Utils.$("#rsvp-website");

    if (!name) {
      Utils.toast("Mohon isi nama terlebih dahulu.");
      return;
    }

    // Kolom jebakan terisi = bot. Pura-pura sukses, tidak dikirim ke mana pun.
    if (honeypot && honeypot.value) {
      Utils.toast(`Terima kasih, ${name}! Ucapanmu telah terkirim 💌`);
      form.reset();
      return;
    }

    // Jeda antar kiriman supaya tidak bisa ditekan berulang kali
    const sinceLast = Date.now() - this._lastSubmitAt;
    if (this._lastSubmitAt && sinceLast < this.COOLDOWN_MS) {
      const wait = Math.ceil((this.COOLDOWN_MS - sinceLast) / 1000);
      Utils.toast(`Mohon tunggu ${wait} detik sebelum mengirim lagi.`);
      return;
    }
    this._lastSubmitAt = Date.now();

    const attendLabel = { hadir: "Akan Hadir", "tidak-hadir": "Tidak Bisa Hadir", ragu: "Masih Ragu" }[attend];
    const normalized = { id: `local-${Date.now()}`, name, guestCount: guest, attendLabel, message };

    // catat fingerprint-nya supaya nanti tidak dobel saat polling menemukan
    // baris yang sama persis dari Sheet
    const key = this._fingerprint(name, attendLabel, message);
    this._pendingLocalKeys.set(key, Date.now() + 3 * 60 * 1000); // kedaluwarsa 3 menit

    this.entries.unshift(normalized);
    this._allEntries.unshift(normalized);
    this._page = 0; // ucapan baru sendiri selalu langsung terlihat di halaman pertama
    this._renderCurrentPage({ animateNewFirstItem: true });
    form.reset();

    const endpoint = WEDDING_CONFIG.rsvp && WEDDING_CONFIG.rsvp.endpoint;

    if (!endpoint) {
      console.warn(
        "[RSVP] WEDDING_CONFIG.rsvp.endpoint belum diisi — ucapan ini TIDAK terkirim ke mana pun, hanya tampil di layar ini. Lihat assets/js/config.js & README.md."
      );
      Utils.toast(`Terima kasih, ${name}! Ucapanmu telah terkirim 💌`);
      MusicPlayer.playClick();
      return;
    }

    this._submitting = true;
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors", // wajib untuk Google Apps Script, lihat catatan di atas
        body: JSON.stringify({
          nama: name,
          jumlahTamu: guest,
          kehadiran: attendLabel,
          ucapan: message || "(tidak ada ucapan)",
          website: "", // kolom jebakan anti-bot (selalu kosong dari form asli)
        }),
      });
      Utils.toast(`Terima kasih, ${name}! Ucapanmu telah terkirim 💌`);
    } catch (err) {
      Utils.toast(`Terima kasih, ${name}! (tersimpan di layar ini, tapi gagal terkirim — cek koneksi internet)`);
      console.error("[RSVP] Error saat mengirim ke Google Sheets:", err);
    } finally {
      this._submitting = false;
    }

    MusicPlayer.playClick();
  },

  // -------------------- INITIAL LOAD --------------------

  async _loadInitial() {
    const endpoint = WEDDING_CONFIG.rsvp && WEDDING_CONFIG.rsvp.endpoint;
    if (!endpoint) return; // tanpa endpoint tidak ada yang bisa diambil, cukup tampilkan layar kosong seperti biasa

    this._showStatus("Memuat ucapan…");

    const rows = await this._fetchGuestbookData(endpoint);

    if (rows === null) {
      this._showStatus("Ucapan terbaru belum dapat dimuat.");
      return;
    }

    this._clearStatus();

    if (rows.length === 0) {
      this._showStatus("Jadilah yang pertama mengirimkan ucapan & doa 💌", { isEmpty: true });
      return;
    }

    // urutan Sheet = lama → baru (appendRow menambah di bawah); simpan terbaru -> terlama
    const newestFirst = [...rows].reverse();
    for (const row of newestFirst) {
      this._seenIds.add(row.id);
      this._allEntries.push(this._normalizeRemoteRow(row));
    }

    this._hasLoadedAny = true;
    this._page = 0;
    this._renderCurrentPage({ animateNewFirstItem: false });
  },

  // -------------------- POLLING / AUTO UPDATE --------------------

  _startPolling() {
    const intervalMs = (WEDDING_CONFIG.rsvp && WEDDING_CONFIG.rsvp.pollIntervalMs) || 8000;

    if (this._pollTimer) return; // jaga-jaga anti timer dobel

    this._pollTimer = setInterval(() => {
      // hemat request saat tab tidak aktif — polling otomatis lanjut lagi saat tab aktif kembali
      if (document.hidden) return;
      this._pollForUpdates();
    }, intervalMs);
  },

  async _pollForUpdates() {
    const endpoint = WEDDING_CONFIG.rsvp && WEDDING_CONFIG.rsvp.endpoint;
    if (!endpoint) return;

    this._purgeExpiredPendingKeys();

    const rows = await this._fetchGuestbookData(endpoint);
    if (rows === null) return; // gagal sementara — diamkan saja, data lama tetap tampil, coba lagi interval berikutnya

    const newRows = rows.filter((row) => !this._seenIds.has(row.id));
    if (newRows.length === 0) return;

    // Sheet sudah kronologis (lama -> baru); balik supaya batch ini juga terbaru -> terlama
    const newRowsNewestFirst = [...newRows].reverse();
    const trulyNewEntries = [];

    for (const row of newRowsNewestFirst) {
      this._seenIds.add(row.id);
      const normalized = this._normalizeRemoteRow(row);
      const key = this._fingerprint(normalized.name, normalized.attendLabel, normalized.message);

      if (this._pendingLocalKeys.has(key)) {
        // ini ucapan yang baru saja disubmit dari browser ini sendiri — sudah
        // tampil di layar lewat render optimis, cukup tandai sudah terlihat.
        this._pendingLocalKeys.delete(key);
        continue;
      }
      trulyNewEntries.push(normalized);
    }

    if (trulyNewEntries.length === 0) return;

    this._allEntries = [...trulyNewEntries, ...this._allEntries];
    this._hasLoadedAny = true;
    this._clearStatus();

    // hanya refresh tampilan kalau tamu sedang di halaman pertama, supaya
    // tamu yang sedang membaca halaman lain tidak terganggu/geser tiba-tiba
    if (this._page === 0) {
      this._renderCurrentPage({ animateNewFirstItem: true });
    } else {
      this._updatePagerUI(); // tetap update status tombol/teks halaman
    }
  },

  _purgeExpiredPendingKeys() {
    const now = Date.now();
    for (const [key, expiresAt] of this._pendingLocalKeys.entries()) {
      if (expiresAt < now) this._pendingLocalKeys.delete(key);
    }
  },

  // -------------------- FETCH HELPER --------------------

  async _fetchGuestbookData(endpoint) {
    try {
      const res = await fetch(endpoint, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== "ok" || !Array.isArray(json.data)) throw new Error("Format respons tidak sesuai");
      return json.data;
    } catch (err) {
      console.error("[RSVP] Gagal mengambil data Buku Tamu dari Google Sheets:", err);
      return null;
    }
  },

  _normalizeRemoteRow(row) {
    const message = row.ucapan === "(tidak ada ucapan)" ? "" : row.ucapan;
    return { id: row.id, name: row.nama, guestCount: row.jumlahTamu, attendLabel: row.kehadiran, message };
  },

  _fingerprint(name, attendLabel, message) {
    const norm = (s) => String(s || "").trim().toLowerCase();
    return `${norm(name)}|${norm(attendLabel)}|${norm(message)}`;
  },

  // -------------------- PAGINATION --------------------

  _goToNextPage() {
    const maxPage = Math.max(0, Math.ceil(this._allEntries.length / this._pageSize) - 1);
    if (this._page >= maxPage) return;
    this._page += 1;
    this._renderCurrentPage({ animateNewFirstItem: false });

    // arahkan pandangan tamu tetap ke area Buku Tamu setelah ganti halaman
    const frame = Utils.$(".guestbook-frame");
    if (frame) frame.scrollIntoView({ behavior: "smooth", block: "nearest" });
  },

  _renderCurrentPage({ animateNewFirstItem = false } = {}) {
    const list = this._listEl || Utils.$("#rsvp-list");
    list.innerHTML = "";

    const start = this._page * this._pageSize;
    const pageItems = this._allEntries.slice(start, start + this._pageSize);

    pageItems.forEach((entry, idx) => {
      const animate = animateNewFirstItem && idx === 0;
      this._renderEntry(entry, { animate });
    });

    this._updatePagerUI();
  },

  _updatePagerUI() {
    if (!this._nextBtn) return;
    const totalPages = Math.max(1, Math.ceil(this._allEntries.length / this._pageSize));
    const hasMore = this._page < totalPages - 1;

    this._nextBtn.hidden = this._allEntries.length <= this._pageSize;
    this._nextBtn.disabled = !hasMore;
    this._nextBtn.textContent = hasMore ? "Lihat ucapan selanjutnya" : "Sudah semua ucapan ditampilkan";
  },

  // -------------------- RENDER --------------------

  _renderEntry(entry, { animate = true } = {}) {
    const list = this._listEl || Utils.$("#rsvp-list");
    const item = document.createElement("div");
    item.className = "rsvp-list-item";
    if (!animate) item.style.animation = "none";
    item.innerHTML = `
      <strong>${this._escape(entry.name)}</strong> · ${this._escape(entry.guestCount)} orang · ${this._escape(entry.attendLabel)}
      ${entry.message ? `<p>"${this._escape(entry.message)}"</p>` : ""}
    `;
    list.appendChild(item);
  },

  // -------------------- STATUS (loading / empty / error) --------------------

  _showStatus(message, { isEmpty = false } = {}) {
    if (this._hasLoadedAny) return; // sudah ada data nyata — jangan timpa dengan status
    const list = this._listEl || Utils.$("#rsvp-list");
    if (!this._statusEl) {
      this._statusEl = document.createElement("p");
      this._statusEl.className = "rsvp-list-status";
    }
    this._statusEl.textContent = message;
    this._statusEl.classList.toggle("rsvp-list-status--empty", isEmpty);
    if (!list.contains(this._statusEl)) list.appendChild(this._statusEl);
  },

  _clearStatus() {
    if (this._statusEl && this._statusEl.parentNode) {
      this._statusEl.parentNode.removeChild(this._statusEl);
    }
  },

  _escape(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },
};
