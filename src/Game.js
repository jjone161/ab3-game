import React, { useState, useEffect } from 'react';
import { saveGameState, loadGameState } from './gameService';

function Game() {
    const [currentRoom, setCurrentRoom] = useState('Lobby');
    const [inventory, setInventory] = useState([]);
    const [name, setName] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [userId] = useState('user-' + Math.random()); // Add this for user identification

    // Your existing rooms object
    const rooms = {
        'Lobby': {'East': 'Director office', 'South': 'Daycare'},
        'Director office': {'South': 'Lounge', 'item': 'Chocolate'},
        'Daycare': {'South': 'Deep Freezer', 'item': 'Cracker'},
        'Deep Freezer': {'North': 'Daycare', 'South': 'Greenhouse', 'East': 'Storage Room', 'item': 'Steak'},
        'Greenhouse': {'North': 'Deep Freezer', 'East': 'Garage', 'item': 'Tomato'},
        'Garage': {'North': 'Storage Room', 'item': 'Franco'},
        'Lounge': {'North': 'Director office', 'South': 'Storage Room', 'item': 'Water'},
        'Storage Room': {'North': 'Lounge', 'South': 'Garage','West': 'Deep Freezer', 'item': 'Potato'}
    };

    // Add loadGame function
    const loadGame = async () => {
        try {
            const gameData = await loadGameState(userId);
            if (gameData.currentRoom && gameData.inventory) {
                setCurrentRoom(gameData.currentRoom);
                setInventory(gameData.inventory);
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
    };

    // Modify your handleCommand function
    const handleCommand = async (command) => {
        if (command[0] === 'go') {
            if (command[1] in rooms[currentRoom]) {
                const newRoom = rooms[currentRoom][command[1]];
                setCurrentRoom(newRoom);
                
                // Save game state after room change
                try {
                    await saveGameState(userId, newRoom, inventory);
                } catch (error) {
                    console.error('Failed to save game state:', error);
                }

                if (newRoom === 'Garage') {
                    alert('Franco is in there! Sorry, you lost!');
                    // Handle game over
                }
            } else {
                console.log(`You can't go that direction from ${currentRoom}`);
            }
        } else if (command[0] === 'get') {
            if (command[1] === rooms[currentRoom]['item']) {
                const newInventory = [...inventory, rooms[currentRoom]['item']];
                setInventory(newInventory);
                
                // Save game state after getting item
                try {
                    await saveGameState(userId, currentRoom, newInventory);
                } catch (error) {
                    console.error('Failed to save game state:', error);
                }

                if (newInventory.length > 5) {
                    alert(`You found all 6 items. Congratulations ${name}! You defeated Franco and won the game! :)`);
                    // Handle game win
                }
            }
        }
    };

    // Add useEffect to load game state when component mounts
    useEffect(() => {
        if (gameStarted) {
            loadGame();
        }
    }, [gameStarted]);

    // Rest of your existing code...

    return (
        <div>
            {/* Your existing JSX */}
            {/* Add Save/Load buttons if needed */}
            {gameStarted && (
                <div>
                    <button onClick={loadGame}>Load Game</button>
                    <button onClick={() => saveGameState(userId, currentRoom, inventory)}>Save Game</button>
                </div>
            )}
        </div>
    );
}

export default Game;
