// =============================
// 部品読み込み（header.html / nav.html）
// =============================
async function loadPart(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(url);
  const html = await res.text();
  el.innerHTML = html;
}

function injectPartials() {
  return Promise.all([
    loadPart('header-placeholder', 'header.html'),
    loadPart('menu-placeholder', 'nav.html')
  ]);
}

// =============================
// 固定 MENU ボタン（右側ボタン）
// =============================
function setupFixedMenu() {
  const btn = document.querySelector('.fixed-menu-btn');
  const menu = document.querySelector('.bottom-menu-overlay');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

// =============================
// フェードイン（.fade-in）
// =============================
function setupFadeIn() {
  const faders = document.querySelectorAll('.fade-in');
  if (!faders.length || !('IntersectionObserver' in window)) return;

  const appearOptions = { threshold: 0.2 };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));
}

// =============================
// スクロールフェード（.scroll-fade）
// =============================
function setupScrollFade() {
  const elements = document.querySelectorAll('.scroll-fade');
  if (!elements.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

// =============================
// トップのスライドショー（.slide + .indicators）
// =============================
function setupSlideshow() {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicators span');
  if (!slides.length || !indicators.length) return;

  let current = 0;
  let timer = null;

  function showSlide(index) {
    slides[current].classList.remove('active');
    indicators[current].classList.remove('active');

    current = index;

    slides[current].classList.add('active');
    indicators[current].classList.add('active');
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // 初期状態
  showSlide(0);
  startAuto();

  indicators.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAuto();
    });
  });

  const container = document.querySelector('.top-slideshow');
  if (container) {
    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', startAuto);
  }
}

// =============================
// お品書きタブ切り替え（.menu-category-nav .tab-btn）
// =============================
function setupMenuTabs() {
  const buttons = document.querySelectorAll('.menu-category-nav .tab-btn');
  const tabs = document.querySelectorAll('.menu-tab');
  if (!buttons.length || !tabs.length) return;

  // 初期状態（active 以外を非表示に）
  tabs.forEach(tab => {
    if (!tab.classList.contains('active')) {
      tab.style.display = 'none';
    }
  });

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      // ボタンの active 切り替え
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // タブの表示切り替え
      tabs.forEach(tab => {
        if (tab.id === targetId) {
          tab.style.display = 'block';
          // 少し遅らせて active クラスでアニメーション
          setTimeout(() => tab.classList.add('active'), 20);
        } else {
          tab.classList.remove('active');
          tab.style.display = 'none';
        }
      });

      // タブナビゲーション付近までスクロール
      const nav = document.querySelector('.menu-category-nav');
      if (nav) {
        const offset = nav.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
}

// =============================
// Swiper（お品書きの写真スライダー）
// =============================
function setupSwiperSlider() {
  if (typeof Swiper === 'undefined') return;
  const swiperEl = document.querySelector('.swiper');
  if (!swiperEl) return;
  if (swiperEl.swiper) return; // すでに初期化済みなら何もしない

  new Swiper('.swiper', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

// =============================
// ニュース開閉（news.html）
// =============================
function setupNewsToggle() {
  const items = document.querySelectorAll('.news-item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

// =============================
// うなぎの量「目安」トグル
// =============================
function setupUnagiToggle() {
  document.querySelectorAll('.unagi-toggle-box').forEach(box => {
    const btn = box.querySelector('.toggle-btn');
    const content = box.querySelector('.toggle-content');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const visible = content.style.display === 'block';
      content.style.display = visible ? 'none' : 'block';
    });
  });
}

// =============================
// スムーススクロール（ページ内リンク）
// =============================
function setupSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
}

// =============================
// ローディングオーバーレイ
// =============================
function setupLoadingOverlay() {
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    loader.classList.add('fade-out');
  }
}

// =============================
// イベント登録
// =============================
window.addEventListener('DOMContentLoaded', () => {
  // 共通パーツ読み込み → 固定メニューのセットアップ
  injectPartials().then(() => {
    // 挿入直後にDOMが安定するよう、ほんの少し遅らせる
    setTimeout(() => {
      setupFixedMenu();
    }, 0);
  });

  // ページ共通〜各ページ別機能まで
  setupFadeIn();
  setupScrollFade();
  setupSlideshow();
  setupMenuTabs();
  setupSwiperSlider();
  setupNewsToggle();
  setupUnagiToggle();
  setupSmoothScroll();
});

window.addEventListener('load', () => {
  setupLoadingOverlay();
});
