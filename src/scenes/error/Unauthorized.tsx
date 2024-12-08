import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { tokens } from "../../theme.ts";

const UnauthorizedPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      padding={4}
    >
      <Typography variant="h1" color={colors.black} gutterBottom>
        401
      </Typography>
      <Typography variant="h4" color={colors.grey[700]} gutterBottom>
        Unauthorized Access {from && ` To  ${from}`}
      </Typography>
      <Typography variant="body1" color={colors.grey[700]} gutterBottom>
        You do not have permission to view this page. Please login with proper credentials.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/login"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Go to Login
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
