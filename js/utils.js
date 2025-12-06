// ===================================
// وظائف مساعدة عامة
// ===================================

/**
 * تنسيق السعر بإضافة فواصل ورمز العملة
 */
function formatPrice(price) {
    return new Intl.NumberFormat('ar-DZ').format(price) + ' دج';
}

/**
 * توليد رقم طلب فريد
 */
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
}

/**
 * عرض إشعار للمستخدم
 */
function showToast(message, type = 'success') {
    // إزالة أي إشعارات سابقة
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // إنشاء الإشعار
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;

    document.body.appendChild(toast);

    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * حفظ بيانات في localStorage
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        return false;
    }
}

/**
 * قراءة بيانات من localStorage
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('خطأ في قراءة البيانات:', error);
        return defaultValue;
    }
}

/**
 * التحقق من صحة رقم الهاتف الجزائري
 */
function validatePhoneNumber(phone) {
    // إزالة المسافات والرموز
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    // التحقق من الصيغة الجزائرية
    const patterns = [
        /^0[5-7]\d{8}$/, // 0X XX XX XX XX
        /^\+213[5-7]\d{8}$/, // +213 X XX XX XX XX
        /^00213[5-7]\d{8}$/ // 00213 X XX XX XX XX
    ];

    return patterns.some(pattern => pattern.test(cleanPhone));
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

/**
 * تنظيف رقم الهاتف للاستخدام في WhatsApp
 */
function cleanPhoneForWhatsApp(phone) {
    // إزالة جميع الرموز والمسافات
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // إذا كان يبدأ بـ 0، استبدله بـ +213
    if (cleaned.startsWith('0')) {
        cleaned = '+213' + cleaned.substring(1);
    }

    // إذا كان يبدأ بـ 00213، استبدله بـ +213
    if (cleaned.startsWith('00213')) {
        cleaned = '+' + cleaned.substring(2);
    }

    // إزالة علامة + للاستخدام في رابط WhatsApp
    return cleaned.replace('+', '');
}

/**
 * تنسيق التاريخ والوقت
 */
function formatDateTime(date = new Date()) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return new Intl.DateTimeFormat('ar-DZ', options).format(date);
}

/**
 * إضافة رسوم متحركة للعناصر عند الظهور
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
}

/**
 * تحديث عداد السلة في جميع الصفحات
 */
function updateCartBadge() {
    const cart = getFromLocalStorage('cart', []);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;

        // إضافة تأثير نبض عند التحديث
        if (totalItems > 0) {
            badge.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 500);
        }
    }
}

/**
 * تشفير النص لاستخدامه في URL
 */
function encodeForURL(text) {
    return encodeURIComponent(text);
}

/**
 * تحويل كائن إلى query string
 */
function objectToQueryString(obj) {
    return Object.keys(obj)
        .map(key => `${encodeForURL(key)}=${encodeForURL(obj[key])}`)
        .join('&');
}

/**
 * تحميل صورة مع معالجة الأخطاء
 */
function loadImageWithFallback(imgElement, src, fallbackSrc = 'images/placeholder.jpg') {
    imgElement.src = src;
    imgElement.onerror = function () {
        this.onerror = null; // منع التكرار اللانهائي
        this.src = fallbackSrc;
    };
}

/**
 * تأخير التنفيذ (debounce)
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * التمرير السلس إلى عنصر
 */
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// تحديث عداد السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    animateOnScroll();
});
