import React, { useState, useEffect } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Recommender from "../../components/liveTraderComponent/Recommender";
import PrevSignal from "../../components/liveTraderComponent/PrevSignal";
import { liveTickers } from "../../data/hokuData";

const LiveTrader = ({ apiKey, chosenTicks }) => {
  const filteredTickers = liveTickers.filter((ticker) =>
    Object.keys(chosenTicks).includes(ticker.title)
  );
  const [badApiKey, setBadApiKey] = useState(false);
  const [jsonData, setJsonData] = useState({});

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const apiUrl = "https://cattle-unified-inherently.ngrok-free.app/receive_json";
    const ws = new WebSocket("ws://9.tcp.ngrok.io:24047");
    ws.onerror = (event) => {
      console.log("error", event);
    }
    ws.onmessage = (event) => {
      const receivedJson = JSON.parse(event.data);
      console.log("realtime", receivedJson);

      setJsonData((prevData) => {
        // Update state only if the data has changed
        if (JSON.stringify(receivedJson) !== JSON.stringify(prevData)) {
          return receivedJson;
        }
        return prevData;
      });
    };

    const headers = {
      Authorization: apiKey,
      "ngrok-skip-browser-warning": 'skip-browser-warning'
    };

    // Make an initial GET request to fetch the last received JSON data with authentication
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        console.log("RECEIVING", response.data);
        setJsonData(response.data || {});
        setBadApiKey(false);
      })
      .catch((error) => {
        error.response.data === "Unauthorized"
          ? setBadApiKey(true)
          : console.error(error);
        // console.error("Error fetching JSON:", error.response.data);
      });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [apiKey]);

  if (badApiKey) {
    return (
      <Box textAlign="center">
        <Typography
          variant="h3"
          fontWeight=""
          sx={{ color: colors.redAccent[600] }}
        >
          UNAUTHORIZED APIKEY:{" "}
          {apiKey.slice(0, -4).split("").map(() => "*").join("")}
          {apiKey.slice(-4)}
        </Typography>
        <Typography
          variant="h3"
          fontWeight=""
          sx={{ color: colors.redAccent[600] }}
        >
          RESET IN CONFIG
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box
        display="flex"
        padding="0 50px"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems="center"
          marginBottom="10px"
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {"Tickers"}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {"Most Recent Signal"}
          </Typography>
        </Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 2fr)"
        gridAutoRows="140px"
        gap="20px"
        padding="0px 20px"
      >
        {Object.entries(filteredTickers).map(([value, ticker]) => (
          <React.Fragment key={ticker.title}>
            <Box
              gridColumn="span 6"
              gridRow="span 1"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="20px"
            >
              <Recommender
                ticker={ticker.title}
                label={ticker.label}
                stocktype=""
                recJson={jsonData[ticker.title] || {}}
              />
            </Box>
            <Box
              gridColumn="span 6"
              gridRow="span 1"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="20px"
            >
              <PrevSignal recJson={jsonData[ticker.title] || {}} />
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default LiveTrader;
