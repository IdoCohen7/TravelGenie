import React, { useState } from "react";
import logo from "../assets/logo.png";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Flight,
  DateRange,
  Group,
  AttachMoney,
  Favorite,
  TravelExplore,
} from "@mui/icons-material";
export default function Home() {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    pax: 1,
    groupType: "family",
    budgetTier: "medium",
    preferences: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = {
      ...formData,
      [name]: value,
    };

    // Auto-set pax based on groupType
    if (name === "groupType") {
      if (value === "solo") {
        updatedData.pax = 1;
      } else if (value === "couple") {
        updatedData.pax = 2;
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert form data to API format
    const apiPayload = {
      destination: formData.destination,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      groupType: formData.groupType,
      pax: parseInt(formData.pax),
      budgetTier: formData.budgetTier,
      preferences: formData.preferences
        ? formData.preferences
            .split(",")
            .map((pref) => pref.trim())
            .filter((pref) => pref.length > 0)
        : [],
    };

    console.log("API Payload:", apiPayload);
    // TODO: Send apiPayload to your API endpoint
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
              width: 350,
              height: "auto",
              mb: 2,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              color: "#D74284",
              fontWeight: 300,
              mb: 3,
            }}
          >
            Your AI-powered travel companion for unforgettable journeys
          </Typography>
        </Box>

        {/* Form Section */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              p: 2,
              textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#D74284",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <TravelExplore sx={{ color: "#D74284" }} />
              Plan Your Dream Trip
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Box sx={{ maxWidth: 900, mx: "auto" }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3} justifyContent="center">
                  {/* Destination */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <Flight sx={{ color: "#D74284", mr: 1 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#D74284" }}
                          fontWeight="bold"
                        >
                          Destination
                        </Typography>
                      </Box>
                      <TextField
                        name="destination"
                        label="Where would you like to go?"
                        variant="outlined"
                        fullWidth
                        value={formData.destination}
                        onChange={handleInputChange}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Card>
                  </Grid>

                  {/* Travel Dates */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <DateRange sx={{ color: "#D74284", mr: 1 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#D74284" }}
                          fontWeight="bold"
                        >
                          Travel Dates
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="startDate"
                            label="Departure Date"
                            type="date"
                            variant="outlined"
                            fullWidth
                            value={formData.startDate}
                            onChange={handleInputChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="endDate"
                            label="Return Date"
                            type="date"
                            variant="outlined"
                            fullWidth
                            value={formData.endDate}
                            onChange={handleInputChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  {/* Group Details */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <Group sx={{ color: "#D74284", mr: 1 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#D74284" }}
                          fontWeight="bold"
                        >
                          Group Details
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="pax"
                            label="Number of Travelers"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={formData.pax}
                            onChange={handleInputChange}
                            required
                            disabled={
                              formData.groupType === "solo" ||
                              formData.groupType === "couple"
                            }
                            inputProps={{ min: 1, max: 20 }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                              "& .MuiInputLabel-root": {
                                color: "#D74284",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "#D74284",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>Travel Type</InputLabel>
                            <Select
                              name="groupType"
                              value={formData.groupType}
                              onChange={handleInputChange}
                              label="Travel Type"
                              sx={{
                                borderRadius: 2,
                              }}
                            >
                              <MenuItem value="family">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  👨‍👩‍👧‍👦 Family
                                </Box>
                              </MenuItem>
                              <MenuItem value="friends">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  👥 Friends
                                </Box>
                              </MenuItem>
                              <MenuItem value="couple">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  💑 Couple
                                </Box>
                              </MenuItem>
                              <MenuItem value="solo">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  🧳 Solo
                                </Box>
                              </MenuItem>
                              <MenuItem value="business">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  💼 Business
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  {/* Budget */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <AttachMoney sx={{ color: "#D74284", mr: 1 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#D74284" }}
                          fontWeight="bold"
                        >
                          Budget Range
                        </Typography>
                      </Box>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Select Budget Tier</InputLabel>
                        <Select
                          name="budgetTier"
                          value={formData.budgetTier}
                          onChange={handleInputChange}
                          label="Select Budget Tier"
                          sx={{
                            borderRadius: 2,
                          }}
                        >
                          <MenuItem value="low">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label="$"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                              Budget-Friendly
                            </Box>
                          </MenuItem>
                          <MenuItem value="medium">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label="$$"
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                              Standard
                            </Box>
                          </MenuItem>
                          <MenuItem value="high">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label="$$$"
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                              Premium
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Card>
                  </Grid>

                  {/* Preferences */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <Favorite sx={{ color: "#D74284", mr: 1 }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#D74284" }}
                          fontWeight="bold"
                        >
                          Your Preferences
                        </Typography>
                      </Box>
                      <TextField
                        name="preferences"
                        label="What would you like to do?"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Enter your preferences separated by commas (e.g., shopping and museums, nightlife, cultural sites)"
                        value={formData.preferences}
                        onChange={handleInputChange}
                        helperText="Separate multiple preferences with commas"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Card>
                  </Grid>

                  {/* Submit Button */}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="medium"
                      sx={{
                        background:
                          "linear-gradient(135deg, #ced276ff 0%, #d77979ff 100%)",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        textTransform: "none",
                        boxShadow: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #b4b78cff 0%, #c28d8dff 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                        transition: "all 0.3s ease",
                      }}
                      startIcon={<Flight />}
                    >
                      Make My Trip Come True ✨
                    </Button>
                  </Box>
                </Grid>
              </form>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
}
