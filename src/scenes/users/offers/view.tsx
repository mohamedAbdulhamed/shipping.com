import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Container,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  MenuItem,
  useTheme,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.ts";
import { tokens } from "../../../theme.ts";
import {
  HEADER_HEIGHT,
  APPBAR_HEIGHT,
  TRANSLAITIONS,
} from "../../../config/constants.ts";
import Offer from "../../../entities/Offer.ts";
import { useTranslation } from "react-i18next";
import useLoading from "../../../hooks/useLoading.ts";
import Header from "../../../components/layout/Header.tsx";
import { handleError } from "../../../utils/utils.ts";

const ViewOffer = () => {
  const { id } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const { setMainLoading } = useLoading();

  const [initialValues, setInitialValues] = useState<Offer | null>(null);

  React.useEffect(() => {
    const fetchOffer = async () => {
      setMainLoading(true);

      try {

      } catch (error) {
        handleError("Failed to fetch offer");
      } finally {
        setMainLoading(false);
      }
    };

    fetchOffer();
  }, [id, setMainLoading]);

  const handleFormSubmit = (values) => {
    // updating offer
    console.log(values);
  };

  const checkoutSchema = yup.object().shape({
  });

  return (
    <Container
      sx={{
        minHeight: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "50px auto",
      }}
    >
      <Header
        title="offers"
        subtitle="offers"
      />

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
          dirty,
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
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                  background: colors.white,
                },
              }}
            >
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!dirty}
              >
                {t(TRANSLAITIONS.update)}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default ViewOffer;
