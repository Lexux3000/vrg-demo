import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import Map from "./components/MapDisplay";
import SimulationControls from "./components/SimControls";
import UnitInfo from "./components/UnitInfo";
import LogPanel from "./components/LogDisplay";

const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<string[]>([]);

  const handleAction = (action: string) => {
    setLogEntries((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${action}`]);
  };

  return (
    <Container maxWidth="xl" sx={{ display: "flex", height: "100vh", padding: 0 }}>
      {/* Map */}
      <Box sx={{ flex: 1 }}>
        <Map />
      </Box>

      {/* Menu */}
      <Box
        sx={{
          width: "300px",
          backgroundColor: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          boxShadow: "-2px 0px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <SimulationControls onAction={handleAction} />
        <UnitInfo />
        <LogPanel logEntries={logEntries} />
      </Box>
    </Container>
  );
};

export default App;
