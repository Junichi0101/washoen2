/**
 * ギャラリータブ切り替え機能
 */

document.addEventListener('DOMContentLoaded', function() {
    // タブボタンの取得
    const tabButtons = document.querySelectorAll('.tab-btn');
    const fukanakaGallery = document.getElementById('fukunaka-gallery');
    const shiomachiGallery = document.getElementById('shiomachi-gallery');
    
    if (tabButtons.length > 0 && fukanakaGallery && shiomachiGallery) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // アクティブクラスの切り替え
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // ギャラリーの表示切り替え
                const store = this.dataset.store;
                if (store === 'fukunaka') {
                    fukanakaGallery.classList.add('active');
                    shiomachiGallery.classList.remove('active');
                } else if (store === 'shiomachi') {
                    shiomachiGallery.classList.add('active');
                    fukanakaGallery.classList.remove('active');
                }
            });
        });
    }
});