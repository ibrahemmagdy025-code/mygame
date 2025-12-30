// Timer Module
let timerInterval = null;
let timerSeconds = 10;
let timerSound = null;
let soundLoaded = false;

// Initialize timer sound (load on first user interaction for mobile)
function initTimerSound() {
    if (soundLoaded) return;
    try {
        timerSound = new Audio('assets/timer-sound.mp3');
        timerSound.preload = 'auto';
        // For mobile: play and pause immediately to unlock audio
        timerSound.play().then(() => {
            timerSound.pause();
            timerSound.currentTime = 0;
        }).catch(() => {
            // Ignore initial play error
        });
        soundLoaded = true;
    } catch (error) {
        console.warn('Timer sound file not found. Timer will work without sound.');
    }
}

// Timer button
document.getElementById('timer-btn')?.addEventListener('click', async () => {
    // Initialize sound on first click (for mobile - requires user interaction)
    if (!soundLoaded) {
        initTimerSound();
        // Small delay to ensure sound is ready
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    showTimer();
});

// Show timer popup
function showTimer() {
    const popup = document.getElementById('timer-popup');
    if (!popup) return;

    popup.classList.add('active');
    timerSeconds = 10;
    updateTimerDisplay();

    // Start countdown
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            playTimerSound();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (display) {
        display.textContent = timerSeconds;
        
        // Change color when time is running out
        if (timerSeconds <= 3) {
            display.style.color = 'var(--danger-color)';
        } else {
            display.style.color = 'var(--primary-color)';
        }
    }
}

// Play timer sound
function playTimerSound() {
    if (!timerSound) {
        console.log('Timer finished!');
        return;
    }
    
    // Reset and play (needed for mobile)
    timerSound.currentTime = 0;
    timerSound.play().catch(error => {
        console.error('Error playing timer sound:', error);
        // Fallback: try to reload and play
        try {
            timerSound.load();
            timerSound.play().catch(() => {
                console.log('Timer finished! (sound unavailable)');
            });
        } catch (e) {
            console.log('Timer finished! (sound unavailable)');
        }
    });
}

// Close timer button
document.getElementById('close-timer-btn')?.addEventListener('click', () => {
    closeTimer();
});

// Close timer
function closeTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const popup = document.getElementById('timer-popup');
    if (popup) {
        popup.classList.remove('active');
    }
    
    timerSeconds = 10;
}

// Close timer when clicking outside
document.getElementById('timer-popup')?.addEventListener('click', (e) => {
    if (e.target.id === 'timer-popup') {
        closeTimer();
    }
});

