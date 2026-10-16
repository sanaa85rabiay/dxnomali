// Shared: header shadow, mobile menu, ticker loop, reveal-on-scroll
const header = document.getElementById('header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), {passive:true});

const burger = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');
burger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open'); burger.classList.remove('open');
}));

const track = document.getElementById('tickerTrack');
if (track) track.innerHTML += track.innerHTML;

const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- عدّادات الأرقام (تتحرك تصاعداً عند وصول الزائر إليها) ---------- */
const COUNTERS = [
  { label: "منتج أصلي",    value: 100, suffix: "+" },
  { label: "زبونة سعيدة",  value: 500, suffix: "+" },
  { label: "مدينة نخدمها", value: 27,  suffix: ""  },
  { label: "رضا الزبونات", value: 100, suffix: "%" },
];
function animateCounter(el, target, suffix){
  const dur = 2000, t0 = performance.now();
  const fmt = n => n.toLocaleString('en-US');
  (function tick(t){
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); /* تباطؤ ناعم عند النهاية */
    el.textContent = fmt(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const numbersGrid = document.querySelector('.numbers-grid');
if (numbersGrid){
  COUNTERS.forEach(c => {
    const item = document.createElement('div');
    item.className = 'num-item';
    item.innerHTML = `<span class="num" data-target="${c.value}" data-suffix="${c.suffix}">0${c.suffix}</span><div class="lbl">${c.label}</div>`;
    numbersGrid.appendChild(item);
  });
  const nio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      nio.unobserve(e.target);
      e.target.querySelectorAll('.num').forEach(n => animateCounter(n, +n.dataset.target, n.dataset.suffix));
    });
  }, {threshold:.35});
  nio.observe(numbersGrid);
}

// Speaker icon helper
function speakerIcon(muted){
  return muted
    ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10v4h4l5 5V5L7 10H3Zm13.6 2a4.4 4.4 0 0 0-2.6-4v8a4.4 4.4 0 0 0 2.6-4Zm-2.6-8.8v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z" opacity=".45"/><path d="m16.2 2.7 1.4 1.4L4.1 17.6l-1.4-1.4Z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10v4h4l5 5V5L7 10H3Zm13.5 2a3.5 3.5 0 0 0-2-3.2v6.4a3.5 3.5 0 0 0 2-3.2Zm-2-7.7v2.1a6 6 0 0 1 0 11.2v2.1a8 8 0 0 0 0-15.4Z"/></svg>';
}
