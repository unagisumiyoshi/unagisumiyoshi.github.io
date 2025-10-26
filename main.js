window.addEventListener('DOMContentLoaded', () => {
  const loadPart = async (id, url) => {
    const res = await fetch(url);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  };


  Promise.all([
    loadPart('header-placeholder', 'header.html'),
    loadPart('menu-placeholder', 'nav.html')
  ]).then(() => {
    // DOMが書き換えられた後に確実にイベントを登録する
    setTimeout(() => {
      const btn = document.querySelector('.fixed-menu-btn');
      const menu = document.querySelector('.bottom-menu-overlay');

      if (btn && menu) {
        btn.addEventListener('click', () => {
          menu.classList.toggle('open');
        });
      }

      const links = document.querySelectorAll('.bottom-menu-overlay a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
        });
      });
    }, 100); // ほんのわずかな遅延でDOMの安定を保証
  });
const tabs = document.querySelectorAll('.menu-tab');
const buttons = document.querySelectorAll('.tab-btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // 全タブ非表示
    tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.style.display = 'none';
    });

    buttons.forEach(b => b.classList.remove('active'));

    // 対象のタブだけ表示 → アニメーション
    const target = document.getElementById(btn.dataset.target);
    target.style.display = 'block';

    setTimeout(() => {
      target.classList.add('active');
    }, 20);

    btn.classList.add('active');
  });
});

const swiper = new Swiper('.swiper', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 30,
    navigation: {
         nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    },
 });



  // フェードアニメーション
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));

  // スムーススクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

// うなぎの量「目安」トグル
document.querySelectorAll('.unagi-toggle-box').forEach(box => {
  const btn = box.querySelector('.toggle-btn');
  const content = box.querySelector('.toggle-content');
  if (!btn || !content) return;
  btn.addEventListener('click', () => {
    content.style.display = (content.style.display === 'block') ? 'none' : 'block';
  });
});
