import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaHandRock, FaBug } from 'react-icons/fa';
import Inventory from './Inventory';
import { saveGameState, loadGameState, testConnection } from '../services/gameService';
import { Auth } from 'aws-amplify';

const GameWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RoomInfo = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Controls = styled.div`
  display: grid;
  grid-template-areas:
    ". up ."
    "left . right"
    ". down .";
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
`;

const Button = styled(motion.button)`
  padding: 15px 25px;
  border: none;
  border-radius: 12px;
  background: ${props => props.isCollect ? '#e74c3c' : props.isTest ? '#9b59b6' : '#3498db'};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const Message = styled(motion.div)`
  padding: 15px;
  margin: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: ${props => props.type === 'success' ? '#2ecc71' : props.type === 'error' ? '#e74c3c' : '#3498db'};
  color: white;
`;

const GameOverOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const GameOverContent = styled(motion.div)`
  background: ${props => props.isWin ? '#27ae60' : '#e74c3c'};
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  color: white;
  max-width: 500px;
  width: 90%;
  box-shadow: ${props => props.isWin 
    ? '0 0 30px rgba(46, 204, 113, 0.5)' 
    : '0 0 30px rgba(231, 76, 60, 0.5)'};
`;
const rooms = {
  'Lobby': {
    'East': 'Director office', 
    'South': 'Daycare',
    description: 'The main entrance of the building. It seems quiet... for now.'
  },
  'Director office': {
    'South': 'Lounge', 
    'West': 'Lobby',
    'item': 'Chocolate',
    description: 'A fancy office with a large desk. There\'s some chocolate here!'
  },
  'Daycare': {
    'North': 'Lobby', 
    'South': 'Deep Freezer',
    'item': 'Cracker',
    description: 'A colorful room with tiny chairs. You spot some crackers.'
  },
  'Deep Freezer': {
    'North': 'Daycare', 
    'South': 'Greenhouse', 
    'East': 'Storage Room',
    'item': 'Steak',
    description: 'Brr! It\'s cold in here. There\'s a frozen steak.'
  },
  'Greenhouse': {
    'North': 'Deep Freezer', 
    'East': 'Garage',
    'item': 'Tomato',
    description: 'A warm, humid room full of plants. A ripe tomato catches your eye.'
  },
  'Garage': {
    'North': 'Storage Room', 
    'West': 'Greenhouse',
    'item': 'Franco',
    description: 'Oh no! This is Franco\'s lair!'
  },
  'Lounge': {
    'North': 'Director office', 
    'South': 'Storage Room',
    'item': 'Water',
    description: 'A relaxation area with comfy chairs. There\'s a bottle of water here.'
  },
  'Storage Room': {
    'North': 'Lounge', 
    'South': 'Garage', 
    'West': 'Deep Freezer',
    'item': 'Potato',
    description: 'Shelves lined with various items. You notice a potato.'
  }
};

function GameContainer({ playerName }) {
  const [currentRoom, setCurrentRoom] = useState('Lobby');
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedGame = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const result = await loadGameState(user.username);
        if (result && result.currentRoom && result.inventory) {
          setCurrentRoom(result.currentRoom);
          setInventory(result.inventory);
          setMessage({ text: 'Game loaded successfully', type: 'success' });
        }
      } catch (error) {
        console.log('No saved game found, starting new game');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedGame();
  }, []);

  useEffect(() => {
    const saveGame = async () => {
      if (!gameOver && !isLoading) {
        try {
          const user = await Auth.currentAuthenticatedUser();
          await saveGameState(user.username, {
            currentRoom,
            inventory
          });
        } catch (error) {
          console.error('Error saving game:', error);
        }
      }
    };

    if (inventory.length > 0) {
      saveGame();
    }
  }, [currentRoom, inventory, gameOver, isLoading]);

  const handleTestConnection = async () => {
    try {
      const result = await testConnection();
      setMessage({ 
        text: 'API connection successful!', 
        type: 'success' 
      });
      console.log('Connection test result:', result);
    } catch (error) {
      setMessage({ 
        text: 'API connection failed', 
        type: 'error' 
      });
      console.error('Connection test error:', error);
    }
  };

  const handleMove = (direction) => {
    if (gameOver) return;
    
    const nextRoom = rooms[currentRoom][direction];
    if (nextRoom) {
      setCurrentRoom(nextRoom);
      if (nextRoom === 'Garage') {
        setGameOver(true);
        setMessage({ text: 'Oh no! Franco found you! Game Over!', type: 'error' });
      } else {
        setMessage({ text: rooms[nextRoom].description, type: 'info' });
      }
    }
  };

  const handleCollectItem = () => {
    const item = rooms[currentRoom].item;
    if (item && item !== 'Franco' && !inventory.includes(item)) {
      const newInventory = [...inventory, item];
      setInventory(newInventory);
      setMessage({ text: `Collected ${item}!`, type: 'success' });
      
      if (newInventory.length >= 6) {
        setGameOver(true);
        setMessage({ text: `Congratulations ${playerName}! You've won!`, type: 'success' });
      }
    }
  };

  if (isLoading) {
    return <Message type="info">Loading game...</Message>;
  }
  return (
    <>
      <GameWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MainArea>
          <Button
            isTest
            onClick={handleTestConnection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginBottom: '20px' }}
          >
            <FaBug /> Test API Connection
          </Button>

          <RoomInfo
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Location: {currentRoom}</h2>
            <p>{rooms[currentRoom].description}</p>
            {rooms[currentRoom].item && rooms[currentRoom].item !== 'Franco' && (
              <p style={{ color: '#27ae60' }}>Item available: {rooms[currentRoom].item}</p>
            )}
          </RoomInfo>

          {message && (
            <Message
              type={message.type}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.text}
            </Message>
          )}

          <Controls>
            <Button
              style={{ gridArea: 'up' }}
              onClick={() => handleMove('North')}
              disabled={!rooms[currentRoom]['North'] || gameOver}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowUp /> North
            </Button>
            <Button
              style={{ gridArea: 'left' }}
              onClick={() => handleMove('West')}
              disabled={!rooms[currentRoom]['West'] || gameOver}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft /> West
            </Button>
            <Button
              style={{ gridArea: 'right' }}
              onClick={() => handleMove('East')}
              disabled={!rooms[currentRoom]['East'] || gameOver}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              East <FaArrowRight />
            </Button>
            <Button
              style={{ gridArea: 'down' }}
              onClick={() => handleMove('South')}
              disabled={!rooms[currentRoom]['South'] || gameOver}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowDown /> South
            </Button>
          </Controls>

          {rooms[currentRoom].item && rooms[currentRoom].item !== 'Franco' && !inventory.includes(rooms[currentRoom].item) && (
            <Button
              isCollect
              onClick={handleCollectItem}
              disabled={gameOver}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: '100%', marginTop: '20px' }}
            >
              <FaHandRock /> Collect {rooms[currentRoom].item}
            </Button>
          )}
        </MainArea>
        <Inventory items={inventory} />
      </GameWrapper>

      <AnimatePresence>
        {gameOver && (
          <GameOverOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameOverContent
              isWin={currentRoom !== 'Garage'}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <h2>{currentRoom === 'Garage' ? '😱 Game Over!' : '🎉 Victory!'}</h2>
              <p>
                {currentRoom === 'Garage'
                  ? "Franco caught you! Better luck next time!"
                  : `Congratulations ${playerName}! You've collected all items and won!`}
              </p>
            </GameOverContent>
          </GameOverOverlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default GameContainer;

