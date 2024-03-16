import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";

const PrevSignal = ({ recJson }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const displaySignal = 
  recJson && Object.keys(recJson).length !== 0 ? (
    recJson.action+" "+recJson.ticker+" "+recJson.position+" @ "+new Date(recJson.timestamp).toLocaleString()
  ) : (
    "No recent signals"
  )

  return (
    <Box width="100%" m="0 20px">
      <Box display="flex" flexDirection="column">
        
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h4"
            fontWeight=""
            sx={{ color: colors.grey[100] }}
          >
            {displaySignal}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PrevSignal;
