// Player Management Module
const db = window.firebaseDb;
let savedPlayers = [];

// Load players from database (each user has their own players list)
async function loadPlayers() {
    if (!window.currentUser) return;

    try {
        // Load players for the current logged-in user only
        const userRef = db.collection('users').doc(window.currentUser.uid);
        const doc = await userRef.get();
        
        if (doc.exists) {
            savedPlayers = doc.data().players || [];
        } else {
            savedPlayers = [];
        }

        displayPlayers();
    } catch (error) {
        console.error('Error loading players:', error);
        savedPlayers = [];
        displayPlayers();
    }
}

// Display players in UI
function displayPlayers() {
    const playersList = document.getElementById('players-list');
    if (!playersList) return;

    playersList.innerHTML = '';

    savedPlayers.forEach((player, index) => {
        const playerItem = createPlayerItem(player, index);
        playersList.appendChild(playerItem);
    });

    updateStartButton();
}

// Create player item element
function createPlayerItem(player, index) {
    const playerItem = document.createElement('div');
    playerItem.className = 'player-item';
    playerItem.dataset.index = index;

    playerItem.innerHTML = `
        <input type="checkbox" ${player.isPlaying !== false ? 'checked' : ''} 
               data-index="${index}" class="player-checkbox">
        <input type="text" value="${player.name}" 
               data-index="${index}" class="player-name-input">
        <button class="btn btn-danger delete-player-btn" data-index="${index}">حذف</button>
    `;

    // Add event listeners
    const checkbox = playerItem.querySelector('.player-checkbox');
    const nameInput = playerItem.querySelector('.player-name-input');
    const deleteBtn = playerItem.querySelector('.delete-player-btn');

    checkbox.addEventListener('change', (e) => {
        savedPlayers[index].isPlaying = e.target.checked;
        updateStartButton();
    });

    nameInput.addEventListener('change', (e) => {
        savedPlayers[index].name = e.target.value;
        savePlayers();
    });

    deleteBtn.addEventListener('click', () => {
        deletePlayer(index);
    });

    return playerItem;
}

// Function to add player
function addPlayer() {
    const nameInput = document.getElementById('new-player-name');
    if (!nameInput) return;

    const name = nameInput.value.trim();
    if (!name) {
        alert('يرجى إدخال اسم اللاعب');
        return;
    }

    savedPlayers.push({
        name: name,
        isPlaying: true
    });

    nameInput.value = '';
    displayPlayers();
    savePlayers();
}

// Add new player button
document.getElementById('add-player-btn')?.addEventListener('click', addPlayer);

// Add player on Enter key press
document.getElementById('new-player-name')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        addPlayer();
    }
});

// Delete player
function deletePlayer(index) {
    if (confirm('هل أنت متأكد من حذف هذا اللاعب؟')) {
        savedPlayers.splice(index, 1);
        displayPlayers();
        savePlayers();
    }
}

// Save players to database (each user has their own players list)
async function savePlayers() {
    if (!window.currentUser) return;

    try {
        // Save players under the current user's ID - each user has separate players
        const userRef = db.collection('users').doc(window.currentUser.uid);
        await userRef.set({
            players: savedPlayers
        }, { merge: true });
    } catch (error) {
        console.error('Error saving players:', error);
        alert('حدث خطأ أثناء حفظ اللاعبين');
    }
}

// Update start game button state
function updateStartButton() {
    const startBtn = document.getElementById('start-game-btn');
    if (!startBtn) return;

    const hasPlayingPlayers = savedPlayers.some(p => p.isPlaying !== false);
    startBtn.disabled = !hasPlayingPlayers || savedPlayers.length === 0;
}

// Start game button
document.getElementById('start-game-btn')?.addEventListener('click', () => {
    const playingPlayers = savedPlayers.filter(p => p.isPlaying !== false);
    if (playingPlayers.length === 0) {
        alert('يرجى اختيار لاعب واحد على الأقل');
        return;
    }

    window.startNewGame(playingPlayers);
});

// Export
window.loadPlayers = loadPlayers;

