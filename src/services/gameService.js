const API_URL = 'https://l0tebdk8th.execute-api.us-east-1.amazonaws.com'; // e.g., https://xxx.execute-api.us-east-1.amazonaws.com

export const saveGameState = async (userId, gameData) => {
    try {
        console.log('Saving game state for user:', userId, gameData);
        
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: 'saveGame',
                userId,
                gameData: {
                    currentRoom: gameData.currentRoom,
                    inventory: gameData.inventory
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Save game response:', result);
        return result;
    } catch (error) {
        console.error('Error saving game state:', error);
        throw new Error('Failed to save game state: ' + error.message);
    }
};

export const loadGameState = async (userId) => {
    try {
        console.log('Loading game state for user:', userId);
        
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: 'loadGame',
                userId
            })
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log('No saved game found');
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Load game response:', result);
        return result;
    } catch (error) {
        console.error('Error loading game state:', error);
        throw new Error('Failed to load game state: ' + error.message);
    }
};

// Helper function to handle API errors
const handleApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
        console.error('API Error Headers:', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
    }
    throw error;
};

// Optional: Add a function to check if a save exists
export const checkSaveExists = async (userId) => {
    try {
        const result = await loadGameState(userId);
        return !!result;
    } catch (error) {
        console.error('Error checking save state:', error);
        return false;
    }
};

// Optional: Add a function to delete a save
export const deleteSaveGame = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action: 'deleteGame',
                userId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting save game:', error);
        throw new Error('Failed to delete save game: ' + error.message);
    }
};
