import {
    Box,
    Typography,
    Grid2,
    Button,
    Paper,
  } from '@mui/material';
  import getStripe from '@/utils/get-stripe';
  
  // --------------- Pricing section --------------------
  const PricingSection = () => {
    // --------------- Pro handle function --------------------
    const handleProSubmit = async () => {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          origin: 'http://localhost:3000',
        },
      });
  
      const checkoutSessionJson = await checkoutSession.json();
  
      // check for any error
      if (checkoutSessionJson.statusCode === 500) {
        console.error(checkoutSessionJson.message);
        return;
      }
  
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });
  
      if (error) {
        console.warn(error.message);
      }
    };
  
    // --------------- UI --------------------
  
    return (
        <Box
          padding="60px 20px"
          sx={{
            backgroundColor: 'primary.background',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {/* Price cards*/}
          <Box mb={6}>
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
              Affordable Pricing!🤩
            </Typography>
          </Box>
  
          {/* cards Grid2 */}
          <Grid2
            container
            spacing={12}
            justifyContent="center"
            alignItems="center"
            sx={{
              maxWidth: 'md', // Limits the width on larger screens
              margin: '0 auto',
              mb: 6,
            }}
          >
            {/* Basic Plan */}
            <Grid2 item xs={12} sm={6} md={6}>
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  p: 4,
                  borderRadius: 4,
                  width: 300,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  color="primary.light_purple"
                  sx={{ fontWeight: 400, mb: 2, fontFamily: 'Lato' }}
                >
                  Starter
                </Typography>
                <Typography
                  color="primary.light_purple"
                  variant="h4"
                  gutterBottom
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontFamily: 'Lato',
                    fontSize: '50px',
                  }}
                >
                  Free
                </Typography>
                <Typography
                  sx={{ fontFamily: 'Lato', color: 'primary.light_purple' }}
                >
                  15 Flashcards at a time
                </Typography>
                <Typography
                  sx={{ fontFamily: 'Lato', color: 'primary.light_purple' }}
                >
                  Maximum 3 Decks
                </Typography>
                <Typography
                  sx={{ fontFamily: 'Lato', color: 'primary.light_purple' }}
                >
                  Limited Storage
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '16px',
                    color: 'primary.main',
                    boxShadow: 'none',
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: 'primary.purple',
                    },
                    mt: 5,
                    pl: 5,
                    pr: 5,
                    fontWeight: 'Bold',
                  }}
                  href="/sign-up"
                >
                  Choose Plan
                </Button>

              </Paper>
            </Grid2>
  
            {/* Pro Plan */}
            <Grid2 item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: 'primary.main',
                  p: 4,
                  color: 'white',
                  borderRadius: 4,
                  width: 300,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  color="primary.light_purple"
                  sx={{ fontWeight: 400, mb: 2, fontFamily: 'Lato' }}
                >
                  Premium
                </Typography>
                
                <Typography
                  color="primary.light_purple"
                  variant="h4"
                  gutterBottom
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    fontFamily: 'Lato',
                    fontSize: '50px',
                  }}
                >
                  $5<sub>/mo</sub>
                </Typography>

                <Typography
                  sx={{ fontFamily: 'Lato', color: 'primary.light_purple' }}
                >
                  Unlimited Flashcards
                </Typography>

                <Typography
                  sx={{ fontFamily: 'Lato', color: 'primary.light_purple' }}
                >
                  Unlimited Deck
                </Typography>

                <Typography
                  sx={{ fontFamily: 'Lato', color: 'primary.light_purple' }}
                >
                  Custom Cards
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '16px',
                    color: 'primary.main',
                    boxShadow: 'none',
                    bgcolor: 'white',
                    '&:hover': {
                      bgcolor: 'primary.purple',
                    },
                    mt: 5,
                    pl: 5,
                    pr: 5,
                    fontWeight: 'Bold',
                  }}
                  onClick={handleProSubmit}
                >
                  Choose Plan
                </Button>

              </Paper>
            </Grid2>
          </Grid2>

          <Typography variant="body1" sx={{fontSize:'25px'}}>
            🔔 Disclaimer: QuickFlip Pro Features Coming Soon.
          </Typography>
        </Box>
    );
  };
  
  export default PricingSection;