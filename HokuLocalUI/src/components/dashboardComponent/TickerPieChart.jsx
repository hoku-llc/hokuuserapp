import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme, Box, Typography } from "@mui/material";

const TickerPieChart = ({ tickerData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const CustomTooltip = ({ id, value, color }) => <div></div>;

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
        Total Trades
      </Typography>
      <ResponsivePie
        data={tickerData}
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
        colors={{ scheme: "nivo" }}
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

export default TickerPieChart;
