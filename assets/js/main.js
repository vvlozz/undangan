/**
 * ============================================================
 *  MAIN.JS — Entry Point Aplikasi
 * ============================================================
 *  Menginisialisasi seluruh modul dalam urutan yang tepat, lalu
 *  menghubungkan alur "Buka Undangan" (reveal karakter + musik).
 */
(function bootstrap() {
  document.addEventListener("DOMContentLoaded", () => {
    ViewportLock.init();

    // Modul yang tidak bergantung pada tata letak akhir
    ContentBuilder.init();
    Gallery.init();
    RSVP.init();
    Gift.init();
    Countdown.init();
    MusicPlayer.init();
    Effects.init();
    Popup.init();
    Character.init();
    Controls.init();
    Joystick.init();
    Utils.attachRipple();
    GuestName.init();
    _initSubtleMotion();

    // Karakter & kontrol dikunci sampai tombol "Buka Undangan" ditekan
    Controls.setEnabled(false);
    Character.groom.el.style.opacity = "0";

    Loader.init(() => {
      GameStage.init();
      _bindOpenInvitation();
    });
  });

  function _initSubtleMotion() {
    // Reveal per-section: each section starts hidden, then its contents
    // enter from ABOVE and drop gently into place one by one.
    document.documentElement.classList.add("motion-ready");

    const revealSelectors = [
      ".section-title",
      ".section-desc",
      ".detail-card",
      ".profile-card",
      ".timeline-item",
      ".gallery-item",
      ".rsvp-form",
      ".gift-card",
      ".map-embed-wrap",
      ".closing-content"
    ];

    const sections = Utils.$all(".section:not(.hero-section)");
    const elements = [];

    sections.forEach((section) => {
      const sectionElements = Utils.$all(revealSelectors.join(","), section);
      sectionElements.forEach((el, index) => {
        const isCard = el.matches(
          ".detail-card, .profile-card, .gallery-item, .gift-card, .map-embed-wrap, .rsvp-form"
        );
        el.classList.add(isCard ? "reveal-card" : "reveal-item");
        // Delay is calculated INSIDE each section, so every section gets
        // its own clean one-by-one sequence when it enters the viewport.
        el.style.setProperty("--reveal-delay", `${Math.min(index, 7) * 110}ms`);
        elements.push(el);
      });
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -10% 0px"
    });

    elements.forEach((el) => observer.observe(el));
  }

  function _bindOpenInvitation() {
    const btn = Utils.$("#open-invitation-btn");

    btn.addEventListener("click", () => {
      MusicPlayer.playClick();
      MusicPlayer.play();

      // Transisi halus: sembunyikan tombol & countdown hero, munculkan karakter.
      // PENTING: pakai visibility (bukan display:none) supaya ruang yang
      // ditempati tombol tetap dipertahankan.
      gsap.to(btn, {
        opacity: 0,
        y: 10,
        duration: 0.4,
        onComplete: () => {
          btn.style.visibility = "hidden";
          btn.style.pointerEvents = "none";
        },
      });

      const groom = Character.groom;
      const wrapper = groom.el;

      // Titik akhir = posisi tengah yang sudah dihitung GameStage saat init.
      // Karakter dimulai dari luar layar sisi kiri, lalu "berjalan masuk"
      // ke titik tengah tersebut — kontrol baru aktif setelah sampai.
      const finalX = groom.x;
      const finalY = groom.y;
      const startX = -groom.width - 40;

      Character.updateGroom(startX, finalY, "right", false);
      wrapper.style.opacity = "0";
      gsap.to(wrapper, { opacity: 1, duration: 0.3, ease: "power1.out" });

      gsap.to(groom, {
        x: finalX,
        y: finalY,
        duration: 2.2,
        delay: 0.15,
        ease: "power1.inOut",
        onUpdate: () => {
          Character.updateGroom(groom.x, groom.y, "right", true);
        },
        onComplete: () => {
          Character.updateGroom(finalX, finalY, "right", false);
          Effects.sparkle(finalX + groom.width / 2, finalY, 16);
          Controls.setEnabled(true);

          // Bubble "Gerakkan karakter untuk menjelajah" di atas joystick
          const hint = Utils.$("#move-hint");
          const joystick = Utils.$("#virtual-joystick");
          if (hint && joystick) {
            joystick.classList.add("needs-attention");
            requestAnimationFrame(() => hint.classList.add("visible"));
          }

          // Popup sambutan "Halo!" muncul otomatis lewat proximity check
          // (karakter langsung berada di dalam radius section hero). Setelah
          // popup itu hilang (auto-hide ±3.2 detik), susulkan pesan ajakan —
          // TAPI cuma kalau tamu belum mulai menggerakkan karakter sendiri.
          // Kalau sudah bergerak duluan, mereka jelas sudah paham caranya,
          // jadi pesan ajakan ini dilewati (kalau tetap dipaksa muncul,
          // posisinya juga sudah tidak relevan lagi karena karakter sudah
          // pindah dari titik awal).
          setTimeout(() => {
            if (GameStage._moveHintDismissed) return;

            const msg = WEDDING_CONFIG.introInvite.replace(
              "{brideName}",
              WEDDING_CONFIG.couple.brideName
            );
            const liveX = Character.groom.x + Character.groom.width / 2;
            const liveY = Character.groom.y - 18;
            Popup.show("hero-invite", liveX, liveY, msg);
          }, 3700);
        },
      });
    }, { once: true });
  }
})();
