import React, { useState } from "react";
import mammoth from "mammoth";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Box,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createResource } from "../models/resourceModel";

export default function UploadForm({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);
  const [nameOverride, setNameOverride] = useState("");
  const [errors, setErrors] = useState({ file: "", displayName: "", tags: "" });

  const allowedTypes = [
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = [".pdf", ".txt", ".md", ".doc", ".docx"];

  const stripExtension = (filename) => {
    const lastDot = filename.lastIndexOf(".");
    return lastDot === -1 ? filename : filename.substring(0, lastDot);
  };

  const handleFileChange = (f) => {
    if (!f) return;

    const fileExt = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
    const isAllowed =
      allowedTypes.includes(f.type) || allowedExtensions.includes(fileExt);

    if (!isAllowed) {
      setFile(null);
      setErrors((prev) => ({
        ...prev,
        file: `Unsupported file type: ${f.name}. Allowed types are PDF, TXT, MD, DOC, DOCX.`,
      }));
      return;
    }

    setFile(f);
    if (f) setNameOverride(stripExtension(f.name));
    setErrors((prev) => ({ ...prev, file: "", displayName: "" }));

    const input = document.getElementById("file-input");
    if (input) input.value = "";
  };

  const handleInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFileChange(f);
  };

  const handleAddTag = () => {
    const t = tagsInput.trim();
    if (!t) return;
    const newTags = t.split(",").map((x) => x.trim()).filter(Boolean);
    setTags((prev) => Array.from(new Set([...prev, ...newTags])));
    setTagsInput("");
    setErrors((prev) => ({ ...prev, tags: "" }));
  };

  const handleRemoveTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const readAsDataURL = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const readFileContent = async (f) => {
    if (!f) return { content: "", rawData: null, fileType: "unknown" };

    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();

    if (f.type.startsWith("text/") || f.type === "text/markdown" || ext === ".md") {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ content: reader.result, rawData: null, fileType: "text/markdown" });
        reader.readAsText(f);
      });
    }

    if (
      f.type === "application/msword" ||
      f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      ext === ".doc" ||
      ext === ".docx"
    ) {
      try {
        const arrayBuffer = await f.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return {
          content: result.value || "",
          rawData: await readAsDataURL(f),
          fileType:
            f.type ||
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
      } catch (err) {
        console.error("Error extracting Word text:", err);
        return {
          content: "",
          rawData: await readAsDataURL(f),
          fileType:
            f.type ||
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        };
      }
    }

    return {
      content: "",
      rawData: await readAsDataURL(f),
      fileType: f.type || "application/pdf",
    };
  };

  const handleUpload = async () => {
    let hasError = false;
    const newErrors = { file: "", displayName: "", tags: "" };

    if (!file) {
      newErrors.file = "Please select a valid file to upload.";
      hasError = true;
    }
    if (!nameOverride.trim()) {
      newErrors.displayName = "Display name is required.";
      hasError = true;
    }
    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const { content, rawData, fileType } = await readFileContent(file);

    const resource = createResource({
      name: nameOverride,
      content: content || "",
      tags,
      fileType,
      rawData,
    });

    const existing = JSON.parse(sessionStorage.getItem("resources")) || [];
    const updated = [...existing, resource];
    sessionStorage.setItem("resources", JSON.stringify(updated));

    setFile(null);
    setTags([]);
    setTagsInput("");
    setNameOverride("");
    setErrors({ file: "", displayName: "", tags: "" });

    const input = document.getElementById("file-input");
    if (input) input.value = "";

    window.dispatchEvent(new Event("storage"));

    // ✅ close upload dialog after success
    if (typeof onSuccess === "function") {
      onSuccess();
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Upload Resource
      </Typography>

      <input
        id="file-input"
        type="file"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />

      <Box
        onClick={() => document.getElementById("file-input").click()}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: "12px",
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          mb: 2,
        }}
      >
        <Typography>
          {file ? `Selected File: ${file.name}` : "Click to select a file"}
        </Typography>
      </Box>

      {errors.file && (
        <Typography variant="caption" color="error" display="block" mb={1}>
          {errors.file}
        </Typography>
      )}

      {/* Display Name */}
      <TextField
        label="Display name"
        required
        fullWidth
        value={nameOverride}
        onChange={(e) => setNameOverride(e.target.value)}
        error={!!errors.displayName}
        helperText={errors.displayName}
        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      />

      {/* Tags Input */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="Add tags (comma-separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          fullWidth
          error={!!errors.tags && tags.length === 0}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <Button
          variant="outlined"
          onClick={handleAddTag}
          startIcon={<AddIcon />}
          sx={{ borderRadius: "12px" }}
        >
          Add
        </Button>
      </Box>

      {errors.tags && tags.length === 0 && (
        <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
          {errors.tags}
        </Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
        {tags.map((t) => (
          <Chip key={t} label={t} onDelete={() => handleRemoveTag(t)} />
        ))}
      </Stack>

      {/* Upload Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleUpload}
        sx={{ mb: 2,
                  borderRadius: "12px",
                  background: "linear-gradient(90deg, #0066FF 0%, #00C2FF 100%)",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 2px 6px rgba(0, 102, 255, 0.3)",
                  "&:hover": {
                    opacity: 0.9,
                    transform: "translateY(-1px)",
                    background: "linear-gradient(90deg, #0066FF 0%, #00C2FF 100%)",
                  },
              }}
      >
        Upload to Session
      </Button>

      <Typography variant="caption" display="block" mt={1} color="text.secondary">
        Allowed file types: PDF, TXT, MD, DOC, DOCX.
        <br />
      </Typography>
    </Paper>
  );
}