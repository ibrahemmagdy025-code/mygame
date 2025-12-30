// Question Management Module

// Next question button
document.getElementById('next-question-btn')?.addEventListener('click', () => {
    // Add visual effect
    const questionCard = document.querySelector('.question-card');
    if (questionCard) {
        questionCard.style.animation = 'none';
        setTimeout(() => {
            questionCard.style.animation = 'slideIn 0.5s ease';
        }, 10);
    }

    // Show next question
    setTimeout(() => {
        window.showNextQuestion();
    }, 200);
});

// Skip question button
document.getElementById('skip-question-btn')?.addEventListener('click', () => {
    if (confirm('هل تريد تخطي هذا السؤال بدون إعطاء أو خصم نقاط؟')) {
        // Just move to next question without updating scores
        const questionCard = document.querySelector('.question-card');
        if (questionCard) {
            questionCard.style.animation = 'none';
            setTimeout(() => {
                questionCard.style.animation = 'slideIn 0.5s ease';
            }, 10);
        }

        setTimeout(() => {
            window.showNextQuestion();
        }, 200);
    }
});

