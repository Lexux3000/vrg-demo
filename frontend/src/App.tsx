import React, { useState, useRef, useCallback } from "react";
import { Container, Box } from "@mui/material";
import Map from "./components/MapDisplay";
import SimulationControls from "./components/SimControls";
import UnitInfo from "./components/UnitInfo";
import LogPanel from "./components/LogDisplay";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const selectedUnitRef = useRef<Feature<Geometry> | null>(null); // ✅ Store selected unit without triggering re-renders

  // ✅ Function to add log messages
  const handleAction = useCallback((action: string) => {
    setLogEntries((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${action}`]);
  }, []);

  // ✅ Function to update selected unit WITHOUT forcing a re-render
  const handleSelectUnit = useCallback((unit: Feature<Geometry> | null) => {
    if (selectedUnitRef.current === unit) return; // ✅ Prevents unnecessary updates

    selectedUnitRef.current = unit; // ✅ Store selected unit without triggering re-render

    if (unit) {
      const unitName = unit.get("name");
      const unitType = unit.get("type");
      const unitRole = unit.get("role");

      setLogEntries((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Selected Unit: ${unitName}| ${unitType} | ${unitRole}`,
      ]);
    } else {
      setLogEntries((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Deselected unit.`]);
    }
  }, []);

  return (
    <Container 
      maxWidth={false} 
      sx={{
        bgcolor: "#f4f4f4", 
        display: "flex", 
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Map Section (✅ No re-renders now) */}
      <Box 
        sx={{
          flex: 1,
          minWidth: "70%",
          height: "100%",
        }}
      >
        <Map onSelectUnit={handleSelectUnit} /> 
      </Box>

      {/* Sidebar/Menu */}
      <Box
        sx={{
          width: { xs: "250px", md: "300px", lg: "350px" },
          backgroundColor: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          boxShadow: "-2px 0px 4px rgba(0, 0, 0, 0.1)",
          height: "100%",
        }}
      > 
        <SimulationControls onAction={handleAction} />
        <UnitInfo selectedUnit={selectedUnitRef.current} /> {/* ✅ No re-rendering */}
        <LogPanel logEntries={logEntries} />
      </Box>
    </Container>
  );
};

export default App;
