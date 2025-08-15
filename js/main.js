/**
 * 和招縁 - メインJavaScript
 * 
 * 機能:
 * - ヘッダーのスクロール制御
 * - ハンバーガーメニュー
 * - スムーススクロール
 * - 予約モーダル
 * - スクロールアニメーション
 */

// ==========================================
// DOM要素の取得
// ==========================================
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const reservationModal = document.getElementById('reservationModal');
const onlineReservationBtn = document.getElementById('onlineReservationBtn');
const modalClose = document.getElementById('modalClose');
const reservationForm = document.getElementById('reservationForm');

// ==========================================
// ヘッダーのスクロール制御
// ==========================================
let lastScrollY = 0;
let ticking = false;

function updateHeaderOnScroll() {
    const currentScrollY = window.scrollY;
    
    // スクロール位置によってヘッダーのスタイルを変更
    if (currentScrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateHeaderOnScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// ==========================================
// ハンバーガーメニュー
// ==========================================
hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // メニューが開いている間はスクロールを無効化
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// メニューリンクをクリックしたらメニューを閉じる
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ==========================================
// スムーススクロール
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 予約モーダル
// ==========================================
// モーダルを開く
onlineReservationBtn.addEventListener('click', function() {
    reservationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// モーダルを閉じる
modalClose.addEventListener('click', function() {
    reservationModal.classList.remove('active');
    document.body.style.overflow = '';
});

// モーダルの外側をクリックしたら閉じる
reservationModal.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && reservationModal.classList.contains('active')) {
        reservationModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==========================================
// 予約フォームの送信処理
// ==========================================
reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // フォームデータを取得
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // ここで実際の送信処理を行う（今回はダミー）
    console.log('予約データ:', data);
    
    // 成功メッセージを表示
    alert(`ご予約ありがとうございます。\n\nお名前: ${data.name}様\n日時: ${data.date} ${data.time}\n人数: ${data.guests}名\n\n確認メールをお送りいたしました。`);
    
    // モーダルを閉じる
    reservationModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // フォームをリセット
    this.reset();
});

// ==========================================
// スクロールアニメーション
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 一度表示したら監視を解除（パフォーマンス向上）
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
document.addEventListener('DOMContentLoaded', function() {
    // 各セクションにフェードインクラスを追加
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        fadeInObserver.observe(section);
    });
    
    // メニューアイテムにもアニメーションを適用
    const menuItems = document.querySelectorAll('.menu-category, .course-item');
    menuItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.transitionDelay = `${index * 0.1}s`;
        fadeInObserver.observe(item);
    });
});

// ==========================================
// 日付入力の最小値を今日に設定
// ==========================================
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
    
    // 最大値を1ヶ月後に設定
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 1);
    
    const maxYear = maxDate.getFullYear();
    const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDate.getDate()).padStart(2, '0');
    
    dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;
}

// ==========================================
// 営業時間に基づく時間選択の制御
// ==========================================
const timeSelect = document.getElementById('time');
const dateSelect = document.getElementById('date');

if (dateSelect && timeSelect) {
    dateSelect.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();
        
        // 日曜日（0）の場合は選択不可
        if (dayOfWeek === 0) {
            alert('申し訳ございません。日曜日は定休日となっております。');
            this.value = '';
            return;
        }
        
        // 時間選択をリセット
        timeSelect.value = '';
        
        // 土曜日はディナーのみ
        if (dayOfWeek === 6) {
            Array.from(timeSelect.options).forEach(option => {
                if (option.value && parseFloat(option.value) < 17) {
                    option.disabled = true;
                    option.textContent = option.textContent + ' (土曜は不可)';
                }
            });
        } else {
            // 平日は全時間帯可能
            Array.from(timeSelect.options).forEach(option => {
                option.disabled = false;
                option.textContent = option.value || '選択してください';
            });
        }
    });
}

// ==========================================
// ローディング完了後の処理
// ==========================================
window.addEventListener('load', function() {
    // ローディングアニメーションなどがあればここで処理
    document.body.classList.add('loaded');
});

// ==========================================
// ウィンドウリサイズ時の処理
// ==========================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // リサイズ完了後の処理
        if (window.innerWidth > 768) {
            // PCサイズになったらモバイルメニューを閉じる
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ==========================================
// ページ離脱時の確認（フォーム入力中）
// ==========================================
let formChanged = false;

reservationForm.addEventListener('change', function() {
    formChanged = true;
});

reservationForm.addEventListener('submit', function() {
    formChanged = false;
});

window.addEventListener('beforeunload', function(e) {
    if (formChanged && reservationModal.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '入力中のデータが失われますが、よろしいですか？';
    }
});

// ==========================================
// コンソールメッセージ
// ==========================================
console.log('%c和招縁へようこそ', 'font-size: 24px; font-weight: bold; color: #8b7355;');
console.log('伝統と革新が織りなす寿司の芸術をお楽しみください。');