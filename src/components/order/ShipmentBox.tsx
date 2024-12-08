import React from 'react';
import { Box, Typography, Paper, Chip, Tooltip } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import WeightScale from './WeightScale.tsx';

interface ShipmentBoxProps {
  length: number;
  width: number;
  height: number;
  weight: number;
  maxWeight: number;
  isFragile: boolean;
}

const ShipmentBox: React.FC<ShipmentBoxProps> = ({
  length,
  width,
  height,
  weight,
  maxWeight,
  isFragile,
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        maxWidth: 400,
        margin: '20px auto',
        position: 'relative',
        borderRadius: 2,
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Box Dimensions */}
      <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
        <LocalShippingIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          Shipment Box
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", gap: 2, marginTop: 1 }}>
          <Tooltip title="Length" arrow>
            <Chip label={`${length} cm`} variant="outlined"  />
          </Tooltip>
          <strong>X</strong>
          <Tooltip title="Width" arrow>
            <Chip label={`${width} cm`} variant="outlined" />
          </Tooltip>
          <strong>X</strong>
          <Tooltip title="Height" arrow>
            <Chip label={`${height} cm`} variant="outlined" />
          </Tooltip>
        </Box>
      </Box>

      {/* Order Details */}
      <Box sx={{ mt: 3 }}>
        <WeightScale weight={weight} maxWeight={maxWeight} />
        {isFragile && (
          <Chip
            icon={<BrokenImageIcon />}
            label="Fragile Item"
            color="warning"
            sx={{ mt: 2 }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default ShipmentBox;
