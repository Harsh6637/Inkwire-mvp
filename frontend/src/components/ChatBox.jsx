import React, { useState, useContext } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemText, Chip, Stack } from '@mui/material';
import { ResourceContext } from '../context/ResourceContext';

export default function ChatBox() {
  const { resources } = useContext(ResourceContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const runSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    // search by content substring and tags
    const matched = resources.filter((r) => {
      const contentMatch = r.content && r.content.toLowerCase().includes(q);
      const tagMatch = r.tags && r.tags.some((t) => t.toLowerCase().includes(q));
      const nameMatch = r.name && r.name.toLowerCase().includes(q);
      return contentMatch || tagMatch || nameMatch;
    });

    setResults(matched);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={1}>
        Chat / Search
      </Typography>
      <TextField
        label="Ask a question or enter tag"
        placeholder='e.g. "payment", "invoice", or full-text search'
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={runSearch} sx={{ mb: 2 }}>
        Search
      </Button>

      <Typography variant="subtitle1" mb={1}>
        Results ({results.length})
      </Typography>

      <List dense>
        {results.length === 0 && <Typography color="text.secondary">No matches yet.</Typography>}
        {results.map((r) => (
          <ListItem key={r.id} alignItems="flex-start" sx={{ mb: 1, borderRadius: 1 }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1">{r.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(r.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
              }
              secondary={
                <div>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {r.content ? `${r.content.slice(0, 300)}${r.content.length > 300 ? '…' : ''}` : '(no text preview)'}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {r.tags?.map((t) => (
                      <Chip key={t} label={t} size="small" />
                    ))}
                  </Stack>
                </div>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
