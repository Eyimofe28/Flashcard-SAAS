'use client';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { db } from '@/firebase';
import {
  doc,
  collection,
  getDoc,
  setDoc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import {
  CardActionArea,
  CardContent,
  Grid2,
  Typography,
  Container,
  Card,
  ThemeProvider,
  Box,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  createTheme,
  CssBaseline
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// ------------- page to view all flashcards saved----------------------
export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false)
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
    router.push('/');
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
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        // console.log(collections); testing
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  // check if user or page is loaded
  if (!isLoaded || !isSignedIn) {
    return <>loading...</>;
  }
  // -------------------- event handler------------------

  const handleCardClick = (id) => {
    setLoading(true);
    router.push(`/savedFlashcards?id=${id}`);
    setLoading(false);
  };

  // delete a flashcard collection
  const handleDeleteClick = async (flashcardName) => {
    const confirmed = confirm(
      `You are about to delete the collection: ${flashcardName}. Are you sure?`
    );

    if (!confirmed) return;

    try {
      const batch = writeBatch(db);
      // Reference to the user doc
      const userDocRef = doc(collection(db, 'users'), user.id);
      // Get the concerned doc snapshot
      const docSnap = await getDoc(userDocRef);

      // conditions of existence and actions
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];

        // Remove the collection
        const updatedCollections = collections.filter(
          (f) => f.name !== flashcardName
        );

        // Update the user document with the new collections
        batch.set(
          userDocRef,
          { flashcards: updatedCollections },
          { merge: true }
        );

        // Ref the col of flashcards within the user's document
        const colRef = collection(db, 'users', user.id, flashcardName);
        // Delete each flashcard in the col
        const flashcardDocs = await getDocs(colRef);
        flashcardDocs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Commit the batch
        await batch.commit();

        // Update the Flashcards arr
        setFlashcards(updatedCollections);
        // alert('Collection deleted successfully!'); test
      }
    } catch (error) {
      console.error('Error deleting collection: ', error);
      alert('There was an error deleting the collection. Please try again.');
    }
  };

  // -------------------- ui------------------
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
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontFamily: 'Mina',
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'text.darker',
              mt: 10,
            }}
          >
            Your Flashcard Collections
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Divider sx={{ bgcolor: 'primary.main', width: 800 }} />
          </Box>

          {/* display collections */}
          <Grid2 container spacing={5} sx={{ mt: 5 }}>
            {flashcards.map((flashcard, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ padding: '20px' }}>
                    <Card sx={{background: 'white', width: '120%'}}>
                    <CardActionArea
                        onClick={() => {
                        handleCardClick(flashcard.name);
                        }}
                    >
                        <CardContent>
                        <Box
                            sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            }}
                        >
                            <Typography color='black' variant="h6">{flashcard.name}</Typography>
                            <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                width: '100%',
                            }}
                            >
                            <IconButton
                                onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering card click
                                handleDeleteClick(flashcard.name);
                                }}
                                disabled={loading}
                            >
                                <DeleteForeverIcon sx={{ color: 'primary.main' }} />
                            </IconButton>
                            
                            {loading && (
                              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                                  <CircularProgress />
                              </Box>
                          )}
                          
                            </Box>
                        </Box>
                        </CardContent>
                    </CardActionArea>
                    </Card>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>
    </ThemeProvider>
  );
}