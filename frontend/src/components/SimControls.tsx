import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

interface SimulationControlsProps {
  onAction: (action: string) => void; // Callback for logging actions
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ onAction }) => {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Simulation Controls
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => onAction("Play clicked")}
        sx={{ mb: 1 }}
      >
        Play
      </Button>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={() => onAction("Pause clicked")}
        sx={{ mb: 1 }}
      >
        Pause
      </Button>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={() => onAction("Stop clicked")}
        sx={{ mb: 1 }}
      >
        Stop
      </Button>
      <Typography variant="subtitle2">Current Time:</Typography>
      <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
        {currentTime}
      </Typography>
    </Box>
  );
};

export default SimulationControls;
