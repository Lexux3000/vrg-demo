import React, { useState, useRef, useCallback, useEffect } from "react";
import { Container, Box, Modal, Typography, Paper, Button } from "@mui/material";
import Map from "./components/MapDisplay";
import SimulationControls from "./components/SimControls";
import UnitInfo from "./components/UnitInfo";
import LogPanel from "./components/LogDisplay";
import { Feature } from "ol";
import { Geometry, Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";

const App: React.FC = () => {
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [simulationTime, setSimulationTime] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const selectedUnitRef = useRef<Feature<Geometry> | null>(null);
  const [selectedUnitState, setSelectedUnitState] = useState<Feature<Geometry> | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<Feature<Geometry>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const simulationTimeRef = useRef(0);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!isSimulationRunning) return;
    const interval = setInterval(() => {
      simulationTimeRef.current += 1;
      forceRender((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  const formatSimulationTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAction = useCallback((action: string) => {
    setLogEntries((prev) => [
      ...prev,
      `[${formatSimulationTime(simulationTimeRef.current)}] ${action}`,
    ]);
  }, []);
  
  const handleSelectUnit = useCallback((unit: Feature<Geometry> | null) => {
    if (selectedUnitRef.current === unit) return;
    selectedUnitRef.current = unit;
    setSelectedUnitState(unit);

    setSelectedUnits((prev) => {
      if (unit) {
        const unitName = unit.get("name");
        const unitType = unit.get("type");
        const unitRole = unit.get("role");

        setLogEntries((prevLogs) => [
          ...prevLogs,
          `[${formatSimulationTime(simulationTimeRef.current)}] Selected Unit: ${unitName} | Type: ${unitType} | Role: ${unitRole}`,
        ]);

        if (prev.length < 2) {
          return [...prev, unit];
        } else {
          return [prev[1], unit];
        }
      }
      return [];
    });
  }, []);

  useEffect(() => {
    if (selectedUnits.length === 2) {
      calculateDistance(selectedUnits[0], selectedUnits[1]);
    }
  }, [selectedUnits]);

  const calculateDistance = (unit1: Feature<Geometry>, unit2: Feature<Geometry>) => {
    if (!unit1 || !unit2) return;
    const coords1 = toLonLat((unit1.getGeometry() as Point)?.getCoordinates() ?? []);
    const coords2 = toLonLat((unit2.getGeometry() as Point)?.getCoordinates() ?? []);
    if (coords1.length < 2 || coords2.length < 2) return;

    const R = 6371;
    const lat1 = (coords1[1] * Math.PI) / 180;
    const lat2 = (coords2[1] * Math.PI) / 180;
    const deltaLat = ((coords2[1] - coords1[1]) * Math.PI) / 180;
    const deltaLon = ((coords2[0] - coords1[0]) * Math.PI) / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    setDistance(distance);
    setIsModalOpen(true);
  };

  return (
    <Container maxWidth={false} sx={{ bgcolor: "#f4f4f4", display: "flex", height: "100vh", width: "100vw" }}>
      <Box sx={{ flex: 1, minWidth: "70%", height: "100%" }}>
        <Map onSelectUnit={handleSelectUnit} />
      </Box>
      <Box sx={{ width: { xs: "250px", md: "300px", lg: "350px" }, backgroundColor: "#f4f4f4", display: "flex", flexDirection: "column", padding: 2, boxShadow: "-2px 0px 4px rgba(0, 0, 0, 0.1)", height: "100%" }}>
        <SimulationControls onAction={handleAction} setIsSimulationRunning={setIsSimulationRunning} />
        <UnitInfo selectedUnit={selectedUnitState} />
        <LogPanel logEntries={logEntries} />
      </Box>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 3, width: 300, textAlign: "center" }}>
          <Typography variant="h6">Distance Between Units</Typography>
          {distance !== null ? (
            <Typography variant="body1">
              The distance between the selected units is <strong>{distance.toFixed(2)} km</strong>.
            </Typography>
          ) : (
            <Typography variant="body2">Error calculating distance.</Typography>
          )}
          <Button sx={{ marginTop: 2 }} variant="contained" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default App;