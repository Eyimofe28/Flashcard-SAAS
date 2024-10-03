'use client';
import React from 'react';
import { useRouter } from "next/navigation"
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { doc, collection, getDocs } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { SignedIn, UserButton } from "@clerk/nextjs";
import {
  Box,
  ThemeProvider,
  Typography,
  CardActionArea,
  CardContent,
  Grid2,
  Card,
  Container,
  Divider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  const router = useRouter();

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

  // Handle go back button
  const goBack = async () => {
    router.push('/savedFlashcardCollections'); // Change this to the actual path of your collections page
  };


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

  // get all flashcards
  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      // console.log(docs); //test
      const flashcards = [];

      // loop through the doc to get hold of cards
      // Inside getFlashcard function
      console.log(`Documents fetched: ${docs.docs.length}`); // Check how many documents are fetched
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      console.log(flashcards); // Log the flashcards array


      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);
  
  // Handle card click
  const handleCardClick = (index) => {
    // Toggle the flipped state for the clicked card
    setFlipped((prevFlipped) => {
      const newFlipped = [...prevFlipped];
      newFlipped[index] = !newFlipped[index]; // Flip the clicked card
      return newFlipped;
    });
  };


  

  // check if user or page is loaded
  if (!isLoaded || !isSignedIn) {
    return <>loading...</>;
  }

  // ------------------- ui --------------------
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h4" style={{ flexGrow: 1, fontFamily: 'Mina' }}>
              QuickFlip Flashcard Application
            </Typography>

            {/* Go Back Button */}
            <Button variant="contained" color="inherit" mt="5" onClick={goBack}>
              Go Back
            </Button>

            <Button color="inherit" mt="5" onClick={handleThemeToggle} style={{fontFamily: 'Mina'}}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>

            <SignedIn>
              <UserButton/>
            </SignedIn>

          </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: isDarkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Container>
          <Box sx={{ mt: 10 }}>
            {/* Title for the Collection */}
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: 'center',
                fontFamily: 'Mina',
                fontSize: '40px',
                fontStyle: 'normal',
                fontWeight: 700,
              }}
            >
              Flashcards saved in - <b><em>{search}</em></b> - Collection
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Divider sx={{ bgcolor: 'primary.main', width:'100%', mb:5}} />
            </Box>
            {/* dispaly cards */}
            <Grid2 container spacing={3} justifyContent="Center">
                  {flashcards.map((flashcard, index) => (
                  <Grid2 item xs={12} sm={6} md={4} lg={3} key={index}> {/* Changed from 6 to 4 for three per row */}
                    <Card sx={{ width: 380, height: 380 }}> {/* Set card dimensions */}
                    <CardActionArea onClick={() => {
                      handleCardClick(index)}}>
                        <CardContent>
                        <Box
                          sx={{
                            width: '100%',
                            overflowY: 'auto',
                            
                            // height: '70%',
                            paddingBottom: '100%',
                            position: 'relative',
                            backgroundColor: 'primary.main',
                            '& > div': {
                              transition: 'transform 0.6s',
                              transformStyle: 'preserve-3d',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.3)',
                              transform: flipped[index]
                                ? 'rotateY(180deg)'
                                : 'rotateY(0deg)',
                            },
                            '& > div > div': {
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '16px',
                              boxSizing: 'border-box',
                            },
                            '& > div > div:nth-of-type(2)': {
                              transform: 'rotateY(180deg)',
                            },
                          }}
                        >
                          <div>

                            {/*Card Front*/}
                            <div>                          
                              <QuizIcon sx={{ alignSelf: 'flex-start', color: 'white'}} />
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{ fontFamily: 'Lato' , color: 'white'}}
                              >
                                {flashcard.front}
                              </Typography>
                            </div>

                            {/*Card Back*/}
                            <div>
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{ fontFamily: 'Lato', color: 'white' }}
                              >
                                {flashcard.back}
                              </Typography>
                            </div>

                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </Container>
      </Box>

    </ThemeProvider>
  );
}