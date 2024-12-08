import React from 'react';
import { Box, Button, Typography, Paper, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme.ts';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const CookieConsent = ({ handleConsent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: colors.primary[200],
          padding: 3,
          textAlign: 'center',
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <img src="../../assets/cookie.png" width="50" alt="Cookie Icon" />
        <Typography sx={{ mt: 2 }} color={colors.grey[900]}>
          We use third-party cookies to personalize content, ads, and analyze site traffic.
        </Typography>
        <Link
          href="/privacy"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            textDecoration: 'none',
            color: colors.grey[800],
          }}
        >
          Learn more <ArrowRightAltIcon />
        </Link>
        <Button
          sx={{
            backgroundColor: colors.grey[900],
            color: colors.grey[100],
            padding: '8px 32px',
            mt: 2,
            '&:hover': {
              backgroundColor: colors.grey[800],
            },
          }}
          onClick={handleConsent}
        >
          Okay
        </Button>
      </Paper>
    </Box>
  );
};

export default CookieConsent;
