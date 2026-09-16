/**
 * ============================================================
 *  CONTENTBUILDER.JS — Merender Data Config ke DOM
 * ============================================================
 *  Semua teks & data yang bersumber dari WEDDING_CONFIG dirender
 *  di sini, sehingga index.html tetap generik dan mudah dipakai
 *  ulang untuk klien lain hanya dengan mengganti config.js.
 */
const ContentBuilder = {
  init() {
    this._renderLoadingScreen();
    this._renderHero();
    this._renderOpening();
    this._renderProfile();
    this._renderDetail();
    this._renderMap();
    this._renderLoveStory();
    this._renderGift();
    document.title = `${WEDDING_CONFIG.couple.brideName} & ${WEDDING_CONFIG.couple.groomName} — Undangan Pernikahan Digital`;
    Utils.$("#meta-description").setAttribute(
      "content",
      `Undangan pernikahan digital interaktif ${WEDDING_CONFIG.couple.brideName} & ${WEDDING_CONFIG.couple.groomName}`
    );
  },

  _renderLoadingScreen() {
    const { couple } = WEDDING_CONFIG;
    Utils.$("#loading-title").textContent = `${couple.brideName} & ${couple.groomName}`;
    Utils.$("#loading-hashtag").textContent = couple.hashtag;
  },

  _renderHero() {
    const { couple, event } = WEDDING_CONFIG;
    Utils.$("#groom-name-display").textContent = couple.groomName;
    Utils.$("#bride-name-display").textContent = couple.brideName;
    Utils.$("#hero-date-display").textContent = event.dateLabel;
  },

  _renderDetail() {
    const { event } = WEDDING_CONFIG;
    Utils.$("#detail-date-1").textContent = event.dateLabel;
    Utils.$("#detail-time-1").textContent = event.akadTime;
    Utils.$("#detail-date-2").textContent = event.dateLabel;
    Utils.$("#detail-time-2").textContent = event.resepsiTime;
    Utils.$("#detail-location").textContent = event.location;
    Utils.$("#detail-address").textContent = event.address;
    Utils.$("#detail-maps-link").href = event.mapsUrl;
  },

  _renderOpening() {
    const { opening } = WEDDING_CONFIG;
    if (!opening) return;
    Utils.$("#opening-label").textContent = opening.label || "Kata Pembuka";
    Utils.$("#opening-title").textContent = opening.title || "";
    Utils.$("#opening-arabic").textContent = opening.arabicText || "";
    Utils.$("#opening-translation").textContent = opening.translation || "";
    Utils.$("#opening-source").textContent = opening.source || "";
  },

  _renderProfile() {
    const { coupleProfile } = WEDDING_CONFIG;
    if (!coupleProfile) return;
    const { groom, bride } = coupleProfile;

    if (groom) {
      Utils.$("#profile-groom-name").textContent = groom.fullName || "";
      Utils.$("#profile-groom-order").textContent = groom.childOrder || "";
      Utils.$("#profile-groom-parents").textContent = groom.parents || "";
      if (groom.photo) {
        Utils.$("#groom-avatar").style.backgroundImage = `url("${groom.photo}")`;
        Utils.$("#groom-avatar").classList.add("has-photo");
      }
    }
    if (bride) {
      Utils.$("#profile-bride-name").textContent = bride.fullName || "";
      Utils.$("#profile-bride-order").textContent = bride.childOrder || "";
      Utils.$("#profile-bride-parents").textContent = bride.parents || "";
      if (bride.photo) {
        Utils.$("#bride-avatar").style.backgroundImage = `url("${bride.photo}")`;
        Utils.$("#bride-avatar").classList.add("has-photo");
      }
    }
  },

  _renderMap() {
    const { event } = WEDDING_CONFIG;
    if (!event) return;
    const query = event.mapsEmbedQuery || `${event.location} ${event.address}`;
    const frame = Utils.$("#map-embed-frame");
    if (frame) {
      frame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }
    const link = Utils.$("#map-open-link");
    if (link) link.href = event.mapsUrl;
  },

  _renderLoveStory() {
    const container = Utils.$("#love-story-timeline");
    container.innerHTML = WEDDING_CONFIG.loveStory
      .map(
        (item) => `
        <div class="timeline-item">
          <img src="assets/effects/lovestory-vine-ring.png" alt="" class="timeline-dot" />
          <span class="timeline-year">${item.year}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </div>`
      )
      .join("");
  },

  _renderGift() {
    const container = Utils.$("#gift-accounts");
    container.innerHTML = WEDDING_CONFIG.gift
      .map(
        (acc, idx) => `
        <div class="gift-account-item">
          <div>
            <p class="bank-name">${acc.bank}</p>
            <p class="account-number">${acc.accountNumber}</p>
            <p class="account-name">a.n. ${acc.accountName}</p>
          </div>
          <button class="copy-btn" data-copy="${acc.accountNumber.replace(/\s/g, "")}" data-index="${idx}">Salin</button>
        </div>`
      )
      .join("");

    Utils.$all(".copy-btn", container).forEach((btn) => {
      btn.addEventListener("click", () => {
        navigator.clipboard
          .writeText(btn.dataset.copy)
          .then(() => Utils.toast("Nomor rekening disalin!"))
          .catch(() => Utils.toast("Gagal menyalin, coba salin manual."));
        MusicPlayer.playClick();
      });
    });
  },
};
