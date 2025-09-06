import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

const PreviewDialog = ({ open, onClose, name, fileType, content, rawData }) => {
  let previewContent;

  if (fileType.startsWith("text/") && fileType !== "text/markdown") {
    previewContent = (
      <Typography sx={{ whiteSpace: "pre-wrap" }}>{content}</Typography>
    );
  } else if (fileType === "application/pdf") {
    previewContent = (
      <embed
        src={rawData}
        type="application/pdf"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    );
  } else if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    previewContent = content ? (
      <Typography sx={{ whiteSpace: "pre-wrap" }}>{content}</Typography>
    ) : (
      <Box>
        <Typography>
          Could not extract preview for this Word document. Please download:
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          href={rawData}
          download={name}
        >
          Download {name}
        </Button>
      </Box>
    );
  } else if (
    fileType === "text/markdown" ||
    fileType === "application/markdown"
  ) {
    previewContent = (
      <Box sx={{ typography: "body1" }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>
    );
  } else {
    previewContent = <Typography>No preview available</Typography>;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          width: "75vw",
          height: "75vh",
          borderRadius: "16px",
          position: "relative",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2,
          pb: 2,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{name}</Typography>
        <Button
          onClick={onClose}
          sx={{
            background: "linear-gradient(90deg, #0066FF 0%, #00C2FF 100%)",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "12px",
                padding: "6px 16px",
                textTransform: "none",
                boxShadow: "0 2px 6px rgba(0, 102, 255, 0.3)",
                "&:hover": {
                  opacity: 0.9,
                  transform: "translateY(-1px)",
                  background: "linear-gradient(90deg, #0066FF 0%, #00C2FF 100%)",
                },
          }}
        >
          CLOSE
        </Button>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          height: "calc(100% - 64px)",
          overflowY: "auto",
          pt: 2,
        }}
      >
        {previewContent}
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
