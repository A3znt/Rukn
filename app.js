const IMAGE_MAP = {
  white: window.RUKN_WHITE ? `data:image/webp;base64,${window.RUKN_WHITE}` : '',
  oak: window.RUKN_OAK ? `data:image/webp;base64,${window.RUKN_OAK}` : '',
  walnut: window.RUKN_WALNUT ? `data:image/webp;base64,${window.RUKN_WALNUT}` : ''
};

const LABELS = {
  white: 'أبيض',
  oak: 'بلوط فاتح',
  walnut: 'جوز داكن'
};

function hydrateImages() {
  document.querySelectorAll('[data-rukn-image]').forEach((img) => {
    const key = img.dataset.ruknImage;
    if (IMAGE_MAP[key]) img.src = IMAGE_MAP[key];
  });
}
hydrateImages();

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});
mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

let selectedColor = 'white';

function applyColor(key) {
  if (!LABELS[key] || !IMAGE_MAP[key]) return;
  selectedColor = key;

  document.querySelectorAll('[data-color-picker] .color-dot').forEach((dot) => {
    dot.classList.toggle('active', dot.dataset.color === key);
  });
  document.querySelectorAll('.product-thumb').forEach((thumb) => {
    thumb.classList.toggle('active', thumb.dataset.color === key);
  });

  const featured = document.getElementById('featuredImage');
  if (featured) {
    featured.style.opacity = '.35';
    setTimeout(() => {
      featured.src = IMAGE_MAP[key];
      featured.alt = `طاولة شاشة ركن باللون ${LABELS[key]}`;
      featured.style.opacity = '1';
    }, 90);
  }

  const main = document.getElementById('productMainImage');
  if (main) {
    main.style.opacity = '.35';
    setTimeout(() => {
      main.src = IMAGE_MAP[key];
      main.alt = `مجموعة طاولة الشاشة من ركن باللون ${LABELS[key]}`;
      main.style.opacity = '1';
    }, 90);
  }

  const name = document.getElementById('selectedColorName');
  const imageLabel = document.getElementById('productImageLabel');
  const drawerColor = document.getElementById('drawerColor');
  if (name) name.textContent = LABELS[key];
  if (imageLabel) imageLabel.textContent = LABELS[key];
  if (drawerColor) drawerColor.textContent = LABELS[key];
}

document.querySelectorAll('[data-color-picker] .color-dot').forEach((dot) => {
  dot.addEventListener('click', () => applyColor(dot.dataset.color));
});
document.querySelectorAll('.product-thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => applyColor(thumb.dataset.color));
});
applyColor('white');

const filters = [...document.querySelectorAll('.filter')];
const shopCards = [...document.querySelectorAll('.shop-card')];
const catalogCount = document.getElementById('catalogCount');

function filterCatalog(category) {
  let visible = 0;
  shopCards.forEach((card) => {
    const show = category === 'all' || card.dataset.category === category;
    card.hidden = !show;
    if (show) visible += 1;
  });
  filters.forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === category));
  if (catalogCount) catalogCount.textContent = String(visible);
}
filters.forEach((btn) => btn.addEventListener('click', () => filterCatalog(btn.dataset.filter)));

if (document.body.dataset.page === 'catalog') {
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  if (category && filters.some((f) => f.dataset.filter === category)) filterCatalog(category);
}

const orderDrawer = document.getElementById('orderDrawer');
const orderBackdrop = document.getElementById('orderBackdrop');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() {
  if (!orderDrawer || !orderBackdrop) return;
  const drawerColor = document.getElementById('drawerColor');
  if (drawerColor) drawerColor.textContent = LABELS[selectedColor];
  orderDrawer.hidden = false;
  orderBackdrop.hidden = false;
  document.body.classList.add('drawer-open');
  drawerClose?.focus();
}
function closeDrawer() {
  if (!orderDrawer || !orderBackdrop) return;
  orderDrawer.hidden = true;
  orderBackdrop.hidden = true;
  document.body.classList.remove('drawer-open');
}
document.querySelectorAll('.open-order').forEach((btn) => btn.addEventListener('click', openDrawer));
drawerClose?.addEventListener('click', closeDrawer);
orderBackdrop?.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    if (orderDrawer && !orderDrawer.hidden) closeDrawer();
  }
});

const copyOrder = document.getElementById('copyOrder');
const copyStatus = document.getElementById('copyStatus');
copyOrder?.addEventListener('click', async () => {
  const message = `السلام عليكم، نبي نطلب مجموعة طاولة الشاشة من ركن: طاولة 1.80 متر + بوكسين + رف. اللون: ${LABELS[selectedColor]}. السعر: 350 د.ل.`;
  try {
    await navigator.clipboard.writeText(message);
    copyOrder.textContent = 'تم النسخ ✓';
    if (copyStatus) copyStatus.textContent = 'تم نسخ رسالة الطلب. ابعتها لصفحة ركن في الخاص.';
    setTimeout(() => {
      copyOrder.textContent = 'انسخ رسالة الطلب';
      if (copyStatus) copyStatus.textContent = 'بعد النسخ ابعتها لصفحة ركن في الخاص.';
    }, 2800);
  } catch {
    if (copyStatus) copyStatus.textContent = message;
  }
});

const reveals = [...document.querySelectorAll('.reveal')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('in'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -30px' });
  reveals.forEach((el) => observer.observe(el));
}