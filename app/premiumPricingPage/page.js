"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;
      try {
        const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
        const sessionData = await res.json();

        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error.message || "Failed to retrieve session.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while retrieving the payment status.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  // Handle back navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      // Redirect to another page (replace '/your-new-page' with the page you want to redirect to)
      router.push("/cancel");
    };

    // Attach the event listener for 'beforeunload'
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router]);

  if (loading) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
      {session?.payment_status === "paid" ? (
        <>
          <Typography variant="h4">Thank you for purchasing</Typography>
          <Box sx={{ mt: 22 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email with the order details shortly.
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4" color="error">
            Payment Failed
          </Typography>
          <Box sx={{ mt: 22 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              Your payment was not successful. Please try again.
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
