// src/components/CommandInput.js
import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaHandRock } from 'react-icons/fa';

const CommandWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DirectionButtons = styled.div`
  display: grid;
  grid-template-areas:
    ". up ."
    "left . right"
    ". down .";
  gap: 10px;
  justify-content: center;
`;

const ActionButton = styled(motion.button)`
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  background: ${props => props.isGet ? '#e74c3c' : '#3498db'};
  color: white;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  min-width: 80px;
  
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }

  svg {
    font-size: 20px;
  }
`;

const GetItemButton = styled(ActionButton)`
  margin: 20px auto;
  padding: 15px 40px;
  background: #2ecc71;
`;

function CommandInput({ onSubmit, disabled, availableDirections, hasItem }) {
  const handleDirection = (direction) => {
    onSubmit(`go ${direction}`);
  };

  const handleGetItem = () => {
    onSubmit(`get ${hasItem}`);
  };

  return (
    <CommandWrapper>
      <DirectionButtons>
        <ActionButton
          style={{ gridArea: 'up' }}
          onClick={() => handleDirection('North')}
          disabled={disabled || !availableDirections.includes('North')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowUp /> North
        </ActionButton>
        <ActionButton
          style={{ gridArea: 'left' }}
          onClick={() => handleDirection('West')}
          disabled={disabled || !availableDirections.includes('West')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft /> West
        </ActionButton>
        <ActionButton
          style={{ gridArea: 'right' }}
          onClick={() => handleDirection('East')}
          disabled={disabled || !availableDirections.includes('East')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          East <FaArrowRight />
        </ActionButton>
        <ActionButton
          style={{ gridArea: 'down' }}
          onClick={() => handleDirection('South')}
          disabled={disabled || !availableDirections.includes('South')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowDown /> South
        </ActionButton>
      </DirectionButtons>

      {hasItem && hasItem !== 'Franco' && (
        <GetItemButton
          isGet
          onClick={handleGetItem}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaHandRock /> Get {hasItem}
        </GetItemButton>
      )}
    </CommandWrapper>
  );
}

export default CommandInput;
