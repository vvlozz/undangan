/**
 * ============================================================
 *  CUTSCENE.JS — Cutscene Pertemuan Romantis (Penutup)
 * ============================================================
 *  Saat karakter pria mendekati karakter wanita di section
 *  penutup: kontrol dinonaktifkan, karakter berjalan otomatis
 *  beberapa langkah terakhir, lalu muncul efek & pesan penutup.
 */
const Cutscene = {
  isPlaying: false,

  trigger() {
    this.isPlaying = true;
    Controls.setEnabled(false);

    const groom = Character.groom;
    const bride = Character.bride;

    // Titik akhir: pria berhenti tepat di samping wanita, berdampingan sejajar
    const gap = 20; // Jarak akhir pasangan dibuat dekat dan natural
    // Posisi akhir dibuat simetris terhadap tengah stage, sehingga pasangan
    // tidak bergeser ke kiri hanya karena groom berdiri di sisi bride.
    const finalX = bride.x - groom.width - gap;
    const finalY = bride.y;

    Character.groom.el.classList.add("walking");
    Character.updateGroom(groom.x, groom.y, "up", true);

    gsap.to(groom, {
      x: finalX,
      y: finalY,
      duration: 1.6,
      ease: "power1.inOut",
      onUpdate: () => {
        Character.updateGroom(groom.x, groom.y, "up", true);
      },
      onComplete: () => {
        Character.updateGroom(finalX, finalY, "up", false);
        this._playMeetingSequence();
      },
    });

    // Pastikan kamera tetap fokus ke momen pertemuan (native smooth scroll,
    // tanpa bergantung pada plugin GSAP tambahan)
    const targetScroll = Math.max(0, finalY - window.innerHeight * 0.46);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  },

  _playMeetingSequence() {
    const groomCenter = Character.centerOf(Character.groom);
    const brideCenter = Character.centerOf(Character.bride);
    const midX = (groomCenter.x + brideCenter.x) / 2;
    const midY = Math.min(groomCenter.y, brideCenter.y);

    // Karakter wanita tersenyum
    Character.brideSmile();

    // Efek kelopak bunga & konfeti & sparkle — konfeti meledak dari kedua sisi
    // agar mengelilingi pasangan yang kini berdiri berdampingan
    Effects.petals(28, 4500);
    setTimeout(() => {
      Effects.confetti(groomCenter.x, groomCenter.y - 60, 30);
      Effects.confetti(brideCenter.x, brideCenter.y - 60, 30);
    }, 250);
    setTimeout(() => Effects.sparkle(midX, midY - 80, 10), 400);
    setTimeout(() => Effects.heartBurst(midX, midY - 100), 500);

    // Musik beralih menjadi lebih romantis
    MusicPlayer.crossfadeToRomantic(2200);

    // Tampilkan pesan penutup setelah jeda sejenak
    setTimeout(() => this._showClosingMessage(), 1800);
  },

  _showClosingMessage() {
    const { closing } = WEDDING_CONFIG;
    Utils.$("#closing-message-text").textContent = closing.message;
    Utils.$("#closing-submessage-text").textContent = closing.subMessage;

    const overlay = Utils.$("#closing-message");
    overlay.classList.add("visible");

    gsap.fromTo(
      "#closing-message-text",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" }
    );

    this._bindClosingButtons();
  },

  _bindClosingButtons() {
    const overlay = Utils.$("#closing-message");

    Utils.$all("[data-scroll-to]", overlay).forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = Utils.$(`#${btn.dataset.scrollTo}`);
        overlay.classList.remove("visible");
        this.isPlaying = false;
        Controls.setEnabled(true);
        if (target) target.scrollIntoView({ behavior: "smooth" });
        MusicPlayer.playClick();
      });
    });

    Utils.$("#thanks-btn").addEventListener("click", () => {
      overlay.classList.remove("visible");
      MusicPlayer.playClick();
      Utils.toast("Terima kasih telah menjadi bagian dari perjalanan kami 💛");
      // Kontrol tetap nonaktif karena perjalanan telah usai; pemain dapat
      // menjelajah ulang dengan scroll manual.
    });
  },
};
