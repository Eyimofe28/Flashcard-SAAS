'use client'
import React from 'react';
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, 
         DialogContent, DialogContentText, DialogTitle, Grid2, Paper, TextField, Typography, 
         CircularProgress, AppBar, Toolbar, Divider } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { db } from "@/firebase"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore"
import { SignedIn, UserButton } from "@clerk/nextjs";
import QuizIcon from '@mui/icons-material/Quiz';

export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState("")
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Load saved flashcards from localStorage on component mount
    useEffect(() => {
        const savedFlashcards = localStorage.getItem('flashcards')
        if (savedFlashcards) {
            setFlashcards(JSON.parse(savedFlashcards))
        }
    }, [])

    // Save flashcards to localStorage whenever they change
    useEffect(() => {
        if (flashcards.length > 0) {
            localStorage.setItem('flashcards', JSON.stringify(flashcards))
        }
    }, [flashcards])

    // --------------------- event handler functions -----------------------------
    const handleSubmit = async () => {
      if (!text.trim()) {
        alert("Please enter some text to generate flashcards.");
        return;
      }
    
      // If the user is not signed in
      if (!isSignedIn) {
        const hasUsedTrial = localStorage.getItem('hasUsedTrial');
    
        // If the user has already used their free trial, show an alert
        if (hasUsedTrial) {
          alert("You've already used your free trial. Please sign in for more flashcards.");
          return;
        }
    
        // If the user has not used their free trial, allow them to generate flashcards
        alert("This is your one free trial to generate flashcards. Sign in for unlimited access!");

        // Mark that the user has used their free trial
        localStorage.setItem('hasUsedTrial', 'true');
      }
    
      // Proceed with generating flashcards if signed in or on the first trial
      setLoading(true);
      fetch('api/generate', {
        method: 'POST',
        body: text,
      })
        .then((res) => res.json())
        .then((data) => {
          setFlashcards(data);
          // Scroll to the flashcard preview section AFTER setting the flashcards
        })
        .catch((error) => {
          console.error("Error generating flashcards:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    

    const handleCardClick = (id) => {
        setFlipped((prev) =>  ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    // Modified handleOpen function to check if the user is signed in
    const handleOpen = () => {
      if (!isSignedIn) {
          alert("You must be signed in to save flashcards.");
          return;
      }
      setOpen(true);
    };


    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
      if (!name){
        alert("Please enter a name");
        return
      }
  
      const batch = writeBatch(db)
      const userDocRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(userDocRef)
  
      if (docSnap.exists()){
          const collections = docSnap.data().flashcards || []
          if (collections.find((f) => f.name === name)){
              alert("Flashcard collection with the same name already exists.")
              return
          } else {
              collections.push({name})
              batch.set(userDocRef, {flashcards: collections}, {merge: true})
          }
      } 
      else{
          batch.set(userDocRef, {flashcards: [{name}]})
      }
  
      const colRef = collection(userDocRef, name)
      flashcards.forEach((flashcard) => {
          const cardDocRef = doc(colRef)
          batch.set(cardDocRef, flashcard)
      })
  
      await batch.commit()
      handleClose()
      
      // Redirect with the name of the saved flashcard collection
      router.push(`/savedFlashcards?id=${encodeURIComponent(name)}`)
  }
  

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

    return (
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>

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

      <Box sx={{
          minHeight: '100vh',
          backgroundColor: isDarkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', py: 3
          }}>
          <Container maxWidth="md" sx={{ mt: 3, backgroundColor: "white", minHeight: "70vh", display: "flex", flexDirection: "column", position: "relative" }}>
            {/* View Saved Flashcards Button */}
            {/*To be designed here*/}

            {/*Heading*/}
            <Box align="Center" sx={{ mt: 4, mb: 3, display: "flex", flexDirection: 'column'}}>  
                <Typography sx={{ fontSize:'28px', fontFamily: 'Mina'}}>
                    What do you wanna learn today?<br /> 
                    Enter a brief text about any topic and I&apos;ll generate flashcards in an instant!
                </Typography>
            </Box>

            {/*Text Field*/}
            <Box sx={{ mb: 4, display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                <Paper sx={{ p: 4, width: "100%" }}>
                    <TextField 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        label="Enter Text" 
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2 }}/>
                    <Button
                        variant="contained" color="primary" onClick={handleSubmit} fullWidth
                        disabled={loading}> 
                        Submit
                    </Button>
                </Paper>
            </Box>

            {/*Comment*/}
            <Box align="Center" sx={{display: "flex", flexDirection: 'column'}}>  
              <Typography sx={{ fontSize:"20px", fontFamily: "Mina"}} >
                Scroll down to see flashcards :)
            </Typography>
            </Box>

        </Container>
      </Box>

      <Box sx={{
          minHeight: '100vh',
          backgroundColor: isDarkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', py: 4
          }}>
          {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
          )}

            {/* display flashcards */}
            {!loading && flashcards.length > 0 && (
              <Container>
                <Box sx={{ mt: 4 }}>       

                  {/* Flashcard Preview Heading*/}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> 
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        textAlign: 'center',
                        fontFamily: 'Mina',
                        fontSize: '40px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        color: isDarkMode ? 'white' : 'black', // Text color based on theme
                      }}
                    >
                      Flashcards Preview 👀
                    </Typography>
                  </Box>

                  {/* Divider */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Divider sx={{ bgcolor: 'primary.main', width: 800, mb: '20px' }} />
                  </Box>
                                
                  {/* Save Flashcards Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mb: 2, mx:3.5 }}  // 35px margin-left from the Typography
                      onClick={handleOpen}  // Add your save flashcards function here
                    >
                      Save Flashcards
                    </Button>
                  </Box>

                  <Grid2 container spacing={3} justifyContent="Center">
                    {flashcards.map((flashcard, index) => (
                    <Grid2 item xs={12} sm={6} md={4} lg={3} key={index}> {/* Changed from 6 to 4 for three per row */}
                      <Card sx={{ width: 330, height: 330 }}> {/* Set card dimensions */}
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
          )}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a name for your flashcards collection
                </DialogContentText>
                <TextField 
                    autoFocus
                    margin="dense"
                    label="Collection Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={saveFlashcards}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  )
}
