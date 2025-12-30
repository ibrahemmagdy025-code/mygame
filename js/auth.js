// Authentication Module
const auth = window.firebaseAuth;

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        window.currentUser = user;
        showMainScreen();
    } else {
        // User is signed out
        window.currentUser = null;
        showLoginScreen();
    }
});

// Google Sign In
document.getElementById('google-login-btn')?.addEventListener('click', async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error('Error signing in:', error);
        alert('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    }
});

// Sign Out
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
        alert('حدث خطأ أثناء تسجيل الخروج.');
    }
});

// Show screens
function showLoginScreen() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('login-screen')?.classList.add('active');
}

function showMainScreen() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('main-screen')?.classList.add('active');
    
    // Update judge name
    if (window.currentUser) {
        const judgeNameEl = document.getElementById('judge-name');
        if (judgeNameEl) {
            judgeNameEl.textContent = window.currentUser.displayName || window.currentUser.email;
        }
    }
    
    // Load history
    if (window.loadHistory) {
        window.loadHistory();
    }
}

// Export functions
window.showLoginScreen = showLoginScreen;
window.showMainScreen = showMainScreen;

