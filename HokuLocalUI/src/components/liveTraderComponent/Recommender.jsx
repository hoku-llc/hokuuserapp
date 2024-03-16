import React, { useState, useEffect } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const Recommender = ({ ticker, label, stocktype, recJson }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const calculateDuration = (stamp) => {
    if (stamp) {
      const now = new Date();
      const utcDate = new Date(stamp)
      const startTime = new Date(utcDate.toLocaleString());
      const durationInSeconds = Math.floor((now - startTime) / 1000);
      return durationInSeconds;
    }
    return 0; // Default to 0 if stamp is not defined
  };
  const [duration, setDuration] = useState(
    recJson.timestamp ? calculateDuration(recJson.timestamp) : 0
  );
  useEffect(() => {
    if (recJson.timestamp) {
      const intervalId = setInterval(() => {
        setDuration(calculateDuration(recJson.timestamp));
      }, 30000); // Update every 30 sec

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [recJson.timestamp]);

  const formatDuration = (seconds) => {
    // Implement your own formatting logic based on the seconds
    // For simplicity, I'm just returning minutes here
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutes`;
  };

  const title_info =
    recJson && Object.keys(recJson).length === 0 ? (
      <Typography
        variant="h4"
        fontWeight=""
        sx={{ color: colors.grey[300] }}
      >
        NOT IN TRADE
      </Typography>
    ) : recJson && recJson["action"] === "SELL" ? (
      <Typography
        variant="h4"
        fontWeight=""
        sx={{ color: colors.grey[300] }}
      >
        NOT IN TRADE
      </Typography>
    ) : recJson && recJson["action"] === "BUY" ? (
      <Typography
        variant="h3"
        fontWeight=""
        sx={{ color: colors.greenAccent[300] }}
      >
        IN TRADE
      </Typography>
    ) : (
      "Error retreiving Json"
    );

  const trade_info =
    recJson && recJson["action"] === "BUY" ? (
      <Box display="flex">
        <Box display="flex" flexDirection="column" marginRight="10px">
          <Typography
            variant="h6"
            sx={{ color: colors.grey[100], marginRight: "0px" }}
          >
            Contract
          </Typography>
          <Typography variant="h6" sx={{ color: colors.greenAccent[500] }}>
            {recJson.cDate}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" marginRight="10px">
          <Typography
            variant="h6"
            sx={{ color: colors.grey[100], marginRight: "0px" }}
          >
            Position
          </Typography>
          <Typography variant="h6" sx={{ color: colors.greenAccent[500] }}>
            {recJson.position}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography variant="h6" sx={{ color: colors.grey[100] }}>
            Duration
          </Typography>
          <Typography variant="h6" sx={{ color: colors.greenAccent[500] }}>
            {formatDuration(duration)}
          </Typography>
        </Box>
      </Box>
    ) : (
      <></>
    );

  const icon_func =
    recJson && recJson["action"] === "BUY" ? (
      <NotificationsActiveIcon
        sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
      />
    ) : (
      <NotificationsNoneIcon
        sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
      />
    );
  return (
    <Box width="100%" m="0 30px">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            {icon_func}
            <Typography
              variant="h3"
              fontWeight=""
              sx={{ color: colors.grey[100] }}
            >
              {ticker}
            </Typography>
            <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
              {label + " " + stocktype}
            </Typography>
          </Box>
          <Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              {title_info}
            </Box>
            {trade_info}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Recommender;
