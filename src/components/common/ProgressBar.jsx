// components/common/ProgressBar.jsx
import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ value, max }) => {
  const progress = Math.min((value / max) * 100, 100);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" color="textSecondary">{`$${value} / $${max}`}</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default ProgressBar;
