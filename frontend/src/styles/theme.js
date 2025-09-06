import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0066FF' },       // blue accent like Inkwire
    secondary: { main: '#00C2FF' },     // gradient secondary
    background: { default: '#F8FAFC' }, // light gray background
    text: { primary: '#1E1F36', secondary: '#6B7280' } // dark/gray text
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 }
  }
});

export default theme;
