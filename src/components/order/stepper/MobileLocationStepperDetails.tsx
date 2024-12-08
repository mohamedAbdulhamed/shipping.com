import React from "react";
import {
  Box,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  Typography,
} from "@mui/material";
import { tokens } from "../../../theme.ts";
import { DeliveryDining } from "@mui/icons-material";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Order from "../../../entities/Order.ts";

type MobileLocationStepperDetailsProps = {
  from: Order['from'];
  pickupCity: Order['pickupCity'];
  to: Order['to'];
  deliveryCity: Order['deliveryCity'];
  direction: "ltr" | "rtl";
};

const MobileLocationStepperDetails = ({
  from,
  pickupCity,
  to,
  deliveryCity,
  direction,
}: MobileLocationStepperDetailsProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" flexDirection="column">
      {/* From box */}
      <Box
        sx={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          margin: "10px",
          maxWidth: "70%",
          border: "1px solid #00000021",
          borderRadius: "20px",
          borderBottomLeftRadius: direction === "ltr" ? "0" : undefined,
          borderBottomRightRadius: direction === "rtl" ? "0" : undefined,
        }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{
            color: colors.primary[200],
            textShadow: "none",
            "&:hover": {
              color: colors.black,
              textShadow: `0 0 10px ${colors.primary[400]}`,
            },
          }}
        >
          {from}
        </Typography>
        {" - "}
        <Typography
          variant="body1"
          component="span"
          sx={{
            color: colors.primary[300],
          }}
        >
          {pickupCity}
          {" City"}
        </Typography>
      </Box>
      {/* Stepper */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: "100%",
          maxWidth: { sm: "100%", md: 600 },
          maxHeight: "720px",
          gap: { xs: 5, md: "none" },
          my: 1,
        }}
      >
        <Stepper
          id="mobile-stepper"
          activeStep={3}
          connector={
            <Box
              id="stepper-connector"
              sx={{
                display: "flex",
                width: "100%",
                "& hr": {
                  width: "100%",
                  height: "1px",
                  margin: "auto",
                  ":first-of-type": { mr: "10px" },
                  ":last-child": { ml: "10px" },
                },
              }}
            >
              <hr />
              <DeliveryDining
                sx={{
                  transform:
                    direction === "rtl" ? "rotateY(180deg)" : undefined,
                }}
              />
              <hr />
            </Box>
          }
          sx={{
            display: { sm: "flex", md: "none" },
            width: "100%",
            direction: "ltr",
            "& .MuiStepLabel-label": {
              color: `${colors.grey[600]} !important`,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: `${colors.black} !important`,
              fontWeight: "bold",
            },
            "& .MuiSvgIcon-root": {
              color: `${colors.grey[600]} !important`,
              fontWeight: "bold",
            },
            "& .MuiSvgIcon-root.Mui-active": {
              color: `${colors.black} !important`,
            },
            "& .MuiStepLabel-root.MuiStepLabel-horizontal": {
              display: "none",
            },
          }}
        >
          <Step
            sx={{
              alignSelf: "start",
              p: 0,
              "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
            }}
          >
            <StepIcon icon={<FmdGoodIcon />}></StepIcon>
            <StepLabel></StepLabel>
          </Step>
          <Step
            sx={{
              alignSelf: "start",
              p: 0,
              // "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
            }}
          >
            <StepIcon icon={<FmdGoodIcon />}></StepIcon>
            <StepLabel
              sx={{ ".MuiStepLabel-labelContainer": { maxWidth: "70px" } }}
            ></StepLabel>
          </Step>
        </Stepper>
      </Box>
      {/* To box */}
      <Box
        sx={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          maxWidth: "70%",
          border: "1px solid #00000021",
          borderRadius: "20px",
          borderTopRightRadius: direction === "ltr" ? "0" : undefined,
          borderTopLeftRadius: direction === "rtl" ? "0" : undefined,
          alignSelf: "flex-end",
        }}
      >
        <Typography
          variant="body1"
          component="span"
          sx={{
            color: colors.primary[200],
            textShadow: "none",
            "&:hover": {
              color: colors.black,
              textShadow: `0 0 10px ${colors.primary[400]}`,
            },
          }}
        >
          {to}
        </Typography>
        {" - "}
        <Typography
          variant="body1"
          component="span"
          sx={{
            color: colors.primary[300],
          }}
        >
          {deliveryCity}
          {" City"}
        </Typography>
      </Box>
    </Box>
  );
};

export default MobileLocationStepperDetails;
