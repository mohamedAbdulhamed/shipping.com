import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  useTheme,
  Typography,
  Autocomplete,
  useMediaQuery,
  styled,
  LinearProgress,
  linearProgressClasses,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme.ts";
import Header from "../../components/layout/Header.tsx";

import PhoneInput, {
  getCountryCallingCode,
  Country,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

import InputMask from "react-input-mask";

import { useNavigate, Link } from "react-router-dom";

import axios from "../../api/axios.ts";
import useAuth from "../../hooks/useAuth.ts";
import { useTranslation } from "react-i18next";
import useLoading from "../../hooks/useLoading.ts";
import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
  ROLES,
} from "../../config/constants.ts";
import User from "../../entities/User.ts";
import { toast } from "react-toastify";
import { gridColumnStyles, handleError } from "../../utils/utils.ts";

type registerUser = {
  fullName: User["fullName"];
  phoneNumber: User["phoneNumber"];
  email: User["email"];
  password: User["password"];
  role: typeof ROLES.client | typeof ROLES.company;
};

type PasswordConstraintsType = {
  name: string;
  checker: (password: string) => boolean;
}[];

const passwordStrengthColors = {
  veryWeak: "#f00",
  weak: "#f44336", // red
  medium: "#ffc107", // amber
  strong: "#4caf50", // green
};

