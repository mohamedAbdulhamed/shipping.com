import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme.ts";
import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
} from "../../config/constants.ts";

const NotFoundPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={`calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`}
      textAlign="center"
      padding={4}
    >
      <Typography variant="h1" color={colors.black} gutterBottom>
        404
      </Typography>
      <Typography variant="h4" color={colors.grey[700]} gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="h5" color={colors.grey[700]} gutterBottom>
        We searched high and low, but we couldn’t find the page you're looking
        for. It may have been moved or deleted, or may never have existed at
        all.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
