// Score Management Module
const db = window.firebaseDb;

// Update players score display
function updatePlayersScoreDisplay() {
    const gameData = window.currentGameData();
    if (!gameData || !gameData.players) return;

    const playersList = document.getElementById('players-score-list');
    if (!playersList) return;

    playersList.innerHTML = '';

    // Filter active players - default isPlaying to true if not set
    const activePlayers = gameData.players.filter(p => p.isPlaying !== false);
    
    if (activePlayers.length === 0) {
        playersList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">لا يوجد لاعبين نشطين</p>';
        return;
    }
    
    // Create a map of active player indices
    const activeIndices = [];
    gameData.players.forEach((p, idx) => {
        if (p.isPlaying !== false) {
            activeIndices.push(idx);
        }
    });

    activePlayers.forEach((player, activeIndex) => {
        const originalIndex = activeIndices[activeIndex];
        const playerItem = document.createElement('div');
        playerItem.className = 'player-score-item';
        
        if (player.score >= 10) {
            playerItem.classList.add('winner');
        }

        playerItem.innerHTML = `
            <div class="player-score-name">${player.name}</div>
            <div class="player-score-value">${player.score}</div>
            <div class="player-score-actions">
                <button class="btn btn-success add-score-btn" data-index="${originalIndex}">+</button>
                <button class="btn btn-danger remove-score-btn" data-index="${originalIndex}">-</button>
            </div>
        `;

        // Add event listeners
        const addBtn = playerItem.querySelector('.add-score-btn');
        const removeBtn = playerItem.querySelector('.remove-score-btn');

        addBtn.addEventListener('click', () => {
            addScore(originalIndex);
        });

        removeBtn.addEventListener('click', () => {
            removeScore(originalIndex);
        });

        playersList.appendChild(playerItem);
    });

    // Check for winner
    checkWinner();
}

// Add score to player (local only for speed)
function addScore(playerIndex) {
    const gameData = window.currentGameData();
    if (!gameData || !gameData.players) return;

    const player = gameData.players[playerIndex];
    if (!player) return;

    // Update score locally only (no database call for speed)
    player.score += 1;
    
    // currentGameData is already updated since we're modifying the same object reference

    // Update UI immediately
    updatePlayersScoreDisplay();
}

// Remove score from player (local only for speed)
function removeScore(playerIndex) {
    const gameData = window.currentGameData();
    if (!gameData || !gameData.players) return;

    const player = gameData.players[playerIndex];
    if (!player) return;

    // Update score locally only (no database call for speed)
    player.score -= 1;
    
    // currentGameData is already updated since we're modifying the same object reference

    // Update UI immediately
    updatePlayersScoreDisplay();
}

// Check for winner
function checkWinner() {
    const gameData = window.currentGameData();
    if (!gameData) return;

    const activePlayers = gameData.players.filter(p => p.isPlaying !== false);
    const winner = activePlayers.find(p => p.score >= 10);

    if (winner) {
        showWinnerPopup(winner.name);
        window.endCurrentGame();
    }
}

// Show winner popup
function showWinnerPopup(winnerName) {
    const popup = document.getElementById('winner-popup');
    const nameEl = document.getElementById('winner-name');
    
    if (popup && nameEl) {
        nameEl.textContent = winnerName;
        popup.classList.add('active');
    }
}

// Close winner popup
document.getElementById('close-winner-btn')?.addEventListener('click', async () => {
    const popup = document.getElementById('winner-popup');
    if (popup) {
        popup.classList.remove('active');
    }
    window.showScreen('main-screen');
    // Refresh history after closing winner popup
    if (window.loadHistory) {
        await window.loadHistory();
    }
});

// No need for periodic updates since scores are local only

// Export
window.updatePlayersScoreDisplay = updatePlayersScoreDisplay;

