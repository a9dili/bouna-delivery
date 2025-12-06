// ===================================
// صفحة إتمام الطلب (Checkout)
// ===================================

let orderNumber = '';

/**
 * تهيئة الصفحة
 */
function initCheckoutPage() {
    const cart = getCart();

    // إذا كانت السلة فارغة، العودة لصفحة السلة
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // توليد رقم الطلب
    orderNumber = generateOrderNumber();
    document.getElementById('orderNumber').textContent = orderNumber;

    // عرض ملخص الطلب
    displayOrderSummary();

    // إعداد معالجات الأحداث
    setupEventHandlers();
}

/**
 * عرض ملخص الطلب
 */
function displayOrderSummary() {
    const cart = getCart();
    const summaryItems = document.getElementById('summaryItems');
    const subtotal = getCartTotal();

    // عرض المنتجات
    summaryItems.innerHTML = cart.map(item => `
    <div class="summary-item">
      <img 
        src="${item.image}" 
        alt="${item.name}" 
        class="summary-item-image"
        onerror="this.src='images/placeholder.jpg'"
      >
      <div class="summary-item-details">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-quantity">${item.quantity} × ${formatPrice(item.price)}</div>
      </div>
      <div class="summary-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

    // عرض المجاميع
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('grandTotal').textContent = formatPrice(subtotal);
}

/**
 * إعداد معالجات الأحداث
 */
function setupEventHandlers() {
    // زر WhatsApp
    document.getElementById('btnWhatsApp').addEventListener('click', () => {
        if (validateForm()) {
            sendViaWhatsApp();
        }
    });

    // زر Email
    document.getElementById('btnEmail').addEventListener('click', () => {
        if (validateForm()) {
            sendViaEmail();
        }
    });

    // التحقق من الحقول عند الكتابة
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

/**
 * التحقق من صحة حقل واحد
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.hasAttribute('required') && value === '') {
        isValid = false;
    } else if (field.id === 'customerPhone' && !validatePhoneNumber(value)) {
        isValid = false;
    }

    if (isValid) {
        field.classList.remove('error');
    } else {
        field.classList.add('error');
    }

    return isValid;
}

/**
 * التحقق من صحة النموذج
 */
function validateForm() {
    const name = document.getElementById('customerName');
    const phone = document.getElementById('customerPhone');
    const address = document.getElementById('customerAddress');

    const isNameValid = validateField(name);
    const isPhoneValid = validateField(phone);
    const isAddressValid = validateField(address);

    if (!isNameValid || !isPhoneValid || !isAddressValid) {
        showToast('الرجاء ملء جميع الحقول المطلوبة بشكل صحيح', 'error');

        // التمرير إلى أول حقل خاطئ
        const firstError = document.querySelector('.form-input.error, .form-textarea.error');
        if (firstError) {
            smoothScrollTo(firstError);
            firstError.focus();
        }

        return false;
    }

    return true;
}

/**
 * الحصول على بيانات العميل
 */
function getCustomerData() {
    return {
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        address: document.getElementById('customerAddress').value.trim(),
        notes: document.getElementById('customerNotes').value.trim()
    };
}

/**
 * تجهيز نص الطلب
 */
function prepareOrderMessage() {
    const cart = getCart();
    const customer = getCustomerData();
    const total = getCartTotal();

    let message = `*طلب جديد من متجر المواد الغذائية*\n\n`;
    message += `📋 *رقم الطلب:* ${orderNumber}\n`;
    message += `📅 *التاريخ:* ${formatDateTime()}\n\n`;

    message += `👤 *معلومات العميل:*\n`;
    message += `الاسم: ${customer.name}\n`;
    message += `الهاتف: ${customer.phone}\n`;
    message += `العنوان: ${customer.address}\n`;
    if (customer.notes) {
        message += `ملاحظات: ${customer.notes}\n`;
    }
    message += `\n`;

    message += `🛒 *تفاصيل الطلب:*\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   الكمية: ${item.quantity} ${item.unit}\n`;
        message += `   السعر: ${formatPrice(item.price * item.quantity)}\n`;
    });
    message += `\n`;

    message += `💰 *المجموع الكلي:* ${formatPrice(total)}\n`;
    message += `🚚 *طريقة الدفع:* الدفع عند التوصيل\n`;

    return message;
}

/**
 * إرسال الطلب عبر WhatsApp
 */
function sendViaWhatsApp() {
    const message = prepareOrderMessage();
    const customer = getCustomerData();

    // رقم WhatsApp الخاص بالمتجر (يجب تعديله)
    const storePhone = '213XXXXXXXXX'; // ضع رقم هاتف المتجر هنا

    // تنظيف رقم الهاتف
    const cleanPhone = cleanPhoneForWhatsApp(storePhone);

    // إنشاء رابط WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // فتح WhatsApp
    window.open(whatsappUrl, '_blank');

    // حفظ الطلب وإظهار رسالة نجاح
    saveOrder();
    showSuccessMessage();
}

/**
 * إرسال الطلب عبر Email
 */
function sendViaEmail() {
    const message = prepareOrderMessage();
    const customer = getCustomerData();

    // البريد الإلكتروني للمتجر (يجب تعديله)
    const storeEmail = 'billel.boulkroun@gmail.com'; // ضع البريد الإلكتروني للمتجر هنا

    const subject = `طلب جديد - ${orderNumber}`;
    const body = message.replace(/\*/g, '').replace(/\n/g, '%0D%0A');

    // إنشاء رابط mailto
    const mailtoUrl = `mailto:${storeEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;

    // فتح برنامج البريد
    window.location.href = mailtoUrl;

    // حفظ الطلب وإظهار رسالة نجاح
    saveOrder();
    showSuccessMessage();
}

/**
 * حفظ الطلب في السجل
 */
function saveOrder() {
    const cart = getCart();
    const customer = getCustomerData();
    const total = getCartTotal();

    const order = {
        orderNumber,
        date: new Date().toISOString(),
        customer,
        items: cart,
        total,
        status: 'pending'
    };

    // حفظ في سجل الطلبات
    const orders = getFromLocalStorage('orders', []);
    orders.push(order);
    saveToLocalStorage('orders', orders);

    // مسح السلة
    clearCart();
}

/**
 * إظهار رسالة النجاح
 */
function showSuccessMessage() {
    showToast('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');

    // الانتقال للصفحة الرئيسية بعد 3 ثوانٍ
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// ===================================
// تهيئة الصفحة
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
});
