import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth.ts";

import { APPBAR_HEIGHT, HEADER_HEIGHT } from "../../config/constants.ts";
import { ButtonBase, useTheme } from "@mui/material";
import { tokens } from "../../theme.ts";
import { useNavigate } from "react-router-dom";

import "../../styles/landing.css";

const imageSrcs = ["package1.webp", "package2.jpg", "package3.webp"];
const landingImagesFolder = "assets/landing/";

const Landing = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [imageSrc, setImageSrc] = React.useState(`${landingImagesFolder}${imageSrcs[0]}`);
  const [isFading, setIsFading] = React.useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsFading(true); // Start fading out

      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          (prevIndex + 1) % imageSrcs.length
        );
        setIsFading(false); // Start fading in after the image is changed
      }, 500); // Match the fade-out duration in CSS
    }, 2500); // 2 seconds visible, 0.5 seconds for transition

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  useEffect(() => {
    setImageSrc(`${landingImagesFolder}${imageSrcs[currentImageIndex]}`);
  }, [currentImageIndex]);

  return (
    <section
      id="hero"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(assets/landing/bg-tablet-pattern.svg)",
        height: `calc(100vh - (${HEADER_HEIGHT}px + ${APPBAR_HEIGHT}px))`,
      }}
    >
      <div className="container flex flex-col-reverse items-center px-6 space-y-0 md:space-y-0 md:flex-row" style={{ gap: "20px" }}>
        <div className="flex flex-col space-y-12 md:w-1/2">
          <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl md:text-left" style={{ margin: "0" }}>
            Shipping made easier, with the perfect mix between fast and cheap
          </h1>
          <p className="max-w-sm text-center text-darkGrayishBlue md:text-left">
            Best price and time offers from the best shipping companies.
          </p>
          <div className="flex justify-center md:justify-start">
            <ButtonBase
              onClick={() => navigate(auth.user ? "/user/orders" : "/login")}
              className="baseline"
              sx={{
                padding: "0.5rem 0.8rem",
                textDecoration: "none",
                borderRadius: "9999px",
                color: colors.black,
                backgroundColor: colors.secondry,
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: colors.blueAccent[300],
                }
              }}
            >
              Get Started
            </ButtonBase>
          </div>
        </div>
        <div className="md:w-1/2">
          <img src={imageSrc} alt="Shipping Logo" className={`landing-image ${isFading ? "fade" : ""}`} />
        </div>
      </div>
    </section>
  );
};

export default Landing;
