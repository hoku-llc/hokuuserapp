import React from "react";
import { useTheme, Box, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../theme";

function getPreviousSunday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const difference = dayOfWeek === 0 ? 7 : dayOfWeek;
  today.setDate(today.getDate() - difference);

  return today;
}

const showWeeks = 8;
const previousSunday = getPreviousSunday();
const startOfWeeks = [new Date()];
for (let i = 0; i < showWeeks; i++) {
  const currentSunday = new Date(previousSunday); // Create a new instance of Date
  currentSunday.setDate(previousSunday.getDate() - 7 * i); // Move to the previous week
  startOfWeeks.push(currentSunday);
}

const WeeklyBarChart = ({ allTransactions }) => {
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
      <strong>Profit</strong>: {value.toFixed(2)}
    </div>
  );
  let weekData = [];
  for (let j = 0; j < showWeeks; j++) {
    weekData.push({
      week: `${startOfWeeks[j + 1].getMonth() + 1}/${startOfWeeks[
        j + 1
      ].getDate()}`,
      profit: allTransactions
        .filter((transaction) => {
          const transactionTimestamp = (transaction.timestamp);
          return (
            transactionTimestamp >= startOfWeeks[j + 1] &&
            transactionTimestamp <= startOfWeeks[j]
          );
        })
        .reduce((total, transaction) => {
          return total + transaction.profit;
        }, 0),
    });
  }
  weekData = weekData.reverse();

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
        Profit Loss
      </Typography>
      <ResponsiveBar
        data={weekData}
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
        keys={["profit"]}
        indexBy="week"
        margin={{ top: 10, right: 50, bottom: 50, left: 60 }}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={[colors.greenAccent[500]]}
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
          legend: "profit",
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[]}
        role="application"
        isFocusable={true}
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
        tooltip={CustomTooltip}
      />
    </Box>
  );
};

export default WeeklyBarChart;
