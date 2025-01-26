import { config } from './config';

export const testDatabaseConnection = async (userId) => {
    try {
        const response = await fetch(`${config.apiUrl}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'saveGame',
                userId: userId,
                gameData: {
                    currentRoom: 'Lobby',
                    inventory: ['Test Item']
                }
            })
        });
        
        console.log('API Response:', await response.json());
        return true;
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
    }
};
