// src/gameService.js
const API_URL = 'https://97bx5zktrj.execute-api.us-east-1.amazonaws.com/game';

export const saveGameState = async (userId, currentRoom, inventory) => {
  try {
    console.log('Attempting to save game state:', { userId, currentRoom, inventory });
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveGame',
        userId,
        gameData: {
          currentRoom,
          inventory
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server responded with:', response.status, errorText);
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Save successful:', data);
    return data;
  } catch (error) {
    console.error('Save failed:', error);
    throw error;
  }
};

export const loadGameState = async (userId) => {
  try {
    console.log('Attempting to load game state for user:', userId);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'loadGame',
        userId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server responded with:', response.status, errorText);
      throw new Error(`Server error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Load successful:', data);
    return data;
  } catch (error) {
    console.error('Load failed:', error);
    throw error;
  }
};

