// ================
// التحميل الأولي للصوت
// ================
window.addEventListener('load', () => {
  const bg = document.getElementById('bgMusic');
  const joy = document.getElementById('joySound');
  
  // تعيين مصادر الصوت بعد التأكد من التحميل
  if (bg) bg.src = 'bg-music.mp3';
  if (joy) joy.src = 'joy-sound.mp3';
  
  // تحميل الصوت مسبقًا
  if (bg) bg.load();
  if (joy) joy.load();
});

// ================
// دالة تشغيل آمنة
// ================
function safePlay(audio, volume = 0.7) {
  if (!audio) return;
  audio.volume = volume;
  const promise = audio.play();
  if (promise) {
    promise.catch(err => console.log("الصوت:", err));
  }
}

// ================
// بدء الرحلة
// ================
document.getElementById('start-btn').addEventListener('click', () => {
  const bg = document.getElementById('bgMusic');
  safePlay(bg, 0.25); // تشغيل الخلفية

  // عرض الرسالة التمهيدية
  const introText = "مرحبًا! أنا أريام، وسأعرض لك رحلة صديقتي شهد إلى القبول الجامعي في جامعة الأمير سطام...";
  let i = 0;
  const typingEl = document.getElementById('typing-text');
  typingEl.textContent = '';
  
  const typeInterval = setInterval(() => {
    if (i < introText.length) {
      typingEl.textContent += introText[i];
      i++;
    } else {
      clearInterval(typeInterval);
      setTimeout(() => {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('journey-map').classList.remove('hidden');
        document.getElementById('journey-content').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        
        // ملء النصوص
        document.getElementById('text1').textContent = "شهد، لم تكوني مجرد طالبة... كنتِ مُبتكرة. عندما صمّمتِ ذلك البيت الذكي، لم تُضيئي الأضواء فحسب، بل أضأتِ مستقبلك. والتكريم من إدارة التعليم؟ كان أول سطر في ملف نجاحك.";
        document.getElementById('text2').textContent = "لم يُكتب لكِ القبول في المرة الأولى... لكنكِ لم تتوقفي. كل سهرة، كل مراجعة، كل لحظة شك — كانت جزءًا من كود الصمود الذي كتبتهِ بيديكِ.";
        document.getElementById('text4').textContent = "الجامعة: جامعة الأمير سطام بن عبدالعزيز 🎓\nالتخصص: برمجة وعلوم حاسب 💡\n\nتذكّري: أنتِ لستِ طالبة جديدة... أنتِ مهندسة المستقبل، وكاتبة أول سطر في رواية نجاحك الجامعي.";
      }, 800);
    }
  }, 35);
});

// ================
// التنقل بين المحطات
// ================
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const stage = btn.dataset.stage;
    
    // تحديث الواجهة
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
    document.getElementById(`stage-${stage}`).classList.add('active');
    
    // تشغيل صوت الفرح فقط في المحطة 3
    if (stage === '3') {
      const joy = document.getElementById('joySound');
      if (joy) {
        joy.currentTime = 0;
        safePlay(joy, 0.9);
      }
    }
  });
});

// ================
// خلفية النجوم
// ================
const canvas = document.getElementById('stars');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = [];
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.4,
      speed: Math.random() * 0.6 + 0.1
    });
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.speed;
      if (star.y > canvas.height) star.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ================
// خلفية Matrix
// ================
const matrix = document.getElementById('matrix-bg');
if (matrix) {
  let fontSize = 14;
  let columns = Math.floor(window.innerWidth / fontSize);
  let drops = new Array(columns).fill(0);

  function drawMatrix() {
    matrix.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      color: #00ff44; font-family: 'Courier New', monospace;
      font-size: ${fontSize}px; line-height: 1.2; opacity: 0.1;
      pointer-events: none; z-index: 1; white-space: pre;
    `;

    let output = '';
    const lines = Math.floor(window.innerHeight / fontSize);
    for (let y = 0; y < lines; y++) {
      for (let x = 0; x < columns; x++) {
        if (drops[x] > y && drops[x] < y + 12) {
          output += '01'[Math.floor(Math.random() * 2)];
        } else {
          output += ' ';
        }
      }
      output += '\n';
    }
    matrix.textContent = output;

    for (let i = 0; i < drops.length; i++) {
      if (drops[i] > lines || Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }

    setTimeout(drawMatrix, 50);
  }
  drawMatrix();
}