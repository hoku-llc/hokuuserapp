import React, { useState } from "react";
import { tokens } from "../../theme";
import { useTheme, Box, Typography, Button } from "@mui/material";
import CryptoJS from "crypto-js";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ibkrLogo from "../../images/ibkrRedLogo-removebg-preview.png";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { liveTickers } from "../../data/hokuData";
import { useNavigate } from "react-router-dom";
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';


const allTickers = liveTickers.reduce((acc, { title }) => {
  acc[title] = undefined;
  return acc;
}, {});
var key = "HOKUHOKUHOKUHOKU";
key = CryptoJS.enc.Utf8.parse(key);

const ConfigFile = ({ configData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [tickerData, setTickerData] = useState({
    ...allTickers,
    ...configData,
  });

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [apiKey, setApiKey] = useState("");

  const handleApiChange = (event) => {
    const { name, value } = event.target;
    setApiKey(value);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleCheckboxChange = (event) => {
    const ticker = event.target.value;
    setTickerData((prevData) => ({
      ...prevData,
      [ticker]: event.target.checked ? 0 : undefined,
    }));
  };

  const handleNumberChange = (event) => {
    const ticker = event.target.name;
    const value = parseInt(event.target.value, 10) || 0;
    setTickerData((prevData) => ({
      ...prevData,
      [ticker]: value,
    }));
  };

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const helpMessage = (
    <span>
      To find the your API key. <br />
      1. Log into Hoku.com <br />
      2. Navigate to your profile <br />
      3. Copy from Api Key
    </span>
  );

  function getLabelByTitle(title) {
    const ticker = liveTickers.find((ticker) => ticker.title === title);
    return ticker ? ticker.label : undefined;
  }
  function getPriceByTitle(title) {
    const ticker = liveTickers.find((ticker) => ticker.title === title);
    return ticker ? ticker.price : undefined;
  }
  function getMarginByTitle(title) {
    const ticker = liveTickers.find((ticker) => ticker.title === title);
    return ticker ? ticker.margin : undefined;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      title: `<h5 style="color: ${colors.grey[100]}">Confirm Configuration</h5>`,
      text: `These settings can be changed at any time`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: colors.greenAccent[400],
      cancelButtonColor: colors.redAccent[400],
      confirmButtonText: "Save",
      background: colors.blueAccent[800],
    }).then((result) => {
      if (result.isConfirmed) {
        const jsonData = JSON.stringify(tickerData);
        const configData = `${userData.username}|${userData.password}|${apiKey}|${jsonData}`;
        console.log([userData.username, userData.password, jsonData]);
        var encrypted = CryptoJS.AES.encrypt(configData, key, {
          mode: CryptoJS.mode.ECB,
        });
        encrypted = encrypted.toString();
        console.log("encrypted", encrypted);
        fetch("/saveconfig", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedStr: encrypted }),
        })
          .then((res) => res.json())
          .then((data) => {
            data.status === "success"
              ? navigate(`/`)
              : alert(data.message);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
    // Convert tickerData to JSON string
  };
  return (
    <Box
      m="20px"
      p="10px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography
        variant="h2"
        fontWeight="bold"
        sx={{ color: colors.grey[100], marginBottom: "10px" }}
      >
        Setup Config File
      </Typography>
      <Typography
        variant="h5"
        fontWeight=""
        sx={{ color: colors.redAccent[600] }}
      >
        Please input your Interactive Brokers Account Information and select
        stocks that you would like to trade
      </Typography>
      <Typography
        variant="h5"
        fontWeight=""
        sx={{ color: colors.redAccent[600] }}
      >
        All information in this file will be encrypted and stored locally
      </Typography>
      <Typography
        variant="h5"
        fontWeight=""
        sx={{ color: colors.redAccent[600], marginBottom: "20px" }}
      >
        Config file must be setup before you can trade
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* IBKR Data */}
        <Box
          m="5px 0px"
          p="10px 20px"
          sx={{ backgroundColor: colors.primary[300] }}
        >
          <Box display="flex" justifyContent="center">
            <img
              src={ibkrLogo} // Update the path accordingly
              alt="HOKU Logo"
              width="260"
              height="55"
            />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.primary[600] }}
              >
                Username
              </Typography>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleUserChange}
                style={{
                  maxWidth: "100%",
                  backgroundColor: colors.grey[100],
                  padding: "5px",
                }}
              />
            </Box>
            <Box
              sx={{ marginLeft: "20px" }}
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.primary[600] }}
              >
                Password
              </Typography>
              <Box display="flex" alignItems="center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userData.password}
                  onChange={handleUserChange}
                  style={{
                    maxWidth: "100%",
                    backgroundColor: colors.grey[100],
                    padding: "5px",
                  }}
                />
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  sx={{ fontSize: "9px" }}
                >
                  {<VisibilityIcon sx={{ fontSize: "18px" }} />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* APIKEY Data */}
        <Box
          m="5px 0px"
          p="10px 20px"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <Box display="flex" justifyContent="center" alignContent="center">
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ color: colors.greenAccent[600] }}
            >
              HOKU API KEY
            </Typography>
            <KeyRoundedIcon sx={{ color: colors.greenAccent[100], fontSize: "25px", marginLeft: "10px"}}/>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box>
              <input
                type="text"
                name="apikey"
                value={apiKey}
                onChange={handleApiChange}
                style={{
                  maxWidth: "100%",
                  backgroundColor: colors.grey[100],
                  padding: "5px",
                }}
              />
              <Tooltip
                title={helpMessage}
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      color: colors.greenAccent[200],
                      fontSize: "15px",
                      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
                      bgcolor: colors.primary[600],
                      "& .MuiTooltip-arrow": {
                        color: colors.primary[600],
                      },
                    },
                  },
                }}
              >
                <IconButton>
                  <HelpOutlineRoundedIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "20px" }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        {Object.entries(tickerData).map(([ticker, value]) => (
          <div key={ticker}>
            <Box
              display="flex"
              m="5px 0px"
              p="20px"
              alignItems="center"
              justifyContent="space-between"
              sx={{ backgroundColor: colors.primary[400] }}
            >
              <input
                type="checkbox"
                name="ticker"
                value={ticker}
                onChange={handleCheckboxChange}
                checked={value !== undefined}
                style={{
                  marginRight: "10px",
                  width: "20px", // Adjust width as needed
                  height: "20px", // Adjust height as needed
                  borderRadius: "9px", // Make it more square
                }}
              />
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.greenAccent[600] }}
                >
                  {ticker}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight=""
                  sx={{ color: colors.greenAccent[600] }}
                >
                  {getLabelByTitle(ticker)}
                </Typography>
                <Box display="flex">
                  <Typography
                    variant="h5"
                    fontWeight=""
                    sx={{ color: colors.grey[100], marginRight: "5px" }}
                  >
                    # Contracts
                  </Typography>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    name={ticker}
                    value={value}
                    onChange={handleNumberChange}
                    style={{
                      maxWidth: "30px",
                      maxHeight: "25px",
                      backgroundColor: colors.grey[100],
                      textAlign: "center", // Center the text horizontally
                      padding: "5px",
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{ marginLeft: "20px" }}
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.greenAccent[600] }}
                >
                  Price
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight=""
                  sx={{ color: colors.greenAccent[100] }}
                >
                  ${getPriceByTitle(ticker)}
                </Typography>
              </Box>
              <Box
                sx={{ marginLeft: "20px" }}
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: colors.greenAccent[600] }}
                >
                  Margin
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight=""
                  sx={{ color: colors.greenAccent[100] }}
                >
                  ${getMarginByTitle(ticker)}
                </Typography>
              </Box>
            </Box>
          </div>
        ))}

        <Box display="flex" m="10px" flexDirection="column" alignItems="center">
          <Button
            type="submit"
            variant="contained"
            sx={{
              fontWeight: "bold",
              backgroundColor: colors.greenAccent[500],
              color: colors.grey[600],
              "&:hover": {
                backgroundColor: colors.greenAccent[600], // Change color on hover
              },
            }}
          >
            Save Config File
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ConfigFile;
