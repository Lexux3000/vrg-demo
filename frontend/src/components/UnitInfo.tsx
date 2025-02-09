import React,{ useEffect, useState } from "react";
import { Paper, Typography, Divider, Button, Box } from "@mui/material";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { assignTask, deleteTask, fetchTasks } from "../api";

interface UnitInfoProps {
  selectedUnit: Feature | null;
}

const UnitInfo: React.FC<UnitInfoProps> = ({ selectedUnit }) => {
  const [showTaskButtons, setShowTaskButtons] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUnit) return;

    const unitId = selectedUnit.get("id");
    fetchTasks().then((tasks) => {
      const task = tasks.find((t: any) => t.unit_id === unitId);
      setCurrentTask(task ? task.task : null);
    });
  }, [selectedUnit]);

    if (!selectedUnit) {
    return (
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography>Select a unit to view details.</Typography>
      </Paper>
    );
  }

  const unitId = selectedUnit.get("id");
  const unitName = selectedUnit.get("name");

  const geometry = selectedUnit.getGeometry() as Point;
  const coordinates: [number, number] = geometry ? geometry.getCoordinates() as [number, number] : [0, 0];  

  const handleAssignTask = async (task: string) => {
    await assignTask(unitId, task);
    setCurrentTask(task); 
    setShowTaskButtons(false); 
  };

  const handleStopTask = async () => {
    await deleteTask(unitId);
    setCurrentTask(null); 
  };

    return (
      <Paper
        elevation={2}
        sx={{
          padding: 2,
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          marginBottom: 2,
          position: "relative",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}> Unit Info </Typography>
  
        <Typography variant="body1">
          <strong>Callsign:</strong> {unitName}
        </Typography>
        <Typography variant="body2">
          <strong>Type:</strong> {selectedUnit.get("type")}
        </Typography>
        <Typography variant="body2">
          <strong>Role:</strong> {selectedUnit.get("role")}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2">
          <strong>Health:</strong> {selectedUnit.get("health")}% 
        </Typography>
        <Typography variant="body2">
          <strong>Speed:</strong> {selectedUnit.get("speed")} km/h
        </Typography>
        <Typography variant="body2">
          <strong>Ammo status:</strong> {selectedUnit.get("ammo")}
        </Typography>
        <Typography variant="body2">
          <strong>Current Task:</strong> {selectedUnit.get("task") || "None"}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2">
          <strong>Position:</strong> {selectedUnit.get("position")}
        </Typography>
  
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 1 }}
          onClick={() => setShowTaskButtons((prev) => !prev)}
        >
          Give Task
        </Button>
  
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={handleStopTask}
        >
          Stop Task
        </Button>

        {showTaskButtons && (
          <Box
            sx={{
              position: "absolute",
              top: coordinates[1] + 50,
              left: coordinates[0] + 50,
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: "10px",
              zIndex: 10,
            }}
          >
            <Button variant="contained" color="success" size="small" onClick={() => handleAssignTask("Move")}>
              Move
            </Button>
            <Button variant="contained" color="warning" size="small" onClick={() => handleAssignTask("Engage")}>
              Engage
            </Button>
            <Button variant="contained" color="info" size="small" onClick={() => handleAssignTask("Hold")}>
              Hold
            </Button>
          </Box>
        )}
      </Paper>
    );
  };

export default UnitInfo;
