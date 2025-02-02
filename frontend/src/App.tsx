import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import Map from "./components/MapDisplay";
import SimulationControls from "./components/SimControls";
import UnitInfo from "./components/UnitInfo";
import LogPanel from "./components/LogDisplay";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Feature<Geometry> | null>(null);

  const handleAction = (action: string) => {
    setLogEntries((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${action}`]);
  };

  return (
    <Container maxWidth="xl" sx={{ bgcolor: "#f4f4f4", display: "flex", height: "100vh"}}>
      {/* Map */}
      <Box sx={{ flex: 1 }}>
        <Map onSelectUnit={setSelectedUnit} />
      </Box>

      {/* Menu */}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          boxShadow: "-2px 0px 4px rgba(0, 0, 0, 0.1)",
        }}
      > 
        <SimulationControls onAction={handleAction} />
        <UnitInfo selectedUnit={selectedUnit} />
        <LogPanel logEntries={logEntries} />
      </Box>
    </Container>
  );
};

export default App;
