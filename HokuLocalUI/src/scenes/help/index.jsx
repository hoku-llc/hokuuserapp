import { Box, Typography } from "@mui/material";
import starImg from "./images/aboutBackground.png";
import startImg from "./images/stock-1863880_1280.jpg";
import termImg from "./images/cyber-security-2296269_1280.jpg";
import aboutImg from "./images/architecture-1048092_1280.jpg";
import React from "react";
import Fade from "react-reveal/Fade";
import Header from "../../components/Header";

const HelpPage = () => {
  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(to bottom, #05223e, #2a5873, #0c2644, #1f4065, #064a73)",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center" // Added alignItems to center vertically
        sx={{
          backgroundImage: `url(${starImg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "60vh",
        }}
      >
        <Box
          display="flex"
          flexDirection="column" // Stack items vertically
          alignItems="center" // Center items horizontally
        >
          <Typography variant="h1" fontSize="64px">
            HOKU ANALYTICS
          </Typography>
          <Typography variant="h5">
            Trading Powered By Artificial Intelligence
          </Typography>
        </Box>
      </Box>
      <Box
        m="30px"
        p="30px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* <Typography variant="h1" fontSize="50px" marginBottom="30px">
          About Hoku Analytics
        </Typography> */}
        <Box display="flex">
          <Fade bottom delay={400}>
            <a href="/gettingStarted" style={{ textDecoration: "none" }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                m="10px"
              >
                <img
                  height="300px"
                  width="300px"
                  src={startImg}
                  alt="gettingStarted"
                ></img>
                <Box
                  borderLeft={1}
                  borderColor="white"
                  width="100%"
                  display="flex"
                  justifyContent=""
                  p="20px"
                >
                  <Typography
                    variant="h5"
                    marginTop=""
                    style={{ color: "white" }}
                  >
                    GETTING STARTED
                  </Typography>
                </Box>
              </Box>
            </a>
          </Fade>
          <Fade bottom delay={800}>
            <a href="/" style={{ textDecoration: "none" }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                m="10px"
              >
                <img
                  height="300px"
                  width="300px"
                  src={aboutImg}
                  alt="About"
                ></img>
                <Box
                  borderLeft={1}
                  borderColor="white"
                  width="100%"
                  display="flex"
                  justifyContent=""
                  p="20px"
                >
                  <Typography
                    variant="h5"
                    marginTop=""
                    style={{ color: "white" }}
                  >
                    ABOUT
                  </Typography>
                </Box>
              </Box>
            </a>
          </Fade>
          <Fade bottom delay={1300}>
            <a href="/" style={{ textDecoration: "none" }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                m="10px"
              >
                <img
                  height="300px"
                  width="300px"
                  src={termImg}
                  alt="terms"
                ></img>
                <Box
                  borderLeft={1}
                  borderColor="white"
                  width="100%"
                  display="flex"
                  justifyContent=""
                  p="20px"
                >
                  <Typography
                    variant="h5"
                    marginTop=""
                    style={{ color: "white" }}
                  >
                    TERMS AND CONDITIONS
                  </Typography>
                </Box>
              </Box>
            </a>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default HelpPage;
