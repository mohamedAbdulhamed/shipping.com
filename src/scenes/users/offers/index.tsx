import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Container,
  Button,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from '@mui/icons-material/Cancel';

import { tokens } from "../../../theme.ts";

import useAuth from "../../../hooks/useAuth.ts";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.ts";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
  ROLES,
} from "../../../config/constants.ts";
import { handleError } from "../../../utils/utils.ts";
import Order from "../../../entities/Order.ts";
import Offer from "../../../entities/Offer.ts";
import { fetchOffers } from "../../../api/offer/index.ts";
import { toast } from "react-toastify";
import testOffers from "../../../testing/testOffers.ts";

const Offers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(false);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOfferIds, setSelectedOfferIds] = useState<number[]>([]);

  const columns: GridColDef<Offer>[] = [
    {
      field: "orderId",
      headerName: "Order",
      // flex: 0.5,
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/user/orders/${params.value}`}
          variant="text"
          sx={{ color: colors.secondry, textDecoration: "underline" }}
        >
          Order Link
        </Button>
      ),
      cellClassName: "orderId-column--cell",
    },
    {
      field: "price",
      headerName: "Price",
      // flex: isNonMobile ? 1 : 0.5,
      width: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      cellClassName: "price-column--cell",
    },
    {
      field: "status",
      headerName: "Offer Status",
      headerAlign: "center",
      align: "center",
      // flex: isNonMobile ? 1 : 0.75,
      width: 150,
      renderCell: (params) => {
        const getColor = (status: Offer["status"]) => {
          switch (status) {
            case "Accepted":
              return "#219653";
            case "Rejected":
              return "#eb5757";
            case "Pending":
              return "#ff9302";
            default:
              return "gray";
          }
        };
        const getIcon = (status: Offer["status"]) => {
          switch (status) {
            case "Accepted":
              return <CheckCircleOutlineIcon />;
            case "Rejected":
              return <ThumbDownAltIcon />;
            case "Pending":
              return <PendingActionsIcon />;
            default:
              return <PendingActionsIcon />;
          }
        };

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "content-box",
              verticalAlign: "middle",
              height: "100%",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: getColor(params.value),
                color: colors.white,
                borderRadius: "4px",
                padding: ".3em 1em",
                gap: ".375rem",
                fontSize: ".875rem",
                fontWeight: 500,
                lineHeight: "1.3",
                textTransform: "capitalize",
              }}
            >
              {params.value} {getIcon(params.value)}
            </span>
          </Box>
        );
      },
      cellClassName: "offer-status-column--cell",
    },
    {
      field: "order",
      headerName: "Order Status",
      headerAlign: "center",
      align: "center",
      // flex: isNonMobile ? 1 : 0.75,
      width: 150,
      // valueGetter: (params: Order) => params.status === 0 ? "Pending" : "Accepted",
      valueGetter: (params: Order) => params.status,
      cellClassName: "order-status-column--cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      flex: isNonMobile ? 1 : 0.75,
      // width: 160,
      sortable: false,
      // handle conditions
      renderCell: (params) =>
        (params.row.order?.status === 1 ||
          params.row.order?.status === "Pending") && (
          <Tooltip title="Delete your offer" placement="top" arrow>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: "4px",
                mx: 1,
                padding: isNonMobile ? undefined : "2px",
                fontSize: isNonMobile ? undefined : "11px",
              }}
              onClick={() => handleWithdrawOffer(params.row.offerId)}
            >
              Withdraw <CancelIcon />
            </Button>
          </Tooltip>
        ),
      // add cancellation button if needed
    },
  ];

  const handleWithdrawOffer = (offerId: Offer["offerId"]) => {
    // TODO: 1. Call API. 2. Create endpoint on offer api file.
    if (auth.user?.role !== ROLES.company) {
      toast.error("You are not authorized.");
      return;
    }
    setIsLoading(true);

    try {
      setOffers((prev) => prev.filter((offer) => offer.offerId !== offerId));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    // different from withdrow
    if (selectedOfferIds.length === 0) {
      toast.error("No offers selected.");
      return;
    }

    setIsLoading(true);

    try {
      // API

      toast.success("Selected offers deleted successfully.");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOffersData = async () => {
      setIsLoading(true);

      try {
        const response = await fetchOffers(axiosPrivate);
        setOffers(response.data || []);
        // setOffers(testOffers);
      } catch (error) {
        handleError(error, "Couldn't fetch offers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffersData();
  }, [axiosPrivate]);

  return (
    <Container
      sx={{
        padding: "2em",
        minHeight: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #cbc3c363",
          marginBottom: "5vh",
        }}
      >
        <Typography sx={{ color: colors.black }} variant="h2">
          Offers You Made
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteSelected}
        disabled={selectedOfferIds.length === 0 || isLoading}
        sx={{ marginBottom: "16px" }}
      >
        {`Delete (${selectedOfferIds.length}) Selected offer(s)`} <DeleteIcon />
      </Button>

      {offers.length > 0 ? (
        <Box
          sx={{
            height: 400,
            width: "100%",
            "& .MuiDataGrid-root": {
              border: "none",
              color: colors.black,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: colors.secondry,
              backdropFilter: "blur(19px) saturate(180%)",
              borderBottom: "none",
            },
            "& .MuiDataGrid-cell": {
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
            "& .MuiDataGrid-footerContainer .Mui-disabled *": {
              color: colors.grey[300],
            },

            "& .MuiCheckbox-root": {
              color: colors.greenAccent[200],
            },
            "& .MuiCheckbox-root.Mui-disabled": {
              color: colors.grey[100],
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: colors.black,
            },

            "& .MuiDataGrid-scrollbar::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "& .MuiDataGrid-scrollbar::-webkit-scrollbar-thumb": {
              backgroundColor: colors.blueAccent[500],
              borderRadius: "4px",
            },
            "& .MuiDataGrid-scrollbar::-webkit-scrollbar-thumb:hover": {
              backgroundColor: colors.greenAccent[300],
            },
            "& .MuiDataGrid-scrollbar::-webkit-scrollbar-track": {
              backgroundColor: colors.primary[600],
              borderRadius: "4px",
            },
          }}
        >
          <DataGrid
            rows={offers}
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
            loading={isLoading || offers.length === 0}
            slots={{ toolbar: GridToolbar }}
            getCellClassName={(params) =>
              Number(params.id) % 2 === 0 ? "cell-grey" : ""
            }
            autoHeight
            disableColumnMenu={!isNonMobile}
            disableRowSelectionOnClick
            checkboxSelection
            onRowSelectionModelChange={(ids) =>
              setSelectedOfferIds(ids as number[])
            }
            // TODO: handle conditions
            isRowSelectable={(params) =>
              params.row.status !== "Accepted" &&
              params.row.order?.status !== "Accepted"
            }
          />
        </Box>
      ) : (
        <span>No offers yet</span>
      )}
    </Container>
  );
};

export default Offers;

// OLD TABLE SX:

// sx={{
//   height: 400,
//   width: "100%",
//   "& .MuiDataGrid-root": {
//     border: "none",
//   },
//   "& .MuiDataGrid-columnHeader": {
//     backgroundColor: colors.blueAccent[700],
//     backdropFilter: "blur(19px) saturate(180%)",
//     borderBottom: "none",
//   },
//   "& .MuiDataGrid-cell": {
//     borderBottom: "none",
//   },
//   "& .name-column--cell": {
//     color: colors.greenAccent[300],
//   },
//   "& .MuiDataGrid-virtualScroller": {
//     backgroundColor: colors.primary[400],
//   },
//   "& .MuiDataGrid-footerContainer": {
//     borderTop: "none",
//     backgroundColor: colors.blueAccent[700],
//   },
//   "& .MuiCheckbox-root": {
//     color: colors.greenAccent[200],
//   },
//   "& .MuiCheckbox-root.Mui-disabled": {
//     color: "#ffffff4d",
//   },
//   "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//     color: colors.black,
//   },

//   "& .MuiDataGrid-scrollbar::-webkit-scrollbar": {
//     width: "8px", // Scrollbar width
//     height: "8px", // Scrollbar height for horizontal scrolling
//   },
//   "& .MuiDataGrid-scrollbar::-webkit-scrollbar-thumb": {
//     backgroundColor: colors.blueAccent[500], // Thumb color
//     borderRadius: "4px", // Rounded corners
//   },
//   "& .MuiDataGrid-scrollbar::-webkit-scrollbar-thumb:hover": {
//     backgroundColor: colors.greenAccent[300], // Thumb color on hover
//   },
//   "& .MuiDataGrid-scrollbar::-webkit-scrollbar-track": {
//     backgroundColor: colors.primary[600], // Track background
//     borderRadius: "4px", // Rounded corners
//   },
// }}
