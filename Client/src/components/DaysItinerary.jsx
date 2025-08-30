import React from "react";
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  ExpandMore,
  Schedule,
  LocationOn,
  LocalActivity,
  Code,
} from "@mui/icons-material";

export default function DaysItinerary({ trip }) {
  if (!trip) return null;

  return (
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
      {trip.days &&
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
              expandIcon={<ExpandMore sx={{ color: "#D74284" }} />}
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
                    day.summary ||
                    "Daily Activities"}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* Show individual items with detailed information */}
                  {day.items && Array.isArray(day.items) && (
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
                        {day.items.map((item, itemIndex) => (
                          <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                            <Card
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                borderColor: "rgba(215,66,132,0.3)",
                                "&:hover": {
                                  borderColor: "rgba(215,66,132,0.5)",
                                  boxShadow: "0 4px 8px rgba(215,66,132,0.2)",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                {typeof item === "string" ? (
                                  <Typography
                                    variant="body2"
                                    sx={{ textAlign: "center" }}
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
                                          color: "#D74284",
                                          fontWeight: 600,
                                          mb: 1,
                                          textAlign: "center",
                                        }}
                                      >
                                        {item.title}
                                      </Typography>
                                    )}

                                    {/* Time Range */}
                                    {(item.startTime || item.endTime) && (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          mb: 1,
                                        }}
                                      >
                                        <Schedule
                                          sx={{
                                            color: "#D74284",
                                            fontSize: 16,
                                            mr: 0.5,
                                          }}
                                        />
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: "text.secondary",
                                          }}
                                        >
                                          {item.startTime || "?"} -{" "}
                                          {item.endTime || "?"}
                                        </Typography>
                                      </Box>
                                    )}

                                    {/* Location */}
                                    {item.location && (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          mb: 1,
                                        }}
                                      >
                                        <LocationOn
                                          sx={{
                                            color: "#D74284",
                                            fontSize: 16,
                                            mr: 0.5,
                                          }}
                                        />
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: "text.secondary",
                                            textAlign: "center",
                                          }}
                                        >
                                          {item.location}
                                        </Typography>
                                      </Box>
                                    )}

                                    {/* Notes */}
                                    {item.notes && (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          mb: 1,
                                          fontStyle: "italic",
                                          textAlign: "center",
                                          fontSize: "0.85rem",
                                        }}
                                      >
                                        {item.notes}
                                      </Typography>
                                    )}

                                    {/* Estimated Cost */}
                                    {item.estCost !== null &&
                                      item.estCost !== undefined &&
                                      item.estCost > 0 && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mt: 1,
                                          }}
                                        >
                                          <Chip
                                            label={`$${item.estCost}`}
                                            size="small"
                                            sx={{
                                              backgroundColor:
                                                "rgba(215,66,132,0.1)",
                                              color: "#D74284",
                                              fontWeight: 600,
                                            }}
                                          />
                                        </Box>
                                      )}
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Show any other day properties dynamically */}
                  {Object.entries(day)
                    .filter(
                      ([key, value]) =>
                        key !== "items" &&
                        key !== "title" &&
                        key !== "location" &&
                        key !== "destination" &&
                        key !== "summary" &&
                        key !== "index" &&
                        key !== "dayIndex" &&
                        !key.toLowerCase().includes("index") &&
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
                            key.slice(1).replace(/([A-Z])/g, " $1")}
                          :
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : value}
                        </Typography>
                      </Box>
                    ))}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
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
              expandIcon={<ExpandMore sx={{ color: "#D74284" }} />}
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
                    sectionKey.slice(1).replace(/([A-Z])/g, " $1")}
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
                            boxShadow: "0 4px 8px rgba(215,66,132,0.1)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          {typeof item === "object" ? (
                            Object.entries(item).map(([prop, val]) => (
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
                                  {prop.replace(/([A-Z])/g, " $1").trim()}:
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {Array.isArray(val) ? val.join(", ") : val}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2">{item}</Typography>
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
    </Grid>
  );
}
