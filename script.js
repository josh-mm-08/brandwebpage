/* ============================================================
   MAISON ÉLAN — Shared JavaScript
   
   STRUCTURE:
   1. PRODUCT DATA        ← Parents edit this (or Google Sheets replaces it)
   2. CART LOGIC          ← Add, remove, update, persist in localStorage
   3. NAVIGATION          ← Mobile drawer, scroll behaviour
   4. GOOGLE SHEETS       ← Stub ready to activate (see comments)
   5. UTILITY HELPERS     ← Toast, scroll reveal, formatting
   ============================================================ */


/* ============================================================
   1. PRODUCT DATA
   
   HOW PARENTS UPDATE THIS:
   Each product is one object in the PRODUCTS array.
   Fields: id, name, category, feel, price, colors, sizes,
           description, tag, pairedWith, accessory
   
   FUTURE: Replace this entire block with a Google Sheets fetch.
   See section 4 below for the ready-made connection code.
   ============================================================ */

const PRODUCTS = [
  {
    id: 'ME-TEE-001',
    name: 'The Structured Boxy Tee',
    category: 'The Tee',
    feel: 'Heavyweight · 180 GSM',
    occasion: 'Everyday',
    price: 198,
    colors: [
      { name: 'Natural Ecru', hex: '#C8B89E' },
      { name: 'Pine Forest',  hex: '#2D5A3D' },
      { name: 'Deep Navy',    hex: '#1B2B4B' },
      { name: 'Slate Blue',   hex: '#8090A4' },
      { name: 'Bone Ivory',   hex: '#E8E2D4', border: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unavailableSizes: ['XS'],
    description: '100% Peruvian Pima Cotton. Structured boxy silhouette with dropped shoulders. Garment-washed for a lived-in softness from day one.',
    tag: 'New Arrival',
    tagStyle: '',
    pairedWith: 'ME-SHO-003',
    accessory: 'ME-ACC-005',
    fabric: '100% Pima Cotton',
    origin: 'Arequipa, Peru',
    weight: '180 GSM',
    certification: 'OEKO-TEX® Standard 100',
    sku: 'ME-TEE-001',
  },
  {
    id: 'ME-HOD-002',
    name: 'The Cloud Hoodie',
    category: 'Lounge',
    feel: 'Midweight · French Terry',
    occasion: 'Lounge',
    price: 285,
    colors: [
      { name: 'Bone Ivory',   hex: '#E8E2D4', border: true },
      { name: 'Slate Blue',   hex: '#8090A4' },
      { name: 'Pine Forest',  hex: '#2D5A3D' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    unavailableSizes: [],
    description: 'French terry heavyweight fleece. Oversized hood, kangaroo pocket, ribbed cuffs. The one you reach for first on every cold morning.',
    tag: 'Bestseller',
    tagStyle: '',
    pairedWith: 'ME-SHO-003',
    accessory: 'ME-ACC-006',
    fabric: '100% Pima Cotton Terry',
    origin: 'Arequipa, Peru',
    weight: '360 GSM',
    certification: 'OEKO-TEX® Standard 100',
    sku: 'ME-HOD-002',
  },
  {
    id: 'ME-SHO-003',
    name: 'The Lounge Short',
    category: 'Lounge',
    feel: 'Midweight · Terry',
    occasion: 'Lounge',
    price: 145,
    colors: [
      { name: 'Deep Navy',    hex: '#1B2B4B' },
      { name: 'Charcoal',     hex: '#222220' },
      { name: 'Natural Ecru', hex: '#C8B89E' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unavailableSizes: [],
    description: 'Pima terry with an elasticated waistband and interior drawstring. 7" inseam. Pairs with everything in the edit.',
    tag: '',
    tagStyle: '',
    pairedWith: 'ME-TEE-001',
    accessory: 'ME-ACC-005',
    fabric: '100% Pima Cotton Terry',
    origin: 'Arequipa, Peru',
    weight: '300 GSM',
    certification: 'OEKO-TEX® Standard 100',
    sku: 'ME-SHO-003',
  },
  {
    id: 'ME-OVR-004',
    name: 'The Boxy Overshirt',
    category: 'Outerwear',
    feel: 'Heavyweight · Twill',
    occasion: 'Everyday',
    price: 320,
    colors: [
      { name: 'Natural Ecru', hex: '#C8B89E' },
      { name: 'Pine Forest',  hex: '#2D5A3D' },
      { name: 'Slate Blue',   hex: '#8090A4' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    unavailableSizes: ['XXL'],
    description: 'Garment-dyed cotton twill. Button-front, single chest pocket. Wear open over a tee or closed as a light layer.',
    tag: 'Limited',
    tagStyle: '',
    pairedWith: 'ME-SHO-003',
    accessory: 'ME-ACC-005',
    fabric: '100% Pima Cotton Twill',
    origin: 'Arequipa, Peru',
    weight: '220 GSM',
    certification: 'OEKO-TEX® Standard 100',
    sku: 'ME-OVR-004',
  },
  {
    id: 'ME-ACC-005',
    name: 'The Pima Sock',
    category: 'Accessories',
    feel: 'Lightweight · Ribbed',
    occasion: 'Everyday',
    price: 38,
    colors: [
      { name: 'Bone Ivory',  hex: '#E8E2D4', border: true },
      { name: 'Charcoal',    hex: '#222220' },
      { name: 'Pine Forest', hex: '#2D5A3D' }
    ],
    sizes: ['S/M', 'L/XL'],
    unavailableSizes: [],
    description: 'Ribbed Pima cotton crew sock. Mid-calf length, cushioned sole. The finishing touch to any set.',
    tag: '',
    tagStyle: '',
    pairedWith: 'ME-TEE-001',
    accessory: null,
    fabric: '78% Pima Cotton, 20% Nylon, 2% Elastane',
    origin: 'Arequipa, Peru',
    weight: 'N/A',
    certification: 'OEKO-TEX® Standard 100',
    sku: 'ME-ACC-005',
  },
  {
    id: 'ME-ACC-006',
    name: 'The Sleep Mask',
    category: 'Sleep Edit',
    feel: 'Lightweight · Satin',
    occasion: 'Sleep',
    price: 55,
    colors: [
      { name: 'Deep Navy',    hex: '#1B2B4B' },
      { name: 'Natural Ecru', hex: '#C8B89E' }
    ],
    sizes: ['One Size'],
    unavailableSizes: [],
    description: 'Mulberry satin face, Pima cotton lining. Adjustable elastic band. Blocks light completely without pressing on eyelids.',
    tag: 'Sleep Edit',
    tagStyle: 'green',
    pairedWith: 'ME-HOD-002',
    accessory: null,
    fabric: 'Shell: 100% Mulberry Satin · Lining: 100% Pima Cotton',
    origin: 'Arequipa, Peru',
    weight: 'N/A',
    certification: 'OEKO-TEX® Standard 100',
    sku: 'ME-ACC-006',
  }
];

/* Helper: get product by ID */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

/* Helper: get all products for a category tab */
function getProductsByCategory(category) {
  if (category === 'All') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}


/* ============================================================
   2. CART LOGIC
   Cart is stored in localStorage as JSON so it persists
   across page refreshes without needing a server.
   ============================================================ */

/* Get current cart (array of {id, name, size, color, price, qty}) */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('me_cart') || '[]');
  } catch {
    return [];
  }
}

/* Save cart to localStorage */
function saveCart(cart) {
  localStorage.setItem('me_cart', JSON.stringify(cart));
  updateCartBadge(); // keep badge in sync
}

/* Add an item. If same id+size+color exists, increment qty */
function addToCart(id, size, color, qty = 1) {
  const product = getProduct(id);
  if (!product) return;

  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.id === id && item.size === size && item.color === color
  );

  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({
      id,
      name: product.name,
      size,
      color,
      price: product.price,
      qty
    });
  }

  saveCart(cart);
  showToast(`Added — ${size} / ${color}`);
}

/* Remove an item by index */
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

/* Update quantity at index */
function updateCartQty(index, newQty) {
  const cart = getCart();
  if (newQty < 1) { removeFromCart(index); return; }
  if (newQty > 9) newQty = 9;
  cart[index].qty = newQty;
  saveCart(cart);
}

/* Get total item count (for badge) */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* Get cart subtotal */
function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

/* Update every cart badge on the page */
function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}


/* ============================================================
   3. NAVIGATION
   ============================================================ */

function initNav() {
  const nav      = document.getElementById('mainNav');
  const drawer   = document.getElementById('navDrawer');
  const overlay  = document.getElementById('navOverlay');
  const hamburger = document.getElementById('navHamburger');
  const closeBtn  = document.getElementById('navClose');

  if (!nav) return;

  /* Scroll shadow */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* Mobile drawer open */
  hamburger?.addEventListener('click', () => {
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  /* Close drawer */
  function closeDrawer() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  /* Highlight active nav link */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-left a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  /* Update cart badge on load */
  updateCartBadge();
}


/* ============================================================
   4. GOOGLE SHEETS CONNECTION
   
   TO ACTIVATE:
   1. In Google Sheets, go to Extensions → Apps Script
   2. Paste the doGet() function from the README
   3. Deploy as Web App (Anyone can access)
   4. Copy the deployment URL
   5. Replace SHEET_URL below with your URL
   6. Change USE_SHEETS = true
   
   The fetchProducts() function will then replace the
   PRODUCTS array above with live data from your spreadsheet.
   ============================================================ */

const USE_SHEETS = false; // ← set to true when ready
const SHEET_URL  = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

async function fetchProductsFromSheets() {
  try {
    const response = await fetch(SHEET_URL);
    const data     = await response.json();

    /* Map sheet rows to the same shape as PRODUCTS above */
    return data.map(row => ({
      id:          row.ID,
      name:        row.Name,
      category:    row.Category,
      feel:        row.Feel,
      occasion:    row.Occasion,
      price:       Number(row.Price),
      colors:      JSON.parse(row.Colors || '[]'),
      sizes:       row.Sizes.split(',').map(s => s.trim()),
      unavailableSizes: row.Unavailable ? row.Unavailable.split(',').map(s => s.trim()) : [],
      description: row.Description,
      tag:         row.Tag || '',
      tagStyle:    row.TagStyle || '',
      pairedWith:  row.PairedWith || null,
      accessory:   row.Accessory || null,
      fabric:      row.Fabric,
      origin:      row.Origin,
      weight:      row.Weight,
    }));
  } catch (err) {
    console.warn('Google Sheets fetch failed, using local data.', err);
    return PRODUCTS; // fallback to local data
  }
}

/* Call this on pages that need live data */
async function loadProducts() {
  if (USE_SHEETS) {
    const liveProducts = await fetchProductsFromSheets();
    /* Replace local PRODUCTS array with live data */
    PRODUCTS.splice(0, PRODUCTS.length, ...liveProducts);
  }
}


/* ============================================================
   5. UTILITY HELPERS
   ============================================================ */

/* Toast notification */
let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    toast.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* Scroll reveal (IntersectionObserver) */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* Format price as "$198" */
function formatPrice(n) {
  return '$' + Number(n).toLocaleString('en-US');
}

/* Generate a random order number */
function generateOrderNumber() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `ME-${date}-${rand}`;
}

/* Auto-format card number: 1234  5678  9012  3456 */
function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(.{4})/g, '$1  ').trim();
}

/* Auto-format expiry: MM / YY */
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 2) v = v.slice(0, 2) + ' / ' + v.slice(2);
  input.value = v;
}

/* Simple inline field validation */
function validateField(input) {
  const isEmpty = !input.value.trim();
  input.classList.toggle('is-error', isEmpty);
  return !isEmpty;
}

/* ── INIT ON EVERY PAGE ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
});