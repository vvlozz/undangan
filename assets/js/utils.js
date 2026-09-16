/**
 * ============================================================
 *  UTILS.JS — Fungsi bantu umum
 * ============================================================
 */
const Utils = {
  $(selector, scope = document) {
    return scope.querySelector(selector);
  },
  $all(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  },
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  },
  throttle(fn, wait) {
    let last = 0;
    let timeout = null;
    return (...args) => {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        last = now;
        fn(...args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          last = Date.now();
          timeout = null;
          fn(...args);
        }, remaining);
      }
    };
  },
  debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  },
  isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },
  /** Menambahkan efek ripple ke tombol saat diklik/disentuh */
  attachRipple() {
    Utils.$all(".ripple").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const circle = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        circle.className = "ripple-circle";
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${(e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
        circle.style.top = `${(e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;
        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 650);
      });
    });
  },
  /** Menampilkan toast notifikasi singkat */
  toast(message, duration = 2400) {
    const toastEl = Utils.$("#toast");
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(Utils._toastTimeout);
    Utils._toastTimeout = setTimeout(() => toastEl.classList.remove("show"), duration);
  },
  /** Format tanggal ISO menjadi label yang mudah dibaca (fallback jika config kosong) */
  formatCountdownUnit(value) {
    return String(Math.max(0, Math.floor(value))).padStart(2, "0");
  },
  /** Ambil nilai parameter URL pertama yang ditemukan dari daftar nama parameter */
  getQueryParam(names) {
    const params = new URLSearchParams(window.location.search);
    const list = Array.isArray(names) ? names : [names];
    for (const name of list) {
      const value = params.get(name);
      if (value && value.trim()) return value.trim();
    }
    return null;
  },
  /** Ubah "budi-santoso" atau "budi_santoso" jadi "Budi Santoso" agar rapi dibaca */
  titleCaseName(str) {
    return str
      .replace(/[-_]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  },
};
