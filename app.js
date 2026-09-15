const heroImage = document.getElementById('heroImage');
const detailImage = document.getElementById('detailImage');
const heroColorName = document.getElementById('heroColorName');
const swatches = [...document.querySelectorAll('.swatch')];
let selectedColor = 'أبيض';

function setColor(label, key){
  heroImage.classList.remove('shot-white','shot-oak','shot-walnut');
  detailImage.classList.remove('shot-white','shot-oak','shot-walnut');
  heroImage.classList.add(`shot-${key}`);
  detailImage.classList.add(`shot-${key}`);
  heroImage.setAttribute('aria-label', `طاولة شاشة رُكن بلون ${label}`);
  detailImage.setAttribute('aria-label', `تفاصيل طاولة شاشة رُكن بلون ${label}`);
  heroColorName.textContent = label;
  selectedColor = label;
  swatches.forEach(btn => btn.classList.toggle('active', btn.dataset.color === key));
}

swatches.forEach(btn => btn.addEventListener('click', () => setColor(btn.dataset.label, btn.dataset.color)));

document.querySelectorAll('.color-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.pick;
    const btn = swatches.find(item => item.dataset.color === key);
    if(btn){
      setColor(btn.dataset.label, key);
      document.querySelector('.hero-visual').scrollIntoView({behavior:'smooth', block:'center'});
    }
  });
});

const copyOrder = document.getElementById('copyOrder');
const copyStatus = document.getElementById('copyStatus');
copyOrder.addEventListener('click', async () => {
  const text = `السلام عليكم، نبي نطلب طاولة شاشة رُكن 1.80 متر مع بوكسين ورف، اللون: ${selectedColor}، السعر 350 د.ل.`;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'تم نسخ نص الطلب ✓';
  } catch {
    copyStatus.textContent = 'انسخ هذا النص وأرسله لنا: ' + text;
  }
  setTimeout(() => copyStatus.textContent = '', 3500);
});
