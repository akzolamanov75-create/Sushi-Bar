/**
 * Sushi Bar Batken — JavaScript
 * Фильтрация меню, анимации, навигация
 */

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

burgerMenu.addEventListener('click', () => {
  burgerMenu.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burgerMenu.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== ФИЛЬТРАЦИЯ МЕНЮ ПО КАТЕГОРИЯМ =====
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.menu-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Активный таб
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const cat = tab.dataset.cat;

    cards.forEach((card, i) => {
      const show = cat === 'all' || card.dataset.cat === cat;

      // Плавная анимация
      if (show) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 30);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  });
});

// ===== ВЫБОР РАЗМЕРА ПИЦЦЫ =====
document.querySelectorAll('.size-pill').forEach(pill => {
  pill.addEventListener('click', function() {
    const card = this.closest('.menu-card');
    const pills = card.querySelectorAll('.size-pill');
    
    // Переключаем активный класс
    pills.forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    
    // Обновляем цену на карточке
    const newPrice = this.dataset.price;
    const priceEl = card.querySelector('.price');
    const unitEl = priceEl.querySelector('.unit');
    
    // Сохраняем unit (сом)
    const unitText = unitEl ? unitEl.outerHTML : '<span class="unit">сом</span>';
    priceEl.innerHTML = `${newPrice} ${unitText}`;
  });
});

// Стили для анимации карточек
cards.forEach(card => {
  card.style.transition = 'opacity .3s ease, transform .3s ease, border-color .3s ease, box-shadow .3s ease';
});

// ===== КОРЗИНА И ЛОГИКА =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartFloatingBtn = document.getElementById('cartFloatingBtn');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const btnOrderWhatsapp = document.getElementById('btnOrderWhatsapp');

renderCart();

// Открытие / закрытие корзины
function toggleCart() {
  cartOverlay.classList.toggle('active');
  cartSidebar.classList.toggle('active');
}
cartFloatingBtn.addEventListener('click', toggleCart);
cartClose.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Обновление UI корзины
function renderCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty" style="display:flex;align-items:center;justify-content:center;gap:8px;">Корзина пуста <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg></div>';
    cartBadge.textContent = 0;
    cartTotalPrice.textContent = 0;
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${item.price} сом</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" onclick="updateQty(${index}, -1)">-</button>
        <span class="cart-qty">${item.qty}</span>
        <button class="cart-qty-btn" onclick="updateQty(${index}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartBadge.textContent = count;
  cartTotalPrice.textContent = total + ' сом';
}

// Очистка корзины
document.getElementById('btnClearCart').addEventListener('click', () => {
  if (cart.length === 0) return;
  if (confirm('Очистить корзину?')) {
    cart = [];
    renderCart();
  }
});

// Изменение количества
window.updateQty = function(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
};

// Добавление в корзину
document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', function () {
    const card = this.closest('.menu-card');
    let name = card.querySelector('h3').textContent;
    
    // Если есть выбор размера, добавляем его к названию
    const activeSize = card.querySelector('.size-pill.active');
    if (activeSize) {
      const sizeText = activeSize.textContent.split('—')[0].trim(); // Берем "30см" или "35см"
      name += ` (${sizeText})`;
    }

    let priceEl = card.querySelector('.price').cloneNode(true);
    // Удаляем старую (перечёркнутую) цену, если есть
    const oldPrice = priceEl.querySelector('.old');
    if (oldPrice) oldPrice.remove();
    const price = parseInt(priceEl.textContent.replace(/\D/g, ''));

    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    renderCart();

    // Анимация кнопки
    this.textContent = '✓';
    this.style.background = '#2ecc71';
    this.style.borderColor = '#2ecc71';
    this.style.color = '#fff';
    this.style.transform = 'rotate(0) scale(1.2)';

    setTimeout(() => {
      this.textContent = '+';
      this.style.background = '';
      this.style.borderColor = '';
      this.style.color = '';
      this.style.transform = '';
    }, 800);
  });
});

// Заказ через WhatsApp
btnOrderWhatsapp.addEventListener('click', () => {
  if (cart.length === 0) return;

  const addressInput = document.getElementById('cartAddress');
  const address = addressInput.value.trim();

  if (!address) {
    alert('Пожалуйста, введите адрес доставки!');
    addressInput.focus();
    return;
  }

  let text = 'Здравствуйте! Мой заказ:%0A%0A';
  let total = 0;

  cart.forEach((item, i) => {
    text += `${i + 1}. ${item.name} — ${item.qty} шт x ${item.price} сом%0A`;
    total += item.price * item.qty;
  });

  text += `%0A*Итого: ${total} сом*%0A`;
  text += `*Адрес доставки:* ${address}`;

  const phone = '996775252527';
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
});



// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), idx * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealElements.forEach(el => observer.observe(el));
