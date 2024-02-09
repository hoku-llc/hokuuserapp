import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme, Box, Typography } from "@mui/material";

const WinratePieChart = ({ transactionData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const CustomTooltip = ({ id, value, color }) => <div></div>;

  const winCount = transactionData.filter(
    (transaction) => transaction.profit > 0
  ).length;
  const winRateData = [
    {
      id: "Profit",
      label: "profit",
      value: winCount,
      color: "hsl(91, 70%, 50%)",
    },
    {
      id: "Loss",
      label: "loss",
      value: transactionData.length - winCount,
      color: "hsl(162, 70%, 50%)",
    },
  ];

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography
        variant="h2"
        fontWeight=""
        sx={{ color: colors.grey[100], marginTop: "8px" }}
      >
        Winning Trades
      </Typography>
      <ResponsivePie
        data={winRateData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={4}
        activeOuterRadiusOffset={8}
        colors={["#9AED90", "#D46868"]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={9}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", "1.6"]],
        }}
        tooltip={CustomTooltip}
        legends={[]}
      />
    </Box>
  );
};

export default WinratePieChart;
