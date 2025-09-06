import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
} from "@mui/material";
import UploadForm from "../components/UploadForm";
import ResourceList from "../components/ResourceList";
import Header from "../components/Header";
import PreviewDialog from "../components/PreviewDialog";
import "./Dashboard.css";

const DashboardPage = () => {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [resourceToRemove, setResourceToRemove] = useState(null);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const loadResources = () => {
    const stored = JSON.parse(sessionStorage.getItem("resources")) || [];
    setResources(stored);
  };

  useEffect(() => {
    loadResources();
    window.addEventListener("storage", loadResources);
    return () => window.removeEventListener("storage", loadResources);
  }, []);

  const handleRemoveClick = (res) => {
    setResourceToRemove(res);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (resourceToRemove) {
      const updatedResources = resources.filter(
        (res) => res.id !== resourceToRemove.id
      );
      setResources(updatedResources);
      sessionStorage.setItem("resources", JSON.stringify(updatedResources));
      setMessages((prev) =>
        prev.map((m) =>
          m.type === "docs"
            ? { ...m, docs: m.docs.filter((d) => d.id !== resourceToRemove.id) }
            : m
        )
      );
    }
    setRemoveDialogOpen(false);
    setResourceToRemove(null);
  };

  const handleCancelRemove = () => {
    setRemoveDialogOpen(false);
    setResourceToRemove(null);
  };

  const handlePreview = (res) => {
    setPreviewData(res);
    setOpenPreview(true);
  };

  const handleSendMessage = () => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    const currentQuery = query.toLowerCase();
    setQuery("");

    setLoading(true);

    const foundDocs = resources.filter(
      (doc) =>
        doc.name.toLowerCase().includes(currentQuery) ||
        (doc.tags &&
          doc.tags.some((tag) => tag.toLowerCase().includes(currentQuery)))
    );

    let aiResponse;
    if (foundDocs.length > 0) {
      aiResponse = {
        role: "ai",
        type: "docs",
        docs: foundDocs,
      };
    } else {
      aiResponse = {
        role: "ai",
        type: "text",
        text: "No matching documents found for your query.",
      };
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1200);
  };

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
    loadResources();
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  return (
    <Box className="bg-gray-50 min-h-screen">
      <Header />

      <Box className="dashboard-wrapper">
        <Box className="dashboard-container">
          {/* Left Panel */}
          <Box className="left-panel">
            <Button
              variant="contained"
              onClick={() => setUploadDialogOpen(true)}
              sx={{ mb: 1, borderRadius: "16px", textTransform: "none" }}
              className="upload-btn"
            >
              Upload Resource
            </Button>
            <div className="section-divider sticky" />
            <Typography
              variant="h6"
                mt={0.5}
                mb={1}
                sx={{ color: "#1e1f36", fontWeight: 600 }}
            >
              Uploaded Resources
            </Typography>
            <ResourceList resources={resources} onRemove={handleRemoveClick} />
            <div className="section-divider sticky" />
          </Box>

          {/* Right Panel */}
          <Paper className="right-panel">
            <Typography variant="h5" mb={2} className="ask-ai-header">
              Ask AI
            </Typography>

            <Box className="chat-messages">
              {messages.length === 0 && !loading && (
                <Box className="empty-chat-message">
                  <Typography color="text.secondary" textAlign="center">
                    Start a conversation by asking about your documents.
                  </Typography>
                </Box>
              )}
              {messages.map((m, i) => (
                <Box
                  key={i}
                  className={`chat-message ${m.role === "user" ? "user" : "ai"}`}
                >
                  {m.role === "ai" && m.type === "docs" ? (
                    <Box>
                      <Typography variant="body2" mb={1}>
                        Found matching documents:
                      </Typography>
                      {m.docs.map((doc) => (
                        <Box key={doc.id} className="doc-card">
                          <Typography variant="subtitle2">{doc.name}</Typography>
                          <Box className="doc-actions">
                            <Button size="small" onClick={() => handlePreview(doc)}>
                              Preview
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = doc.rawData;
                                link.download = doc.name;
                                link.click();
                              }}
                            >
                              Download
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveClick(doc)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    m.text
                  )}
                </Box>
              ))}

              {loading && (
                <Box className="chat-message ai">
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </Box>
              )}
            </Box>

            <Box className="chat-input">
              <TextField
                fullWidth
                placeholder="Ask AI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#fff" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4A90E2" },
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="btn-send"
                sx={{ borderRadius: "16px" }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleCloseUploadDialog}
        maxWidth="sm"
        fullWidth
        disableBackdropClick={false}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          onClick: (e) => {
            e.stopPropagation();
            handleCloseUploadDialog();
          }
        }}
        PaperProps={{
          sx: { borderRadius: "16px", position: "relative", zIndex: 1300 }
        }}
      >
        <DialogContent sx={{ position: "relative", minHeight: "400px", paddingBottom: "8px" }}>
          <UploadForm onSuccess={handleUploadSuccess} />
        </DialogContent>
        <DialogActions sx={{ padding: "8px 24px", marginTop: "-20px" }}>
          <Button onClick={handleCloseUploadDialog} className="upload-cancel-btn">Cancel</Button>
        </DialogActions>
      </Dialog>

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

      {/* Remove Confirmation */}
      {resourceToRemove && (
        <Dialog
          open={removeDialogOpen}
          onClose={handleCancelRemove}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Confirm Remove</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove "{resourceToRemove.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelRemove}>Cancel</Button>
            <Button color="error" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default DashboardPage;
