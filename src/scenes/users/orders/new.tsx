import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Container,
  useTheme,
  Autocomplete,
  useMediaQuery,
  Divider,
  Typography,
  CardMedia,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { Formik, FormikErrors } from "formik";
import * as yup from "yup";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate.ts";
import useLoading from "../../../hooks/useLoading.ts";
import { useTranslation } from "react-i18next";

import { tokens } from "../../../theme.ts";
import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
  egyptianCities,
  // MAX_WEIGHT,
} from "../../../config/constants.ts";
import Order from "../../../entities/Order.ts";
import { toast } from "react-toastify";
import Header from "../../../components/layout/Header.tsx";
import { gridColumnStyles, handleError } from "../../../utils/utils.ts";
import { addOrder } from "../../../api/order/index.ts";
import LeafletMapDialog from "../../../components/map/LeafletMapDialog.tsx";
import CreateOrderRequest from "../../../dtos/orders/createOrderRequest.ts";

import { CheckRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { Map } from "@mui/icons-material";
import OrderPlacedAnimation from "../../../components/layout/OrderPlacedAnimation.tsx";

type boxOptionsProps = {
  title: string;
  length: Order["length"];
  width: Order["width"];
  height: Order["height"];
  image: string;
};

const boxOptions: boxOptionsProps[] = [
  {
    title: "A4 Envelope",
    length: 1,
    width: 24,
    height: 32,
    image: "1.png",
  },
  {
    title: "One or two books",
    length: 4,
    width: 14,
    height: 23,
    image: "2.png",
  },
  {
    title: "Shoe box",
    length: 15,
    width: 20,
    height: 35,
    image: "3.png",
  },
  {
    title: "Moving box",
    length: 35,
    width: 35,
    height: 75,
    image: "4.png",
  },
];

const NewOrder = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const { setMainLoading } = useLoading();

  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [mapField, setMapField] = useState<"from" | "to" | null>(null);

  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const [buttonFlicker, setButtonFlicker] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const [orderPlaced, setOrderPlaced] = useState(false);

  // const [maxWeight, setMaxWeight] = useState<
  //   (typeof MAX_WEIGHT)[keyof typeof MAX_WEIGHT]
  // >(MAX_WEIGHT.general);

  const [initialValues] = useState<CreateOrderRequest>({
    description: "",
    from: "",
    fromLatitude: null,
    fromLongitude: null,
    pickupCity: egyptianCities[0],
    to: "",
    toLatitude: null,
    toLongitude: null,
    deliveryCity: egyptianCities[0],

    isFragile: false,
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    quantity: 1,
  });

  const handleFormSubmit = async (values: CreateOrderRequest) => {
    console.log(values);

    setMainLoading(true);

    try {
      const response = await addOrder(axiosPrivate, values);

      if (response?.data?.Success && response?.data?.StatusCode === 200) {
        // toast.success("Order added, now wait for offers to come.");
        // navigate("/user/orders");
        setMainLoading(false); // make sure it is not loading
        // start order placed animation
        setOrderPlaced(true);
      } else {
        toast.error("Couldn't add your order, please try again later.");
      }
    } catch (err) {
      console.log(err);
      handleError("Couldn't add your order, please try again later.");
    } finally {
      setMainLoading(false);
    }
  };

  const handleSelectLocation = (
    location: {
      lat: number;
      lng: number;
      name: string;
    },
    setFieldValue: {
      (
        field: string,
        value: any,
        shouldValidate?: boolean
      ): Promise<void | FormikErrors<Order>>;
      (arg0: string, arg1: string): void;
    }
  ) => {
    if (mapField) {
      setFieldValue(mapField, location.name);

      if (mapField === "from") {
        setFieldValue("fromLatitude", location.lat);
        setFieldValue("fromLongitude", location.lng);
      } else if (mapField === "to") {
        setFieldValue("toLatitude", location.lat);
        setFieldValue("toLongitude", location.lng);
      } else {
        setFieldValue("fromLatitude", null);
        setFieldValue("fromLongitude", null);
        setFieldValue("toLatitude", null);
        setFieldValue("toLongitude", null);
      }
    }
    setOpenMapDialog(false);
  };

  const handleBoxChange = (
    index: number,
    box: boxOptionsProps,
    setFieldValue: {
      (
        field: string,
        value: any,
        shouldValidate?: boolean
      ): Promise<void | FormikErrors<CreateOrderRequest>>;
      (arg0: string, arg1: number): void;
    }
  ) => {
    setSelectedBox(index);
    setFieldValue("length", box.length);
    setFieldValue("width", box.width);
    setFieldValue("height", box.height);
  };

  const handleCheckValid = (
    errors: FormikErrors<CreateOrderRequest>
  ): string | null => {
    // Check if there are any errors in the form
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      // Return the first error message found
      return errors[errorKeys[0]] as string;
    }
    return null;
  };

  // Constrains
  const minDescriptionLength = 5;
  const maxDescriptionLength = 500;

  const checkoutSchema = yup.object().shape({
    description: yup
      .string()
      .min(
        minDescriptionLength,
        t(TRANSLAITIONS.minEntityError, {
          entity: t(TRANSLAITIONS.description),
          min: minDescriptionLength,
        })
      )
      .max(
        maxDescriptionLength,
        t(TRANSLAITIONS.maxEntityError, {
          entity: t(TRANSLAITIONS.description),
          max: maxDescriptionLength,
        })
      )
      .required(
        t(TRANSLAITIONS.requiredEntityError, {
          entity: t(TRANSLAITIONS.description),
        })
      ),
    from: yup
      .string()
      .required(
        t(TRANSLAITIONS.requiredEntityError, { entity: t(TRANSLAITIONS.from) })
      ),
    to: yup
      .string()
      .required(
        t(TRANSLAITIONS.requiredEntityError, { entity: t(TRANSLAITIONS.to) })
      ),
    pickupCity: yup
      .string()
      .oneOf(
        egyptianCities,
        t(TRANSLAITIONS.invalidEntityError, {
          entity: t(TRANSLAITIONS.pickupCity),
        })
      )
      .required(
        t(TRANSLAITIONS.requiredEntityError, {
          entity: t(TRANSLAITIONS.pickupCity),
        })
      ),
    deliveryCity: yup
      .string()
      .oneOf(
        egyptianCities,
        t(TRANSLAITIONS.invalidEntityError, {
          entity: t(TRANSLAITIONS.deliveryCity),
        })
      )
      .required(
        t(TRANSLAITIONS.requiredEntityError, {
          entity: t(TRANSLAITIONS.deliveryCity),
        })
      ),

    // add validation for details
  });

  return (
    <React.Fragment>
      {orderPlaced && (
        <OrderPlacedAnimation
          height={`calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`}
          goTo="/user/orders"
        />
      )}

      {!orderPlaced && (
        <Container
          sx={{
            minHeight: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            my: "10vh",
          }}
        >
          <Header
            title={t(TRANSLAITIONS.newOrder)}
            subtitle={t(TRANSLAITIONS.newOrderSuptitle)}
          />

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                {/* Fields */}
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                      background: colors.white,
                    },
                  }}
                >
                  {/* 1. ENTER ORIGIN AND DESTINATION: from, pickup city, to, delevery city */}
                  {/* Divider with the header */}
                  <Divider
                    sx={{
                      gridColumn: "span 4",
                      position: "relative",
                      "::before, ::after": {
                        borderTop: `thin solid ${colors.grey[300]}`,
                        opacity: "0.3",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{
                        textTransform: "uppercase",
                        color: colors.black,
                      }}
                    >
                      ORIGIN AND DESTINATION
                    </Typography>
                  </Divider>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label={t(TRANSLAITIONS.from)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.from}
                    name="from"
                    error={!!touched.from && !!errors.from}
                    helperText={touched.from && errors.from}
                    sx={gridColumnStyles(colors, 3)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ height: "100%" }}>
                          <Button
                            onClick={() => {
                              setMapField("from");
                              setOpenMapDialog(true);
                            }}
                            aria-label="choose from map"
                            sx={{
                              width: "100%",
                              background: colors.secondry,
                            }}
                          >
                            Choose From Map
                            <Map />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Autocomplete
                    fullWidth
                    options={egyptianCities}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t(TRANSLAITIONS.pickupCity)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.pickupCity}
                        name="pickupCity"
                        error={!!touched.pickupCity && !!errors.pickupCity}
                        helperText={touched.pickupCity && errors.pickupCity}
                        sx={gridColumnStyles(colors)}
                        required
                      />
                    )}
                    onChange={(event, value) =>
                      setFieldValue("pickupCity", value)
                    }
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label={t(TRANSLAITIONS.to)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.to}
                    name="to"
                    error={!!touched.to && !!errors.to}
                    helperText={touched.to && errors.to}
                    sx={gridColumnStyles(colors, 3)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ height: "100%" }}>
                          <Button
                            onClick={() => {
                              setMapField("to");
                              setOpenMapDialog(true);
                            }}
                            aria-label="choose from map"
                            sx={{
                              width: "100%",
                              background: colors.secondry,
                            }}
                          >
                            Choose From Map
                            <Map />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Autocomplete
                    fullWidth
                    options={egyptianCities}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t(TRANSLAITIONS.deliveryCity)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.deliveryCity}
                        name="deliveryCity"
                        error={!!touched.deliveryCity && !!errors.deliveryCity}
                        helperText={touched.deliveryCity && errors.deliveryCity}
                        sx={gridColumnStyles(colors)}
                        required
                      />
                    )}
                    onChange={(event, value) =>
                      setFieldValue("deliveryCity", value)
                    }
                  />

                  {/* 2.DESCRIBE YOUR SHIPMENT: Description, height, width, depth, weight */}
                  <Divider
                    sx={{
                      gridColumn: "span 4",
                      position: "relative",
                      "::before, ::after": {
                        borderTop: `thin solid ${colors.grey[300]}`,
                        opacity: "0.3",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{
                        textTransform: "uppercase",
                        color: colors.black,
                      }}
                    >
                      DESCRIBE YOUR SHIPMENT
                    </Typography>
                  </Divider>
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
                    sx={gridColumnStyles(colors, 3)}
                    required
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    label="Quantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity}
                    name="quantity"
                    error={!!touched.quantity && !!errors.quantity}
                    helperText={touched.quantity && errors.quantity}
                    sx={gridColumnStyles(colors, 1)}
                    required
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    label="weight (kg)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.weight}
                    name="weight"
                    error={!!touched.weight && !!errors.weight}
                    helperText={touched.weight && errors.weight}
                    sx={gridColumnStyles(colors, 1)}
                    required
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      label="length (cm)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.length}
                      name="length"
                      error={!!touched.length && !!errors.length}
                      helperText={touched.length && errors.length}
                      sx={gridColumnStyles(colors, 1)}
                      required
                    />
                    <span style={{ fontWeight: "bold" }}>X</span>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      label="width (cm)"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.width}
                      name="width"
                      error={!!touched.width && !!errors.width}
                      helperText={touched.width && errors.width}
                      sx={gridColumnStyles(colors, 1)}
                      required
                    />
                    <span style={{ fontWeight: "bold" }}>X</span>
                  </Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    label="height (cm)"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.height}
                    name="height"
                    error={!!touched.height && !!errors.height}
                    helperText={touched.height && errors.height}
                    sx={gridColumnStyles(colors, 1)}
                    required
                  />

                  {/* box options */}
                  <Box
                    sx={{
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      gridColumn: "span 4",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    {boxOptions.map((box, index) => (
                      <Card
                        key={index}
                        component="div"
                        aria-selected={selectedBox === index}
                        onClick={(e) =>
                          handleBoxChange(index, box, setFieldValue)
                        }
                        sx={{
                          position: "relative",
                          backgroundColor: colors.white,
                          boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          height: "20vh",
                          border:
                            selectedBox === index
                              ? `1px solid ${colors.secondry}`
                              : "0",
                          transition: "opacity 0.3s ease-out",
                          "&:hover": {
                            boxShadow: "rgb(178, 178, 178) 0px 2px 7px 1px",
                            outline: "0",
                          },
                        }}
                      >
                        {/* selected box checked */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: 0,
                            height: 0,
                            borderRight: "15px solid transparent",
                            borderBottom: "15px solid transparent",
                            borderTop: `15px solid ${colors.secondry}`,
                            borderLeft: `15px solid ${colors.secondry}`,
                            borderRadius: "4px",
                            transition: "opacity 0.3s ease-out",
                            opacity: selectedBox === index ? "1" : "0",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              top: "-15px",
                              left: "-14px",
                            }}
                          >
                            <CheckRounded />
                          </span>
                        </Box>
                        <CardMedia
                          component="img"
                          image={`/assets/boxes/${box.image}`}
                          sx={{
                            width: "50%",
                            padding: "1rem",
                          }}
                        />
                        <CardContent
                          sx={{
                            color: colors.black,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <Typography>{box.title}</Typography>
                          <Typography>
                            {box.length} x {box.width} x {box.height} cm
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  {/* total weight of package */}
                  <Box
                    gridColumn="span 4"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="h3" component="h3">
                      Total Shipment Weight: {values.weight * values.quantity}{" "}
                      kg
                    </Typography>

                    <FormControlLabel
                      label="Shipment contains fragile items?"
                      control={
                        <Checkbox
                          checked={values.isFragile}
                          onChange={handleChange}
                          name="isFragile"
                          color="info"
                          sx={{
                            color: colors.greenAccent[500],
                          }}
                        />
                      }
                      sx={{
                        color: colors.black,
                        "& .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.css-havevq-MuiSvgIcon-root":
                          {
                            color: colors.greenAccent[500],
                          },
                        "& .MuiFormControlLabel-label": {
                          textWrap: "nowrap",
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Buttons */}
                <Box display="flex" justifyContent="end" mt="20px">
                  <Tooltip
                    open={tooltipOpen}
                    title={tooltipMessage || ""}
                    arrow
                    onClose={() => setTooltipOpen(false)}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        e.preventDefault();

                        // Check for validation errors
                        const validationError = handleCheckValid(errors);
                        if (validationError) {
                          // Show the tooltip with the first error message
                          setTooltipMessage(validationError);
                          setTooltipOpen(true);

                          toast.error(validationError);

                          // Trigger button flicker effect
                          setButtonFlicker(true);
                          setTimeout(() => setButtonFlicker(false), 300);
                        } else {
                          // No validation errors, proceed with form submission
                          handleSubmit();
                        }
                      }}
                      sx={{
                        backgroundColor: buttonFlicker ? "red" : undefined,
                        animation: buttonFlicker
                          ? "flicker 0.1s ease 3"
                          : "none",
                        "&:hover": {
                          backgroundColor: buttonFlicker ? "red" : undefined,
                        },
                      }}
                    >
                      {t(TRANSLAITIONS.placeOrder)}
                    </Button>
                  </Tooltip>
                </Box>

                <LeafletMapDialog
                  open={openMapDialog}
                  onClose={() => setOpenMapDialog(false)}
                  onSelectLocation={(location) =>
                    handleSelectLocation(location, setFieldValue)
                  }
                />
              </form>
            )}
          </Formik>
        </Container>
      )}
    </React.Fragment>
  );
};

export default NewOrder;
