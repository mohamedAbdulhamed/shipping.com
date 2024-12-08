import React from "react";
import {
  Box,
  Button,
  TextField,
  Container,
  useTheme,
  Chip,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

import { tokens } from "../../theme.ts";
import Header from "../../components/layout/Header.tsx";
import { useNavigate } from "react-router-dom";

import useAxiosPrivate from "../../hooks/useAxiosPrivate.ts";
import useAuth from "../../hooks/useAuth.ts";

import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
  ROLES,
} from "../../config/constants.ts";
import User from "../../entities/User.ts";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { inputStyles, handleError } from "../../utils/utils.ts";
import useLoading from "../../hooks/useLoading.ts";

type ProfileUser = {
  phoneNumber: User["phoneNumber"];
  email: User["email"];
  fullName: User["fullName"];
};

const Profile = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setMainLoading } = useLoading();

  const [addBalanceDialogOpen, setAddBalanceDialogOpen] = React.useState(false);
  const openDialog = () => setAddBalanceDialogOpen(true);
  const closeDialog = () => setAddBalanceDialogOpen(false);

  const [initialValues] = React.useState<ProfileUser>({
    phoneNumber: auth?.user?.phoneNumber || "",
    email: auth?.user?.email || "",
    fullName: auth?.user?.fullName || "",
  });

  const handleFormSubmit = async (values: ProfileUser) => {
    console.log(values);
    setMainLoading(true);

    try {
      const response = await axiosPrivate.post("/Account/update", values);

      if (response?.data?.Success && response?.data?.StatusCode === 200) {
        navigate("/");
      } else {
        let message = response?.data?.ErrorMessage || "Unknown error";
        toast.error(message);
      }
    } catch (err) {
      handleError(err, "Something went wrong, please try again later.");
    } finally {
      setMainLoading(false);
    }
  };

  const getRoleLabel = () => {
    switch (auth.user?.role) {
      case ROLES.client:
        return t(TRANSLAITIONS.clientRole);
      case ROLES.company:
        return t(TRANSLAITIONS.companyRole);
      case ROLES.admin:
        return "Admin";
      default:
        return "";
    }
  };

  const getRoleBgColor = () => {
    switch (auth.user?.role) {
      case ROLES.client:
        return colors.redAccent[300];
      case ROLES.company:
        return colors.greenAccent[300];
      case ROLES.admin:
        return colors.blueAccent[300];
      default:
        return "";
    }
  };

  const checkoutSchema = yup.object().shape({
    name: yup
      .string()
      .required(
        t(TRANSLAITIONS.requiredEntityError, { entity: t(TRANSLAITIONS.name) })
      )
      .min(
        4,
        t(TRANSLAITIONS.minEntityError, {
          entity: t(TRANSLAITIONS.name),
          min: "4",
        })
      )
      .max(
        60,
        t(TRANSLAITIONS.maxEntityError, {
          entity: t(TRANSLAITIONS.name),
          max: "60",
        })
      ),
    email: yup
      .string()
      .email(
        t(TRANSLAITIONS.invalidEntityError, { entity: t(TRANSLAITIONS.email) })
      )
      .required(
        t(TRANSLAITIONS.requiredEntityError, { entity: t(TRANSLAITIONS.email) })
      ),
  });

  return (
    <Container
      sx={{
        minHeight: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      {/* Profile Info */}
      <Box
        sx={{
          background: colors.white,
          borderRadius: 4,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Header title={t(TRANSLAITIONS.profile_headerTitle)} />

          <Tooltip title={t(TRANSLAITIONS.role)} placement="top" arrow>
            <Chip
              label={getRoleLabel()}
              sx={{
                backgroundColor: getRoleBgColor(),
                color: colors.black,
                fontWeight: "bold",
              }}
            />
          </Tooltip>
        </Box>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            dirty,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label={t(TRANSLAITIONS.mobileNumber)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  name="phoneNumber"
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  sx={inputStyles(colors, {
                    "& .MuiInputBase-input": {
                      cursor: "not-allowed !important",
                    },
                  })}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label={t(TRANSLAITIONS.email)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={inputStyles(colors, {
                    "& .MuiInputBase-input": {
                      cursor: "not-allowed !important",
                    },
                  })}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label={t(TRANSLAITIONS.name)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.fullName}
                  name="fullName"
                  error={!!touched.fullName && !!errors.fullName}
                  helperText={touched.fullName && errors.fullName}
                  sx={inputStyles(colors, {
                    "& .MuiInputBase-input": {
                      cursor: "not-allowed !important",
                    },
                  })}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" mt="20px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  {t(TRANSLAITIONS.profile_updateButton)}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {/* Balance Info: if user is a company */}
      {auth.user?.role === ROLES.company && (
        <Box
          sx={{
            background: colors.white,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Header title="Balance" />

            <Button
              variant="contained"
              onClick={openDialog}
              sx={{
                borderRadius: "9999px",
              }}
            >
              Add Money
            </Button>
            
            {/* Add balance dialog */}
            <Dialog
              open={addBalanceDialogOpen}
              onClose={closeDialog}
              PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const formJson = Object.fromEntries(
                    (formData as any).entries()
                  );
                  const balance = formJson.balance;
                  console.log(balance);
                  closeDialog();
                },
                sx:{
                  width: isNonMobile ? "40vw" : "90vw",
                  maxWidth: "600px",
                  height: "80vh",
                  overflowY: "auto",
                },
              }}
            >
              <DialogTitle>Adding Balance</DialogTitle>
              <DialogContent>
                <DialogContentText>Choose amount</DialogContentText>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="balance"
                  name="balance"
                  label="Balance"
                  type="number"
                  fullWidth
                  variant="standard"
                  inputProps={{
                    min: 0,
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button sx={{ color: colors.redAccent[400] }} onClick={closeDialog}>Cancel</Button>
                <Button sx={{ color: colors.secondry }} type="submit">Continue</Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* if balance is below certain amount, color: red */}
          <Typography variant="h3">0.00 EGP</Typography>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
