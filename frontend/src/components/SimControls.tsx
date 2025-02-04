import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface SimulationControlsProps {
  onAction: (action: string) => void;
  setIsSimulationRunning: React.Dispatch<React.SetStateAction<boolean>>; // Logging
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ onAction, setIsSimulationRunning }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(undefined);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Simulation State
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 0, mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={() => {
            setIsRunning(true);
            setIsSimulationRunning(true);
            onAction("Play clicked");
          }}
        >
          <PlayArrowIcon />
        </Button>

        <Button
          variant="contained"
          color="warning"
          fullWidth
          onClick={() => {
            setIsRunning(false);
            setIsSimulationRunning(false);
            onAction("Pause clicked");
          }}
        >
          <PauseIcon />
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => {
            setIsRunning(false);
            setElapsedTime(0); // Reset timer
            setIsSimulationRunning(false);
            onAction("Stop clicked");
          }}
        >
          <StopIcon />
        </Button>
      </Box>

      {/* Timer */}
      <Typography variant="subtitle2">Current time:</Typography>
      <Typography variant="h6" sx={{ fontFamily: "monospace" }}>
        {formatTime(elapsedTime)}
      </Typography>
    </Box>
  );
};

export default SimulationControls;
