import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import WinratePieChart from "../../components/sharedDataComponents/WinratePieChart";
import WeeklyBarChart from "../../components/sharedDataComponents/WeeklyBarChart";
import ProfitStatBox from "../../components/tickerStatComponent/ProfitStatBox";
import PositionBarChart from "../../components/sharedDataComponents/PositionBarChart";
import TickerInfo from "../../components/tickerStatComponent/TickerInfo";
import PastTransactionsTable from "../../components/sharedDataComponents/PastTransactionsTable";
import { useLocation } from "react-router-dom";
import { liveTickers } from "../../data/hokuData";
import { DotLoader } from "react-spinners";
import Header from "../../components/Header";


const TickerStats = () => {
  const location = useLocation().pathname.split("/");
  const currTicker = location[location.length - 1];
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tickerTrans, setTickerTrans] = useState();
  const [tickerContract, setTickerContract] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let allTransactionJson = [];
    fetch("/readDB")
      .then((res) => res.json())
      .then((data) => {
        console.log("db exist", data.success);
        const transactionsData = data.docs;

        transactionsData.forEach((doc) => {
          allTransactionJson.push(doc);
        });
        allTransactionJson = allTransactionJson.map((transaction) => {
          const dateObject = new Date((new Date(transaction.timestamp)).toLocaleString());
          transaction.timestamp = dateObject;
          return transaction;
        });
        const filteredTick = allTransactionJson.filter(
          (transaction) => transaction.ticker === currTicker
        );
        console.log(filteredTick);
        setTickerTrans(filteredTick);

        const filterCont = liveTickers.find(
          (contract) => contract.title === currTicker
        );
        console.log(filterCont);
        setTickerContract(filterCont);
        setLoading(false)
      });
  }, [currTicker]);

  if (loading) {
    return (
      <Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <DotLoader color={colors.greenAccent[400]} />
        </Box>
      </Box>
    );
  }

  return (
    <Box m="20px" padding=" 0 5%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Ticker Statistics"} subtitle={tickerContract.label}/>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 4"
          backgroundColor={"#2a5873"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{borderRadius: '10px'}}
        >
          <TickerInfo
            ticker={currTicker}
            label={tickerContract.label}
            shortLabel={tickerContract.shortLabel}
            contract={{
              price: tickerContract.commission,
              unit: tickerContract.units,
            }}
          />
        </Box>
        <Box
          gridColumn="span 8"
          backgroundColor={"#2a5873"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{borderRadius: '10px'}}
        >
          <ProfitStatBox
            tickerTrans={tickerTrans}
            contractPrice={tickerContract.commission}
          />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={"#2a5873"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{borderRadius: '10px'}}
        >
          <WinratePieChart transactionData={tickerTrans} />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={"#2a5873"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{borderRadius: '10px'}}
        >
          <WeeklyBarChart allTransactions={tickerTrans} />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={"#2a5873"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{borderRadius: '10px'}}
        >
          <PositionBarChart transactionData={tickerTrans} />
        </Box>
      </Box>
      <PastTransactionsTable data={tickerTrans} />
    </Box>
  );
};

export default TickerStats;
