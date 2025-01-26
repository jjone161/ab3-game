const API_URL = 'https://97bx5zktrj.execute-api.us-east-1.amazonaws.com';

export const testConnection = async () => {
    try {
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'test',
                userId: 'test-user'
            })
        });
        const data = await response.json();
        console.log('API Test Response:', data);
        return data;
    } catch (error) {
        console.error('API Test Error:', error);
        throw error;
    }
};

export const saveGameState = async (userId, gameData) => {
    try {
        console.log('Saving game state:', { userId, gameData });
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'saveGame',
                userId,
                gameData
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Save game response:', data);
        return data;
    } catch (error) {
        console.error('Save game error:', error);
        throw error;
    }
};

export const loadGameState = async (userId) => {
    try {
        console.log('Loading game state for user:', userId);
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
        const data = await response.json();
        console.log('Load game response:', data);
        return data;
    } catch (error) {
        console.error('Load game error:', error);
        throw error;
    }
};
