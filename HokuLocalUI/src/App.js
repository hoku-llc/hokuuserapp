import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./scenes/dashboard";
import TickerStats from "./scenes/tickerstats/TickerStats";
import LiveTrader from "./scenes/livetrader";
import ConfigFile from "./components/profileComponent/ConfigFile";
import "./App.css";
import StartTrader from "./scenes/startTrader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  const [theme, colorMode] = useMode();
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
          <div className="app">
            <main className="content">
            <Navbar />
            <Router>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<StartTrader />} />
                <Route path="tickerstats/:buttonId" element={<TickerStats />} />
                <Route path="/config" element={<ConfigFile />} />
              </Routes>
            </Router>
            </main>
          </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
