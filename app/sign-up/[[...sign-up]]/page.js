'use client';
import { Box, Paper, Typography, Button, Container, AppBar, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import React, { useState, useEffect } from "react";
import { SignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// ---------------------- const vars -----------------
const clerkTheme = {
  variables: {
    fontSize: '16px',
  },
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6200ea' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
    text: { primary: '#000000' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#bb86fc' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#bb86fc' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { color: 'white' },
      },
    },
  },
});

export default function SignUpPage() {
  const router = useRouter();

  // Adjust based on screen size
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State to manage theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Retrieve theme preference from localStorage on mount
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Save the theme preference
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Handle go back button
  const goBack = async () => {
    router.push('/');
  };

  // ----------------- UI ------------------
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant={isMobile ? "h5" : "h4"} style={{ flexGrow: 1, fontFamily: 'Mina' }}>
            QuickFlip Flashcard Application
          </Typography>

          <Button color="inherit" mt="5" onClick={handleThemeToggle}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>

          {/* Go Back Button */}
          <Button variant="contained" color="inherit" mt="5" onClick={goBack}>
            Go Back
          </Button>
        </Toolbar>
      </AppBar>

    <Box
      sx={{
        backgroundColor: isDarkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
        minHeight: '100vh', // Ensures it covers the full height based on content
        display: 'flex',
        flexDirection: 'column',
        mt: '64px'
      }}
    >
      <Container maxWidth="100vw">
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Ensures this covers the full height based on content
            backgroundColor: 'background.default',
          }}
        >
          {/* form bg */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px 0', // Adds some padding for visual spacing
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 4,
                maxWidth: 'sm',
                width: '100%',
                backgroundColor: 'background.paper', // Paper background based on theme
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h4"
                mb="10px"
                sx={{
                  textAlign: 'center',
                  fontFamily: 'Mina',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: {
                    xs: '23px', // font size for small screens (mobile)
                    sm: '30px', // font size for larger screens (tablet and up)
                  },
                  color: isDarkMode ? 'white' : 'black', // Text color based on theme
                }}
              >
                Let&apos;s get this party started! 🤩
              </Typography>
              <SignUp appearance={{ baseTheme: clerkTheme }} />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
</ThemeProvider>
);
}
