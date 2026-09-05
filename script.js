const products = [
  {name:'Robux Starter', category:'Roblox', price:'25.000đ', symbol:'◈', tag:'HOT'},
  {name:'Gamepass Premium', category:'Roblox', price:'39.000đ', symbol:'✦', tag:'NEW'},
  {name:'Minecraft Rank VIP', category:'Minecraft', price:'49.000đ', symbol:'▦', tag:'BEST'},
  {name:'Minecraft Key 30D', category:'Minecraft', price:'29.000đ', symbol:'◇', tag:'NEW'},
  {name:'Discord Bot Premium', category:'Discord', price:'79.000đ', symbol:'☁', tag:'HOT'},
  {name:'Discord Server Boost', category:'Discord', price:'35.000đ', symbol:'⚡', tag:'SALE'},
  {name:'VIP Digital Tool', category:'Khác', price:'59.000đ', symbol:'✧', tag:'NEW'},
  {name:'Premium Access', category:'Khác', price:'99.000đ', symbol:'◆', tag:'BEST'}
];

const grid = document.getElementById('productGrid');
const toast = document.getElementById('toast');
let currentFilter = 'Tất cả';
let toastTimer;

function showToast(message){
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderProducts(filter='Tất cả'){
  const list = filter === 'Tất cả' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = list.map((p, index) => `
    <article class="product-card">
      <div class="product-image"><span class="tag">${p.tag}</span><span class="symbol">${p.symbol}</span></div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <div class="category">${p.category}</div>
        <div class="product-bottom"><strong>${p.price}</strong><button class="buy-btn" data-product="${index}">Xem sản phẩm</button></div>
      </div>
    </article>`).join('');

  document.querySelectorAll('.buy-btn').forEach(btn => btn.addEventListener('click', () => {
    showToast('Trang chi tiết sản phẩm đang ở chế độ demo.');
  }));
}

function activateFilter(filter){
  currentFilter = filter;
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

document.querySelectorAll('[data-toast]').forEach(el => el.addEventListener('click', () => showToast(el.dataset.toast)));

document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
renderProducts();
