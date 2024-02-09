import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const TickerInfo = ({ ticker, label, shortLabel, contract }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <ShowChartIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {ticker}
          </Typography>
          <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
            {label}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            Contract Info (per contract)
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography
              variant="h6"
              sx={{ color: colors.grey[100], marginRight: "4px" }}
            >
              Price
            </Typography>
            <Typography variant="h6" sx={{ color: colors.greenAccent[500] }}>
              ${contract.price.toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: colors.grey[100], marginRight: "4px" }}
            >
              Contract Unit
            </Typography>
            <Typography variant="h6" sx={{ color: colors.greenAccent[500] }}>
              {contract.unit} x {shortLabel}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TickerInfo;
