import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { tokens } from "../../theme.ts";
import useAuth from "../../hooks/useAuth.ts";
import { ROLES, TRANSLAITIONS } from "../../config/constants.ts";
import Order from "../../entities/Order.ts";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.ts";
import MobileLocationStepperDetails from "./stepper/MobileLocationStepperDetails.tsx";
import DesktopLocationStepperDetails from "./stepper/DesktopLocationStepperDetails.tsx";
import { useTranslation } from "react-i18next";
import { deleteOrder } from "../../api/order/index.ts";
import { handleError, truncateString } from "../../utils/utils.ts";
import "../../styles/OrderListItem.css";

type OrderListItemProps = {
  order: Order;
  triggerDelete: (orderId: Order["orderId"]) => Promise<void>;
};

const OrderListItem = ({ order, triggerDelete }: OrderListItemProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isNonMobile = useMediaQuery("(min-width:900px)");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [deleted, setDeleted] = React.useState(false);

  const STEP_COUNTER = {
    PENDING: 1,
    ACCEPTED: 3,
  } as const;

  const handleDeleteOrder = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    orderId?: Order["orderId"]
  ) => {
    e.preventDefault();
    if (!orderId) return;

    try {
      const response = await deleteOrder(axiosPrivate, orderId);

      console.log(response);

      // if success
      setDeleted(true);
    } catch (error) {
      handleError(
        error,
        "Failed to delete the order.",
        "Order not found",
        "error"
      );
    }
  };

  const getActiveStep = () => {
    if (order.status === "Accepted" || order.status === 1) {
      return STEP_COUNTER.ACCEPTED;
    } else {
      return STEP_COUNTER.PENDING;
    }
  };

  const steps = ["", "Pending", "Completed"];

  return (
    <Link
      key={order.orderId}
      to={`/user/orders/${order.orderId}`}
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        textDecoration: "none",
        transition: "0.3s",
      }}
      className={`magnify ${deleted ? "slide-out" : ""}`}
      onAnimationEnd={() =>
        deleted && order.orderId && triggerDelete(order.orderId)
      }
    >
      <Box
        sx={{
          width: "100%",
          color: colors.black,
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isNonMobile ? "row" : "column",
        }}
      >
        {/* details */}
        <Box
          sx={{
            width: isNonMobile ? "75%" : "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Typography variant="h3">{truncateString(order.description, 50)}</Typography>
          {isNonMobile ? (
            <DesktopLocationStepperDetails
              from={order.from}
              pickupCity={order.pickupCity}
              to={order.to}
              deliveryCity={order.deliveryCity}
              direction={i18n.dir()}
            />
          ) : (
            <MobileLocationStepperDetails
              from={order.from}
              pickupCity={order.pickupCity}
              to={order.to}
              deliveryCity={order.deliveryCity}
              direction={i18n.dir()}
            />
          )}
        </Box>
        {/* actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            gap: isNonMobile ? undefined : "20px",
            my: isNonMobile ? undefined : "20px",
          }}
        >
          <Button
            variant="contained"
            color={auth.user?.role === ROLES.company ? "primary" : "info"}
            onClick={() => navigate(`/user/orders/${order.orderId}`)}
          >
            {auth.user?.role === ROLES.company
              ? isNonMobile
                ? t(TRANSLAITIONS.makeOffer)
                : t(TRANSLAITIONS.offer)
              : t(TRANSLAITIONS.review)}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={(e) => handleDeleteOrder(e, order.orderId)}
          >
            {t(TRANSLAITIONS.delete)}
          </Button>
        </Box>
      </Box>
      {!isNonMobile ? (
        // Mobile
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
            activeStep={getActiveStep()}
            alternativeLabel
            sx={{
              display: { sm: "flex", md: "none" },
              width: "100%",
              direction: "ltr",
              "& .MuiStepLabel-label": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.grey[600]} !important`,
              },
              "& .MuiStepLabel-label.Mui-active": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.black} !important`,
                fontWeight: "bold",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.grey[300]} !important`,
                fontWeight: "bold",
              },
              "& .MuiSvgIcon-root": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.grey[600]} !important`,
                fontWeight: "bold",
              },
              "& .MuiSvgIcon-root.Mui-active": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.black} !important`,
              },
            }}
          >
            {steps.map((label) => (
              <Step
                sx={{
                  ":first-of-type": { pl: 0 },
                  ":last-child": { pr: 0 },
                  "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                }}
                key={label}
              >
                <StepLabel
                  sx={{
                    ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      ) : (
        // Desktop
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexGrow: 1,
            m: 2,
          }}
        >
          <Stepper
            id="desktop-stepper"
            connector={
              getActiveStep() >= STEP_COUNTER.ACCEPTED &&
              auth.user?.role === ROLES.client ? (
                <hr
                  style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: colors.greenAccent[500],
                    border: "0",
                  }}
                />
              ) : undefined
            }
            activeStep={getActiveStep()}
            sx={{
              width: "100%",
              height: 40,
              direction: "ltr",
              "& .MuiStepLabel-label": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.grey[600]} !important`,
              },
              "& .MuiStepLabel-label.Mui-active": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.black} !important`,
                fontWeight: "bold",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.grey[300]} !important`,
                fontWeight: "bold",
              },
              "& .MuiSvgIcon-root": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.grey[600]} !important`,
                fontWeight: "bold",
              },
              "& .MuiSvgIcon-root.Mui-active": {
                color:
                  getActiveStep() >= STEP_COUNTER.ACCEPTED &&
                  auth.user?.role === ROLES.client
                    ? `${colors.greenAccent[500]} !important`
                    : `${colors.black} !important`,
              },
            }}
          >
            {steps.map((label) => (
              <Step
                sx={{
                  ":first-of-type": { pl: 0 },
                  ":last-child": { pr: 0 },
                }}
                key={label}
              >
                <StepLabel sx={{ color: colors.blueAccent[900] }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
    </Link>
  );
};

export default OrderListItem;
