import { useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import "./Navbar.css";
import hokubluelogoside from "../../images/hokubluelogoside.png";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [clicked] = useState(false);

  return (
    <Box display="flex" p={2} sx={{ backgroundColor: colors.primary[600] }}>
      {/* LOGO */}
      <a id="logo" href="/">
        <img
          src={hokubluelogoside} // Update the path accordingly
          alt="HOKU Logo"
          width="80"
          height="40"
        />
      </a>
      <Box
        display="flex"
        className="linkers"
        sx={{
          justifyContent: "space-around",
          width: "100%", // Set width to 100%
        }}
      >
        <ul id="navbar" className={clicked ? "#navbar active" : "#navbar"}>
          <li>
            <a href="/">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                Start Trader
              </Typography>
            </a>
          </li>
          <li>
            <a href="/dashboard">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                Dashboard
              </Typography>
            </a>
          </li>
          <li>
            <a href="/config">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                Config File
              </Typography>
            </a>
          </li>
          <li>
            <a href="/help">
              <Typography
                variant="h4"
                fontWeight=""
                sx={{ color: colors.grey[100] }}
              >
                Help
              </Typography>
            </a>
          </li>
        </ul>
      </Box>
      {/* ICONS
      <Box display="flex">
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {authUser ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <PersonOutlinedIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  backgroundColor: colors.blueAccent[900],
                },
              }}
            >
              <a href="/profile" style={{textDecoration: "none"}}>
                <MenuItem onClick={handleProfile}>
                  <Typography
                    variant="h6"
                    fontWeight=""
                    sx={{ color: colors.grey[100] }}
                  >
                    Profile
                  </Typography>
                </MenuItem>
              </a>
              <MenuItem onClick={userSignOut}>
                <Typography
                  variant="h6"
                  fontWeight=""
                  sx={{ color: colors.grey[100] }}
                >
                  Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <a href="/login">
            <IconButton>
              <LoginIcon />
            </IconButton>
          </a>
        )}
      </Box> */}
    </Box>
  );
};

export default Navbar;
