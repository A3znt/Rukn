const heroImage = document.getElementById('heroImage');
const detailImage = document.getElementById('detailImage');
const heroColorName = document.getElementById('heroColorName');
const orderColorName = document.getElementById('orderColorName');
const sheetColorName = document.getElementById('sheetColorName');
const swatches = [...document.querySelectorAll('.swatch')];
const colorCards = [...document.querySelectorAll('.color-card')];

const IMAGES = {
  white: `data:image/webp;base64,${window.RUKN_WHITE || ''}`,
  oak: `data:image/webp;base64,${window.RUKN_OAK || ''}`,
  walnut: `data:image/webp;base64,${window.RUKN_WALNUT || ''}`
};

const LABELS = {
  white: 'أبيض',
  oak: 'بلوط فاتح',
  walnut: 'جوز داكن'
};

let selectedKey = 'oak';

function fillImages() {
  document.querySelectorAll('[data-src-key]').forEach((img) => {
    const key = img.dataset.srcKey;
    if (IMAGES[key]) img.src = IMAGES[key];
  });
}

function setColor(key, scrollToProduct = false) {
  if (!IMAGES[key] || !LABELS[key]) return;

  selectedKey = key;
  const label = LABELS[key];

  if (heroImage) {
    heroImage.style.opacity = '.28';
    window.setTimeout(() => {
      heroImage.src = IMAGES[key];
      heroImage.alt = `مجموعة طاولة شاشة ركن بلون ${label}`;
      heroImage.style.opacity = '1';
    }, 110);
  }

  if (detailImage) {
    detailImage.src = IMAGES[key];
    detailImage.alt = `مجموعة طاولة شاشة ركن بلون ${label}`;
  }

  [heroColorName, orderColorName, sheetColorName].forEach((el) => {
    if (el) el.textContent = label;
  });

  swatches.forEach((btn) => btn.classList.toggle('active', btn.dataset.color === key));
  colorCards.forEach((card) => card.classList.toggle('selected', card.dataset.pick === key));

  if (scrollToProduct) {
    document.getElementById('product')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

swatches.forEach((btn) => {
  btn.addEventListener('click', () => setColor(btn.dataset.color));
});

colorCards.forEach((card) => {
  card.addEventListener('click', () => setColor(card.dataset.pick, false));
  card.querySelector('button')?.addEventListener('click', (event) => {
    event.stopPropagation();
    setColor(card.dataset.pick, true);
  });
});

const sheet = document.getElementById('orderSheet');
const backdrop = document.getElementById('sheetBackdrop');
const closeButton = document.getElementById('sheetClose');

function openSheet() {
  if (!sheet || !backdrop) return;
  if (sheetColorName) sheetColorName.textContent = LABELS[selectedKey];
  sheet.hidden = false;
  backdrop.hidden = false;
  document.body.classList.add('sheet-open');
  closeButton?.focus();
}

function closeSheet() {
  if (!sheet || !backdrop) return;
  sheet.hidden = true;
  backdrop.hidden = true;
  document.body.classList.remove('sheet-open');
}

document.querySelectorAll('.open-order').forEach((button) => {
  button.addEventListener('click', openSheet);
});
closeButton?.addEventListener('click', closeSheet);
backdrop?.addEventListener('click', closeSheet);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sheet && !sheet.hidden) closeSheet();
});

const copyOrder = document.getElementById('copyOrder');
const copyStatus = document.getElementById('copyStatus');

copyOrder?.addEventListener('click', async () => {
  const label = LABELS[selectedKey];
  const message = `السلام عليكم، نبي نطلب مجموعة ركن: طاولة شاشة 1.80 متر + بوكسين + رف، اللون: ${label}، السعر 350 د.ل.`;

  try {
    await navigator.clipboard.writeText(message);
    copyStatus.textContent = 'تم نسخ رسالة الطلب ✓ — ابعتها لصفحة ركن في الخاص.';
    copyOrder.textContent = 'تم النسخ ✓';
    window.setTimeout(() => {
      copyOrder.textContent = 'انسخ رسالة الطلب';
      copyStatus.textContent = 'بعد النسخ، ابعتها لصفحة ركن في الخاص.';
    }, 3200);
  } catch {
    copyStatus.textContent = message;
  }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = [...document.querySelectorAll('.reveal')];

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('in'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  reveals.forEach((el) => observer.observe(el));
}

fillImages();
setColor('oak');