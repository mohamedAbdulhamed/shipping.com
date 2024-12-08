import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Container,
  useTheme,
  Paper,
  Typography,
  useMediaQuery,
  Tooltip,
  ButtonBase,
  Modal,
  Fade,
  Backdrop,
  IconButton,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { ArrowBackRounded, ThumbDown, ThumbUp } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate.ts";
import useLoading from "../../../hooks/useLoading.ts";
import { useTranslation } from "react-i18next";
import useAuth from "../../../hooks/useAuth.ts";

import { tokens } from "../../../theme.ts";
import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
  ROLES,
  egyptianCities,
  MAX_WEIGHT,
} from "../../../config/constants.ts";
import Order from "../../../entities/Order.ts";
import Offer from "../../../entities/Offer.ts";
import CreateOfferRequest from "../../../dtos/offers/CreateOfferRequest.ts";
import {
  formatDateToDateOnly,
  gridColumnStyles,
  handleError,
  truncateString,
} from "../../../utils/utils.ts";
import { fetchOrder, updateOrder } from "../../../api/order/index.ts";
import {
  acceptOffer,
  addOffer,
  declineOffer,
} from "../../../api/offer/index.ts";

import { toast } from "react-toastify";

import ShipmentBox from "../../../components/order/ShipmentBox.tsx";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";

import "../../../styles/viewOrder.css";

