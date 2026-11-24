const API = 'http://localhost:3000';
let dishes = [];
let cart = {};
let activeCategory = 'All';
const grid = document.querySelector('#foodGrid');
const money = n => `₹${n}`;
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function loadDishes() {
  try {
    const response = await fetch(`${API}/dishes`);
    if (!response.ok) throw new Error('Could not reach JSON Server');
    dishes = await response.json();
    renderDishes();
  } catch (error) {
    grid.innerHTML = `<div class="no-results">Couldn't connect to the menu API.<br>Start the project with <b>npm run dev</b>.</div>`;
    document.querySelector('#resultCount').textContent = 'Menu unavailable';
  }
}
function renderDishes() {
  const query = document.querySelector('#searchInput').value.trim().toLowerCase();
  const filtered = dishes.filter(d => (activeCategory === 'All' || d.category === activeCategory) &&
    (`${d.name} ${d.description} ${d.category}`).toLowerCase().includes(query));
  document.querySelector('#resultCount').textContent = `${filtered.length} delicious options`;
  grid.innerHTML = filtered.length ? filtered.map(d => `
    <article class="food-card">
      <div class="food-image"><img src="${escapeHTML(d.image)}" alt="${escapeHTML(d.name)}" loading="lazy"><span class="food-tag">${escapeHTML(d.tag || d.category)}</span></div>
      <div class="food-info"><div class="food-top"><h3>${escapeHTML(d.name)}</h3><span class="price">${money(d.price)}</span></div>
      <p>${escapeHTML(d.description)}</p><div class="food-bottom"><span class="rating"><b>★ ${d.rating}</b> · ${d.time} min</span>
      <button class="add-btn" data-add="${d.id}">＋ Add</button></div></div>
    </article>`).join('') : '<div class="no-results">No dishes found. Try another search.</div>';
}
function showToast(message) {
  const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1900);
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1; updateCart();
  const dish = dishes.find(d => d.id === id); showToast(`${dish.name} added to your bag`);
}
function updateCart() {
  const entries = Object.entries(cart).filter(([,qty]) => qty > 0);
  const count = entries.reduce((sum,[,qty]) => sum + qty, 0);
  const subtotal = entries.reduce((sum,[id,qty]) => sum + dishes.find(d => d.id === Number(id)).price * qty, 0);
  document.querySelector('#cartCount').textContent = count;
  document.querySelector('#subtotal').textContent = money(subtotal);
  document.querySelector('#total').textContent = money(subtotal + (count ? 30 : 0));
  document.querySelector('#cartItems').innerHTML = entries.length ? entries.map(([id,qty]) => {
    const d = dishes.find(item => item.id === Number(id));
    return `<div class="cart-row"><img src="${escapeHTML(d.image)}" alt=""><div class="cart-row-info"><strong>${escapeHTML(d.name)}</strong><small>${money(d.price)} each</small></div><div class="quantity"><button data-qty="${id}" data-change="-1">−</button><b>${qty}</b><button data-qty="${id}" data-change="1">+</button></div></div>`;
  }).join('') : '<div class="empty-cart">Your bag is looking a little lonely.<br>Let’s fix that with something tasty! 🍕</div>';
}
function openCart() { document.querySelector('#cartPanel').classList.add('open'); document.querySelector('#overlay').classList.add('show'); }
function closeCart() { document.querySelector('#cartPanel').classList.remove('open'); document.querySelector('#overlay').classList.remove('show'); }

document.querySelector('#filters').addEventListener('click', e => {
  const btn = e.target.closest('[data-category]'); if (!btn) return;
  activeCategory = btn.dataset.category;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn)); renderDishes();
});
document.querySelector('#searchInput').addEventListener('input', renderDishes);
grid.addEventListener('click', e => { const btn = e.target.closest('[data-add]'); if (btn) addToCart(Number(btn.dataset.add)); });
document.querySelector('#cartItems').addEventListener('click', e => {
  const btn = e.target.closest('[data-qty]'); if (!btn) return;
  const id = Number(btn.dataset.qty); cart[id] = (cart[id] || 0) + Number(btn.dataset.change);
  if (cart[id] <= 0) delete cart[id]; updateCart();
});
document.querySelector('#cartJump').addEventListener('click', openCart);
document.querySelector('#closeCart').addEventListener('click', closeCart);
document.querySelector('#overlay').addEventListener('click', closeCart);
document.querySelector('#checkoutBtn').addEventListener('click', () => {
  if (!Object.keys(cart).length) return showToast('Add something tasty first!');
  showToast('Demo order placed! Thanks for trying Crave 🎉'); cart = {}; updateCart(); closeCart();
});
loadDishes(); updateCart();