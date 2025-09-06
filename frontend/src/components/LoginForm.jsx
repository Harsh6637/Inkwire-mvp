import React, { useState, useContext, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, checkExistingLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (checkExistingLogin()) navigate('/dashboard');
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login({ email, password });
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#0f172a,#006d77)'
      }}
    >
      <Paper elevation={8} sx={{ p: 4, width: { xs: '92%', sm: 420 }, borderRadius: 3 }}>
        <Typography variant="h5" align="center" mb={2} color="primary">
          Inkwire — Login
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>

        <Typography variant="caption" display="block" mt={2} color="text.secondary">
          Demo credentials: <strong>JakeDoe@gmail.com</strong> / <strong>P@$$word123</strong>
        </Typography>
      </Paper>
    </Box>
  );
}
