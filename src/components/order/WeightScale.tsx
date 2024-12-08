import React from 'react';
import { Box, Typography } from '@mui/material';
import GaugeMeter from '../layout/GaugeMeter.tsx';

interface WeightScaleProps {
  weight: number; // weight in kilograms
  maxWeight: number;
}

const WeightScale: React.FC<WeightScaleProps> = ({ weight, maxWeight }) => {

  const categoryThreshold = {
    Light: 10,
    Medium: 30,
    Heavy: 50,
  };

  // Determine the weight category
  const getWeightCategory = () => {
    if (weight <= categoryThreshold.Light) return 'Light';
    if (weight <= categoryThreshold.Medium) return 'Medium';
    return 'Heavy';
  };

  const categoryColor = {
    Light: '#4caf50',
    Medium: '#ff9800',
    Heavy: '#f44336',
  };

  const [animatedValue, setAnimatedValue] = React.useState(0);

  React.useEffect(() => {
    let currentValue = 0;
    const increment = Math.ceil(weight / 100);
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= weight) {
        setAnimatedValue(weight);
        clearInterval(interval);
      } else {
        setAnimatedValue(currentValue);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [weight]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Weight Scale
      </Typography>

      {/* Scale Container */}
      <GaugeMeter value={weight} valueMax={maxWeight} fillColor={categoryColor[getWeightCategory()]} />

      {/* Display Weight Value */}
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        <strong>{animatedValue.toFixed(1)} kg</strong>
      </Typography>
    </Box>
  );
};

export default WeightScale;
