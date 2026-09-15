const heroImage = document.getElementById('heroImage');
const detailImage = document.getElementById('detailImage');
const heroColorName = document.getElementById('heroColorName');
const swatches = [...document.querySelectorAll('.swatch')];

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

let selectedColor = 'أبيض';

// Populate all product photography from the embedded generated assets.
document.querySelectorAll('[data-src-key]').forEach((img) => {
  const key = img.dataset.srcKey;
  if (IMAGES[key]) img.src = IMAGES[key];
});

function setColor(key) {
  const image = IMAGES[key];
  const label = LABELS[key];
  if (!image || !label) return;

  heroImage.style.opacity = '.25';
  window.setTimeout(() => {
    heroImage.src = image;
    heroImage.alt = `طاولة شاشة رُكن بلون ${label}`;
    detailImage.src = image;
    detailImage.alt = `تفاصيل طاولة شاشة رُكن بلون ${label}`;
    heroColorName.textContent = label;
    selectedColor = label;
    heroImage.style.opacity = '1';
  }, 120);

  swatches.forEach((btn) => btn.classList.toggle('active', btn.dataset.color === key));
}

swatches.forEach((btn) => {
  btn.addEventListener('click', () => setColor(btn.dataset.color));
});

document.querySelectorAll('.color-card').forEach((card) => {
  card.addEventListener('click', () => {
    const key = card.dataset.pick;
    setColor(key);
    document.querySelector('.hero-visual').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

const copyOrder = document.getElementById('copyOrder');
const copyStatus = document.getElementById('copyStatus');

copyOrder.addEventListener('click', async () => {
  const text = `السلام عليكم، نبي نطلب مجموعة رُكن: طاولة شاشة 1.80 متر + بوكسين + رف، اللون: ${selectedColor}، السعر 350 د.ل.`;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'تم نسخ نص الطلب ✓';
  } catch {
    copyStatus.textContent = 'انسخ هذا النص وأرسله لنا: ' + text;
  }
  window.setTimeout(() => { copyStatus.textContent = ''; }, 3500);
});
