import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaGamepad } from 'react-icons/fa';

const WelcomeWrapper = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Input = styled.input`
  padding: 15px 25px;
  margin: 20px;
  font-size: 18px;
  border-radius: 50px;
  border: 2px solid #3498db;
  width: 300px;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #2980b9;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
  }
`;

const Button = styled.button`
  padding: 15px 40px;
  font-size: 18px;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin: 20px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Instructions = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: rgba(236, 240, 241, 0.8);
  border-radius: 15px;
`;

function WelcomeScreen({ onStartGame }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStartGame(name);
    }
  };

  return (
    <WelcomeWrapper>
      <Title>
        <FaGamepad /> Defeating Franco the Food Monster
      </Title>
      <Instructions>
        <h3>Mission Briefing:</h3>
        <p>Collect 6 food items before Franco finds the new food shipment!</p>
        <p>Use the direction buttons to move around and collect items.</p>
      </Instructions>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter your name, brave adventurer..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit">
          Begin Adventure
        </Button>
      </form>
    </WelcomeWrapper>
  );
}

export default WelcomeScreen;
