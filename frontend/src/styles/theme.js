import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0066FF' },
    secondary: { main: '#00C2FF' },
    background: { default: '#F8FAFC' },
    text: { primary: '#1E1F36', secondary: '#6B7280' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 }
  }
});

export default theme;
