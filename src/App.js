import React, { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import GameContainer from './components/GameContainer';
import { FaGamepad } from 'react-icons/fa';

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
  z-index: 10;
`;

const SignOutButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #c0392b;
  }
`;

const ContentWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
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
function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [particles] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10
    }))
  );

  const handleStartGame = (name) => {
    setPlayerName(name);
    setGameStarted(true);
  };

  return (
    <Authenticator>
      {({ signOut, user }) => {
        // Get user's email and use it as the display name
        const displayName = user.attributes?.email?.split('@')[0] || 'Player';

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
              <GameHeader
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FaGamepad /> {displayName}'s Game
              </GameHeader>

              <SignOutButton
                onClick={signOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Out
              </SignOutButton>

              <ContentWrapper
                key={gameStarted ? 'game' : 'welcome'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {!gameStarted ? (
                  <WelcomeScreen 
                    onStartGame={handleStartGame} 
                    playerName={displayName}
                  />
                ) : (
                  <GameContainer 
                    playerName={playerName || displayName}
                  />
                )}
              </ContentWrapper>
            </AnimatePresence>
e>
          </AppWrapper>
        );
      }}
    </Authenticator>
  );
}

export default App;
