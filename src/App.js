import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import GameContainer from './components/GameContainer';
import { FaGamepad, FaRedo } from 'react-icons/fa';

const AppWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    pointer-events: none;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const GameHeader = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2em;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  border-radius: 50px;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const ResetButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1em;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const BackgroundParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
`;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create background particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  const handleStartGame = (name) => {
    setPlayerName(name);
    setGameStarted(true);
  };

  const handleReset = () => {
    setGameStarted(false);
    setPlayerName('');
  };

  return (
    <AppWrapper>
      <BackgroundParticles>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </BackgroundParticles>

      <AnimatePresence mode="wait">
        {gameStarted && (
          <>
            <GameHeader
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FaGamepad /> Player: {playerName}
            </GameHeader>

            <ResetButton
              onClick={handleReset}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRedo /> New Game
            </ResetButton>
          </>
        )}

        <ContentWrapper
          key={gameStarted ? 'game' : 'welcome'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {!gameStarted ? (
            <WelcomeScreen onStartGame={handleStartGame} />
          ) : (
            <GameContainer playerName={playerName} />
          )}
        </ContentWrapper>
      </AnimatePresence>
    </AppWrapper>
  );
}

export default App;
