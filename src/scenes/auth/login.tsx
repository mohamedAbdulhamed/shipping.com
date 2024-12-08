import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Container,
  useTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme.ts";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import PhoneInput, { getCountryCallingCode, Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import InputMask from "react-input-mask";

import axios from "../../api/axios.ts";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.ts";
import useLoading from "../../hooks/useLoading.ts";
import { useTranslation } from "react-i18next";

import Header from "../../components/layout/Header.tsx";
import CookieConsent from "../../components/CookieConsent.tsx";
import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
  ROLES,
} from "../../config/constants.ts";
import User from "../../entities/User.ts";
import { toast } from "react-toastify";
import { gridColumnStyles, handleError } from "../../utils/utils.ts";

type loginUser = {
  phoneNumber: User["phoneNumber"];
  password: User["password"];
};

const Login = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t, i18n } = useTranslation();

  const { auth, setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { setMainLoading } = useLoading();

  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(
    localStorage.getItem("cookieConsent") === "true"
  );

  const [showPassword, setShowPassword] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<Country>("EG");
  const [countryCode, setCountryCode] = useState("+20");

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    const code = getCountryCallingCode(country);
    setCountryCode(`+${code}`);
  };

  const handleFormSubmit = async (values: {
    phoneNumber: User["phoneNumber"];
    password: User["password"];
  }) => {
    if (auth?.user) {
      toast.error(t(TRANSLAITIONS.login_alreadySignedError));
      return;
    }

    setMainLoading(true);

    try {
      let normalizedMobileNumber = values.phoneNumber
        .replace(/\s+/g, "") // Remove spaces
        .replace(/[^0-9]/g, ""); // Remove all non-digit characters, including '+'

      const payload = {
        ...values,
        phoneNumber: normalizedMobileNumber,
      };

      const response = await axios.post("/Account/login", payload, {
        withCredentials: true,
      });

      // const user: User = {
      //   id: "123",
      //   username: "Alwatanya",
      //   email: "mohamed@gmail.com",
      //   phoneNumber: "01010101010",
      //   password: "123456",
      //   role: ROLES.client,
      // };
      // const token = "";

      // setAuth({ user, token });
      // navigate(from, { replace: true });

      // return;

      if (response?.data?.Success && response?.data?.StatusCode === 200) {
        const token = response?.data?.Result?.token;
        const user = response?.data?.Result?.user;

        if (!token || !user) {
          toast.error("Something went wrong, please try again!");
          setMainLoading(false);
          return;
        };

        setAuth({ user, token });

        setMainLoading(false);

        navigate(from, { replace: true });
      } else {
        toast.error(
          response?.data?.ErrorMessage || "An unknown error has occured!"
        );
      }
    } catch (err) {
      console.log(err)
      handleError(err);
    } finally {
      setMainLoading(false);
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", `${persist}`);

    if (persist && !consentGiven) {
      setShowConsent(true);
    }
  }, [persist, consentGiven]);

  useEffect(() => {
    if (auth.user) {
      navigate(from);
    }
  }, [auth.user, navigate, from]);

  const handleConsent = () => {
    setConsentGiven(true);
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  const checkoutSchema = yup.object().shape({
    phoneNumber: yup
      .string()
      .required(
        t(TRANSLAITIONS.requiredEntityError, {
          entity: t(TRANSLAITIONS.mobileNumber),
        })
      )
      .matches(
        /^\+20 \d{3} \d{3} \d{4}$/, // only egyptian numbers allowed for now
        t(TRANSLAITIONS.invalidEntityError, {
          entity: t(TRANSLAITIONS.mobileNumber),
        })
      ),
    password: yup.string().required(
      t(TRANSLAITIONS.requiredEntityError, {
        entity: t(TRANSLAITIONS.password),
      })
    ),
  });

  const initialValues: loginUser = {
    phoneNumber: "",
    password: "",
  };

  return (
    <Container
      sx={{
        minHeight: `calc(90vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Header
        title={t(TRANSLAITIONS.login_headerTitle)}
        subtitle={t(TRANSLAITIONS.login_headerSubtitle)}
      />

      {showConsent && <CookieConsent handleConsent={handleConsent} />}

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
          setFieldValue
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
              <InputMask
                mask={`${countryCode} 999 999 9999`}
                maskChar="_"
                alwaysShowMask={false}
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {() => (
                  <TextField
                  fullWidth
                  variant="outlined"
                  type="tel"
                  label={t(TRANSLAITIONS.mobileNumber)}
                  value={values.phoneNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="phoneNumber"
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  sx={gridColumnStyles(colors)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneInput
                          international
                          readOnly
                          defaultCountry={selectedCountry}
                          focusInputOnCountrySelection={false}
                          onCountryChange={handleCountryChange}
                          onChange={() => null}
                          inputComponent={() => null}
                          style={{
                            backgroundColor: "white",
                            color: "black"
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                )}
              </InputMask>
            
              <TextField
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                label={t(TRANSLAITIONS.password)}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={gridColumnStyles(colors, 2, {
                  "& .MuiInputBase-root.MuiInputBase-adornedEnd": {
                    flexDirection: i18n.dir() === "ltr" ? "row" : "row-reverse",
                  },
                })}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{
                          color: colors.black,
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                label={t(TRANSLAITIONS.login_rememberMeLabel)}
                control={
                  <Checkbox
                    checked={persist}
                    onChange={togglePersist}
                    name="persist"
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
            <Box display="flex" justifyContent="space-between" mt="20px">
              <Box display="flex" alignItems="center">
                <Link to={"/register"}>
                  <Typography
                    variant="h5"
                    color={colors.secondry}
                    sx={{ marginRight: "10px", textDecoration: "underline" }}
                  >
                    {t(TRANSLAITIONS.login_headToRegisterLink)}
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Button type="submit" color="secondary" variant="contained">
                  {t(TRANSLAITIONS.login_loginButton)}
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default Login;
