// ===================================
// صفحة السلة
// ===================================

/**
 * عرض محتوى السلة
 */
function displayCartPage() {
    const cart = getCart();
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');

    if (cart.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }

    if (cartContent) cartContent.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';

    const total = getCartTotal();

    cartContent.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item animate-fadeInUp">
          <img 
            src="${item.image}" 
            alt="${item.name}" 
            class="cart-item-image"
            onerror="this.src='images/placeholder.jpg'"
          >
          
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <div class="cart-item-category">${item.category}</div>
            <div class="cart-item-price">${formatPrice(item.price)} / ${item.unit}</div>
          </div>
          
          <div class="cart-item-controls">
            <div class="quantity-control">
              <button 
                class="quantity-btn" 
                onclick="decreaseQuantity(${item.id})"
                ${item.quantity <= 1 ? 'disabled' : ''}
              >
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-value">${item.quantity}</span>
              <button 
                class="quantity-btn" 
                onclick="increaseQuantity(${item.id})"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
            
            <div class="cart-item-total">
              <div class="cart-item-total-label">المجموع</div>
              <div class="cart-item-total-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
            
            <button 
              class="btn-remove" 
              onclick="handleRemoveItem(${item.id})"
              title="حذف من السلة"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="cart-summary">
      <h2>ملخص الطلب</h2>
      
      <div class="summary-row">
        <span class="summary-label">عدد المنتجات:</span>
        <span class="summary-value">${getCartItemCount()}</span>
      </div>
      
      <div class="summary-row">
        <span class="summary-label">المجموع الفرعي:</span>
        <span class="summary-value">${formatPrice(total)}</span>
      </div>
      
      <div class="summary-row">
        <span class="summary-label">التوصيل:</span>
        <span class="summary-value">مجاناً</span>
      </div>
      
      <div class="summary-row">
        <span class="summary-label">المجموع الكلي:</span>
        <span class="summary-value">${formatPrice(total)}</span>
      </div>
      
      <div class="cart-actions">
        <a href="checkout.html" class="btn-checkout">
          <i class="fas fa-check-circle"></i>
          إتمام الطلب
        </a>
        <a href="index.html" class="btn-continue">
          <i class="fas fa-arrow-right"></i>
          متابعة التسوق
        </a>
      </div>
    </div>
  `;
}

/**
 * زيادة كمية منتج
 */
function increaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
        updateCartItemQuantity(productId, item.quantity + 1);
        displayCartPage();
    }
}

/**
 * تقليل كمية منتج
 */
function decreaseQuantity(productId) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);

    if (item && item.quantity > 1) {
        updateCartItemQuantity(productId, item.quantity - 1);
        displayCartPage();
    }
}

/**
 * معالجة حذف منتج
 */
function handleRemoveItem(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        removeFromCart(productId);
        displayCartPage();
    }
}

// ===================================
// تهيئة الصفحة
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    displayCartPage();
});
