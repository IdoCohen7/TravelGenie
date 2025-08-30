import React from "react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  CardContent,
} from "@mui/material";
import { ArrowBack, TravelExplore, Download, Hotel } from "@mui/icons-material";
import logo from "../assets/logo.png";
import TripOverview from "../components/TripOverview";
import DaysItinerary from "../components/DaysItinerary";

// Custom CircularProgressWithLabel component
function CircularProgressWithLabel({ value = 0, ...props }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant={value > 0 ? "determinate" : "indeterminate"}
        value={value}
        size={60}
        thickness={4}
        {...props}
      />
      {value > 0 && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function Trip() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { tripData } = location.state || {};
  const progressRef = useRef(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        setProgress(0);
        progressRef.current = 0;

        // Simulate realistic loading progression
        const updateProgress = (targetProgress, duration = 1000) => {
          return new Promise((resolve) => {
            const startProgress = progressRef.current;
            const difference = targetProgress - startProgress;
            const steps = Math.max(20, Math.abs(difference));
            const stepDuration = duration / steps;
            const stepIncrement = difference / steps;

            let currentStep = 0;
            const interval = setInterval(() => {
              currentStep++;
              const newProgress = startProgress + stepIncrement * currentStep;
              progressRef.current = Math.min(Math.max(newProgress, 0), 100);
              setProgress(progressRef.current);

              if (
                currentStep >= steps ||
                progressRef.current >= targetProgress
              ) {
                clearInterval(interval);
                progressRef.current = targetProgress;
                setProgress(targetProgress);
                resolve();
              }
            }, stepDuration);
          });
        };

        // Step 1: Initialize request (0-20%)
        await updateProgress(20, 800);

        // Step 2: Sending request to AI (20-40%)
        const response = await fetch("https://localhost:7014/api/ai/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        });

        await updateProgress(40, 500);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Step 3: Processing AI response (40-70%)
        await updateProgress(70, 1200);

        // Step 4: Parsing and organizing data (70-90%)
        const data = await response.json();
        console.log("Fetched trip data:", data);
        await updateProgress(90, 600);

        // Step 5: Finalizing (90-100%)
        await updateProgress(100, 400);

        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip data:", error);
        setError(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 500);
      }
    };

    if (tripData) {
      fetchTripData();
    } else {
      setLoading(false);
    }
  }, [tripData]);

  async function handleDownloadPdf() {
    try {
      setDownloading(true);

      // נשלח לשרת את התוכנית שחזרה מ-/preview (trip). אם משום מה אין – נ fallback ל-tripData
      const payload = trip ?? tripData;
      if (!payload) throw new Error("No trip data to generate PDF.");

      const res = await fetch("https://localhost:7014/api/ai/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to generate PDF (${res.status}). ${txt}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // ננסה לקחת שם קובץ מה־Content-Disposition
      const cd = res.headers.get("Content-Disposition");
      let filename = "trip.pdf";
      if (cd) {
        const m = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
        if (m) filename = decodeURIComponent(m[1] || m[2]);
      } else if (payload?.destination) {
        filename = `${payload.destination}-trip.pdf`.replace(/[^\w\-.]+/g, "_");
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  }

  function handleBookHotel() {
    try {
      const destination = trip?.destination || tripData?.destination;
      const startDate = trip?.startDate || tripData?.startDate;
      const endDate = trip?.endDate || tripData?.endDate;

      if (!destination) {
        alert("No destination found for hotel booking.");
        return;
      }

      // Format dates for booking.com (YYYY-MM-DD format)
      let checkinDate = "";
      let checkoutDate = "";

      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start)) {
          checkinDate = start.toISOString().split("T")[0];
        }
      }

      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end)) {
          checkoutDate = end.toISOString().split("T")[0];
        }
      }

      // Build booking.com URL
      let bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
        destination
      )}`;

      if (checkinDate) {
        bookingUrl += `&checkin=${checkinDate}`;
      }
      if (checkoutDate) {
        bookingUrl += `&checkout=${checkoutDate}`;
      }

      // Add number of guests if available
      const pax = trip?.pax || tripData?.pax;
      if (pax && !isNaN(pax)) {
        bookingUrl += `&group_adults=${pax}`;
      }

      // Open in new tab
      window.open(bookingUrl, "_blank");
    } catch (err) {
      console.error("Error opening hotel booking:", err);
      alert("Failed to open hotel booking. Please try again.");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #edf0b6ff 0%, #f3b2b2ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            pt: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="TravelGenie Logo"
            onClick={() => navigate("/")}
            sx={{
              width: 200,
              height: "auto",
              mb: 2,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 1,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Your Dream Trip
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontWeight: 300,
              mb: 3,
            }}
          >
            AI-generated itinerary tailored just for you
          </Typography>
        </Box>

        {loading ? (
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              p: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "40vh",
                gap: 3,
              }}
            >
              <CircularProgressWithLabel value={progress} />
              <Typography variant="h6" sx={{ color: "#D74284" }}>
                {progress < 20
                  ? "Initializing your trip request..."
                  : progress < 40
                  ? "Sending request to AI..."
                  : progress < 70
                  ? "AI is crafting your perfect itinerary..."
                  : progress < 90
                  ? "Organizing your trip details..."
                  : "Finalizing your dream trip..."}
              </Typography>
            </Box>
          </Paper>
        ) : error ? (
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Error loading trip data
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
              sx={{
                background:
                  "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                color: "white",
              }}
            >
              Go Back
            </Button>
          </Paper>
        ) : trip ? (
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Trip Header */}
            <Box
              sx={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                p: 3,
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TravelExplore sx={{ color: "#D74284", fontSize: 32 }} />
                <Typography
                  variant="h4"
                  sx={{
                    color: "#D74284",
                    fontWeight: "bold",
                    fontSize: { xs: "1.8rem", md: "2.125rem" },
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  {trip.destination || "Your Trip"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleDownloadPdf}
                  startIcon={<Download />}
                  disabled={downloading}
                  size="small"
                  sx={{
                    background:
                      "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #b4b78cff 0%, #c28d8dff 100%)",
                    },
                    minWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  {downloading ? "Downloading…" : "Download PDF"}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleBookHotel}
                  startIcon={<Hotel />}
                  size="small"
                  sx={{
                    background:
                      "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                    },
                    minWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  Book A Hotel
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBack />}
                  size="small"
                  sx={{
                    borderColor: "#D74284",
                    color: "#D74284",
                    minWidth: { xs: "100%", sm: "auto" },
                  }}
                >
                  Back
                </Button>
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} justifyContent="center">
                {/* Trip Overview */}
                <TripOverview tripData={tripData} trip={trip} />

                {/* Trip Itinerary - Dynamic Day Cards */}
                <DaysItinerary trip={trip} />
              </Grid>
            </CardContent>
          </Paper>
        ) : (
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "#D74284", mb: 2 }}>
              No trip data available.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please go back and submit the form to generate a trip.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
              sx={{
                background:
                  "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                color: "white",
              }}
            >
              Go Back to Form
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
