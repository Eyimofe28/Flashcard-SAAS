{!loading && flashcards.length > 0 && (
    <Box sx={{ mt: 4 }}>
        <Typography variant="h5">
            Flashcards Preview
        </Typography>
        <Grid2 container spacing={3}>
            {flashcards.map((flashcard, index) => (
                <Grid2 item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea onClick={() => {
                            handleCardClick(index)
                        }}>
                            <CardContent>
                                <Box sx={{
                                    perspective: "1000px",
                                    '& > div': {
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                    },
                                    '& > div > div': {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: "hidden",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 2,
                                        boxSizing: 'border-box'
                                    },
                                    '& > div > div:nth-of-type(2)': {
                                        transform: 'rotateY(180deg)'
                                    }
                                }}>
                                    <div>
                                        <div>
                                            <Typography variant="h5" component="div">
                                                {flashcard.front}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h5" component="div">
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
        <Box sx={{ mt: 4, display: "flex", justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
                Save
            </Button>
        </Box>
    </Box>
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



const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }
  
    setLoading(true); // Set loading to true when the request starts
  
    try {
      const response = await fetch('api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: text }), // Use text input from your field
      });
  
      const data = await response.json();
  
      // Handle the API response, ensuring flashcards is an array
      if (data && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
      } else {
        setFlashcards([]); // In case of an unexpected response
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setFlashcards([]); // Set to empty array on error
    } finally {
      setLoading(false); // Set loading back to false after the request finishes
    }
  };



  {!loading && flashcards.length > 0 && (
    <Box sx={{ mt: 4 }}>
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
        Generated FlashCards
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Divider sx={{ bgcolor: 'primary.main', width: 800 }} />
      </Box>

      <Grid2
        container
        spacing={4}
        justifyContent="center"
        sx={{
          mt: 4,
        }}
      >
        {flashcards.map((flashcard, index) => (
          <Grid2 item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                width: '100%',
                aspectRatio: '1/1',
                backgroundColor: 'black',
              }}
            >
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent
                  sx={{
                    position: 'relative',
                    perspective: '1000px',
                    padding: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      overflowY: 'auto',
                      paddingBottom: '100%',
                      position: 'relative',
                      backgroundColor: 'black',
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
                      <div>
                        {/* <QuizIcon sx={{ alignSelf: 'flex-start' }} /> */}
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontFamily: 'Lato' }}
                        >
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontFamily: 'Lato' }}
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

      {/* Save btn */}
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          sx={{ bgcolor: 'primary.purple', mb: '20px' }}
          onClick={handleOpen}
        >
          Save Cards
        </Button>
      </Box> */}
    </Box>
  )}







  


return (
  <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
    <Box sx={{ backgroundColor: isDarkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default, minHeight: '100vh' }}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h4" style={{ flexGrow: 1, fontFamily: 'Mina' }}>
            QuickFlip Flashcard Application
          </Typography>
          <Button color="inherit" onClick={handleThemeToggle}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button variant="contained" color="inherit" onClick={goBack}>
            Go Back
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ mt: 12 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', fontFamily: 'Mina', fontWeight: 700 }}>
            Saved Flashcard Collections
          </Typography>
          <Divider sx={{ bgcolor: 'primary.main', width: 800, margin: '16px auto' }} />

          {/* Display flashcard collections as boxes */}
          <Grid2 container spacing={3} justifyContent="center">
            {collections.map((collection) => (
              <Grid2 item xs={12} sm={6} md={4} key={collection.id}>
                <Card sx={{ color: 'white', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CardActionArea onClick={() => handleCollectionClick(collection.id)}>
                    
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontFamily: 'Lato' }}>
                        {collection.name}
                      </Typography>
                    </CardContent>
                  
                  </CardActionArea>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          {selectedCollection && (
            <>
              <Typography variant="h5" sx={{ mt: 4, textAlign: 'center', fontFamily: 'Mina', fontWeight: 700 }}>
                Flashcards in Collection: {selectedCollection}
              </Typography>
              <Grid2 container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                  <Grid2 item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardActionArea>
                        <CardContent>
                          <Typography variant="h6">{flashcard.front}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {flashcard.back}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
            </>
          )}
        </Box>
      </Container>
    </Box>
  </ThemeProvider>
);
