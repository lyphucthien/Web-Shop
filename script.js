const products = [
  {name:'Robux Starter 400', category:'Roblox', price:'25.000đ', symbol:'◈', tag:'HOT'},
  {name:'Robux Pack 800', category:'Roblox', price:'45.000đ', symbol:'◈', tag:'SALE'},
  {name:'Robux Pack 1700', category:'Roblox', price:'89.000đ', symbol:'◈', tag:''},
  {name:'Gamepass Premium', category:'Roblox', price:'39.000đ', symbol:'✦', tag:'NEW'},
  {name:'Roblox Item Rare', category:'Roblox', price:'55.000đ', symbol:'✧', tag:''},
  {name:'Roblox Account VIP', category:'Roblox', price:'129.000đ', symbol:'◆', tag:'BEST'},
  {name:'Roblox Script Key 7D', category:'Roblox', price:'19.000đ', symbol:'◇', tag:'NEW'},
  {name:'Roblox Executor Pro', category:'Roblox', price:'69.000đ', symbol:'▣', tag:'HOT'},
];

const grid = document.getElementById('productGrid');
const toast = document.getElementById('toast');
let currentFilter = 'Tất cả';
let toastTimer;
const PAGE_SIZE = 8;
let visibleCount = PAGE_SIZE;

function showToast(message){
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderProducts(filter='Tất cả'){
  if (!grid) return;
  const fullList = filter === 'Tất cả' ? products : products.filter(p => p.category === filter);
  const list = fullList.slice(0, visibleCount);

  grid.innerHTML = list.map((p, index) => `
    <article class="product-card">
      <div class="product-image">${p.tag ? `<span class="tag">${p.tag}</span>` : ''}${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span class="symbol">${p.symbol}</span>`}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <div class="category">${p.category}</div>
        <div class="product-bottom"><strong>${p.price}</strong><button class="buy-btn" data-product="${index}">Xem sản phẩm</button></div>
      </div>
    </article>`).join('');

  document.querySelectorAll('.buy-btn').forEach(btn => btn.addEventListener('click', () => {
    showToast('Trang chi tiết sản phẩm đang ở chế độ demo.');
  }));

  let loadMoreBtn = document.getElementById('loadMoreBtn');
  if (fullList.length > visibleCount) {
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement('button');
      loadMoreBtn.id = 'loadMoreBtn';
      loadMoreBtn.className = 'ghost-btn load-more-btn';
      loadMoreBtn.textContent = 'Xem thêm sản phẩm';
      loadMoreBtn.addEventListener('click', () => {
        visibleCount += PAGE_SIZE;
        renderProducts(currentFilter);
      });
      grid.insertAdjacentElement('afterend', loadMoreBtn);
    }
    loadMoreBtn.style.display = '';
  } else if (loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }
}

function activateFilter(filter){
  currentFilter = filter;
  visibleCount = PAGE_SIZE;
  renderProducts(filter);
  document.getElementById('products')?.scrollIntoView({behavior:'smooth', block:'start'});
}

  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (['Tất cả','Roblox','Minecraft','Discord'].includes(filter)) activateFilter(filter);
      else if (filter === 'Khác') { currentFilter = filter; renderProducts(filter); document.getElementById('products')?.scrollIntoView({behavior:'smooth'}); }
    });
  });

  renderProducts();

document.querySelectorAll('[data-toast]').forEach(el => el.addEventListener('click', () => showToast(el.dataset.toast)));

document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

const carousel = document.getElementById('heroCarousel');
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

if (carousel && track) {
  const slides = Array.from(track.children);
  let index = 0;
  let autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }
  function startAuto(){ autoTimer = setInterval(next, 4200); }
  function stopAuto(){ clearInterval(autoTimer); }

  nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  startAuto();
}

// ===== Chế độ sáng / tối =====
(function () {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const root = document.documentElement;
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function swap(next) {
    root.dataset.theme = next;
    try { localStorage.setItem('lpt_theme', next); } catch (e) {}
  }

  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';

    root.classList.add('theme-switching');
    setTimeout(() => root.classList.remove('theme-switching'), 800);

    if (reduceMotion) { swap(next); return; }

    if (!document.startViewTransition) {
      root.classList.add('theme-anim');
      swap(next);
      setTimeout(() => root.classList.remove('theme-anim'), 400);
      return;
    }

    const toDark = next === 'dark';
    const cx = innerWidth / 2;
    const cy = innerHeight / 2;
    const radius = Math.hypot(cx, cy);

    root.classList.toggle('theme-inward', toDark);

    const transition = document.startViewTransition(() => swap(next));
    transition.ready.then(() => {
      const full = `circle(${radius}px at ${cx}px ${cy}px)`;
      const none = `circle(0px at ${cx}px ${cy}px)`;
      root.animate(
        { clipPath: toDark ? [full, none] : [none, full] },
        {
          duration: 1600,
          easing: 'cubic-bezier(.65,0,.35,1)',
          fill: 'forwards',
          pseudoElement: toDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
        }
      );
    }).catch(() => {});
    transition.finished.finally(() => root.classList.remove('theme-inward'));
  });
})();

(function () {
  const bar = document.querySelector('.top-actions');
  if (!bar) return;

  bar.addEventListener('click', e => {
    const b = e.target.closest('.circle-btn');
    if (b) b.classList.add('tip-off');
  }, true);

  bar.addEventListener('mouseout', e => {
    const b = e.target.closest('.circle-btn');
    if (b && !b.contains(e.relatedTarget)) b.classList.remove('tip-off');
  });
})();
