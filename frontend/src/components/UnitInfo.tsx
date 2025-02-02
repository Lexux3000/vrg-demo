import React from "react";
import { Paper, Typography, Divider } from "@mui/material";
import { Feature } from "ol";

interface UnitInfoProps {
  selectedUnit: Feature | null;
}

const UnitInfo: React.FC<UnitInfoProps> = ({ selectedUnit }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 2,
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        marginBottom: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Unit Info
      </Typography>
      
      {selectedUnit ? (
        <>
          <Typography variant="body1">
            <strong>Name:</strong> {selectedUnit.get("name")}
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
            <strong>Ammo:</strong> {selectedUnit.get("ammo")}
          </Typography>
          <Typography variant="body2">
            <strong>Task:</strong> {selectedUnit.get("task")}
          </Typography>
          <Typography variant="body2">
            <strong>Damage:</strong> {selectedUnit.get("damage")}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Click a unit to view details..
        </Typography>
        )}
    </Paper>
  );
};

export default UnitInfo;