const ViewOrder = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { setMainLoading } = useLoading();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/user/orders";
  const { t } = useTranslation();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [editMode, setEditMode] = useState(false);
  const [madeOffer, setMadeOffer] = useState<{
    price: Offer["price"];
    comment: Offer["comment"];
  } | null>(null); // made offer by the company

  const [dealClosed, setDealClosed] = useState(false);

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const handleOpenAddOfferModal = () => setOfferModalOpen(true);
  const handleCloseAddOfferModal = () => setOfferModalOpen(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // submitting new offer

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const handleOpenAcceptOfferDialog = (offerId: Offer["offerId"]) => {
    setOfferToAccept(offerId);
    setAcceptDialogOpen(true);
  };
  const handleCloseAcceptOfferDialog = () => setAcceptDialogOpen(false);

  const [offerToAccept, setOfferToAccept] = useState<Offer["offerId"] | null>(
    null
  );

  const [order, setOrder] = useState<Order>({
    orderId: 0,
    description: "",
    from: "",
    fromLatitude: null,
    fromLongitude: null,
    pickupCity: egyptianCities[0],
    to: "",
    toLatitude: null,
    toLongitude: null,
    deliveryCity: egyptianCities[0],

    createdAt: new Date(),
    status: "Pending",
    offers: [],
    clientId: "0",

    isFragile: false,
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    quantity: 1,
  });

  const [initialValues, setInitialValues] = useState<Order>({
    orderId: 0,
    description: "",
    from: "",
    fromLatitude: null,
    fromLongitude: null,
    pickupCity: egyptianCities[0],
    to: "",
    toLatitude: null,
    toLongitude: null,
    deliveryCity: egyptianCities[0],

    createdAt: new Date(),
    status: "Pending",
    offers: [],
    clientId: "0",

    isFragile: false,
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    quantity: 1,
  });

  const [maxWeight, setMaxWeight] = useState<
    (typeof MAX_WEIGHT)[keyof typeof MAX_WEIGHT]
  >(MAX_WEIGHT.general);

  const columns: GridColDef<Offer>[] = [
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      headerAlign: "center",
      align: "center",
      type: "number",
      valueGetter: (price: number) => `${price} EGP`,
      cellClassName: "price-column--cell",
    },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "comment-column--cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: isNonMobile ? "center" : "left",
      flex: 1,
      renderCell: (params) =>
        dealClosed ? (
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              color: colors.grey[300],
              cursor: "not-allowed",
            }}
          >
            Deal Closed
          </span>
        ) : params.row.status === "Rejected" ? (
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              color: colors.redAccent[300],
              cursor: "not-allowed",
            }}
          >
            Offer Declined
          </span>
        ) : (
          <React.Fragment>
            <Tooltip title="Accept" placement="top" arrow>
              <Button
                variant="contained"
                color="success"
                sx={{
                  borderRadius: "4px",
                  mx: isNonMobile ? 1 : 0.5,
                  padding: isNonMobile ? undefined : 0.5,
                  minWidth: "unset",
                }}
                onClick={() => handleOpenAcceptOfferDialog(params.row.offerId)}
              >
                <ThumbUp />
              </Button>
            </Tooltip>
            <Tooltip title="Decline" placement="top" arrow>
              <Button
                variant="contained"
                color="error"
                sx={{
                  borderRadius: "4px",
                  mx: isNonMobile ? 1 : 0.5,
                  padding: isNonMobile ? undefined : 0.5,
                  minWidth: "unset",
                }}
                onClick={() => handleDeclineOffer(params.row.offerId)}
              >
                <ThumbDown />
              </Button>
            </Tooltip>
          </React.Fragment>
        ),
    },
  ];

  const makeOfferModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    color: colors.white,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchOrderData = async () => {
      if (!id) return;

      setMainLoading(true);
      const orderId = Number.parseInt(id);

      try {
        const response = await fetchOrder(axiosPrivate, orderId, controller);
        if (isMounted && response.data) {
          setOrder(response.data);
          setInitialValues(response.data);

          console.log(response.data);

          // set max weight based on order details

          // maybe find a better way (use backend)
          if (auth.user?.role === ROLES.company) {
            response.data.offers.forEach((offer) => {
              if (offer.shippingCompanyId === auth.user?.id) {
                setMadeOffer({ price: offer.price, comment: offer.comment });
              }
            });
          }
        }
      } catch (error) {
        handleError(error, "Failed to fetch order details");
      } finally {
        setMainLoading(false);
      }
    };

    fetchOrderData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, axiosPrivate, auth.user?.id, auth.user?.role, setMainLoading]);

  const isClient = () => auth?.user?.role === ROLES.client;

  // NOT IMPLEMENTED IN BACKEND
  const handleUpdate = async () => {
    if (!isClient()) return;

    // TODO: DELETE WHEN BACKEND SUPPORTS UPDATING ORDER
    toast.error(
      "sorry our server does not support updating functionallity right now."
    );
    return;

    console.log(order);
    setMainLoading(true);

    try {
      const response = await updateOrder(axiosPrivate, order);
      console.log(response);
      // if (response?.data?.Success && response?.data?.StatusCode === 200) {
      setEditMode(false);

      setInitialValues(order);
      // } else {
      //   setOrder(initialValues);
      //   toast.error(response?.data?.ErrorMessage || "Unknown error happened");
      // }
    } catch (err) {
      handleError(err, "Unable to update order, try again later.");
    } finally {
      setMainLoading(false);
    }
  };

  // Cancel updating
  const handleCancel = () => {
    setOrder(initialValues);
    setEditMode(false);
  };

  const handleAcceptOffer = async () => {
    if (!isClient() || !offerToAccept) return;

    try {
      const response = await acceptOffer(axiosPrivate, offerToAccept);

      if (response?.data?.Success && response?.data?.StatusCode === 200) {
        toast.success("Offer accepted, you will be contacted soon.");
        setDealClosed(true);
      } else {
        toast.error("Couldn't accept this offer, please try again later.");
      }
    } catch (error) {
      handleError(error, "Unable to accept offer, try again later.");
    } finally {
      setAcceptDialogOpen(false);
      setOfferToAccept(null); // Reset the offer ID
    }
  };

  const handleDeclineOffer = async (offerId: Offer["offerId"]) => {
    if (!isClient()) return;

    try {
      const response = await declineOffer(axiosPrivate, offerId);

      if (response?.data?.Success && response?.data?.StatusCode === 200) {
        toast.info("Offer declined.");

        // update offers
        setOrder((prevOrder) => ({
          ...prevOrder,
          offers: prevOrder.offers.map((offer) =>
            offer.offerId === offerId
              ? { ...offer, status: "Rejected" }  // Change the status of the declined offer
              : offer  // Keep the other offers unchanged
          ),
        }));
      } else {
        toast.error("Couldn't decline this offer, please try again later.");
      }
    } catch (error) {
      handleError(error, "Unable to decline offer, try again later.");
    } finally {
      setAcceptDialogOpen(false);
      setOfferToAccept(null); // Reset the offer ID
    }
  };

  const handleMakeOffer = async (values: CreateOfferRequest) => {
    setIsSubmitting(true);

    const payload: CreateOfferRequest = {
      ...values,
      deliveryDate:
        values.deliveryDate instanceof Date
          ? formatDateToDateOnly(values.deliveryDate)
          : values.deliveryDate,
    };

    try {
      const response = await addOffer(axiosPrivate, payload);

      if (response?.data?.Success && response?.data?.StatusCode === 200) {
        toast.success("Offer added, now wait for the client response.");
        handleCloseAddOfferModal();

        setMadeOffer({ price: values.price, comment: values.comment });
      } else {
        toast.error("Couldn't add your order, please try again later.");
      }
    } catch (error) {
      handleError(error, "Couldn't Make that offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTextColor = (orderStatus: Order["status"]) => {
    switch (orderStatus) {
      case "Accepted":
        return colors.greenAccent[500];
      default:
        return colors.primary[300];
    }
  };

  const getStatusIcon = (orderStatus: Order["status"]) => {
    switch (orderStatus) {
      case "Accepted":
        return <CheckCircleOutlineIcon />;
      default:
        return <PendingActionsIcon />;
    }
  };

  return (
    <Container
      sx={{
        minHeight: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isNonMobile ? undefined : 0,
      }}
    >
      {/* Make offer modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={offerModalOpen}
        onClose={handleCloseAddOfferModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={offerModalOpen}>
          <Box sx={makeOfferModalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Make your best offer and wait for the client's response
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Formik
                initialValues={{
                  price: 10,
                  comment: "",
                  deliveryDate: new Date(),
                  orderId: order.orderId,
                }}
                onSubmit={handleMakeOffer}
                validationSchema={yup.object().shape({
                  price: yup
                    .number()
                    .required("Price is required")
                    .min(10, "Minimum offer is 10 EGP")
                    .max(1000, "Max offer is 1000 EGP"),
                  comment: yup.string().max(100, "Max comment length is 100"),
                })}
              >
                {({
                  values,
                  errors,
                  touched,
                  isValid,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Offer Price"
                      name="price"
                      type="number"
                      value={values.price}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!touched.price && !!errors.price}
                      helperText={touched.price && errors.price}
                      required
                      sx={{ my: 2 }}
                    />
                    {/* Delivery Date Field */}
                    <DatePicker
                      label="Expected Delivery Date (ETA)"
                      value={values.deliveryDate}
                      onChange={(value) =>
                        value && setFieldValue("deliveryDate", value)
                      }
                      name="deliveryDate"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          error:
                            !!touched.deliveryDate && !!errors.deliveryDate,
                          helperText:
                            touched.deliveryDate && errors.deliveryDate
                              ? "Delivery date is required"
                              : "",
                          required: true,
                          sx: { my: 2 },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Add a comment"
                      name="comment"
                      value={values.comment}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!touched.comment && !!errors.comment}
                      helperText={touched.comment && errors.comment}
                      sx={{ my: 2 }}
                    />

                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Button
                        variant="contained"
                        onClick={handleCloseAddOfferModal}
                        color="error"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={!isValid || isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="loader"></div>
                        ) : (
                          "Submit Offer"
                        )}
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </LocalizationProvider>
          </Box>
        </Fade>
      </Modal>
      {/* Accept offer dialog */}
      <Dialog
        open={acceptDialogOpen}
        onClose={handleCloseAcceptOfferDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to accept this offer?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            By accepting this offer, the deal will be finalized, and the
            selected company will proceed with fulfilling your order. This
            action cannot be undone. Are you sure you want to accept this offer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseAcceptOfferDialog}
            sx={{ color: colors.white }}
          >
            Cancel
          </Button>
          <Button onClick={handleAcceptOffer} color="success" autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      <Paper
        sx={{
          my: 3,
          p: isNonMobile ? 3 : 0.5,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          color: colors.black,
          background: colors.white,
        }}
      >
        <ButtonBase
          onClick={() => navigate(from)}
          sx={{
            my: 1,
            padding: "10px",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ArrowBackRounded />
        </ButtonBase>
        <Box
          sx={{
            my: 1,
            p: 1,
          }}
        >
          {/* order update */}
          {editMode && isClient() ? (
            <Formik
              onSubmit={handleUpdate}
              initialValues={order}
              enableReinitialize
            >
              {({
                values,
                errors,
                touched,
                dirty,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 4",
                        // background: colors.white,
                      },
                    }}
                  >
                    {/* TODO: check if update order is required */}
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label={t(TRANSLAITIONS.description)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      name="description"
                      error={!!touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                      sx={gridColumnStyles(colors)}
                      required
                    />
                  </Box>

                  <Box display="flex" justifyContent="end" mt="20px">
                    {dirty && (
                      <Button
                        disabled={true} // !dirty
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mx: 1 }}
                      >
                        {t(TRANSLAITIONS.update)}
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={handleCancel}
                      sx={{ mx: 1 }}
                    >
                      {t(TRANSLAITIONS.cancel)}
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          ) : (
            // order details
            <React.Fragment>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ color: colors.grey[500], m: 2 }}
              >
                {truncateString(order.description, 150)}
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.grey[500] }}
              >
                <strong>{`${t(TRANSLAITIONS.from)}: `}</strong>
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
                  {order.from}
                </Typography>
                {" - "}
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    color: colors.primary[300],
                  }}
                >
                  {order.pickupCity}
                  {" City"}
                </Typography>
                {order.fromLatitude && order.fromLongitude && (
                  <IconButton
                    color="info"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps?q=${order.fromLatitude},${order.fromLongitude}`,
                        "_blank"
                      );
                    }}
                  >
                    <MapIcon />
                  </IconButton>
                )}
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.grey[500] }}
              >
                <strong>{`${t(TRANSLAITIONS.to)}: `}</strong>
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
                  {order.to}
                </Typography>
                {" - "}
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    color: colors.primary[300],
                  }}
                >
                  {order.deliveryCity}
                  {" City"}
                </Typography>
                {order.toLatitude && order.toLongitude && (
                  <IconButton
                    color="info"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps?q=${order.toLatitude},${order.toLongitude}`,
                        "_blank"
                      );
                    }}
                  >
                    <MapIcon />
                  </IconButton>
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <strong>Status: </strong>
                <Typography
                  variant="subtitle1"
                  component="span"
                  color={getTextColor(order.status)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {order.status} {getStatusIcon(order.status)}
                </Typography>
              </Typography>
              {order.deliveryPersonNumber && (
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <strong>Delivery Person Number: </strong>
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {order.deliveryPersonNumber}
                    <Tooltip title="Number of the person you will contact, when delivery is done.">
                      <InfoIcon />
                    </Tooltip>
                  </Typography>
                </Typography>
              )}

              <ShipmentBox {...order} maxWeight={maxWeight} />

              {/* Client => Edit, Company => madeoffer ? Veiw offer : Add offer */}
              {isClient() ? (
                <Button
                  variant="contained"
                  onClick={() => setEditMode(true)}
                  sx={{ mt: 2, backgroundColor: colors.blueAccent[500] }}
                >
                  {t(TRANSLAITIONS.edit)}
                </Button>
              ) : madeOffer ? (
                // Add delete offer, check backend first
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#40a8cc",
                    padding: "20px",
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }} // 40a8cc
                >
                  Offer Made: {madeOffer.price} EGP | "
                  {truncateString(madeOffer.comment, 100) || "No comment"}"
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleOpenAddOfferModal}
                  sx={{ mt: 2, backgroundColor: colors.blueAccent[500] }}
                >
                  Add an offer
                </Button>
              )}
            </React.Fragment>
          )}
        </Box>
        {/* if client: list order offers */}
        {isClient() && (
          <React.Fragment>
            <hr style={{ margin: "20px" }} />

            {order.offers.length > 0 ? (
              <Box
                sx={{
                  height: 400,
                  width: "100%",
                  "& .MuiDataGrid-root": {
                    border: "none",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    color: colors.black,
                    backgroundColor: colors.secondry,
                    backdropFilter: "blur(19px) saturate(180%)",
                    borderBottom: "none",
                  },
                  "& .MuiDataGrid-cell": {
                    color: colors.black,
                    borderTop: "none",
                    borderBottom: "1px solid #f1f1f1",
                    backgroundColor: "#fff",
                  },
                  "& .MuiDataGrid-cell.cell-grey": {
                    backgroundColor: "#f9fbfe",
                  },
                  "& .price-column--cell": {
                    color: colors.greenAccent[300],
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.white,
                  },
                  "& .MuiDataGrid-footerContainer *": {
                    color: colors.black,
                  },

                  "& .MuiCheckbox-root": {
                    color: colors.greenAccent[200],
                  },
                  "& .MuiCheckbox-root.Mui-disabled": {
                    color: "#ffffff4d",
                  },
                  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: colors.black,
                  },

                  "& .MuiDataGrid-scrollbar::-webkit-scrollbar": {
                    width: "8px", // Scrollbar width
                    height: "8px", // Scrollbar height for horizontal scrolling
                  },
                  "& .MuiDataGrid-scrollbar::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.blueAccent[500], // Thumb color
                    borderRadius: "4px", // Rounded corners
                  },
                  "& .MuiDataGrid-scrollbar::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: colors.greenAccent[300], // Thumb color on hover
                  },
                  "& .MuiDataGrid-scrollbar::-webkit-scrollbar-track": {
                    backgroundColor: colors.primary[600], // Track background
                    borderRadius: "4px", // Rounded corners
                  },
                }}
              >
                <DataGrid
                  rows={order.offers}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  getRowId={(row: Offer) => row.offerId}
                  slots={{ toolbar: GridToolbar }}
                  getCellClassName={(params) =>
                    Number(params.id) % 2 === 0 ? "cell-grey" : ""
                  }
                  autoHeight
                  disableColumnMenu={!isNonMobile}
                  disableRowSelectionOnClick
                />
              </Box>
            ) : (
              <span>No offers yet</span>
            )}
          </React.Fragment>
        )}
      </Paper>
    </Container>
  );
};

export default ViewOrder;
