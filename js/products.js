// ===================================
// إدارة المنتجات والصفحة الرئيسية
// ===================================

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'الكل';

/**
 * تحميل المنتجات من ملف JSON
 */
async function loadProducts() {
    try {
        showLoading(true);
        const response = await fetch('products.json');

        if (!response.ok) {
            throw new Error('فشل تحميل المنتجات');
        }

        allProducts = await response.json();
        filteredProducts = [...allProducts];

        displayCategories();
        displayProducts(filteredProducts);
        showLoading(false);
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        showLoading(false);
        showEmptyState(true);
    }
}

/**
 * عرض الفئات
 */
function displayCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    // استخراج الفئات الفريدة
    const categories = ['الكل', ...new Set(allProducts.map(p => p.category))];

    // أيقونات الفئات
    const categoryIcons = {
        'الكل': 'fa-th-large',
        'خضروات': 'fa-carrot',
        'فواكه': 'fa-apple-alt',
        'منتجات ألبان': 'fa-cheese',
        'حبوب': 'fa-seedling',
        'زيوت': 'fa-oil-can',
        'بقالة': 'fa-shopping-basket'
    };

    categoriesGrid.innerHTML = categories.map(category => `
    <div class="category-card ${category === currentCategory ? 'active' : ''}" 
         onclick="filterByCategory('${category}')"
         data-category="${category}">
      <i class="fas ${categoryIcons[category] || 'fa-box'}"></i>
      <h3>${category}</h3>
    </div>
  `).join('');
}

/**
 * فلترة المنتجات حسب الفئة
 */
function filterByCategory(category) {
    currentCategory = category;

    // تحديث الفئة النشطة
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.category === category) {
            card.classList.add('active');
        }
    });

    // فلترة المنتجات
    if (category === 'الكل') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }

    displayProducts(filteredProducts);
}

/**
 * عرض المنتجات
 */
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    if (products.length === 0) {
        showEmptyState(true);
        return;
    }

    showEmptyState(false);

    productsGrid.innerHTML = products.map((product, index) => `
    <div class="product-card animate-fadeInUp delay-${Math.min(index % 6, 5)}">
      <img 
        src="${product.image}" 
        alt="${product.name}" 
        class="product-image"
        onerror="this.src='images/placeholder.jpg'"
      >
      ${!product.inStock ? '<span class="product-badge">نفذت الكمية</span>' : ''}
      
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description || ''}</p>
        
        <div class="product-footer">
          <div>
            <span class="product-price">${formatPrice(product.price)}</span>
            <span class="product-unit">/${product.unit}</span>
          </div>
          
          <button 
            class="btn-add-to-cart ${!product.inStock ? 'disabled' : ''}" 
            onclick="handleAddToCart(${product.id})"
            ${!product.inStock ? 'disabled' : ''}
          >
            <i class="fas fa-cart-plus"></i>
            إضافة
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * معالجة إضافة منتج إلى السلة
 */
function handleAddToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product && product.inStock) {
        addToCart(product);
    }
}

/**
 * البحث عن المنتجات
 */
function searchProducts(query) {
    query = query.trim().toLowerCase();

    if (query === '') {
        filteredProducts = currentCategory === 'الكل'
            ? [...allProducts]
            : allProducts.filter(p => p.category === currentCategory);
    } else {
        const baseProducts = currentCategory === 'الكل'
            ? allProducts
            : allProducts.filter(p => p.category === currentCategory);

        filteredProducts = baseProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query))
        );
    }

    displayProducts(filteredProducts);
}

/**
 * ترتيب المنتجات
 */
function sortProducts(sortType) {
    switch (sortType) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'ar'));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // الترتيب الافتراضي (حسب ID)
            filteredProducts.sort((a, b) => a.id - b.id);
    }

    displayProducts(filteredProducts);
}

/**
 * عرض حالة التحميل
 */
function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const productsGrid = document.getElementById('productsGrid');

    if (loadingState) {
        loadingState.style.display = show ? 'block' : 'none';
    }
    if (productsGrid) {
        productsGrid.style.display = show ? 'none' : 'grid';
    }
}

/**
 * عرض حالة عدم وجود منتجات
 */
function showEmptyState(show) {
    const emptyState = document.getElementById('emptyState');
    const productsGrid = document.getElementById('productsGrid');

    if (emptyState) {
        emptyState.style.display = show ? 'block' : 'none';
    }
    if (productsGrid) {
        productsGrid.style.display = show ? 'none' : 'grid';
    }
}

// ===================================
// تهيئة الصفحة
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // تحميل المنتجات
    loadProducts();

    // البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchProducts(e.target.value);
        }, 300));
    }

    // الترتيب
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
});
