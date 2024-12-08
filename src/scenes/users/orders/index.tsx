import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  useTheme,
  Container,
  Pagination,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { tokens } from "../../../theme.ts";

import useAuth from "../../../hooks/useAuth.ts";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.ts";
import useOrdersFilters from "../../../hooks/useOrdersFilters.ts";
import useLoading from "../../../hooks/useLoading.ts";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import useSignalR from "../../../hooks/useSignalR.ts";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  ROLES,
  TRANSLAITIONS,
} from "../../../config/constants.ts";
import { handleError } from "../../../utils/utils.ts";
import Order from "../../../entities/Order.ts";
import { fetchOrders } from "../../../api/order/index.ts";
import Alert from "@mui/material/Alert";

import OrderListItem from "../../../components/order/OrderListItem.tsx";
import OrdersFiltersMenu from "../../../components/order/OrdersFiltersMenu.tsx";
import { BASE_URL } from "../../../api/axios.ts";

const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { mainLoading, setMainLoading } = useLoading();
  const {
    pickupCity,
    deliveryCity,
    isFragile,
    weight,
    sortBy,
    sortDescending,
    clearFilters,
  } = useOrdersFilters();

  const fetchAbortControllerRef = useRef<AbortController | undefined>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // page number
  const [perPage, setPerPage] = useState<10 | 25 | 50 | 100>(10); // rows per page
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false); // instead of defining the function outside the useEffect

  // SignalR message handler
  const handleNewOrder = () => {
    setShowAlert(true);
  };

  // Initialize SignalR connection
  const signalrConnection = useSignalR(`${BASE_URL}/hub`, handleNewOrder, auth.token);

  const refreshOrders = () => {
    clearFilters();
    setShowAlert(false);
    setFetchTrigger((prev) => !prev);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const triggerDelete = async (orderId: Order["orderId"]) => {
    const newOrders = orders.filter((order) => order.orderId !== orderId);
    setOrders(newOrders);
  };

  // fetch orders
  useEffect(() => {
    const fetchOrdersData = async () => {
      setMainLoading(true);

      const controller = new AbortController();
      const { signal } = controller;

      fetchAbortControllerRef.current = controller;

      console.log("filters", {
        pickupCity,
        deliveryCity,
        isFragile,
        weight,
        sortBy,
        sortDescending,
      });

      try {
        const response = await fetchOrders(
          axiosPrivate,
          signal,
          currentPage,
          perPage,
          {
            pickupCity,
            deliveryCity,
            isFragile,
            weight,
            sortBy,
            sortDescending,
          }
        );
        console.log(response.data);
        setOrders(response.data || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalItems || 0);
      } catch (error) {
        handleError(error, "Couldn't fetch orders.");
      } finally {
        setMainLoading(false);
      }
    };

    fetchOrdersData();

    return () => {
      fetchAbortControllerRef.current?.abort();
    };
  }, [
    currentPage,
    perPage,
    axiosPrivate,
    setMainLoading,
    pickupCity,
    deliveryCity,
    isFragile,
    weight,
    sortBy,
    sortDescending,
    fetchTrigger,
  ]);

  useEffect(() => {
    return () => {
      signalrConnection.current?.stop();
    }
  }, [signalrConnection]);
  

  return (
    <Container
      sx={{
        padding: "2rem",
        minHeight: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {showAlert && (
        <Alert
          icon={<AutorenewIcon fontSize="inherit" />}
          severity="info"
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={refreshOrders}>
                Refresh
              </Button>
              <IconButton onClick={() => setShowAlert(false)}>
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          New Orders were placed.
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #cbc3c363",
          marginBottom: "5vh",
        }}
      >
        <Typography sx={{ color: colors.black }} variant="h2">
          {auth.user?.role === ROLES.client ? "Your Orders" : "Clients' Orders"}
        </Typography>
        {auth.user?.role === ROLES.client && (
          <Button
            onClick={() => navigate("/user/orders/new")}
            type="submit"
            variant="text"
            color="secondary"
            sx={{
              // margin: "0 0 20px 20px",
              fontWeight: "bold",
            }}
          >
            {t(TRANSLAITIONS.newOrder)}
            <AddIcon />
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {orders?.length > 0 ? (
          <React.Fragment>
            {/* Filteration System */}
            <OrdersFiltersMenu
              currentPage={currentPage}
              perPage={perPage}
              setPerPage={setPerPage}
              totalItems={totalItems}
              handlePageChange={handlePageChange}
            />
            {/* Orders */}
            {orders.map((order) => (
              <OrderListItem
                key={order.orderId}
                order={order}
                triggerDelete={triggerDelete}
              />
            ))}
          </React.Fragment>
        ) : (
          <Typography sx={{ color: colors.black }} variant="h3">
            {auth.user?.role === ROLES.company ? (
              <span>No orders yet, wait till a client add a new order.</span>
            ) : (
              <span>
                You have no pending orders,{" "}
                <Link to={"/user/orders/new"}>start adding them</Link>
              </span>
            )}
          </Typography>
        )}
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
          direction: "ltr",
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => handlePageChange(event, page)}
          color="primary"
          showFirstButton
          showLastButton
          disabled={mainLoading}
          sx={{
            "& .MuiPaginationItem-root": {
              color: colors.black,
            },
            "& .MuiPaginationItem-page:hover": {
              backgroundColor: colors.primary[400],
            },
            "& .Mui-selected": {
              backgroundColor: colors.primary[500],
              color: colors.white,
            },
            "& .MuiPaginationItem-ellipsis": {
              color: colors.black,
            },
            direction: "ltr",
            mt: 4,
            mb: 4,
          }}
        />
      </Box>
    </Container>
  );
};

export default Orders;
