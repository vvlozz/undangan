/**
 * ============================================================
 *  COUNTDOWN.JS — Hitung Mundur Menuju Hari Acara
 * ============================================================
 */
const Countdown = {
  intervalId: null,

  init() {
    const targetDate = new Date(WEDDING_CONFIG.event.isoDate).getTime();
    this._tick(targetDate);
    this.intervalId = setInterval(() => this._tick(targetDate), 1000);
  },

  _tick(targetDate) {
    const now = Date.now();
    const diff = targetDate - now;

    const daysEl = Utils.$("#cd-days");
    const hoursEl = Utils.$("#cd-hours");
    const minutesEl = Utils.$("#cd-minutes");
    const secondsEl = Utils.$("#cd-seconds");
    const miniText = Utils.$("#detail-cd-text");

    if (diff <= 0) {
      [daysEl, hoursEl, minutesEl, secondsEl].forEach((el) => el && (el.textContent = "00"));
      if (miniText) miniText.textContent = "Hari bahagia telah tiba! 🎉";
      clearInterval(this.intervalId);
      return;
    }

    const days = diff / (1000 * 60 * 60 * 24);
    const hours = (diff / (1000 * 60 * 60)) % 24;
    const minutes = (diff / (1000 * 60)) % 60;
    const seconds = (diff / 1000) % 60;

    if (daysEl) daysEl.textContent = Utils.formatCountdownUnit(days);
    if (hoursEl) hoursEl.textContent = Utils.formatCountdownUnit(hours);
    if (minutesEl) minutesEl.textContent = Utils.formatCountdownUnit(minutes);
    if (secondsEl) secondsEl.textContent = Utils.formatCountdownUnit(seconds);
    if (miniText) {
      miniText.textContent = `${Math.floor(days)} hari lagi menuju hari bahagia kami`;
    }
  },
};
