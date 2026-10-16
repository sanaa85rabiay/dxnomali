// معرض الريلز بنمط الأكورديون:
// - تمرير الفأرة فوق لوحة يفتحها ويشغّل فيديوها، ويرفع الكتم تلقائياً بعد نجاح التشغيل
//   (نفس تقنية موقعي المعيطي وسارة: autoplay صامت مسموح، وبعد resolve تُرفع السماعة برمجياً)
// - زر الصوت يتيح الكتم/التشغيل اليدوي
// - أول لوحة تشتغل تلقائياً بالصوت عند ظهور القسم في الشاشة
const panels = [...document.querySelectorAll('.rpanel')];
const vids = panels.map(p => p.querySelector('video'));
const sounds = panels.map(p => p.querySelector('.rp-sound'));
let activeIdx = -1;
let soundLocked = false; // المستخدم كتم الصوت يدوياً فنحترم قراره

function refreshIcons(){
  panels.forEach((_, k) => { if (sounds[k]) sounds[k].innerHTML = speakerIcon(vids[k].muted); });
}

function activate(i){
  if (i === activeIdx) return;
  activeIdx = i;
  panels.forEach((p, k) => {
    const on = k === i;
    p.classList.toggle('active', on);
    p.setAttribute('aria-expanded', on);
    const v = vids[k];
    if (on){
      if (!v.src && v.dataset.src) v.src = v.dataset.src; /* تحميل كسول: لا يُجلب الفيديو إلا عند التفعيل */
      v.muted = true;
      const pr = v.play();
      if (pr && pr.then){
        pr.then(() => {
          // نجح التشغيل الصامت → نرفع الكتم فوراً (السماح متاح لأن الفيديو يعمل الآن)
          if (!soundLocked && k === activeIdx){ v.muted = false; refreshIcons(); }
        }).catch(() => {});
      }
    } else {
      v.pause();
      v.muted = true;
    }
  });
  refreshIcons();
}

function deactivate(){
  if (activeIdx < 0) return;
  vids[activeIdx].pause();
  panels[activeIdx].classList.remove('active');
  activeIdx = -1;
}

panels.forEach((p, i) => {
  if (sounds[i]){
    sounds[i].innerHTML = speakerIcon(true);
    const toggle = e => {
      e.stopPropagation();
      const v = vids[i];
      soundLocked = !v.muted;   // كان مسموعاً → نكتم ونثبّت الكتم
      v.muted = soundLocked;
      if (v.paused){ v.muted = true; const pr = v.play(); if (pr && pr.then) pr.then(() => { if (!soundLocked) v.muted = false; }).catch(() => {}); }
      refreshIcons();
    };
    sounds[i].addEventListener('click', toggle);
    sounds[i].addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(e); } });
  }
  // التمرير (ديسكتوب) والنقر (جوال) يفتحان اللوحة ويشغّلانها بالصوت
  p.addEventListener('mouseenter', () => activate(i));
  p.addEventListener('click', () => activate(i));
});

// أول لوحة تشتغل تلقائياً بالصوت عند ظهور القسم، وتتوقف عند مغادرته
const rgallery = document.getElementById('rgallery');
const reelIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) activate(0); else deactivate(); });
}, {threshold:.3});
reelIO.observe(rgallery);
