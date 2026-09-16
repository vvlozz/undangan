/**
 * ============================================================
 *  GUESTNAME.JS — Nama Tamu Undangan via Parameter URL
 * ============================================================
 *  Saat link undangan dibagikan dengan parameter URL, contoh:
 *    index.html?nama=Obi
 *  maka kotak "Kepada Yth." di hero otomatis menampilkan nama
 *  tersebut. Jika parameter tidak ada, tampilkan teks fallback
 *  dari WEDDING_CONFIG.invitedGuest.fallbackName.
 */
const GuestName = {
  init() {
    const cfg = WEDDING_CONFIG.invitedGuest;
    if (!cfg) return;

    const box = Utils.$("#invited-guest");
    const labelEl = Utils.$("#invited-guest-label");
    const nameEl = Utils.$("#invited-guest-name");
    if (!box || !labelEl || !nameEl) return;

    labelEl.textContent = cfg.label;

    const rawName = Utils.getQueryParam(cfg.queryParams);

    if (rawName) {
      // Hanya rapikan kapitalisasi jika nama ditulis huruf kecil semua
      // (mis. ?nama=obi-setiawan -> "Obi Setiawan"). Jika pengirim link
      // sudah menuliskan huruf besar sendiri, biarkan apa adanya.
      const isAllLower = rawName === rawName.toLowerCase();
      nameEl.textContent = isAllLower ? Utils.titleCaseName(rawName) : rawName;
      box.classList.add("invited-guest--named");
    } else {
      nameEl.textContent = cfg.fallbackName;
      box.classList.remove("invited-guest--named");
    }
  },
};
