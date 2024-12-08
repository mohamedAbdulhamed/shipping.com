import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Collapse,
  IconButton,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { tokens } from "../../theme.ts";

import { useTranslation } from "react-i18next";
import useOrdersFilters from "../../hooks/useOrdersFilters.ts";
import useLoading from "../../hooks/useLoading.ts";

import { egyptianCities, TRANSLAITIONS } from "../../config/constants.ts";
import { gridColumnStyles } from "../../utils/utils.ts";

// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
// import { MobileDateRangePicker } from "@mui/x-date-pickers-pro/MobileDateRangePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs, { Dayjs } from "dayjs";
// import { DateRange } from "@mui/x-date-pickers-pro/models";

// const shortcutsItems = [
//   {
//     label: "This Week",
//     getValue: () => {
//       const today = dayjs();
//       return [today.startOf("week"), today.endOf("week")];
//     },
//   },
//   {
//     label: "Last Week",
//     getValue: () => {
//       const today = dayjs();
//       const prevWeek = today.subtract(7, "day");
//       return [prevWeek.startOf("week"), prevWeek.endOf("week")];
//     },
//   },
//   {
//     label: "Last 7 Days",
//     getValue: () => {
//       const today = dayjs();
//       return [today.subtract(7, "day"), today];
//     },
//   },
//   {
//     label: "Current Month",
//     getValue: () => {
//       const today = dayjs();
//       return [today.startOf("month"), today.endOf("month")];
//     },
//   },
//   {
//     label: "Next Month",
//     getValue: () => {
//       const today = dayjs();
//       const startOfNextMonth = today.endOf("month").add(1, "day");
//       return [startOfNextMonth, startOfNextMonth.endOf("month")];
//     },
//   },
//   { label: "Reset", getValue: () => [null, null] },
// ];

