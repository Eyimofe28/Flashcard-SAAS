"use client";
// pages/your-custom-cancel-page.js
import { Box, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation"; // Use next/navigation instead

const CancelPage = () => {
  const router = useRouter(); // This now uses next/navigation

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3" style={{fontFamily: "Mina"}}>Payment Canceled</Typography>
      <Box sx={{ mt: 4 }}>
        <Typography style={{fontFamily: "Mina"}} variant="h5">
          Your payment was canceled. You can try again or continue browsing.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => router.push("/")} // Navigating to the premium page
        >
          Go to Home Page
        </Button>
      </Box>
    </Container>
  );
};

export default CancelPage;
