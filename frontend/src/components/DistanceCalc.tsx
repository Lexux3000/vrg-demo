import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { getDistance } from "ol/sphere"; // ✅ OpenLayers function to measure distance

interface DistanceModalProps {
  open: boolean;
  onClose: () => void;
  pointA: number[] | null;
  pointB: number[] | null;
}

const DistanceModal: React.FC<DistanceModalProps> = ({ open, onClose, pointA, pointB }) => {
  if (!pointA || !pointB) return null;

  // ✅ Calculate the distance between two points in meters
  const distance = getDistance(pointA, pointB);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: "white", mx: "auto", my: "20%", width: 300, borderRadius: 2 }}>
        <Typography variant="h6">Distance Measurement</Typography>
        <Typography variant="body1">
          Distance between points: <b>{distance.toFixed(2)} m</b>
        </Typography>
        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default DistanceModal;
