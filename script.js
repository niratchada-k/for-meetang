/* ===== แก้ความทรงจำในกล่องสุ่มได้ตรงนี้ ===== */
const MEMORIES = [
  '[ความทรงจำที่ 1 เช่น วันที่น้องแอบกินขนมแล้วทำหน้าไม่รู้เรื่อง]',
  '[ความทรงจำที่ 2]',
  '[ความทรงจำที่ 3]',
  '[ความทรงจำที่ 4]',
  '[ความทรงจำที่ 5]'
];
 
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
 
/* กลีบดอกทานตะวัน */
const petals = document.getElementById('petals');
for (let i = 0; i < 16; i++) {
  const e = document.createElementNS(NS, 'ellipse');
  e.setAttribute('cx', 100); e.setAttribute('cy', 36);
  e.setAttribute('rx', 17); e.setAttribute('ry', 36);
  e.setAttribute('transform', `rotate(${i * 22.5} 100 100)`);
  petals.appendChild(e);
}
 
/* ===== ดาวลอยทั่วพื้นหลัง =====
   แบ่งจอเป็นช่องตาราง แล้วสุ่มวางดาวในแต่ละช่อง ดาวจะกระจายทั่ว ไม่กองรวมกัน */
const STAR_COLORS = ['#F9C08A', '#B9A4F5', '#F7A8C4', '#9EDBC6', '#FFD86B'];
const sky = document.getElementById('sky');
function makeSky() {
  sky.innerHTML = '';
  const phone = window.innerWidth < 640;
  const cols = phone ? 4 : 8;   /* จำนวนช่องแนวนอน */
  const rows = phone ? 7 : 5;   /* จำนวนช่องแนวตั้ง */
  let k = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const left = ((c + 0.15 + Math.random() * 0.7) / cols) * 100;
      const top = ((r + 0.15 + Math.random() * 0.7) / rows) * 100;
      const color = STAR_COLORS[k++ % STAR_COLORS.length];
      const delay = (Math.random() * 6).toFixed(1) + 's';
      const dur = (5 + Math.random() * 4).toFixed(1) + 's';
      if (Math.random() < 0.7) {
        /* ดาวประกาย */
        const size = (phone ? 10 : 12) + Math.round(Math.random() * (phone ? 12 : 18));
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'star');
        svg.setAttribute('width', size); svg.setAttribute('height', size);
        svg.setAttribute('fill', color);
        const use = document.createElementNS(NS, 'use');
        use.setAttribute('href', '#sparkle');
        svg.appendChild(use);
        Object.assign(svg.style, { left: left + '%', top: top + '%', animationDelay: delay, animationDuration: dur });
        sky.appendChild(svg);
      } else {
        /* จุดกลมเล็ก ๆ */
        const d = document.createElement('span');
        const size = 5 + Math.round(Math.random() * 6);
        d.className = 'dot';
        Object.assign(d.style, { left: left + '%', top: top + '%', width: size + 'px', height: size + 'px', background: color, animationDelay: delay, animationDuration: dur });
        sky.appendChild(d);
      }
    }
  }
}
makeSky();
/* หมุนจอมือถือหรือย่อหน้าต่าง ให้จัดดาวใหม่ */
let skyTimer;
let lastPhone = window.innerWidth < 640;
window.addEventListener('resize', () => {
  clearTimeout(skyTimer);
  skyTimer = setTimeout(() => {
    const phone = window.innerWidth < 640;
    if (phone !== lastPhone) { lastPhone = phone; makeSky(); }
  }, 200);
});
 
/* ส่งความคิดถึง → หัวใจลอย */
let miss = 0;
const heartArea = document.getElementById('heartArea');
const HEART_COLORS = ['#F7A8C4', '#B9A4F5', '#FFD86B', '#9EDBC6'];
document.getElementById('missBtn').addEventListener('click', () => {
  miss++;
  document.getElementById('missCount').textContent = miss;
  if (reduceMotion) return;
  for (let i = 0; i < 4; i++) {
    const size = 20 + Math.round(Math.random() * 18);
    const h = document.createElementNS(NS, 'svg');
    h.setAttribute('class', 'float-heart');
    h.setAttribute('width', size); h.setAttribute('height', size);
    h.setAttribute('fill', HEART_COLORS[(miss + i) % HEART_COLORS.length]);
    h.style.left = (15 + Math.random() * 70) + '%';
    h.style.animationDelay = (i * 0.15) + 's';
    const use = document.createElementNS(NS, 'use');
    use.setAttribute('href', '#heartIcon');
    h.appendChild(use);
    heartArea.appendChild(h);
    setTimeout(() => h.remove(), 3200);
  }
});
 
/* การ์ดพลิก */
document.querySelectorAll('.flip').forEach(card => {
  card.addEventListener('click', () => {
    const on = card.classList.toggle('on');
    card.setAttribute('aria-pressed', on);
  });
});
 
/* กล่องสุ่มความทรงจำ */
let last = -1;
const memText = document.getElementById('memText');
document.getElementById('shuffleBtn').addEventListener('click', () => {
  let i;
  do { i = Math.floor(Math.random() * MEMORIES.length); } while (i === last && MEMORIES.length > 1);
  last = i;
  memText.classList.add('swap');
  setTimeout(() => {
    memText.textContent = MEMORIES[i];
    document.getElementById('memNo').textContent = i + 1;
    memText.classList.remove('swap');
  }, reduceMotion ? 0 : 250);
});
 
/* ค่อย ๆ โผล่ตอนเลื่อนลงมา */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = ((i % 4) * 0.08) + 's';
  io.observe(el);
});
 
/* เมนู: เงาตอนเลื่อน + ไฮไลต์ส่วนที่กำลังดู + ปุ่มขึ้นบน */
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
const links = [...document.querySelectorAll('.menu a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 10);
  toTop.classList.toggle('show', y > 600);
  let current = -1;
  sections.forEach((sec, i) => { if (sec && sec.getBoundingClientRect().top < 140) current = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === current));
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();
 
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));