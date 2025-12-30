// Game Management Module
const db = window.firebaseDb;
let currentGameId = null;
let currentGameData = null;
let allQuestions = [];
let selectedTopics = [];

// Load topics from JSON files (from GitHub)
window.loadTopics = async function loadTopics() {
    const topicsList = document.getElementById('topics-list');
    if (!topicsList) return;

    // Get GitHub base URL from config
    const githubBaseUrl = window.QUESTIONS_CONFIG?.githubBaseUrl || 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/questions/';
    const topicsConfig = window.QUESTIONS_CONFIG?.topics || [];

    // Available topics
    const topics = topicsConfig.map(topic => ({
        id: topic.id,
        name: topic.name,
        file: githubBaseUrl + topic.file
    }));
    
    // Add mixed option
    topics.push({ id: 'mixed', name: 'متنوع', file: null });

    topicsList.innerHTML = '';
    topics.forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.dataset.topicId = topic.id;
        topicItem.innerHTML = `
            <label style="display: flex; align-items: center; cursor: pointer; width: 100%;">
                <input type="checkbox" data-topic-id="${topic.id}" data-topic-file="${topic.file || ''}">
                <span style="flex: 1;">${topic.name}</span>
            </label>
        `;
        topicsList.appendChild(topicItem);
    });

    // Update continue button state
    updateTopicsButton();
    
    // Add event listeners for checkboxes
    topicsList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            handleTopicSelection(checkbox);
            updateTopicsButton();
        });
    });

    // Add event listeners for clicking anywhere on topic item
    topicsList.querySelectorAll('.topic-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking directly on checkbox (to avoid double toggle)
            if (e.target.type === 'checkbox') {
                return;
            }
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                handleTopicSelection(checkbox);
                updateTopicsButton();
            }
        });
    });
}

// Handle topic selection logic (mixed vs regular topics)
function handleTopicSelection(checkbox) {
    const topicId = checkbox.dataset.topicId;
    const allCheckboxes = document.querySelectorAll('#topics-list input[type="checkbox"]');
    const mixedCheckbox = document.querySelector('#topics-list input[data-topic-id="mixed"]');
    
    if (topicId === 'mixed') {
        // If mixed is selected, uncheck all other topics
        if (checkbox.checked) {
            allCheckboxes.forEach(cb => {
                if (cb.dataset.topicId !== 'mixed') {
                    cb.checked = false;
                }
            });
        }
    } else {
        // If a regular topic is selected, uncheck mixed
        if (checkbox.checked && mixedCheckbox) {
            mixedCheckbox.checked = false;
        }
    }
    
    // Update visual selection state
    updateTopicVisualState();
}

// Update visual selection state for topic items
function updateTopicVisualState() {
    const topicItems = document.querySelectorAll('.topic-item');
    topicItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function updateTopicsButton() {
    const checked = document.querySelectorAll('#topics-list input[type="checkbox"]:checked');
    const continueBtn = document.getElementById('start-topics-btn');
    if (continueBtn) {
        continueBtn.disabled = checked.length === 0;
    }
    // Update visual state
    updateTopicVisualState();
}

// Continue from topics selection
document.getElementById('start-topics-btn')?.addEventListener('click', async () => {
    const checked = document.querySelectorAll('#topics-list input[type="checkbox"]:checked');
    selectedTopics = Array.from(checked).map(cb => ({
        id: cb.dataset.topicId,
        file: cb.dataset.topicFile
    }));

    // Load questions from selected topics
    await loadQuestions();
    
    // Show players screen
    window.showScreen('players-screen');
    loadPlayers();
});

// Load questions from JSON files (from GitHub)
async function loadQuestions() {
    allQuestions = [];
    
    // Get GitHub base URL and topics from config
    const githubBaseUrl = window.QUESTIONS_CONFIG?.githubBaseUrl || 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/questions/';
    const topicsConfig = window.QUESTIONS_CONFIG?.topics || [];
    
    for (const topic of selectedTopics) {
        if (topic.id === 'mixed') {
            // Load all topics for mixed from GitHub
            for (const topicConfig of topicsConfig) {
                const fileUrl = githubBaseUrl + topicConfig.file;
                try {
                    const response = await fetch(fileUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.questions) {
                        allQuestions.push(...data.questions.map(q => ({ ...q, topic: topicConfig.id })));
                    }
                } catch (error) {
                    console.error(`Error loading ${fileUrl}:`, error);
                    alert(`حدث خطأ أثناء تحميل ملف ${topicConfig.name}. تأكد من أن الملف موجود على GitHub.`);
                }
            }
        } else if (topic.file) {
            try {
                const response = await fetch(topic.file);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.questions) {
                    allQuestions.push(...data.questions.map(q => ({ ...q, topic: topic.id })));
                }
            } catch (error) {
                console.error(`Error loading ${topic.file}:`, error);
                alert(`حدث خطأ أثناء تحميل ملف ${topic.name}. تأكد من أن الملف موجود على GitHub.`);
            }
        }
    }

    if (allQuestions.length === 0) {
        alert('لم يتم تحميل أي أسئلة. يرجى التحقق من إعدادات GitHub.');
        return;
    }

    // Shuffle questions
    shuffleArray(allQuestions);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start new game
async function startNewGame(players) {
    if (!window.currentUser) return;

    try {
        const gameData = {
            judgeId: window.currentUser.uid,
            players: players.map(p => ({
                name: p.name,
                score: 0,
                isPlaying: p.isPlaying !== false // Default to true if not set
            })),
            selectedTopics: selectedTopics.map(t => t.id),
            status: 'active',
            currentQuestionIndex: -1, // Start at -1 so first question is 0
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('games').add(gameData);
        currentGameId = docRef.id;
        currentGameData = { 
            ...gameData, 
            id: currentGameId,
            createdAt: new Date()
        };

        // Show game screen first
        window.showScreen('game-screen');
        
        // Show first question
        showNextQuestion();
        
        // Update score display after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (window.updatePlayersScoreDisplay) {
                window.updatePlayersScoreDisplay();
            }
        }, 100);
    } catch (error) {
        console.error('Error starting game:', error);
        alert('حدث خطأ أثناء بدء اللعبة: ' + error.message);
    }
}

