import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

const PastTransactionsTable = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: "ticker",
      headerName: "Ticker",
      flex: 1,
      align: "center",
      cellClassName: "id-cell",
      headerAlign: "center",
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      flex: 1,
      align: "center",
      headerAlign: "center",
      cellClassName: "timestamp-cell", // Add cellClassName for timestamp
      valueFormatter: ({ value }) => {
        const dateObject = new Date(value);
        const formattedDate = dateObject.toLocaleString();
        return formattedDate;
      },
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "duration",
      headerName: "Duration (min)",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "numberContracts",
      headerName: "# of Contracts",
      type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "profit",
      headerName: "Profit",
      type: "number",
      headerAlign: "center",
      align: "right",
      flex: 1,
      cellClassName: "id-profit",
      valueFormatter: ({ value }) => `$${value.toFixed(2)}`, // Format profit to two decimal places
    },
  ];

  return (
    <Box m="20px 45px">
      <Typography variant="h4" sx={{ color: colors.grey[100] }}>
        Past Transactions
      </Typography>
      <Box
        m="10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "16px",
            color: colors.grey[100],
            borderBottom: `1px solid ${colors.grey[700]}`, // Add bottom border to cells

            // Adjust the font size for cells
          },
          "& .name-column-cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#072c48",
            borderBottom: "none",
            fontSize: "16px",
            fontWeight: "",
            color: colors.grey[100],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .id-cell": {
            paddingLeft: "8px", // Add left padding for ID cells
          },
          "& .profit-cell": {
            paddingRight: "8px", // Add right padding for Profit cells
          },
          "& .timestamp-cell": {
            fontSize: "14px", // Adjust the font size for the timestamp cell
          },
        }}
      >
        <DataGrid rows={data} columns={columns} sortModel={[
            { field: "timestamp", sort: "desc" },
          ]}/>
      </Box>
    </Box>
  );
};

export default PastTransactionsTable;
