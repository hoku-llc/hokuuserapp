import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import RequestPageIcon from "@mui/icons-material/RequestPage";

const ProfitStatBox = ({ tickerTrans, contractPrice }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const calcDaysAgo = (days) => {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - days);
    return sevenDaysAgo;
  };

  const currentTime = new Date();
  const sevenDays = tickerTrans
    ? tickerTrans.filter((transaction) => {
      console.log('senor',  transaction.timestamp)
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

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <RequestPageIcon
          sx={{ color: colors.greenAccent[600], fontSize: "40px" }}
        />
        {/* TOTAL PROFIT TAB */}
        <Box height="100%" justifyContent="flex-end">
          <Typography
            variant="h2"
            fontSize="26px"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            Total Profit
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight=""
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              7 Days:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${sevenProfit.toFixed(2)}
            </h3>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight=""
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              30 Days:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${thirtyProfit.toFixed(2)}
            </h3>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight="550"
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              Overall:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${overallProfit.toFixed(2)}
            </h3>
          </Box>
        </Box>
        {/* FEES TAB */}
        <Box height="100%" justifyContent="flex-end">
          <Typography
            variant="h2"
            fontWeight="bold"
            fontSize="26px"
            sx={{ color: colors.grey[100] }}
          >
            Contract Fees
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight=""
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              7 Days:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${(sevenDays.length * contractPrice).toFixed(2)}
            </h3>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight=""
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              30 Days:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${(thirtyDays.length * contractPrice).toFixed(2)}
            </h3>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight="550"
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              Overall:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${(tickerTrans.length * contractPrice).toFixed(2)}
            </h3>
          </Box>
        </Box>
        {/* NET PROFIT TAB */}
        <Box height="100%" justifyContent="flex-end">
          <Typography
            variant="h2"
            fontSize="26px"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            Net Profit
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight=""
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              7 Days:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${(sevenProfit - sevenDays.length * contractPrice).toFixed(2)}
            </h3>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight=""
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              30 Days:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${(thirtyProfit - thirtyDays.length * contractPrice).toFixed(2)}
            </h3>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography
              variant="h5"
              fontWeight="550"
              sx={{ color: colors.grey[100], marginRight: "6px" }}
            >
              Overall:
            </Typography>
            <h3 style={{ color: colors.greenAccent[500], fontWeight: "100" }}>
              ${(overallProfit - tickerTrans.length * contractPrice).toFixed(2)}
            </h3>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfitStatBox;
