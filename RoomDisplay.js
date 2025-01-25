// src/components/RoomDisplay.js
// ... (previous imports and styled components remain the same)

const ShakeWrapper = styled(motion.div)`
  width: 100%;
`;

function RoomDisplay({ room, roomData, gameOver }) {
  const availableDirections = roomData ? 
    Object.keys(roomData).filter(key => key !== 'item' && key !== 'description') : 
    [];

  return (
    <RoomWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ShakeWrapper
        animate={room === 'Garage' ? {
          x: [-10, 10, -10, 10, -10, 0],
          transition: {
            duration: 0.5,
            repeat: 3
          }
        } : {}}
      >
        <RoomTitle>Current Location: {room}</RoomTitle>
        <RoomInfo>
          <div>Available directions: {availableDirections.join(', ')}</div>
          {roomData?.description && (
            <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
              {roomData.description}
            </div>
          )}
          {roomData?.item && roomData.item !== 'Franco' && (
            <div style={{ marginTop: '10px', color: '#27ae60' }}>
              Item available: {roomData.item}
            </div>
          )}
        </RoomInfo>
      </ShakeWrapper>
    </RoomWrapper>
  );
}

export default RoomDisplay;
