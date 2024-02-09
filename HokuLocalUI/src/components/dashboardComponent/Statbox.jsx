import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";

const Statbox = ({ title, subtitle, icon, allTrans }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let tickerTrans = [];

  allTrans
    ? (tickerTrans = allTrans.filter(
        (transaction) => transaction.ticker === title
      ))
    : (tickerTrans = []);

  const calcDaysAgo = (days) => {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - days);
    return sevenDaysAgo;
  };

  const currentTime = new Date();
  const sevenDays = tickerTrans
    ? tickerTrans.filter((transaction) => {
        const transactionTimestamp = (transaction.timestamp);
        return (
          transactionTimestamp >= calcDaysAgo(7) &&
          transactionTimestamp <= currentTime
        );
      })
    : [];

  const thirtyDays = tickerTrans
    ? tickerTrans.filter((transaction) => {
        const transactionTimestamp = (transaction.timestamp);
        return (
          transactionTimestamp >= calcDaysAgo(30) &&
          transactionTimestamp <= currentTime
        );
      })
    : [];

  const sevenProfit = sevenDays.reduce((total, transaction) => {
    return total + transaction.profit;
  }, 0);

  const thirtyProfit = thirtyDays.reduce((total, transaction) => {
    return total + transaction.profit;
  }, 0);

  const overallProfit = tickerTrans.reduce((total, transaction) => {
    return total + transaction.profit;
  }, 0);

  if (title === "") {
    return (
      <Box display="flex" justifyContent="center">
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ color: colors.greenAccent[100] }}
        >
          More Tickers Coming Soon
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      m="0 30px"
      sx={{
        transition: "transform 0.2s ease-in-out", // Add a transition for smooth effect
        "&:hover": {
          transform: "scale(1.05)", // Apply scale on hover
        },
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box display="flex">
          <Box display="flex" justifyContent="flex-end">
            {/* <ProgressCircle progress={progress} /> */}
            <Box width="100px" textAlign="right">
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: colors.grey[100] }}
              >
                7 Days:
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: colors.grey[100], marginTop: "4px" }}
              >
                30 Days:
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: colors.grey[100], marginTop: "2px" }}
              >
                Overall:
              </Typography>
            </Box>
          </Box>

          <Box
            style={{ marginLeft: "10px" }}
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
          >
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${sevenProfit.toFixed(2)}
            </h3>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${thirtyProfit.toFixed(2)}
            </h3>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${overallProfit.toFixed(2)}
            </h3>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default Statbox;
