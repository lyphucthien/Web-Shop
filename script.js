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
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderProducts(filter='Tất cả'){
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
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  renderProducts(filter);
  document.getElementById('products').scrollIntoView({behavior:'smooth', block:'start'});
}

  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (['Tất cả','Roblox','Minecraft','Discord'].includes(filter)) activateFilter(filter);
      else if (filter === 'Khác') { currentFilter = filter; document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); renderProducts(filter); document.getElementById('products').scrollIntoView({behavior:'smooth'}); }
    });
  });

  renderProducts();

document.querySelectorAll('[data-toast]').forEach(el => el.addEventListener('click', () => showToast(el.dataset.toast)));

document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
renderProducts();

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