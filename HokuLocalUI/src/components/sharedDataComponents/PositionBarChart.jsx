import React from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../theme";

const PositionBarChart = ({ transactionData }) => {
  const longData = transactionData.filter(
    (transaction) => transaction.position === "Long"
  );
  const shortData = transactionData.filter(
    (transaction) => transaction.position === "Short"
  );

  const winLongCount = longData.filter((long) => long.profit > 0).length;
  const winShortCount = shortData.filter((long) => long.profit > 0).length;

  const positionData = [
    {
      position: "long",
      loss: longData.length - winLongCount,
      profit: winLongCount,
    },
    {
      position: "short",
      loss: shortData.length - winShortCount,
      profit: winShortCount,
    },
  ];

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const CustomTooltip = ({ id, value, color }) => (
    <div
      style={{
        backgroundColor: colors.grey[100],
        padding: "8px",
        borderRadius: "4px",
        color: colors.grey[700],
      }}
    >
      <strong>{id}</strong>: {value}
    </div>
  );

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
        Positions
      </Typography>
      <ResponsiveBar
        data={positionData}
        theme={{
          axis: {
            domain: {
              line: { stroke: colors.grey[100] },
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
        keys={["loss", "profit"]}
        indexBy="position"
        margin={{ top: 10, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        minValue={0}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={["#D46868", "#9AED90"]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "trades",
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 90,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 20,
            itemDirection: "left-to-right",
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
        tooltip={CustomTooltip}
      />
    </Box>
  );
};

export default PositionBarChart;
