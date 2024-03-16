import React from "react";
import Header from "../../components/Header";
import configImg from "./images/configPic.png";
import startTradeImg from "./images/liveTrader.png";
import tradingImg from "./images/tradingPic.png";
import apiSettingImg from "./images/twsPic.png";
import { Box, Typography } from "@mui/material";
import Fade from "react-reveal/Fade";

const GettingStarted = () => {
  return (
    <Box p="20px 5%">
      <Header title={"Getting Started"} subtitle={"Set Up Live Trader"} />
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Fade right delay={200}>
          <Box
            display="flex"
            justifyContent="center"
            borderBottom={1}
            paddingBottom="10px"
          >
            <img
              src={apiSettingImg}
              alt="config"
              style={{ maxWidth: "40vw" }}
            />
            <Box maxWidth="20vw" marginLeft="10px">
              <Typography variant="h1">STEP 0</Typography>
              <Box paddingLeft="10px">
                <br />
                <Typography variant="h6">
                  To begin please log into your Interactive Brokers TWS API
                </Typography>
                <br />
                <Typography variant="h6">
                  In the top left there will be a button called "File" then
                  "Global Configuration ..."
                </Typography>
                <br />
                <Typography variant="h6">
                  Navigate to "API" then "Settings": Uncheck the "Read-only API"
                  and check "Enable ActiveX and Socket Clients"
                </Typography>
                <br />
                <Typography variant="h6">
                  Then navigate to "Lock and Exit": Click "Auto restart" and set
                  the auto restart time to 5:03PM EST
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
        <br />
        <Fade left delay={800}>
          <Box display="flex" justifyContent="center" borderBottom={1}>
            <Box maxWidth="20vw">
              <Typography variant="h1">STEP 1</Typography>
              <Box paddingLeft="10px">
                <br />
                <Typography variant="h6">
                  Click the "Config File" button from the navigation bar above
                </Typography>
                <br />
                <Typography variant="h6">
                  Input your personal apikey given by Hoku Analytics in the HOKU
                  API KEY box
                </Typography>
                <br />
                <Typography variant="h6">
                  Select which tickers you would like to trade
                </Typography>
                <br />
                <Typography variant="h6">
                  Once a ticker is selected please input the number of contracts
                  you would like to trade at a time of that ticker
                </Typography>
                <br />
                <Typography variant="h6">
                  When you are finished setting up your ticker selection press
                  the "SAVE CONFIG FILE" button at the bottom. This will
                  generate a pop up asking for confirmation
                </Typography>
              </Box>
            </Box>
            <img src={configImg} alt="config" style={{ maxWidth: "40vw" }} />
          </Box>
        </Fade>
        <br />
        <Fade right delay={400}>
          <Box display="flex" justifyContent="center" borderBottom={1}>
            <img
              src={startTradeImg}
              alt="config"
              style={{ maxWidth: "40vw" }}
            />
            <Box maxWidth="20vw">
              <Typography variant="h1">STEP 2</Typography>
              <Box paddingLeft="10px">
                <br />
                <Typography variant="h6">
                  Once the config file is saved the app will redirect you to the
                  live trader page
                </Typography>
                <br />
                <Typography variant="h6">
                  Look over the given ticker configuration and confirm that all
                  information is correct
                </Typography>
                <br />
                <Typography variant="h6">
                  When you are ready to begin trading, click the "START TRADING"
                  button
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
        <br />
        <Fade left delay={400}>
          <Box display="flex" justifyContent="center">
            <Box maxWidth="20vw">
              <Typography variant="h1">STEP 3</Typography>
              <Box paddingLeft="10px">
                <br />
                <Typography variant="h6">
                  Clicking the "START TRADING" button will now navigate you to
                  this page
                </Typography>
                <br />
                <Typography variant="h6">
                  When you see that the green ball is boucing, live trading has
                  begun
                </Typography>
                <br />
                <Typography variant="h6">
                  To stop trading at any point click the "STOP TRADING" button
                </Typography>
                <Typography variant="h6">
                  MAKE SURE THAT THERE ARE NO ONGOING TRADES
                </Typography>
                <br />
              </Box>
              <Typography variant="h3">Notes</Typography>
              <Box paddingLeft="10px">
                <Typography variant="h6">
                  Please keep the device powered on at all times
                </Typography>
                <br />
                <Typography variant="h6">
                  If WiFi connection is lost or device is powered off refresh
                  the page
                </Typography>
                <br />
                <Typography variant="h6">
                  You will see when a ticker is in a trade when the left side
                  box has a filled in bell and specifics of the current trade
                </Typography>
              </Box>
            </Box>
            <img src={tradingImg} alt="config" style={{ maxWidth: "30vw" }} />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default GettingStarted;
