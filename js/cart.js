// ===================================
// إدارة سلة التسوق
// ===================================

/**
 * الحصول على السلة من localStorage
 */
function getCart() {
    return getFromLocalStorage('cart', []);
}

/**
 * حفظ السلة في localStorage
 */
function saveCart(cart) {
    saveToLocalStorage('cart', cart);
    updateCartBadge();
}

/**
 * إضافة منتج إلى السلة
 */
function addToCart(product) {
    const cart = getCart();

    // البحث عن المنتج في السلة
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        // زيادة الكمية إذا كان المنتج موجوداً
        existingItem.quantity += 1;
    } else {
        // إضافة المنتج الجديد
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    showToast(`تمت إضافة ${product.name} إلى السلة`);
}

/**
 * إزالة منتج من السلة
 */
function removeFromCart(productId) {
    let cart = getCart();
    const product = cart.find(item => item.id === productId);

    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);

    if (product) {
        showToast(`تم حذف ${product.name} من السلة`, 'error');
    }
}

/**
 * تحديث كمية منتج في السلة
 */
function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

/**
 * حساب المجموع الكلي للسلة
 */
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * حساب عدد المنتجات في السلة
 */
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * مسح السلة بالكامل
 */
function clearCart() {
    saveCart([]);
    showToast('تم مسح السلة');
}

/**
 * التحقق من وجود منتج في السلة
 */
function isInCart(productId) {
    const cart = getCart();
    return cart.some(item => item.id === productId);
}

/**
 * الحصول على كمية منتج في السلة
 */
function getCartItemQuantity(productId) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
}
