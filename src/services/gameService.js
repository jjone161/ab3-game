import { config } from '../config/config';

const API_URL = config.apiUrl;

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

export const checkSaveExists = async (userId) => {
    try {
        const result = await loadGameState(userId);
        return !!result;
    } catch (error) {
        console.error('Error checking save state:', error);
        return false;
    }
};

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

// Helper function for retrying failed requests
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // exponential backoff
        }
    }
    
    throw lastError;
};

// Helper function to validate API response
const validateResponse = (data) => {
    if (!data) {
        throw new Error('Empty response received');
    }
    
    if (data.error) {
        throw new Error(data.error);
    }
    
    return data;
};

// Helper function to handle offline state
const isOnline = () => {
    return navigator.onLine;
};

// Queue operations when offline
const operationsQueue = [];

window.addEventListener('online', async () => {
    console.log('Back online, processing queued operations...');
    while (operationsQueue.length > 0) {
        const operation = operationsQueue.shift();
        try {
            await operation();
        } catch (error) {
            console.error('Failed to process queued operation:', error);
        }
    }
});

export const queueOperationIfOffline = (operation) => {
    if (!isOnline()) {
        operationsQueue.push(operation);
        return true;
    }
    return false;
};

// Export utility functions
export const utils = {
    retryOperation,
    validateResponse,
    isOnline,
    queueOperationIfOffline
};
