import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  ArrowBack,
  LocationOn,
  Schedule,
  Group,
  AttachMoney,
  Restaurant,
  Hotel,
  LocalActivity,
  Flight,
  ExpandMore,
  TravelExplore,
  Code,
} from "@mui/icons-material";
import logo from "../assets/logo.png";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { tripData } = location.state || {};

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        setProgress(10);

        const response = await fetch("https://localhost:7014/api/ai/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        });

        setProgress(50);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched trip data:", data);
        setProgress(100);
        setTrip(data);
        setEditedTrip(data);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setTrip(editedTrip);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTrip(trip);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedTrip((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (section, index, field, value) => {
    setEditedTrip((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #edf0b6ff 0%, #f3b2b2ff 100%)",
        padding: { xs: 2, md: 4 },
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
            sx={{
              width: 200,
              height: "auto",
              mb: 2,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
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
                {progress < 50
                  ? "Sending request..."
                  : "Creating your perfect trip..."}
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
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TravelExplore sx={{ color: "#D74284", fontSize: 32 }} />
                <Typography
                  variant="h4"
                  sx={{
                    color: "#D74284",
                    fontWeight: "bold",
                  }}
                >
                  {trip.destination || "Your Trip"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBack />}
                  sx={{ borderColor: "#D74284", color: "#D74284" }}
                >
                  Back
                </Button>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      startIcon={<Save />}
                      sx={{
                        background:
                          "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      startIcon={<Cancel />}
                      sx={{ borderColor: "#D74284", color: "#D74284" }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleEdit}
                    startIcon={<Edit />}
                    sx={{
                      background:
                        "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                    }}
                  >
                    Edit Trip
                  </Button>
                )}
              </Box>
            </Box>

            <CardContent
              sx={{ p: 4 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Grid container spacing={4}>
                {/* Trip Overview */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{ color: "#D74284", mb: 3, textAlign: "center" }}
                      >
                        Trip Overview
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <LocationOn sx={{ color: "#D74284" }} />
                            <Typography variant="h6">Destination</Typography>
                          </Box>
                          {isEditing ? (
                            <TextField
                              fullWidth
                              value={editedTrip.destination || ""}
                              onChange={(e) =>
                                handleInputChange("destination", e.target.value)
                              }
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": { color: "#D74284" },
                              }}
                            />
                          ) : (
                            <Typography variant="body1" sx={{ ml: 4 }}>
                              {tripData.destination || "N/A"}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <Schedule sx={{ color: "#D74284" }} />
                            <Typography variant="h6">Duration</Typography>
                          </Box>
                          <Typography variant="body1" sx={{ ml: 4 }}>
                            {tripData.startDate && tripData.endDate
                              ? `${new Date(
                                  tripData.startDate
                                ).toLocaleDateString()} - ${new Date(
                                  tripData.endDate
                                ).toLocaleDateString()}`
                              : "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <Group sx={{ color: "#D74284" }} />
                            <Typography variant="h6">Group Size</Typography>
                          </Box>
                          <Typography variant="body1" sx={{ ml: 4 }}>
                            {tripData.pax || "N/A"} travelers
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <AttachMoney sx={{ color: "#D74284" }} />
                            <Typography variant="h6">Budget</Typography>
                          </Box>
                          <Chip
                            label={tripData.budgetTier || "N/A"}
                            color={
                              tripData.budgetTier === "low"
                                ? "success"
                                : tripData.budgetTier === "medium"
                                ? "warning"
                                : "error"
                            }
                            sx={{ ml: 4 }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Trip Itinerary - Dynamic Day Cards */}
                {trip && (
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#D74284",
                        mb: 4,
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      Your Complete Itinerary
                    </Typography>

                    {/* Render Days Dynamically */}
                    {trip.days
                      ? // If trip.days exists, use it
                        trip.days.map((day, index) => (
                          <Accordion
                            key={index}
                            sx={{
                              mb: 3,
                              borderRadius: 3,
                              background:
                                "linear-gradient(135deg, rgba(206,210,118,0.1) 0%, rgba(215,121,121,0.1) 100%)",
                              border: "1px solid rgba(215,66,132,0.2)",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, rgba(206,210,118,0.15) 0%, rgba(215,121,121,0.15) 100%)",
                                border: "1px solid rgba(215,66,132,0.3)",
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMore sx={{ color: "#D74284" }} />
                              }
                              sx={{
                                minHeight: 60,
                                "& .MuiAccordionSummary-content": { my: 2 },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Chip
                                  label={`Day ${index + 1}`}
                                  size="small"
                                  sx={{
                                    background:
                                      "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{ color: "#D74284", fontWeight: 500 }}
                                >
                                  {day.title ||
                                    day.location ||
                                    day.destination ||
                                    `${day.summary}`}
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                              <Grid container spacing={2}>
                                {/* Activities/Description */}
                                <Grid item xs={12}>
                                  {isEditing ? (
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={4}
                                      label="Day Description"
                                      value={day.description || ""}
                                      onChange={(e) =>
                                        handleNestedInputChange(
                                          "days",
                                          index,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      sx={{
                                        "& .MuiInputLabel-root": {
                                          color: "#D74284",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                          "&:hover fieldset": {
                                            borderColor: "#D74284",
                                          },
                                          "&.Mui-focused fieldset": {
                                            borderColor: "#D74284",
                                          },
                                        },
                                      }}
                                    />
                                  ) : (
                                    <Box>
                                      {/* Show individual items with detailed information */}
                                      {day.items &&
                                        Array.isArray(day.items) && (
                                          <Box sx={{ mt: 2 }}>
                                            <Typography
                                              variant="subtitle2"
                                              sx={{
                                                color: "#D74284",
                                                mb: 2,
                                                fontWeight: 600,
                                                textAlign: "center",
                                              }}
                                            >
                                              Daily Schedule:
                                            </Typography>
                                            <Grid container spacing={2}>
                                              {day.items.map(
                                                (item, itemIndex) => (
                                                  <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    key={itemIndex}
                                                  >
                                                    <Card
                                                      variant="outlined"
                                                      sx={{
                                                        borderRadius: 2,
                                                        borderColor:
                                                          "rgba(215,66,132,0.3)",
                                                        "&:hover": {
                                                          borderColor:
                                                            "rgba(215,66,132,0.5)",
                                                          boxShadow:
                                                            "0 4px 8px rgba(215,66,132,0.2)",
                                                        },
                                                      }}
                                                    >
                                                      <CardContent
                                                        sx={{ p: 2 }}
                                                      >
                                                        {typeof item ===
                                                        "string" ? (
                                                          <Typography
                                                            variant="body2"
                                                            sx={{
                                                              textAlign:
                                                                "center",
                                                            }}
                                                          >
                                                            {item}
                                                          </Typography>
                                                        ) : (
                                                          <Box>
                                                            {/* Item Title */}
                                                            {item.title && (
                                                              <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                  color:
                                                                    "#D74284",
                                                                  fontWeight: 600,
                                                                  mb: 1,
                                                                  textAlign:
                                                                    "center",
                                                                }}
                                                              >
                                                                {item.title}
                                                              </Typography>
                                                            )}

                                                            {/* Time Range */}
                                                            {(item.startTime ||
                                                              item.endTime) && (
                                                              <Box
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  alignItems:
                                                                    "center",
                                                                  justifyContent:
                                                                    "center",
                                                                  mb: 1,
                                                                }}
                                                              >
                                                                <Schedule
                                                                  sx={{
                                                                    color:
                                                                      "#D74284",
                                                                    fontSize: 16,
                                                                    mr: 0.5,
                                                                  }}
                                                                />
                                                                <Typography
                                                                  variant="caption"
                                                                  sx={{
                                                                    color:
                                                                      "text.secondary",
                                                                  }}
                                                                >
                                                                  {item.startTime ||
                                                                    "?"}{" "}
                                                                  -{" "}
                                                                  {item.endTime ||
                                                                    "?"}
                                                                </Typography>
                                                              </Box>
                                                            )}

                                                            {/* Location */}
                                                            {item.location && (
                                                              <Box
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  alignItems:
                                                                    "center",
                                                                  justifyContent:
                                                                    "center",
                                                                  mb: 1,
                                                                }}
                                                              >
                                                                <LocationOn
                                                                  sx={{
                                                                    color:
                                                                      "#D74284",
                                                                    fontSize: 16,
                                                                    mr: 0.5,
                                                                  }}
                                                                />
                                                                <Typography
                                                                  variant="caption"
                                                                  sx={{
                                                                    color:
                                                                      "text.secondary",
                                                                    textAlign:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  {
                                                                    item.location
                                                                  }
                                                                </Typography>
                                                              </Box>
                                                            )}

                                                            {/* Notes */}
                                                            {item.notes && (
                                                              <Typography
                                                                variant="body2"
                                                                sx={{
                                                                  mb: 1,
                                                                  fontStyle:
                                                                    "italic",
                                                                  textAlign:
                                                                    "center",
                                                                  fontSize:
                                                                    "0.85rem",
                                                                }}
                                                              >
                                                                {item.notes}
                                                              </Typography>
                                                            )}

                                                            {/* Estimated Cost */}
                                                            {item.estCost !==
                                                              null &&
                                                              item.estCost !==
                                                                undefined &&
                                                              item.estCost >
                                                                0 && (
                                                                <Box
                                                                  sx={{
                                                                    display:
                                                                      "flex",
                                                                    alignItems:
                                                                      "center",
                                                                    justifyContent:
                                                                      "center",
                                                                    mt: 1,
                                                                  }}
                                                                >
                                                                  <AttachMoney
                                                                    sx={{
                                                                      color:
                                                                        "#D74284",
                                                                      fontSize: 16,
                                                                      mr: 0.5,
                                                                    }}
                                                                  />
                                                                  <Chip
                                                                    label={`$${item.estCost}`}
                                                                    size="small"
                                                                    sx={{
                                                                      backgroundColor:
                                                                        "rgba(215,66,132,0.1)",
                                                                      color:
                                                                        "#D74284",
                                                                      fontWeight: 600,
                                                                    }}
                                                                  />
                                                                </Box>
                                                              )}

                                                            {/* Show any other item properties */}
                                                            {Object.entries(
                                                              item
                                                            )
                                                              .filter(
                                                                ([key]) =>
                                                                  ![
                                                                    "title",
                                                                    "startTime",
                                                                    "endTime",
                                                                    "location",
                                                                    "notes",
                                                                    "estCost",
                                                                  ].includes(
                                                                    key
                                                                  )
                                                              )
                                                              .map(
                                                                ([
                                                                  key,
                                                                  value,
                                                                ]) => (
                                                                  <Box
                                                                    key={key}
                                                                    sx={{
                                                                      mt: 1,
                                                                    }}
                                                                  >
                                                                    <Typography
                                                                      variant="caption"
                                                                      sx={{
                                                                        color:
                                                                          "#D74284",
                                                                        fontWeight: 600,
                                                                        textTransform:
                                                                          "capitalize",
                                                                      }}
                                                                    >
                                                                      {key
                                                                        .replace(
                                                                          /([A-Z])/g,
                                                                          " $1"
                                                                        )
                                                                        .trim()}
                                                                      :
                                                                    </Typography>
                                                                    <Typography
                                                                      variant="body2"
                                                                      sx={{
                                                                        fontSize:
                                                                          "0.8rem",
                                                                      }}
                                                                    >
                                                                      {typeof value ===
                                                                      "object"
                                                                        ? JSON.stringify(
                                                                            value
                                                                          )
                                                                        : value}
                                                                    </Typography>
                                                                  </Box>
                                                                )
                                                              )}
                                                          </Box>
                                                        )}
                                                      </CardContent>
                                                    </Card>
                                                  </Grid>
                                                )
                                              )}
                                            </Grid>
                                          </Box>
                                        )}

                                      {/* Show any other day properties dynamically */}
                                      {Object.entries(day)
                                        .filter(
                                          ([key, value]) =>
                                            key !== "description" &&
                                            key !== "items" &&
                                            key !== "title" &&
                                            key !== "location" &&
                                            key !== "destination" &&
                                            key !== "summary" &&
                                            key !== "dayIndex" &&
                                            value &&
                                            value !== ""
                                        )
                                        .map(([key, value]) => (
                                          <Box key={key} sx={{ mt: 2 }}>
                                            <Typography
                                              variant="subtitle2"
                                              sx={{
                                                color: "#D74284",
                                                fontWeight: 600,
                                              }}
                                            >
                                              {key.charAt(0).toUpperCase() +
                                                key
                                                  .slice(1)
                                                  .replace(/([A-Z])/g, " $1")}
                                              :
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              sx={{ mt: 0.5 }}
                                            >
                                              {typeof value === "object"
                                                ? JSON.stringify(value, null, 2)
                                                : value}
                                            </Typography>
                                          </Box>
                                        ))}
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      : // If no itinerary, try to render other day-based data structures
                        Object.entries(trip)
                          .filter(
                            ([key, value]) =>
                              Array.isArray(value) &&
                              value.length > 0 &&
                              (key.toLowerCase().includes("day") ||
                                key.toLowerCase().includes("itinerary") ||
                                key.toLowerCase().includes("schedule"))
                          )
                          .map(([key, days]) => (
                            <Box key={key} sx={{ mb: 3 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: "#D74284",
                                  mb: 2,
                                  textAlign: "center",
                                }}
                              >
                                {key.charAt(0).toUpperCase() +
                                  key.slice(1).replace(/([A-Z])/g, " $1")}
                              </Typography>
                              {days.map((day, index) => (
                                <Accordion
                                  key={index}
                                  sx={{
                                    mb: 2,
                                    borderRadius: 3,
                                    background:
                                      "linear-gradient(135deg, rgba(206,210,118,0.1) 0%, rgba(215,121,121,0.1) 100%)",
                                    border: "1px solid rgba(215,66,132,0.2)",
                                    "&:hover": {
                                      background:
                                        "linear-gradient(135deg, rgba(206,210,118,0.15) 0%, rgba(215,121,121,0.15) 100%)",
                                    },
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={
                                      <ExpandMore sx={{ color: "#D74284" }} />
                                    }
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                      }}
                                    >
                                      <Chip
                                        label={`Day ${index + 1}`}
                                        size="small"
                                        sx={{
                                          background:
                                            "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                                          color: "white",
                                          fontWeight: 600,
                                        }}
                                      />
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          color: "#D74284",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {day.title ||
                                          day.location ||
                                          day.name ||
                                          `${day.summary}`}
                                      </Typography>
                                    </Box>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12}>
                                        {/* Render all properties of this day */}
                                        {Object.entries(day).map(
                                          ([property, value]) => (
                                            <Box key={property} sx={{ mb: 2 }}>
                                              {Array.isArray(value) ? (
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 1,
                                                  }}
                                                >
                                                  {value.map(
                                                    (item, itemIndex) => (
                                                      <Chip
                                                        key={itemIndex}
                                                        label={
                                                          typeof item ===
                                                          "object"
                                                            ? JSON.stringify(
                                                                item
                                                              )
                                                            : item
                                                        }
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                          borderColor:
                                                            "#D74284",
                                                          color: "#D74284",
                                                          "&:hover": {
                                                            backgroundColor:
                                                              "rgba(215,66,132,0.1)",
                                                          },
                                                        }}
                                                      />
                                                    )
                                                  )}
                                                </Box>
                                              ) : typeof value === "object" &&
                                                value !== null ? (
                                                <Box
                                                  component="pre"
                                                  sx={{
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                    backgroundColor:
                                                      "rgba(215,66,132,0.05)",
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    fontSize: "0.85rem",
                                                    border:
                                                      "1px solid rgba(215,66,132,0.2)",
                                                  }}
                                                >
                                                  {JSON.stringify(
                                                    value,
                                                    null,
                                                    2
                                                  )}
                                                </Box>
                                              ) : (
                                                <Typography
                                                  variant="body2"
                                                  sx={{ lineHeight: 1.5 }}
                                                >
                                                  {value ||
                                                    "No information available"}
                                                </Typography>
                                              )}
                                            </Box>
                                          )
                                        )}
                                      </Grid>
                                    </Grid>
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </Box>
                          ))}

                    {/* Additional Trip Data Sections */}
                    {Object.entries(trip)
                      .filter(
                        ([key, value]) =>
                          !["currency", "totalEstCost", "days"].includes(key) &&
                          ![
                            "destination",
                            "startDate",
                            "endDate",
                            "pax",
                            "budgetTier",
                          ].includes(key) &&
                          value &&
                          (Array.isArray(value) || typeof value === "object") &&
                          (Array.isArray(value)
                            ? value.length > 0
                            : Object.keys(value).length > 0)
                      )
                      .map(([sectionKey, sectionValue]) => (
                        <Accordion
                          key={sectionKey}
                          sx={{
                            mb: 2,
                            borderRadius: 3,
                            background:
                              "linear-gradient(135deg, rgba(206,210,118,0.08) 0%, rgba(215,121,121,0.08) 100%)",
                            border: "1px solid rgba(215,66,132,0.15)",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMore sx={{ color: "#D74284" }} />
                            }
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <LocalActivity sx={{ color: "#D74284" }} />
                              <Typography
                                variant="h6"
                                sx={{ color: "#D74284", fontWeight: 500 }}
                              >
                                {sectionKey.charAt(0).toUpperCase() +
                                  sectionKey
                                    .slice(1)
                                    .replace(/([A-Z])/g, " $1")}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ px: 3, pb: 3 }}>
                            {Array.isArray(sectionValue) ? (
                              <Grid container spacing={2}>
                                {sectionValue.map((item, index) => (
                                  <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        borderRadius: 2,
                                        borderColor: "rgba(215,66,132,0.2)",
                                        "&:hover": {
                                          borderColor: "rgba(215,66,132,0.4)",
                                          boxShadow:
                                            "0 4px 8px rgba(215,66,132,0.1)",
                                        },
                                      }}
                                    >
                                      <CardContent sx={{ p: 2 }}>
                                        {typeof item === "object" ? (
                                          Object.entries(item).map(
                                            ([prop, val]) => (
                                              <Box key={prop} sx={{ mb: 1 }}>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: "#D74284",
                                                    fontWeight: 600,
                                                    textTransform: "uppercase",
                                                    letterSpacing: 0.5,
                                                  }}
                                                >
                                                  {prop
                                                    .replace(/([A-Z])/g, " $1")
                                                    .trim()}
                                                  :
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  sx={{ mt: 0.5 }}
                                                >
                                                  {Array.isArray(val)
                                                    ? val.join(", ")
                                                    : val}
                                                </Typography>
                                              </Box>
                                            )
                                          )
                                        ) : (
                                          <Typography variant="body2">
                                            {item}
                                          </Typography>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                            ) : (
                              <Box
                                component="pre"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                  backgroundColor: "rgba(215,66,132,0.05)",
                                  p: 2,
                                  borderRadius: 2,
                                  fontSize: "0.9rem",
                                  border: "1px solid rgba(215,66,132,0.1)",
                                }}
                              >
                                {JSON.stringify(sectionValue, null, 2)}
                              </Box>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ))}

                    {/* Raw Data Section - Always show for debugging */}
                    <Accordion
                      sx={{
                        borderRadius: 3,
                        background: "rgba(0,0,0,0.02)",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Code sx={{ color: "#666" }} />
                          <Typography variant="h6" sx={{ color: "#666" }}>
                            Raw API Response (Debug)
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          component="pre"
                          sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            backgroundColor: "#f8f9fa",
                            p: 2,
                            borderRadius: 2,
                            overflow: "auto",
                            fontSize: "0.75rem",
                            fontFamily: "monospace",
                            border: "1px solid #e9ecef",
                            maxHeight: 400,
                          }}
                        >
                          {JSON.stringify(
                            isEditing ? editedTrip : trip,
                            null,
                            2
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                )}
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
