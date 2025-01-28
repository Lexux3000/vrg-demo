import React from "react";
import { Paper, Typography, Box } from "@mui/material";

interface LogPanelProps {
  logEntries: string[]; // Array of log entries
}

const LogPanel: React.FC<LogPanelProps> = ({ logEntries }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 2,
        flex: "2 1 auto",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        maxHeight: "300px",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Log Output
      </Typography>
      <Box sx={{ overflowY: "auto", fontSize: "0.9rem", fontFamily: "monospace" }}>
        {logEntries.length > 0 ? (
          logEntries.map((entry, index) => (
            <Typography key={index} variant="body2">
              {entry}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No logs yet.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default LogPanel;