// Show next question
function showNextQuestion() {
    if (!currentGameId || allQuestions.length === 0) return;

    let questionIndex = (currentGameData?.currentQuestionIndex ?? -1) + 1;
    if (questionIndex >= allQuestions.length) {
        alert('انتهت جميع الأسئلة!');
        return;
    }

    const question = allQuestions[questionIndex];
    currentGameData.currentQuestionIndex = questionIndex;

    // Update UI
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    
    if (questionText) questionText.textContent = question.question;
    if (answerText) answerText.textContent = question.answer;

    // Update in database
    updateGameData({
        currentQuestion: {
            question: question.question,
            answer: question.answer,
            topic: question.topic
        },
        currentQuestionIndex: questionIndex
    });
}

// Update game data in Firestore
async function updateGameData(updates) {
    if (!currentGameId) return;

    try {
        await db.collection('games').doc(currentGameId).update(updates);
        if (currentGameData) {
            currentGameData = { ...currentGameData, ...updates };
        }
    } catch (error) {
        console.error('Error updating game:', error);
    }
}

// Get current game data from database
async function refreshGameData() {
    if (!currentGameId) return null;

    try {
        const doc = await db.collection('games').doc(currentGameId).get();
        if (doc.exists) {
            currentGameData = { id: doc.id, ...doc.data() };
            return currentGameData;
        }
    } catch (error) {
        console.error('Error refreshing game data:', error);
    }
    return null;
}

