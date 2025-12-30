// Main Application Controller
// Note: All scripts are loaded via script tags in index.html

// Navigation between screens
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
    
    // Refresh history when showing main screen
    if (screenId === 'main-screen' && window.loadHistory) {
        window.loadHistory();
    }
}

// Navigation handlers
document.addEventListener('DOMContentLoaded', () => {
    // Start game button
    document.querySelector('.start-game-btn')?.addEventListener('click', () => {
        showScreen('topics-screen');
        // loadTopics will be called from game.js
        if (window.loadTopics) {
            window.loadTopics();
        }
    });

    // Back buttons
    document.getElementById('back-to-main')?.addEventListener('click', () => {
        showScreen('main-screen');
        // Refresh history when returning to main screen
        if (window.loadHistory) {
            window.loadHistory();
        }
    });

    document.getElementById('back-to-topics')?.addEventListener('click', () => {
        showScreen('topics-screen');
    });

    // Close game button
    document.getElementById('close-game-btn')?.addEventListener('click', async () => {
        if (confirm('هل أنت متأكد من إغلاق اللعبة؟ سيتم حفظ التقدم الحالي.')) {
            if (window.endCurrentGame) {
                await window.endCurrentGame();
            }
            showScreen('main-screen');
            // Refresh history after closing game
            if (window.loadHistory) {
                await window.loadHistory();
            }
        }
    });
});

// Export
window.showScreen = showScreen;

