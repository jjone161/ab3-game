const API_URL = 'https://l0tebdk8th.execute-api.us-east-1.amazonaws.com'; // e.g., https://xxx.execute-api.us-east-1.amazonaws.com

export const saveGameState = async (userId, gameData) => {
    try {
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'saveGame',
                userId,
                gameData
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Save game error:', error);
        throw error;
    }
};

export const loadGameState = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'loadGame',
                userId
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Load game error:', error);
        throw error;
    }
};
