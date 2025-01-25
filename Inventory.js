// src/components/Inventory.js
import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { GiBackpack } from 'react-icons/gi';
import { 
  FaHamburger, 
  FaAppleAlt, 
  FaCookie, 
  FaWater, 
  FaCarrot
} from 'react-icons/fa';

const InventoryWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(52, 152, 219, 0.2);
`;

const TitleText = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  margin: 0;
  font-size: 1.2em;
`;

const Progress = styled.div`
  background: rgba(52, 152, 219, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  color: #2c3e50;
  font-weight: bold;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ItemSlot = styled(motion.div)`
  background: ${props => props.filled ? 'rgba(46, 204, 113, 0.1)' : 'rgba(189, 195, 199, 0.2)'};
  border: 2px solid ${props => props.filled ? 'rgba(46, 204, 113, 0.3)' : 'rgba(189, 195, 199, 0.3)'};
  border-radius: 10px;
  padding: 15px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
`;

const ItemIcon = styled.div`
  font-size: 2em;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
`;

const ItemName = styled.span`
  font-size: 0.9em;
  color: #34495e;
  text-align: center;
  font-weight: ${props => props.filled ? 'bold' : 'normal'};
`;

const EmptySlot = styled.div`
  color: #95a5a6;
  font-style: italic;
  font-size: 0.8em;
`;

const NewItemBadge = styled(motion.div)`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7em;
  font-weight: bold;
`;

// Map items to their respective icons
const itemIcons = {
  'Chocolate': FaCookie,
  'Cracker': FaCookie,
  'Steak': FaHamburger,
  'Tomato': FaAppleAlt,
  'Water': FaWater,
  'Potato': FaCarrot,
};

function Inventory({ items = [], lastCollected = null }) {
  // Create array of 6 slots
  const slots = Array(6).fill(null).map((_, index) => items[index] || null);

  return (
    <InventoryWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>
        <TitleText>
          <GiBackpack /> Inventory
        </TitleText>
        <Progress>
          {items.length}/6 Items
        </Progress>
      </Title>

      <ItemGrid>
        {slots.map((item, index) => {
          const Icon = item ? itemIcons[item] || FaAppleAlt : null;
          const isNew = item === lastCollected;

          return (
            <ItemSlot
              key={index}
              filled={!!item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={item ? { scale: 1.05 } : {}}
            >
              {item ? (
                <>
                  <ItemIcon as={Icon} />
                  <ItemName filled>{item}</ItemName>
                  {isNew && (
                    <NewItemBadge
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      NEW!
                    </NewItemBadge>
                  )}
                </>
              ) : (
                <EmptySlot>Empty Slot</EmptySlot>
              )}
            </ItemSlot>
          );
        })}
      </ItemGrid>

      {items.length === 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#27ae60',
            fontWeight: 'bold'
          }}
        >
          Collection Complete! 🎉
        </motion.div>
      )}

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#7f8c8d',
            fontStyle: 'italic'
          }}
        >
          Start collecting items to fill your inventory!
        </motion.div>
      )}
    </InventoryWrapper>
  );
}

export default Inventory;
