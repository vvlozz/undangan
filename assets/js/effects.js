/**
 * ============================================================
 *  EFFECTS.JS — Efek Visual (Petal, Confetti, Sparkle, Heart)
 * ============================================================
 *  Semua partikel di-render sebagai elemen <img> ringan di dalam
 *  #effects-layer dan dianimasikan menggunakan GSAP.
 */
const Effects = {
  layer: null,
  confettiSources: [0, 1, 2, 3, 4].map((i) => `assets/effects/confetti_${i}.png`),

  init() {
    this.layer = Utils.$("#effects-layer");
  },

  /** Menjatuhkan kelopak bunga dari atas layar selama `duration` ms */
  petals(count = 22, duration = 4200) {
    const vw = this.layer.offsetWidth || window.innerWidth;
    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = "assets/effects/petal.png";
      img.className = "fx-particle";
      const size = 18 + Math.random() * 20;
      img.style.width = `${size}px`;
      img.style.opacity = 0.85;
      const startX = Math.random() * vw;
      const startY = window.scrollY - 60;
      img.style.left = `${startX}px`;
      img.style.top = `${startY}px`;
      this.layer.appendChild(img);

      const drift = (Math.random() - 0.5) * 200;
      const fallDistance = window.innerHeight * 1.2;
      const rotate = (Math.random() - 0.5) * 360;
      const delay = Math.random() * (duration / 2500);

      gsap.to(img, {
        y: fallDistance,
        x: drift,
        rotation: rotate,
        duration: duration / 1000 + Math.random(),
        delay,
        ease: "sine.inOut",
        onComplete: () => img.remove(),
      });
      gsap.to(img, {
        opacity: 0,
        duration: 1,
        delay: delay + (duration / 1000) * 0.7,
      });
    }
  },

  /** Meledakkan efek konfeti dari titik (x, y) dalam koordinat dokumen */
  confetti(x, y, count = 34) {
    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = this.confettiSources[i % this.confettiSources.length];
      img.className = "fx-particle";
      const size = 8 + Math.random() * 8;
      img.style.width = `${size}px`;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      this.layer.appendChild(img);

      const angle = Math.random() * Math.PI * 2;
      const power = 80 + Math.random() * 140;
      const destX = Math.cos(angle) * power;
      const destY = Math.sin(angle) * power - 60;

      gsap.to(img, {
        x: destX,
        y: destY + 220,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        duration: 1.6 + Math.random() * 0.6,
        ease: "power2.out",
        onComplete: () => img.remove(),
      });
    }
  },

  /** Sparkle kecil di sekitar titik tertentu */
  sparkle(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = "assets/effects/sparkle.png";
      img.className = "fx-particle";
      const size = 12 + Math.random() * 10;
      img.style.width = `${size}px`;
      img.style.left = `${x + (Math.random() - 0.5) * 190}px`;
      img.style.top = `${y + (Math.random() - 0.5) * 190}px`;
      img.style.opacity = 0;
      this.layer.appendChild(img);

      const delay = Math.random() * 0.35;
      gsap.to(img, {
        opacity: 1,
        scale: 1.3,
        duration: 0.3,
        delay,
        onComplete: () => {
          gsap.to(img, { opacity: 0, duration: 0.5, delay: 0.2, onComplete: () => img.remove() });
        },
      });
    }
  },

  /** Ikon hati kecil melayang ke atas dari titik (x, y) */
  heartBurst(x, y) {
    const heart = document.createElement("div");
    heart.className = "heart-burst";
    heart.textContent = "❤️";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    this.layer.appendChild(heart);
    setTimeout(() => heart.remove(), 1700);
  },
};
