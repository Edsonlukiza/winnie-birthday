/* =========================================================
  Advela's Birthday Experience — script.js
   Scenes: welcome -> gift -> opening -> surprise -> celebration
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- element refs ---------- */
  const sceneWelcome = document.getElementById('scene-welcome');
  const sceneGift = document.getElementById('scene-gift');
  const sceneSurprise = document.getElementById('scene-surprise');

  const giftWrap = document.getElementById('giftWrap');
  const giftBox = document.getElementById('giftBox');
  const giftHint = document.getElementById('giftHint');

  const cakeWrap = document.getElementById('cakeWrap');
  const messagePanel = document.getElementById('messagePanel');
  const wishText = document.getElementById('wishText');
  const makeWishBtn = document.getElementById('makeWishBtn');
  const memoryGallery = document.getElementById('memoryGallery');
  const photoButtons = Array.from(document.querySelectorAll('.memory-photo'));
  const photoLightbox = document.getElementById('photoLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');

  const flash = document.getElementById('flash');
  const confettiLayer = document.getElementById('confettiLayer');
  const heartsLayer = document.getElementById('heartsLayer');
  const fireworksLayer = document.getElementById('fireworksLayer');
  const sparkleLayer = document.getElementById('sparkleLayer');

  const starsLayer = document.getElementById('stars');
  const balloonsLayer = document.getElementById('balloons');
  const particlesLayer = document.getElementById('ambientParticles');

  const musicToggle = document.getElementById('musicToggle');
  const songBtn1 = document.getElementById('songBtn1');
  const songBtn2 = document.getElementById('songBtn2');
  const audio1 = document.getElementById('audioTrack1');
  const audio2 = document.getElementById('audioTrack2');
  const celebrateAgainBtn = document.getElementById('celebrateAgainBtn');
  const welcomeLine = document.getElementById('welcomeLine');
  const welcomeSub = document.getElementById('welcomeSub');

  const WISH_LINES = [
    'May every new beginning bring courage, every ordinary day a little joy,',
    'and every dream remind you how much beauty is still ahead.',
    '',
    'Keep shining as you are. Happy Birthday, Advela!'
  ];

  const GOLD_TONES = ['#f4c95d', '#f9dfa0', '#e8a63f'];
  const PARTY_TONES = ['#e893b8', '#f4c95d', '#b47ee5', '#7fd8c9', '#f97b7b'];

  let celebrationInterval = null;
  let currentTrack = 1;
  let isPlaying = false;
  let wishMade = false;
  let currentPhoto = 0;

  /* =========================================================
     AMBIENT BACKGROUND: stars, balloons, particles
  ========================================================= */
  function buildStars(count = 60) {
    starsLayer.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.setProperty('--dur', (2 + Math.random() * 3.5).toFixed(2) + 's');
      s.style.setProperty('--delay', (Math.random() * 4).toFixed(2) + 's');
      frag.appendChild(s);
    }
    starsLayer.appendChild(frag);
  }

  function buildBalloons(count = 7) {
    balloonsLayer.innerHTML = '';
    const colors = ['#e893b8', '#f4c95d', '#b47ee5', '#7fd8c9', '#f97b7b'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.background = `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), ${colors[i % colors.length]} 60%)`;
      b.style.setProperty('--x', (Math.random() * 92) + '%');
      b.style.setProperty('--dur', (14 + Math.random() * 10).toFixed(1) + 's');
      b.style.setProperty('--delay', (Math.random() * 14).toFixed(1) + 's');
      frag.appendChild(b);
    }
    balloonsLayer.appendChild(frag);
  }

  function buildParticles(count = 26) {
    particlesLayer.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'p-dot';
      p.style.setProperty('--x', Math.random() * 100 + '%');
      p.style.setProperty('--y', Math.random() * 100 + '%');
      p.style.setProperty('--dur', (8 + Math.random() * 8).toFixed(1) + 's');
      p.style.setProperty('--delay', (Math.random() * 6).toFixed(1) + 's');
      frag.appendChild(p);
    }
    particlesLayer.appendChild(frag);
  }

  /* =========================================================
     GIFT BOX: tilt toward cursor
  ========================================================= */
  function handleGiftTilt(e) {
    const rect = giftBox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    giftBox.style.setProperty('--tiltY', Math.max(-14, Math.min(14, dx * 16)) + 'deg');
    giftBox.style.setProperty('--tiltX', Math.max(-14, Math.min(14, dy * -16)) + 'deg');
  }
  window.addEventListener('mousemove', handleGiftTilt);

  /* =========================================================
     EFFECT GENERATORS
  ========================================================= */
  function spawnConfetti(count = 90, layer = confettiLayer, tones = PARTY_TONES) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const c = document.createElement('span');
      c.className = 'confetto';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = tones[Math.floor(Math.random() * tones.length)];
      c.style.setProperty('--dur', (2.4 + Math.random() * 2).toFixed(2) + 's');
      c.style.setProperty('--delay', (Math.random() * 1.4).toFixed(2) + 's');
      c.style.setProperty('--drift', (Math.random() * 160 - 80).toFixed(0) + 'px');
      c.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
      frag.appendChild(c);
      setTimeout(() => c.remove(), 5200);
    }
    layer.appendChild(frag);
  }

  function spawnHearts(count = 14, layer = heartsLayer) {
    const glyphs = ['💗', '💛', '💕', '✨'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.className = 'heart';
      h.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      h.style.left = (5 + Math.random() * 90) + '%';
      h.style.setProperty('--dur', (3.4 + Math.random() * 2.2).toFixed(2) + 's');
      h.style.setProperty('--delay', (Math.random() * 1.6).toFixed(2) + 's');
      h.style.setProperty('--drift', (Math.random() * 100 - 50).toFixed(0) + 'px');
      h.style.setProperty('--size', (14 + Math.random() * 14).toFixed(0) + 'px');
      frag.appendChild(h);
      setTimeout(() => h.remove(), 6500);
    }
    layer.appendChild(frag);
  }

  function spawnSparkles(count = 24, originX = '50%', originY = '45%') {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.style.left = originX;
      s.style.top = originY;
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 140;
      s.style.setProperty('--tx', (Math.cos(angle) * dist).toFixed(0) + 'px');
      s.style.setProperty('--ty', (Math.sin(angle) * dist - 40).toFixed(0) + 'px');
      s.style.setProperty('--dur', (0.8 + Math.random() * 0.8).toFixed(2) + 's');
      frag.appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }
    sparkleLayer.appendChild(frag);
  }

  function launchFirework(x, y, tones = GOLD_TONES) {
    const fw = document.createElement('div');
    fw.className = 'firework';
    fw.style.setProperty('--x', x + '%');
    fw.style.setProperty('--y', y + '%');
    const sparkCount = 20;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('span');
      spark.className = 'spark';
      const angle = (Math.PI * 2 * i) / sparkCount;
      const dist = 50 + Math.random() * 60;
      spark.style.setProperty('--tx', (Math.cos(angle) * dist).toFixed(0) + 'px');
      spark.style.setProperty('--ty', (Math.sin(angle) * dist).toFixed(0) + 'px');
      spark.style.setProperty('--c', tones[Math.floor(Math.random() * tones.length)]);
      spark.style.animationDelay = (Math.random() * 0.1).toFixed(2) + 's';
      fw.appendChild(spark);
    }
    fireworksLayer.appendChild(fw);
    setTimeout(() => fw.remove(), 1500);
  }

  function randomFireworksBurst() {
    const x = 15 + Math.random() * 70;
    const y = 15 + Math.random() * 45;
    launchFirework(x, y);
  }

  function triggerFlash() {
    flash.classList.remove('is-active');
    void flash.offsetWidth; // restart animation
    flash.classList.add('is-active');
  }

  /* =========================================================
     SCENE FLOW
  ========================================================= */
  function goToScene(scene) {
    [sceneWelcome, sceneGift, sceneSurprise].forEach(s => s.classList.remove('is-active'));
    scene.classList.add('is-active');
  }

  function typeText(element, text, onComplete) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      element.textContent = text;
      onComplete?.();
      return;
    }

    element.textContent = '';

    let index = 0;
    let displayed = '';

    function step() {
      if (index >= text.length) {
        onComplete?.();
        return;
      }

      const char = text[index];
      displayed += char;
      element.textContent = displayed;
      index += 1;

      const delay = /[.!?]/.test(char) ? 220 : char === ' ' ? 90 : 80 + Math.random() * 35;
      setTimeout(step, delay);
    }

    step();
  }

  function typeWelcomeMessage() {
    const lines = [
      { element: document.querySelector('.eyebrow'), text: 'a small secret, just for you' },
      { element: welcomeLine, text: 'A birthday surprise for Advela... 🎁' },
      { element: welcomeSub, text: 'Click the gift to open it' }
    ];

    lines.forEach(({ element }) => {
      element.textContent = '';
    });

    let currentIndex = 0;

    function runNextLine() {
      if (currentIndex >= lines.length) return;
      const line = lines[currentIndex];
      typeText(line.element, line.text, () => {
        currentIndex += 1;
        setTimeout(runNextLine, 650);
      });
    }

    setTimeout(runNextLine, 320);
  }

  function startExperience() {
    goToScene(sceneWelcome);
    typeWelcomeMessage();
    setTimeout(() => goToScene(sceneGift), 12500);
  }

  function typewriteWish() {
    wishText.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '\u00A0';

    const fullText = WISH_LINES.join('\n');
    let i = 0;

    function typeChar() {
      if (i <= fullText.length) {
        wishText.textContent = fullText.slice(0, i);
        wishText.appendChild(cursor);
        i++;
        const ch = fullText[i - 1];
        const delay = ch === '\n' ? 260 : (18 + Math.random() * 30);
        setTimeout(typeChar, delay);
      } else {
        setTimeout(() => cursor.remove(), 900);
        startCelebrationLoop();
      }
    }
    typeChar();
  }

  function revealSurprise() {
    goToScene(sceneSurprise);

    // cake rises
    requestAnimationFrame(() => {
      setTimeout(() => cakeWrap.classList.add('is-visible'), 150);
      setTimeout(() => {
        messagePanel.classList.add('is-visible');
        makeWishBtn.classList.add('is-visible');
        memoryGallery.classList.add('is-visible');
        typewriteWish();
      }, 900);
    });

    // initial celebration burst
    spawnConfetti(130);
    spawnHearts(16);
    setTimeout(() => launchFirework(30, 30), 200);
    setTimeout(() => launchFirework(70, 25), 500);
    setTimeout(() => launchFirework(50, 40), 850);

    celebrateAgainBtn.classList.remove('is-hidden');
  }

  function startCelebrationLoop() {
    if (celebrationInterval) return;
    celebrationInterval = setInterval(() => {
      randomFireworksBurst();
      if (Math.random() > 0.5) spawnConfetti(40);
      if (Math.random() > 0.6) spawnHearts(6);
    }, 2600);
  }

  function stopCelebrationLoop() {
    clearInterval(celebrationInterval);
    celebrationInterval = null;
  }

  /* =========================================================
     GIFT OPENING SEQUENCE
  ========================================================= */
  let opened = false;

  function openGift() {
    if (opened) return;
    opened = true;
    giftBox.disabled = true;
    giftHint.style.opacity = '0';

    giftBox.classList.add('is-opening');

    // 1. ribbon unties
    setTimeout(() => giftBox.classList.add('ribbon-untied'), 100);

    // 2. box shakes
    setTimeout(() => giftBox.classList.add('shake'), 500);

    // 3. lid lifts + light bursts
    setTimeout(() => {
      giftBox.classList.add('lid-open');
      spawnSparkles(30, '50%', '30%');
    }, 1050);

    // 4. flash + confetti + fireworks + hearts, screen flash
    setTimeout(() => {
      triggerFlash();
      spawnConfetti(110);
      spawnHearts(14);
      launchFirework(35, 35);
      setTimeout(() => launchFirework(65, 30), 250);
    }, 1750);

    // 5. box fades away, move to surprise scene
    setTimeout(() => {
      giftWrap.classList.add('is-done');
      giftBox.classList.add('is-done');
    }, 2450);

    setTimeout(() => {
      revealSurprise();
    }, 3100);
  }

  giftBox.addEventListener('click', openGift);
  giftBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openGift();
  });

  /* =========================================================
     MUSIC CONTROLS
  ========================================================= */
  function activeAudio() {
    return currentTrack === 1 ? audio1 : audio2;
  }

  function updateSongPicker() {
    songBtn1.classList.toggle('is-active', currentTrack === 1);
    songBtn2.classList.toggle('is-active', currentTrack === 2);
  }

  function playMusic() {
    activeAudio().play().catch(() => { });
    isPlaying = true;
    musicToggle.dataset.playing = 'true';
    musicToggle.querySelector('.btn-icon').textContent = '🔇';
    musicToggle.querySelector('.btn-label').textContent = 'Mute Music';
  }

  function pauseMusic() {
    audio1.pause();
    audio2.pause();
    isPlaying = false;
    musicToggle.dataset.playing = 'false';
    musicToggle.querySelector('.btn-icon').textContent = '🔊';
    musicToggle.querySelector('.btn-label').textContent = 'Play Music';
  }

  musicToggle.addEventListener('click', () => {
    isPlaying ? pauseMusic() : playMusic();
  });

  function switchTrack(track) {
    if (track === currentTrack) return;
    const wasPlaying = isPlaying;
    audio1.pause();
    audio2.pause();
    currentTrack = track;
    updateSongPicker();
    if (wasPlaying) playMusic();
  }

  songBtn1.addEventListener('click', () => switchTrack(1));
  songBtn2.addEventListener('click', () => switchTrack(2));

  function showPhoto(index) {
    currentPhoto = (index + photoButtons.length) % photoButtons.length;
    const button = photoButtons[currentPhoto];
    const image = button.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.caption;
  }

  photoButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showPhoto(index);
      photoLightbox.showModal();
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', () => photoLightbox.close());
  document.getElementById('lightboxPrevious').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => showPhoto(currentPhoto + 1));
  photoLightbox.addEventListener('click', event => {
    if (event.target === photoLightbox) photoLightbox.close();
  });

  makeWishBtn.addEventListener('click', () => {
    if (wishMade) return;
    wishMade = true;
    document.querySelectorAll('.flame').forEach(flame => flame.classList.add('is-extinguished'));
    makeWishBtn.querySelector('.wish-action-icon').textContent = '✦';
    makeWishBtn.querySelector('.wish-action-label').textContent = 'Your wish is on its way';
    makeWishBtn.classList.add('wish-is-made');
    spawnSparkles(22, '50%', '36%');
    spawnConfetti(48);
    launchFirework(50, 34);
  });

  /* =========================================================
     CELEBRATE AGAIN — reset to gift scene
  ========================================================= */
  function resetExperience() {
    stopCelebrationLoop();
    opened = false;

    // reset gift box visuals
    giftBox.disabled = false;
    giftBox.classList.remove('is-opening', 'ribbon-untied', 'shake', 'lid-open', 'is-done');
    giftWrap.classList.remove('is-done');
    giftHint.style.opacity = '';

    // reset surprise scene
    cakeWrap.classList.remove('is-visible');
    messagePanel.classList.remove('is-visible');
    wishText.textContent = '';
    wishMade = false;
    makeWishBtn.classList.remove('wish-is-made');
    makeWishBtn.querySelector('.wish-action-icon').textContent = '✧';
    makeWishBtn.querySelector('.wish-action-label').textContent = 'Make a wish & blow out the candles';
    document.querySelectorAll('.flame').forEach(flame => flame.classList.remove('is-extinguished'));
    memoryGallery.classList.remove('is-visible');
    makeWishBtn.classList.remove('is-visible');

    celebrateAgainBtn.classList.add('is-hidden');

    goToScene(sceneGift);
    spawnConfetti(50);
  }

  celebrateAgainBtn.addEventListener('click', resetExperience);

  /* =========================================================
     INIT
  ========================================================= */
  buildStars();
  buildBalloons();
  buildParticles();
  startExperience();
});
