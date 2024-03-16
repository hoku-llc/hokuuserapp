import React, { useState, useEffect } from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { liveTickers } from "../../data/hokuData";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { IconButton } from "@mui/material";
import PlayCircleFilledWhiteRoundedIcon from "@mui/icons-material/PlayCircleFilledWhiteRounded";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import LiveTrader from "../livetrader";

const StartTrader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tickers, setTickers] = useState({});
  const [apiKey, setApiKey] = useState();
  const [inLive, setInLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/checkconfig")
      .then((res) => res.json())
      .then((data) => {
        if (data.file_exists) {
          console.log("config exist", data.file_exists);
          console.log("tickers", data.tickerJson);
          setTickers(data.tickerJson);
          setApiKey(data.apiKey)
        } else {
          navigate("/help");
        }
      }).then(() => setLoading(false));
    fetch("/checkLive")
      .then((res) => res.json())
      .then((data) => {
        console.log("in live", data.inLive);
        setInLive(data.inLive);
      });
  }, [navigate]);

  const handleClick = () => {
    fetch("/startLive")
      .then((res) => res.json())
      .then((data) => {
        console.log("run trader", data);
      });
    setInLive(true);
  };

  const handleStop = () => {
    fetch("/stopLive")
      .then((res) => res.json())
      .then((data) => {
        console.log("stop trader", data);
        setInLive(false);
      });
  };

  function getLabelByTitle(title) {
    const ticker = liveTickers.find((ticker) => ticker.title === title);
    return ticker ? ticker.label : undefined;
  }

  return (
    <Box>
      <Box m="20px" p="0 5%">
        <Header title="Start Live Trader" subtitle="Live Trader using IBKR" />
        {inLive ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              marginBottom="5px"
            >
              <Typography
                variant="h1"
                fontWeight=""
                sx={{ color: colors.greenAccent[100], marginRight: "20px" }}
              >
                Predicting Market Trends
              </Typography>
              <BounceLoader color={colors.greenAccent[400]} />
            </Box>
            <Box display="flex" flexDirection="column" marginBottom="20px" textAlign="center">
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: colors.redAccent[500] }}
              >
                Please do not exit from this page!!
              </Typography>
              <Typography
                variant="h5"
                fontWeight=""
                sx={{ color: colors.redAccent[200] }}
              >
                Keep Connection Secure (if lost refresh the page)
              </Typography>
              <Typography
                variant="h5"
                fontWeight=""
                sx={{ color: colors.redAccent[200] }}
              >
                Before stopping trade ensure that there are no unattended open orders!
              </Typography>
            </Box>
            <IconButton display="flex" onClick={handleStop}>
              <Typography
                variant="h1"
                fontWeight=""
                sx={{ color: colors.redAccent[400], marginRight: "20px" }}
              >
                Stop Trading
              </Typography>
              <StopCircleRoundedIcon
                sx={{ color: colors.redAccent[400], fontSize: "60px" }}
              />
            </IconButton>
            {loading ? <></> : <LiveTrader apiKey={apiKey} chosenTicks={tickers}/>}
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            maxWidth="500px"
            mx="auto" // Set left and right margin to auto
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              p="10px"
              sx={{ backgroundColor: "#0a3553", borderRadius: '10px' }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginBottom="10px"
              >
                <Typography
                  variant="h2"
                  fontWeight=""
                  sx={{ color: colors.greenAccent[100] }}
                >
                  Tickers to Trade
                </Typography>
                <a href="/config">
                  <IconButton>
                    <ModeEditRoundedIcon
                      sx={{ color: colors.grey[200], fontSize: "20px" }}
                    />
                  </IconButton>
                </a>
              </Box>
              {Object.entries(tickers).map(([ticker, value]) => (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p="25px 50px"
                  m="2px"
                  key={ticker}
                  sx={{ backgroundColor: "#2a5873", borderRadius: '10px' }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight=""
                      sx={{ color: colors.greenAccent[500] }}
                    >
                      {ticker}
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight=""
                      sx={{ color: colors.greenAccent[200] }}
                    >
                      {getLabelByTitle(ticker)}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignContent="end"
                    sx={{ marginLeft: "20px" }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight=""
                      sx={{ color: colors.greenAccent[200] }}
                    >
                      # of Contracts:
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight=""
                      sx={{ color: colors.greenAccent[500], ml: "auto" }}
                    >
                      {value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <IconButton display="flex" onClick={handleClick}>
              <Typography
                variant="h1"
                fontWeight=""
                sx={{ color: colors.greenAccent[400], marginRight: "5px" }}
              >
                Start Trading
              </Typography>
              <PlayCircleFilledWhiteRoundedIcon
                sx={{ color: colors.greenAccent[400], fontSize: "60px" }}
              />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StartTrader;
