// Questions Configuration - GitHub Repository
// TODO: استبدل هذه القيم بمعلومات repository الخاص بك على GitHub

const QUESTIONS_CONFIG = {
    // GitHub repository URL (استبدل username و repo-name)
    // مثال: https://raw.githubusercontent.com/username/repo-name/main/questions/
    githubBaseUrl: 'https://raw.githubusercontent.com/ibrahemmagdy025-code/quiz-questions/main/questions/',
    
    // أو يمكنك استخدام branch آخر بدلاً من main
    // githubBaseUrl: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/master/questions/',
    
    // أسماء ملفات الأسئلة
    topics: [
        { id: 'general', name: 'أسئلة عامة', file: 'general.json' },
        { id: 'sports', name: 'رياضة', file: 'sports.json' },
        { id: 'history', name: 'تاريخ', file: 'history.json' },
        { id: 'science', name: 'علوم', file: 'science.json' }
    ]
};

// Export for use in other modules
window.QUESTIONS_CONFIG = QUESTIONS_CONFIG;

