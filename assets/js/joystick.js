/**
 * ============================================================
 *  JOYSTICK.JS — Virtual Joystick (Mobile/Touch)
 * ============================================================
 *  Menghasilkan vektor arah dari gestur drag pada joystick,
 *  lalu menuliskannya ke Controls.joystickVector.
 */
const Joystick = {
  base: null,
  thumb: null,
  container: null,
  active: false,
  origin: { x: 0, y: 0 },
  maxRadius: 40,

  init() {
    this.container = Utils.$("#virtual-joystick");
    this.base = Utils.$(".joystick-base");
    this.thumb = Utils.$("#joystick-thumb");

    // Tampilan situs dikunci selalu bergaya HP (lihat #app-frame), jadi
    // joystick virtual juga selalu ditampilkan — sudah mendukung mouse
    // sekaligus sentuhan, jadi tetap bisa dipakai di desktop.
    this.container.classList.add("active", "enabled-mobile");

    this.base.addEventListener("touchstart", (e) => this._onStart(e), { passive: false });
    window.addEventListener("touchmove", (e) => this._onMove(e), { passive: false });
    window.addEventListener("touchend", () => this._onEnd());
    window.addEventListener("touchcancel", () => this._onEnd());

    // Dukungan mouse untuk pengujian di desktop
    this.base.addEventListener("mousedown", (e) => this._onStart(e));
    window.addEventListener("mousemove", (e) => this._onMove(e));
    window.addEventListener("mouseup", () => this._onEnd());
  },

  _getPoint(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  },

  _onStart(e) {
    if (!Controls.enabled) return;
    e.preventDefault();
    this.active = true;
    const rect = this.base.getBoundingClientRect();
    this.origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  },

  _onMove(e) {
    if (!this.active) return;
    e.preventDefault();
    const point = this._getPoint(e);
    let dx = point.x - this.origin.x;
    let dy = point.y - this.origin.y;
    const dist = Math.hypot(dx, dy);

    if (dist > this.maxRadius) {
      dx = (dx / dist) * this.maxRadius;
      dy = (dy / dist) * this.maxRadius;
    }

    this.thumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    Controls.joystickVector = {
      x: Utils.clamp(dx / this.maxRadius, -1, 1),
      y: Utils.clamp(dy / this.maxRadius, -1, 1),
    };
  },

  _onEnd() {
    if (!this.active) return;
    this.active = false;
    this.thumb.style.transform = "translate(-50%, -50%)";
    Controls.joystickVector = { x: 0, y: 0 };
  },
};
