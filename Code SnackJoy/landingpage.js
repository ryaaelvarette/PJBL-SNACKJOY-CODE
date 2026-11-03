// ============ DATA PRODUK ============
const products = [
  { id: 1,  cat: 'Cookies', name: 'Choco Chip Cookies Premium', emoji: '🍪', price: 24500, old: 35000, rate: 4.9, review: 128 },
  { id: 2,  cat: 'Cookies', name: 'Double Choco Cookies',        emoji: '🍪', price: 26000, old: 36000, rate: 4.8, review: 96 },
  { id: 3,  cat: 'Cookies', name: 'Butter Cookies Klasik',       emoji: '🍪', price: 22000, old: 30000, rate: 4.9, review: 143 },
  { id: 4,  cat: 'Cookies', name: 'Oatmeal Raisin Cookies',      emoji: '🍪', price: 25000, old: 34000, rate: 4.7, review: 71 },
  { id: 5,  cat: 'Keripik', name: 'Keripik Singkong Pedas',      emoji: '🥔', price: 18000, old: 25000, rate: 4.8, review: 210 },
  { id: 6,  cat: 'Keripik', name: 'Keripik Kentang Balado',      emoji: '🥔', price: 20000, old: 27000, rate: 4.9, review: 175 },
  { id: 7,  cat: 'Keripik', name: 'Keripik Pisang Coklat',       emoji: '🍌', price: 19000, old: 26000, rate: 4.7, review: 88 },
  { id: 8,  cat: 'Keripik', name: 'Keripik Tempe Original',      emoji: '🥠', price: 17000, old: 23000, rate: 4.6, review: 64 },
  { id: 9,  cat: 'Biskuit', name: 'Biskuit Susu Krim',           emoji: '🍘', price: 15000, old: 21000, rate: 4.8, review: 102 },
  { id: 10, cat: 'Biskuit', name: 'Biskuit Kelapa Renyah',       emoji: '🍘', price: 16500, old: 22000, rate: 4.7, review: 59 },
  { id: 11, cat: 'Biskuit', name: 'Biskuit Gandum Madu',         emoji: '🍘', price: 18500, old: 24000, rate: 4.8, review: 77 },
  { id: 12, cat: 'Biskuit', name: 'Biskuit Coklat Kacang',       emoji: '🍘', price: 17500, old: 23000, rate: 4.6, review: 49 },
  { id: 13, cat: 'Wafer',   name: 'Wafer Coklat Lumer',          emoji: '🍫', price: 14000, old: 19000, rate: 4.9, review: 188 },
  { id: 14, cat: 'Wafer',   name: 'Wafer Keju Gurih',            emoji: '🧇', price: 14500, old: 20000, rate: 4.8, review: 134 },
  { id: 15, cat: 'Wafer',   name: 'Wafer Vanilla Krim',          emoji: '🧇', price: 13500, old: 18000, rate: 4.7, review: 92 },
  { id: 16, cat: 'Wafer',   name: 'Wafer Stik Tiramisu',         emoji: '🍫', price: 16000, old: 22000, rate: 4.8, review: 67 },
];

// ============ STATE ============
let activeCat = 'Cookies';
let searchKey = '';
let cartCount = 0;
const liked = new Set();

// ============ ELEMEN ============
const grid       = document.getElementById('productGrid');
const emptyMsg   = document.getElementById('emptyMsg');
const pills      = document.getElementById('pills');
const searchEl   = document.getElementById('searchInput');
const cartBadge  = document.getElementById('cartBadge');
const cartBtn    = document.getElementById('cartBtn');
const toast      = document.getElementById('toast');
const navbar     = document.getElementById('navbar');
const burger     = document.getElementById('burger');
const navLinks   = document.getElementById('navLinks');

const rupiah = n => 'Rp ' + n.toLocaleString('id-ID');

// ============ RENDER PRODUK ============
function renderProducts() {
  const list = products.filter(p =>
    p.cat === activeCat &&
    p.name.toLowerCase().includes(searchKey.toLowerCase())
  );

  // kalau sedang mencari, cari di semua kategori
  const result = searchKey
    ? products.filter(p => p.name.toLowerCase().includes(searchKey.toLowerCase()))
    : list;

  grid.innerHTML = result.map(p => `
    <article class="card">
      <div class="card-img">
        <button class="heart ${liked.has(p.id) ? 'liked' : ''}" data-id="${p.id}" aria-label="Suka">♥</button>
        <span class="emoji">${p.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <h3 class="card-name">${p.name}</h3>
        <div class="card-rate"><span class="star">★</span> ${p.rate} · ${p.review} ulasan</div>
        <div class="card-price">${rupiah(p.price)} <s>${rupiah(p.old)}</s></div>
        <button class="add-btn" data-id="${p.id}">+ Keranjang</button>
      </div>
    </article>
  `).join('');

  emptyMsg.hidden = result.length > 0;

  // animasi muncul berurutan (stagger)
  grid.querySelectorAll('.card').forEach((card, i) => {
    setTimeout(() => card.classList.add('show'), 80 * i + 30);
  });
}

// ============ KATEGORI ============
pills.addEventListener('click', e => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  pills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  activeCat = pill.dataset.cat;
  searchEl.value = '';
  searchKey = '';
  renderProducts();
});

// ============ PENCARIAN ============
searchEl.addEventListener('input', e => {
  searchKey = e.target.value.trim();
  renderProducts();
});

// ============ KERANJANG & SUKA ============
grid.addEventListener('click', e => {
  const addBtn = e.target.closest('.add-btn');
  const heart  = e.target.closest('.heart');

  if (addBtn) {
    const p = products.find(x => x.id === +addBtn.dataset.id);
    cartCount++;
    cartBadge.textContent = cartCount;
    cartBtn.classList.remove('bump');
    void cartBtn.offsetWidth; // restart animasi
    cartBtn.classList.add('bump');
    showToast(`${p.name} ditambahkan ke keranjang 🛒`);
  }

  if (heart) {
    const id = +heart.dataset.id;
    liked.has(id) ? liked.delete(id) : liked.add(id);
    heart.classList.toggle('liked');
  }
});

// ============ TOAST ============
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ============ NAVBAR ============
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

burger.addEventListener('click', () => navLinks.classList.toggle('open'));

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.querySelectorAll('a').forEach(l => l.classList.remove('active'));
    a.classList.add('active');
    navLinks.classList.remove('open');
  });
});

// ============ COUNTER STATISTIK ============
function runCounters() {
  document.querySelectorAll('.count').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const decimal = +el.dataset.decimal || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimal);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ============ ANIMASI SCROLL (REVEAL) ============
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('show'), i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============ INIT ============
renderProducts();
setTimeout(runCounters, 700);