// End current game and save to database
async function endCurrentGame() {
    if (!currentGameId || !currentGameData) return;

    try {
        // Get final scores from local data
        const activePlayers = currentGameData.players.filter(p => p.isPlaying !== false);
        const winner = activePlayers.find(p => p.score >= 10);
        
        // Prepare final scores object with all players
        const finalScores = {};
        activePlayers.forEach(p => {
            finalScores[p.name] = p.score;
        });

        // Save final game state to database
        await db.collection('games').doc(currentGameId).update({
            status: 'finished',
            players: currentGameData.players // Save final scores
        });

        // Save to history
        await db.collection('history').add({
            gameId: currentGameId,
            judgeId: window.currentUser.uid,
            winner: winner ? winner.name : 'لا يوجد فائز',
            finalScores: finalScores,
            players: activePlayers.map(p => ({ name: p.name, score: p.score })), // Save players with scores
            finishedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear game data
        currentGameId = null;
        currentGameData = null;
        
        // Refresh history after saving
        if (window.loadHistory) {
            await window.loadHistory();
        }
    } catch (error) {
        console.error('Error ending game:', error);
        alert('حدث خطأ أثناء حفظ اللعبة: ' + error.message);
    }
}

// Load history
async function loadHistory() {
    if (!window.currentUser) return;

    try {
        // Get history for this judge (without orderBy to avoid index requirement)
        const historyRef = db.collection('history')
            .where('judgeId', '==', window.currentUser.uid)
            .limit(10);

        const snapshot = await historyRef.get();
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        historyList.innerHTML = '';

        // Show/hide clear history button
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        if (clearHistoryBtn) {
            clearHistoryBtn.style.display = snapshot.empty ? 'none' : 'block';
        }

        if (snapshot.empty) {
            historyList.innerHTML = '<p style="text-align: center; color: var(--text-light);">لا يوجد تاريخ بعد</p>';
            return;
        }

        // Convert to array and sort by date
        const historyItems = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            historyItems.push({
                ...data,
                id: doc.id
            });
        });

        // Sort by finishedAt descending
        historyItems.sort((a, b) => {
            const dateA = a.finishedAt?.toDate?.() || new Date(0);
            const dateB = b.finishedAt?.toDate?.() || new Date(0);
            return dateB - dateA;
        });

        // Display history items
        historyItems.forEach(data => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = data.finishedAt?.toDate?.();
            const dateStr = date ? date.toLocaleDateString('ar-EG') : 'تاريخ غير معروف';
            
            // Build players list with scores
            let playersListHtml = '';
            if (data.players && Array.isArray(data.players)) {
                playersListHtml = '<div class="history-players" style="margin-top: 0.5rem; font-size: 0.9rem;">';
                data.players.forEach(player => {
                    playersListHtml += `<div style="margin: 0.25rem 0; color: var(--text-light);">${player.name}: ${player.score} نقطة</div>`;
                });
                playersListHtml += '</div>';
            } else if (data.finalScores && typeof data.finalScores === 'object') {
                // Fallback to finalScores if players array doesn't exist
                playersListHtml = '<div class="history-players" style="margin-top: 0.5rem; font-size: 0.9rem;">';
                Object.keys(data.finalScores).forEach(playerName => {
                    playersListHtml += `<div style="margin: 0.25rem 0; color: var(--text-light);">${playerName}: ${data.finalScores[playerName]} نقطة</div>`;
                });
                playersListHtml += '</div>';
            }
            
            historyItem.innerHTML = `
                <div style="flex: 1;">
                    <div class="winner-info">الفائز: ${data.winner}</div>
                    ${playersListHtml}
                </div>
                <div class="date-info">${dateStr}</div>
            `;
            historyList.appendChild(historyItem);
        });
    } catch (error) {
        console.error('Error loading history:', error);
        // Show error message
        const historyList = document.getElementById('history-list');
        if (historyList) {
            // Check if it's a permissions error
            if (error.code === 'permission-denied' || error.message.includes('permissions')) {
                historyList.innerHTML = '<p style="text-align: center; color: var(--text-light);">لا يمكن تحميل التاريخ. يرجى التحقق من إعدادات قاعدة البيانات.</p>';
            } else {
                historyList.innerHTML = '<p style="text-align: center; color: var(--text-light);">لا يوجد تاريخ بعد</p>';
            }
        }
    }
}

// Clear all history
async function clearHistory() {
    if (!window.currentUser) return;

    if (!confirm('هل أنت متأكد من مسح كل التاريخ؟ لا يمكن التراجع عن هذا الإجراء.')) {
        return;
    }

    try {
        // Get all history items for current user
        const historyRef = db.collection('history')
            .where('judgeId', '==', window.currentUser.uid);

        const snapshot = await historyRef.get();
        
        if (snapshot.empty) {
            alert('لا يوجد تاريخ للمسح');
            return;
        }

        // Delete all history items
        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();

        // Refresh history display
        await loadHistory();
        
        alert('تم مسح التاريخ بنجاح');
    } catch (error) {
        console.error('Error clearing history:', error);
        alert('حدث خطأ أثناء مسح التاريخ: ' + error.message);
    }
}

// Clear history button event listener
document.getElementById('clear-history-btn')?.addEventListener('click', () => {
    clearHistory();
});

// Export functions
window.startNewGame = startNewGame;
window.showNextQuestion = showNextQuestion;
window.updateGameData = updateGameData;
window.endCurrentGame = endCurrentGame;
window.currentGameData = () => currentGameData;
window.currentGameId = () => currentGameId;
window.refreshGameData = refreshGameData;
window.loadHistory = loadHistory;
window.clearHistory = clearHistory;