const calculatePasswordStrength = (password: string) => {
  let strength = 0;

  if (password.length >= 8) strength += 1; // at least 8 characters long
  if (/[A-Z]/.test(password)) strength += 1; // at least one uppercase letter
  if (/[a-z]/.test(password)) strength += 1; // at least one lowercase letter
  if (/[0-9]/.test(password)) strength += 1; // at least one number
  if (/[@$!%*?&#]/.test(password)) strength += 1; // one special character

  const WEAK_THRESHOLD = 2;
  const STRONG_THRESHOLD = 5;

  if (strength <= WEAK_THRESHOLD)
    return { value: 20, label: "Weak", color: passwordStrengthColors.weak };
  if (strength > WEAK_THRESHOLD && strength < STRONG_THRESHOLD)
    return { value: 60, label: "Medium", color: passwordStrengthColors.medium };
  if (strength >= STRONG_THRESHOLD)
    return {
      value: 100,
      label: "Strong",
      color: passwordStrengthColors.strong,
    };
  return {
    value: 0,
    label: "Very Weak",
    color: passwordStrengthColors.veryWeak,
  };
};

const RegisterForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { auth, setAuth, persist, setPersist } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setMainLoading } = useLoading();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    value: 0,
    label: "Very Weak",
    color: passwordStrengthColors.weak,
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>("EG");
  const [countryCode, setCountryCode] = useState(
    getCountryCallingCode(selectedCountry)
  );

  const [initialValues] = useState<registerUser>({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    role: ROLES.client,
  });

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // const code = getCountryCallingCode(country);
    // setCountryCode(`+${code}`);
  };

  const handleFormSubmit = async (values: registerUser) => {
    setMainLoading(true);

    try {
      // Normalize phone number: remove spaces, non-digit characters, and the '+' sign
      let normalizedMobileNumber = values.phoneNumber
        .replace(/\s+/g, "") // Remove spaces
        .replace(/[^0-9]/g, ""); // Remove all non-digit characters, including '+'

      // Update the values with the normalized phone number
      const payload = {
        ...values,
        phoneNumber: normalizedMobileNumber,
      };

      const response = await axios.post("/Account/register", payload);

      console.log(response.data);

      if (response?.data?.Success && response?.data?.StatusCode === 200) {
        navigate("/login");
        // set auth after the backend supports it
        // const token = response?.data?.Result?.token;
        // const user = response?.data?.Result?.user;
        // if (!token || !user) {
        //   toast.error("Something went wrong, please try again!");
        //   setMainLoading(false);
        //   return;
        // };

        // setAuth({ user, token });
        toast.success("Welcome to Shipping"); // TODO: change the name
      } else {
        toast.error(
          `Operation Failed: ${response?.data?.ErrorMessage || "Unknown error"}`
        );
      }
    } catch (err) {
      handleError(err, "Operation Failed, Please Try Again Later!");
    } finally {
      setMainLoading(false);
    }
  };

  const checkoutSchema = yup.object().shape({
    fullName: yup
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
        40,
        t(TRANSLAITIONS.maxEntityError, {
          entity: t(TRANSLAITIONS.name),
          max: "40",
        })
      ),
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
    email: yup
      .string()
      .email(
        t(TRANSLAITIONS.invalidEntityError, { entity: t(TRANSLAITIONS.email) })
      ),
    password: yup
      .string()
      .required(
        t(TRANSLAITIONS.requiredEntityError, {
          entity: t(TRANSLAITIONS.password),
        })
      )
      .min(
        8,
        t(TRANSLAITIONS.minEntityError, {
          entity: t(TRANSLAITIONS.password),
          min: "8",
        })
      )
      // .max(
      //   40,
      //   t(TRANSLAITIONS.maxEntityError, {
      //     entity: t(TRANSLAITIONS.password),
      //     max: "40",
      //   })
      // )
      .matches(/[A-Z]/, t(TRANSLAITIONS.passwordUppercaseError))
      .matches(/[a-z]/, t(TRANSLAITIONS.passwordLowercaseError))
      .matches(/[0-9]/, t(TRANSLAITIONS.passwordNumberError))
      .matches(/[@$!%*?&#]/, t(TRANSLAITIONS.passwordSpecialCharError))
      .matches(/^\S*$/, t(TRANSLAITIONS.passwordNoSpacesError)),
    role: yup
      .mixed<typeof ROLES.client | typeof ROLES.company>()
      .oneOf(
        [ROLES.client, ROLES.company],
        t(TRANSLAITIONS.invalidEntityError, { entity: t(TRANSLAITIONS.role) })
      )
      .required(
        t(TRANSLAITIONS.requiredEntityError, { entity: t(TRANSLAITIONS.role) })
      ),
  });

  const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: colors.grey[200],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: passwordStrength.color,
      transition: "width 0.3s",
    },
    transition: "width 0.3s",
  }));

  const passwordConstraints: PasswordConstraintsType = [
    {
      name: "At least 8 characters long",
      checker: (password: string) => password.length >= 8,
    },
    {
      name: "At least one uppercase letter",
      checker: (password: string) => /[A-Z]/.test(password),
    },
    {
      name: "At least one lowercase letter",
      checker: (password: string) => /[a-z]/.test(password),
    },
    {
      name: "At least one number",
      checker: (password: string) => /[0-9]/.test(password),
    },
    {
      name: "One special character",
      checker: (password: string) => /[@$!%*?&#]/.test(password),
    },
  ];

  return (
    <Container
      sx={{
        minHeight: `calc(90vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "5vh",
        marginBottom: "5vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexDirection: isNonMobile ? "row" : "column",
        }}
      >
        <Header
          title={t(TRANSLAITIONS.register_headerTitle)}
          subtitle={t(TRANSLAITIONS.register_headerSubtitle)}
        />
      </Box>

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
                label={t(TRANSLAITIONS.nameDescription)}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={gridColumnStyles(colors)}
                required
              />
              <InputMask
                mask={`+${countryCode} 999 999 9999`}
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
                              color: "black",
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
                type="text"
                label={t(TRANSLAITIONS.email)}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={gridColumnStyles(colors)}
              />

              <Autocomplete
                options={[ROLES.client, ROLES.company]}
                value={values.role}
                onChange={(e, value) => setFieldValue("role", value)}
                getOptionLabel={(
                  option: typeof ROLES.client | typeof ROLES.company
                ) =>
                  option === ROLES.client
                    ? `${t(TRANSLAITIONS.clientRole)} - ${t(
                        TRANSLAITIONS.clientRoleDescription
                      )}`
                    : `${t(TRANSLAITIONS.companyRole)} - ${t(
                        TRANSLAITIONS.companyRoleDescription
                      )}`
                }
                sx={gridColumnStyles(colors, 2)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(TRANSLAITIONS.role)}
                    variant="outlined"
                    onBlur={handleBlur}
                    sx={gridColumnStyles(colors)}
                    error={!!touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
                    required
                  />
                )}
              />

              <Box
                sx={{
                  gridColumn: "span 4",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label={t(TRANSLAITIONS.password)}
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={(e) => {
                    handleChange(e);
                    setPasswordStrength(
                      calculatePasswordStrength(e.target.value)
                    );
                  }}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={gridColumnStyles(colors, 2, {
                    "& .MuiInputBase-root.MuiInputBase-adornedEnd": {
                      flexDirection:
                        i18n.dir() === "ltr" ? "row" : "row-reverse",
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
                  autoComplete="new-password"
                />
                <Box
                  sx={{
                    gridColumn: "span 2",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <BorderLinearProgress
                    variant="determinate"
                    value={passwordStrength.value}
                  />

                  {passwordStrength.value > 0 && (
                    <Typography sx={{ color: passwordStrength.color }}>
                      {passwordStrength.label} password
                    </Typography>
                  )}

                  {/* Requirments list */}
                  <List>
                    {passwordConstraints.map((constraint, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {constraint.checker(values.password) ? (
                            <CheckCircleOutlineIcon color="success" />
                          ) : (
                            <CircleOutlinedIcon
                              sx={{ color: colors.grey[400] }}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={constraint.name}
                          sx={{
                            color: constraint.checker(values.password)
                              ? colors.black
                              : colors.grey[400],
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="20px">
              <Box display="flex" alignItems="center">
                <Link to="/login">
                  <Typography
                    variant="h5"
                    color={colors.secondry}
                    sx={{ marginRight: "10px", textDecoration: "underline" }}
                  >
                    {t(TRANSLAITIONS.register_headToLoginLink)}
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Button type="submit" color="secondary" variant="contained">
                  {t(TRANSLAITIONS.register_registerButton)}
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default RegisterForm;
