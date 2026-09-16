/**
 * ============================================================
 *  CONTROLS.JS — Kontrol Keyboard (WASD & Arrow Keys)
 * ============================================================
 *  Menghasilkan vektor arah gabungan dari keyboard. Vektor dari
 *  joystick virtual digabungkan di GameStage melalui Controls.joystickVector.
 */
const Controls = {
  keysPressed: new Set(),
  joystickVector: { x: 0, y: 0 },
  enabled: true,

  KEY_MAP: {
    w: "up", ArrowUp: "up",
    s: "down", ArrowDown: "down",
    a: "left", ArrowLeft: "left",
    d: "right", ArrowRight: "right",
  },

  init() {
    window.addEventListener("keydown", (e) => {
      if (!this.enabled) return;

      // Jangan tangkap tombol W/A/S/D atau panah kalau tamu sedang mengetik
      // di form (nama, ucapan RSVP, dll) — biarkan browser memproses
      // pengetikan seperti biasa, jangan sampai malah gerakkan karakter.
      const tag = e.target.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable;
      if (isTyping) return;

      const dir = this.KEY_MAP[e.key];
      if (dir) {
        this.keysPressed.add(dir);
        e.preventDefault();
      }
    });
    window.addEventListener("keyup", (e) => {
      const dir = this.KEY_MAP[e.key];
      if (dir) this.keysPressed.delete(dir);
    });
    // Cegah macet jika window kehilangan fokus saat tombol ditekan
    window.addEventListener("blur", () => this.keysPressed.clear());
  },

  /** Mengembalikan vektor arah gabungan keyboard + joystick, ternormalisasi (-1..1) */
  getVector() {
    if (!this.enabled) return { x: 0, y: 0 };

    let x = 0;
    let y = 0;
    if (this.keysPressed.has("up")) y -= 1;
    if (this.keysPressed.has("down")) y += 1;
    if (this.keysPressed.has("left")) x -= 1;
    if (this.keysPressed.has("right")) x += 1;

    // Gabungkan dengan joystick (ambil yang dominan agar tidak saling tumpang tindih aneh)
    if (Math.abs(this.joystickVector.x) > 0.05 || Math.abs(this.joystickVector.y) > 0.05) {
      x = this.joystickVector.x;
      y = this.joystickVector.y;
    } else {
      const len = Math.hypot(x, y);
      if (len > 0) {
        x /= len;
        y /= len;
      }
    }

    return { x, y };
  },

  setEnabled(state) {
    this.enabled = state;
    if (!state) {
      this.keysPressed.clear();
      this.joystickVector = { x: 0, y: 0 };
    }
  },
};
