import React, { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme.ts";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ReactNode } from "react";

type StatBoxProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  link: string;
}

const StatBox = ({ title, subtitle, icon, link }: StatBoxProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.black }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component={Link}
            to={link}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ArrowForwardIosIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