const OrdersFiltersMenu = ({
  currentPage,
  perPage,
  setPerPage,
  totalItems,
  handlePageChange,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const {
    pickupCity,
    setPickupCity,
    deliveryCity,
    setDeliveryCity,
    isFragile,
    setIsFragile,
    weight,
    setWeight,
    sortBy,
    setSortBy,
    sortDescending,
    setSortDescending,
    clearFilters,
  } = useOrdersFilters();
  const { mainLoading } = useLoading();

  const [open, setOpen] = React.useState(false);

  const fragileOptions = [
    { label: "Fragile", value: true, icon: <ExpandMoreIcon /> },
    { label: "Not Fragile", value: false, icon: <ExpandMoreIcon /> },
  ];

  const weightOptions = [
    { label: "Less than 10kg", value: 10 },
    { label: "Less than 30kg", value: 30 },
    { label: "Less than 50kg", value: 50 },
  ];

  const sortByOptions = [
    { label: "Pickup City", value: "pickupCity" },
    { label: "Delivery City", value: "deliveryCity" },
    { label: "Is Fragile", value: "isFragile" },
    { label: "Weight", value: "weight" },
  ];

  const perPageOptions = [
    {
      label: "10",
      value: 10,
    },
    {
      label: "25",
      value: 25,
    },
    {
      label: "50",
      value: 50,
    },
    {
      label: "100",
      value: 100,
    },
  ];

  const handleRowsPerPageChange = (event) => {
    const newPerPage = parseInt(event.target?.value!, 10);
    setPerPage(newPerPage);
  };

  return (
    <Box
      sx={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        p: 3,
      }}
    >
      {/* Header title */}
      <Tooltip title={open ? "Click to collapse" : "Click to expand"}>
        <ButtonBase
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            width: "100%",
            "& :hover": {
              color: colors.primary[300],
            },
          }}
        >
          <Typography
            variant="h2"
            component="strong"
            sx={{
              color: colors.black,
              my: 3,
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Filters{" "}
            {open ? (
              <ExpandLessIcon
                sx={{
                  animation: "bounceUpDown 1s infinite",
                  "@keyframes bounceUpDown": {
                    "0%, 100%": {
                      transform: "translateY(0)",
                    },
                    "50%": {
                      transform: "translateY(-5px)",
                    },
                  },
                }}
              />
            ) : (
              <ExpandMoreIcon
                sx={{
                  animation: "bounceDownUp 1s infinite",
                  "@keyframes bounceDownUp": {
                    "0%, 100%": {
                      transform: "translateY(0)",
                    },
                    "50%": {
                      transform: "translateY(5px)",
                    },
                  },
                }}
              />
            )}
          </Typography>
        </ButtonBase>
      </Tooltip>

      <Collapse in={open} timeout="auto">
        <React.Fragment>
          {/* Fields */}
          <Box
            sx={{
              display: "grid",
              gap: "30px",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
                background: colors.white,
              },
            }}
          >
            {/* Pickup City */}
            <Autocomplete
              fullWidth
              options={egyptianCities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t(TRANSLAITIONS.pickupCity)}
                  placeholder="Any"
                  sx={gridColumnStyles(colors, 1)}
                />
              )}
              value={pickupCity}
              onChange={(event, city) => setPickupCity(city)}
            />

            {/* Delivery City */}
            <Autocomplete
              fullWidth
              options={egyptianCities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t(TRANSLAITIONS.deliveryCity)}
                  placeholder="Any"
                  sx={gridColumnStyles(colors, 1)}
                />
              )}
              value={deliveryCity}
              onChange={(event, city) => setDeliveryCity(city)}
            />

            {/* Estimated Delivery Start/End Date */}
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              {isNonMobile ? (
                <DateRangePicker
                  localeText={{
                    start: "Estimated Delivery Start Date",
                    end: "Estimated Delivery End Date",
                  }}
                  value={[
                    estimatedDeliveryStartDate
                      ? dayjs(estimatedDeliveryStartDate)
                      : null,
                    estimatedDeliveryEndDate
                      ? dayjs(estimatedDeliveryEndDate)
                      : null,
                  ]}
                  onChange={(newValue: DateRange<Dayjs>) => {
                    const [start, end] = newValue;
                    setEstimatedDeliveryStartDate(
                      start ? start.toDate() : null
                    );
                    setEstimatedDeliveryEndDate(end ? end.toDate() : null);
                  }}
                  sx={gridColumnStyles(colors, 2, { color: colors.black })}
                  slotProps={{
                    shortcuts: {
                      items: shortcutsItems,
                    },
                    actionBar: { actions: [] },
                  }}
                  calendars={2}
                />
              ) : (
                <MobileDateRangePicker
                  localeText={{
                    start: "Estimated Delivery Start Date",
                    end: "Estimated Delivery End Date",
                  }}
                  value={[
                    estimatedDeliveryStartDate
                      ? dayjs(estimatedDeliveryStartDate)
                      : null,
                    estimatedDeliveryEndDate
                      ? dayjs(estimatedDeliveryEndDate)
                      : null,
                  ]}
                  onChange={(newValue: DateRange<Dayjs>) => {
                    const [start, end] = newValue;
                    setEstimatedDeliveryStartDate(
                      start ? start.toDate() : null
                    );
                    setEstimatedDeliveryEndDate(end ? end.toDate() : null);
                  }}
                  sx={gridColumnStyles(colors, 4, { color: colors.black })}
                  slotProps={{
                    shortcuts: {
                      items: shortcutsItems,
                    },
                    actionBar: { actions: [] },
                  }}
                />
              )}
            </LocalizationProvider> */}

            <Autocomplete
              fullWidth
              options={fragileOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Is Fragile"
                  placeholder="Any"
                  sx={gridColumnStyles(colors, 1)}
                />
              )}
              value={
                fragileOptions.find((option) => option.value === isFragile) ||
                null
              }
              onChange={(event, newValue) => {
                setIsFragile(newValue?.value || null);
              }}
            />

            <Autocomplete
              fullWidth
              options={weightOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Weight"
                  placeholder="Any"
                  sx={gridColumnStyles(colors, 1)}
                />
              )}
              value={
                weightOptions.find((option) => option.value === weight) || null
              }
              onChange={(event, newValue) => {
                setWeight(newValue?.value || null);
              }}
            />

            <Autocomplete
              fullWidth
              options={sortByOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Sort By"
                  placeholder="Any"
                  sx={gridColumnStyles(colors, 1)}
                />
              )}
              value={
                sortByOptions.find((option) => option.value === sortBy) || null
              }
              onChange={(event, newValue) => {
                setSortBy(newValue?.value || null);
              }}
            />

            <Box
              sx={gridColumnStyles(colors, 1, {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              })}
            >
              <Tooltip title="Descend">
                <IconButton
                  onClick={() => setSortDescending(true)}
                  disabled={sortDescending}
                >
                  <ArrowDownward
                    sx={{
                      color: sortDescending
                        ? colors.primary[200]
                        : colors.black,
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ascend">
                <IconButton
                  onClick={() => setSortDescending(false)}
                  disabled={!sortDescending}
                >
                  <ArrowUpward
                    sx={{
                      color: sortDescending
                        ? colors.black
                        : colors.primary[200],
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={clearFilters}
            sx={{ my: 3 }}
          >
            Clear
          </Button>

          <TablePagination
            component="div"
            count={totalItems}
            page={currentPage - 1}
            onPageChange={(event, page) => handlePageChange(event, page + 1)}
            rowsPerPage={perPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={perPageOptions}
            aria-disabled={mainLoading}
            disabled={mainLoading}
            sx={{
              color: colors.black,
              "& .MuiToolbar-root": {
                justifyContent: "flex-end",
                flexWrap: "wrap",
              },
              "& .MuiTablePagination-actions button": {
                color: colors.black,
              },
              "& .MuiTablePagination-actions button.Mui-disabled": {
                color: colors.grey[300],
              },
            }}
          />
        </React.Fragment>
      </Collapse>
    </Box>
  );
};

export default OrdersFiltersMenu;
