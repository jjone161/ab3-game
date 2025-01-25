import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaHandRock, FaSkull, FaTrophy, FaRedo } from 'react-icons/fa';
import { GiMonsterGrasp, GiPartyPopper, GiStarMedal } from 'react-icons/gi';
import Inventory from './Inventory';

// Styled Components
const GameWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const RoomInfo = styled(motion.div)`
  margin-bottom: 20px;
  padding: 25px;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 15px;
  border: 2px solid rgba(52, 152, 219, 0.2);
`;

const RoomTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.8em;
  text-align: center;
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
  background: ${props => props.isCollect ? '#e74c3c' : '#3498db'};
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
  background: ${props => props.isWin ? 'rgba(46, 204, 113, 0.95)' : 'rgba(0, 0, 0, 0.95)'};
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

const GameOverTitle = styled(motion.h2)`
  font-size: 3em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const GameOverText = styled(motion.p)`
  font-size: 1.2em;
  margin-bottom: 30px;
`;

const IconContainer = styled(motion.div)`
  font-size: 5em;
  margin: 20px 0;
  color: #ffffff;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const RestartButton = styled(motion.button)`
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  background: white;
  color: ${props => props.isWin ? '#27ae60' : '#e74c3c'};
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
`;

const Confetti = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  border-radius: 50%;
`;
// Game data
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
    const [showGameOver, setShowGameOver] = useState(false);
    const [isWin, setIsWin] = useState(false);
  
    const handleMove = (direction) => {
      if (gameOver) return;
      
      const nextRoom = rooms[currentRoom][direction];
      if (nextRoom) {
        setCurrentRoom(nextRoom);
        if (nextRoom === 'Garage') {
          setGameOver(true);
          setIsWin(false);
          setTimeout(() => setShowGameOver(true), 1000);
          setMessage({ text: 'Oh no! Franco found you!', type: 'error' });
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
          setIsWin(true);
          setTimeout(() => setShowGameOver(true), 500);
        }
      }
    };
  
    const handleRestart = () => {
      setCurrentRoom('Lobby');
      setInventory([]);
      setMessage(null);
      setGameOver(false);
      setShowGameOver(false);
      setIsWin(false);
    };
  
    const confettiColors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];
  
    return (
      <>
        <GameWrapper>
          <motion.div
            animate={currentRoom === 'Garage' ? {
              x: [-10, 10, -10, 10, -10, 0],
              transition: {
                duration: 0.5,
                repeat: 3
              }
            } : {}}
          >
            <RoomTitle>Location: {currentRoom}</RoomTitle>
            <RoomInfo
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>Available directions: {Object.keys(rooms[currentRoom]).filter(key => !['item', 'description'].includes(key)).join(', ')}</div>
              {rooms[currentRoom].description && (
                <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
                  {rooms[currentRoom].description}
                </div>
              )}
              {rooms[currentRoom].item && rooms[currentRoom].item !== 'Franco' && (
                <div style={{ marginTop: '10px', color: '#27ae60' }}>
                  Item available: {rooms[currentRoom].item}
                </div>
              )}
            </RoomInfo>
          </motion.div>
  
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
  
          <Inventory items={inventory} />
        </GameWrapper>
  
        <AnimatePresence>
          {showGameOver && (
            <GameOverOverlay
              isWin={isWin}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isWin ? (
                <GameOverContent
                  isWin
                  initial={{ scale: 0, y: 100 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: -100 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <GameOverTitle>
                    <FaTrophy /> Victory! <FaTrophy />
                  </GameOverTitle>
                  <GameOverText>
                    Congratulations {playerName}! You've collected all items and won!
                  </GameOverText>
                  <IconContainer>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <GiPartyPopper />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.3,
                      }}
                    >
                      <GiStarMedal />
                    </motion.div>
                  </IconContainer>
                  <RestartButton
                    isWin
                    onClick={handleRestart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaRedo /> Play Again
                  </RestartButton>
                  {Array.from({ length: 50 }).map((_, i) => (
                    <Confetti
                      key={i}
                      color={confettiColors[i % confettiColors.length]}
                      initial={{
                        x: Math.random() * window.innerWidth,
                        y: -20,
                        opacity: 1
                      }}
                      animate={{
                        y: window.innerHeight + 20,
                        opacity: 0,
                        rotate: Math.random() * 360
                      }}
                      transition={{
                        duration: Math.random() * 2 + 1,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </GameOverContent>
              ) : (
                <GameOverContent
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <GameOverTitle>
                    <FaSkull /> Game Over <FaSkull />
                  </GameOverTitle>
                  <GameOverText>
                    Franco caught you! Better luck next time, {playerName}!
                  </GameOverText>
                  <IconContainer>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <GiMonsterGrasp />
                    </motion.div>
                  </IconContainer>
                  <RestartButton
                    onClick={handleRestart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaRedo /> Try Again
                  </RestartButton>
                </GameOverContent>
              )}
            </GameOverOverlay>
          )}
        </AnimatePresence>
      </>
    );
  }
  
  export default GameContainer;
  
