import React, { useState } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import PreviewDialog from "./PreviewDialog";
import PreviewIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const ResourceList = ({ resources = [], onRemove }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handlePreview = (res) => {
    setPreviewData(res);
    setOpenPreview(true);
  };

  const renderResourceCard = (res) => (
    <Box
      key={res.id}
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid #E5E7EB",
        borderRadius: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        backgroundColor: "#FAFAFA",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: 2,
      }}
    >
      {/* Left side: File details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {res.name}
        </Typography>

        {(res.tags || []).length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Tags:
            </Typography>
            {res.tags.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                sx={{ backgroundColor: "#E5E7EB", color: "#1E1F36" }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Right side: Actions (stacked vertically) */}
      <Box
        className="doc-actions"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          flexShrink: 0,
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => handlePreview(res)}
          startIcon={<PreviewIcon />}
          fullWidth
        >
          Preview
        </Button>

        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => onRemove(res)}
          startIcon={<DeleteIcon />}
          fullWidth
        >
          Remove
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box>
      {resources.length === 0 ? (
        <Typography color="text.secondary">No resources available.</Typography>
      ) : (
        resources.map(renderResourceCard)
      )}

      {/* Preview Dialog */}
      {previewData && (
        <PreviewDialog
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          name={previewData.name}
          fileType={previewData.fileType}
          content={previewData.content}
          rawData={previewData.rawData}
        />
      )}
    </Box>
  );
};

export default ResourceList;
