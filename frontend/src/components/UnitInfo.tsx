import React from "react";
import { Paper, Typography } from "@mui/material";

const UnitInfo: React.FC = () => {
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
      <Typography variant="body2">Click a unit to view details here.</Typography>
    </Paper>
  );
};

export default UnitInfo;
