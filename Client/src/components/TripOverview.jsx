import React from "react";
import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material";
import { LocationOn, Schedule, Group, AttachMoney } from "@mui/icons-material";

export default function TripOverview({ tripData, trip }) {
  // Calculate total expenses from all days
  const calculateTotalExpenses = () => {
    if (!trip || !trip.days) return 0;

    let total = 0;
    trip.days.forEach((day) => {
      if (day.items && Array.isArray(day.items)) {
        day.items.forEach((item) => {
          if (item.estCost && !isNaN(item.estCost)) {
            total += parseFloat(item.estCost);
          }
        });
      }
    });

    return total;
  };

  const totalExpenses = calculateTotalExpenses();
  return (
    <Grid item xs={12} md={8} lg={6}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: "#D74284", mb: 3, textAlign: "center" }}
          >
            Trip Overview
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "#D74284" }} />
                  <Typography variant="h6">Destination</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {tripData.destination || "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Schedule sx={{ color: "#D74284" }} />
                  <Typography variant="h6">Duration</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {tripData.startDate && tripData.endDate
                    ? `${new Date(
                        tripData.startDate
                      ).toLocaleDateString()} - ${new Date(
                        tripData.endDate
                      ).toLocaleDateString()}`
                    : "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Group sx={{ color: "#D74284" }} />
                  <Typography variant="h6">Group Size</Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {tripData.groupSize || tripData.pax || "N/A"} travelers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                />
              </Box>
            </Grid>

            {/* Total Expenses */}
            {trip && totalExpenses > 0 && (
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AttachMoney sx={{ color: "#D74284" }} />
                    <Typography variant="h6">
                      Total Estimated Expenses
                    </Typography>
                  </Box>
                  <Typography
                    variant="h7"
                    sx={{
                      fontWeight: 600,
                      color: "#D74284",
                      background:
                        "linear-gradient(135deg, rgba(206,210,118,0.1) 0%, rgba(215,121,121,0.1) 100%)",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                    }}
                  >
                    ${totalExpenses.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
