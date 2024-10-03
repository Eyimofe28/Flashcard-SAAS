"use client";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import React, {useState} from "react";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, CssBaseline, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import PricingSection from './components/pricing';
import Head from "next/head";

const lightTheme = createTheme({ 
  palette: { 
    mode: 'light', 
    primary: { main: '#6200ea'},
    background: { default: '#ffffff'}, 
  }, 
});

const darkTheme = createTheme({ 
  palette: { 
    mode: 'dark', 
    primary: { main: '#bb86fc'},
    background: { default: '#121212'}, 
  },
  components: {
    MuiAppBar: { 
      styleOverrides: { 
        root: { backgroundColor: '#bb86fc'}, 
      }},
    MuiButton: { 
      styleOverrides: { 
        root: { color: 'white'},
      }},
  }, 
});


export default function Home() {
   //State to manage theme
   const [isDarkMode, setIsDarkMode] = useState(false);
   
   // Adjust based on screen size
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

   //Touggle theme handler
   const handleThemeTouggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
   }
   
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
       {/* CssBaseline is used to set up a global style base and reset */}
      <CssBaseline />

      <AppBar position="fixed">
          <Toolbar>
            <Typography variant={isMobile ? "h5" : "h4"} style={{flexGrow: 1, fontFamily: 'Mina'}} >
              QuickFlip Flashcard Application
            </Typography>

            <SignedOut>
              <Button variant="contained" color="inherit" mt="5" href="/sign-up">Sign Up</Button>
              <Button color="inherit" mt="10" href="/sign-in">Log In</Button>
            </SignedOut>
            
            <SignedIn>
              {/* Button to view saved flashcards, visible only when signed in */}
              <Button variant="contained" color="inherit" mt="5" href="/savedFlashcardCollections">
                View Saved Flashcards
              </Button>
            </SignedIn>

            <Button color="inherit"  mt="5" onClick={handleThemeTouggle}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            
            <SignedIn>
              {/*User Login Credentials shown when signed in*/}
              <UserButton/>
            </SignedIn>
          </Toolbar>
        </AppBar>

      <Container maxWidth="100vw">
        <Head>
          <title>QuickFlip Flashcard Application</title>
          <meta name="description" content="Create flashcard from your text" />
        </Head>

        <Box align="center" sx={{mt: { xs: 17, sm: 12 }, // 20px margin-top on small screens, 12 on larger
}}>
          <Typography sx={{ fontFamily: 'Mina', fontSize: {
              xs: '25px', // font size for small screens (mobile)
              sm: '35px', // font size for larger screens (tablet and up)
            }}}>
            Boring and seemingly endless notes/topics tiring you out?<br />
            Convert them to Flashcards using QuickFlip to narrow down the pressure!
          </Typography>
        </Box>

        <Box align="center" mt={7}>
          <Typography
          // FEATURES HEADING  
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              fontFamily: 'Mina',
              fontSize: '40px',
              fontStyle: 'normal',
              fontWeight: 700,
            }}>
          ✨Key Features✨
          </Typography>
        </Box>
        
        <Box
        // FEATURES SECTION 
          sx={{
            display: 'flex', // enable flexbox
            flexDirection: { xs: 'column', sm: 'row' }, // column on small screens, row on larger
            justifyContent: 'center', // centers the boxes horizontally
            alignItems: 'center', // centers the boxes vertically
            gap: 4, // spacing between the boxes
            flexWrap: 'wrap' // allows boxes to wrap to a new row if screen is too narrow
          }} 
          mt={2}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: '30%' }, // adjust width based on screen size
              height: 'auto',
              borderRadius: '10%',
              color: 'black',
              backgroundColor: 'white',
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.45)',
              padding: 2,
            }}
          >
            <Typography sx={{ fontSize:'25px', fontFamily: 'Mina'}}>
              Better Form Of Study!<br /><br />
              Our AI-driven system takes key concepts on any topic
              and converts them into flashcards for effective studying.
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: '100%', sm: '30%' }, 
              height: 'auto',
              borderRadius: '10%',
              color: 'black',
              backgroundColor: 'white',
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.45)',
              padding: 2
            }}
          >
            <Typography sx={{ fontSize:'25px', fontFamily: 'Mina'}}>
              Most Accessible Study Tool!<br /><br />
              Study literally on-the-go from any device. Whether you&apos;re in the library
              or on the bus, your flashcards are always with you.
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: '100%', sm: '30%' }, 
              height: 'auto',
              borderRadius: '10%',
              color: 'black',
              backgroundColor: 'white',
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.45)',
              padding: 2
            }}
          >
            <Typography sx={{ fontSize:'25px', fontFamily: 'Mina'}}>
              Zero Manual Effort!<br /><br />
              Just input your text and let QuickFlip handle the rest. Get
              high-quality flashcards without the hassle of manual
              creation.
            </Typography>
          </Box>
        </Box>

        <Box align="center" my={5}>
          <SignedIn>
            <Button variant="contained" sx={{ mt: 3, fontSize: '20px' }} color="primary" href="/generateCards">
              Generate Flashcards
            </Button>
          </SignedIn>
          
          <SignedOut>
            <Button variant="contained" sx={{ mt: 3, fontSize: '20px' }} color="primary" href="/generateCards">
              Try Out Now!
            </Button>
          </SignedOut>
        </Box>

        
        <PricingSection />
        
      </Container>
    </ThemeProvider>
  );
}
