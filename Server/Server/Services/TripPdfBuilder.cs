namespace Server.BL
{
    using System.Globalization;
    using System.Linq;                     
    using QuestPDF.Fluent;
    using QuestPDF.Helpers;
    using QuestPDF.Infrastructure;

    public static class TripPdfBuilder
    {
        public static byte[] Build(
            TripPlan trip,
            string? destination = null,
            DateTime? startDate = null,
            DateTime? endDate = null,
            byte[]? logoPng = null)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            // Helpers
            static bool Has(string? s) => !string.IsNullOrWhiteSpace(s);
            static string OrDash(string? s) => Has(s) ? s!.Trim() : "-";
            static string TimeOrDash(string? start, string? end)
            {
                var s = (start ?? "").Trim();
                var e = (end ?? "").Trim();
                if (s.Length == 0 && e.Length == 0) return "-";
                var sep = (s.Length > 0 && e.Length > 0) ? "–" : "";
                return $"{s}{sep}{e}";
            }

            var currency = Has(trip.currency) ? trip.currency! : "USD";
            string Money(decimal? amount) => amount is null ? "-" : FormatCurrency(amount.Value, currency);

            var safeDays = (trip.days ?? new List<TripDay>())
                           .Select(d => d ?? new TripDay(null, null, new List<TripItem>()))
                           .OrderBy(d => d.dayIndex ?? int.MaxValue)
                           .ToList();

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(28);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    // Header
                    page.Header().Height(60).PaddingBottom(10).Row(row =>
                    {
                        // Left side: Title
                        row.RelativeItem().AlignMiddle().Column(col =>
                        {
                            col.Item().Text(t =>
                                t.Span("TravelGenie — Trip Itinerary")
                                 .SemiBold().FontSize(16).FontColor("#D74284"));

                            var sub = destination ?? "Your Trip";
                            if (startDate is not null && endDate is not null)
                                sub += $" · {startDate:dd/MM/yyyy} → {endDate:dd/MM/yyyy}";

                            col.Item().Text(t => t.Span(sub).Light());
                        });

                        // Right side: Logo
                        row.ConstantItem(80).AlignMiddle().AlignRight().Element(e =>
                        {
                            if (logoPng is not null)
                            {
                                e.Height(50).Image(logoPng);  // set container height, then draw image inside
                            }
                        });
                    });




                    // Footer
                    page.Footer().AlignCenter().Text(t =>
                    {
                        t.DefaultTextStyle(s => s.Light());
                        t.Span("Page ");
                        t.CurrentPageNumber();
                        t.Span(" / ");
                        t.TotalPages();
                    });

                    // Body
                    page.Content().PaddingVertical(6).Column(col =>
                    {
                        if (trip.totalEstCost is not null)
                        {
                            col.Item().Border(1).BorderColor(Colors.Grey.Lighten3).Padding(10).Row(r =>
                            {
                                r.RelativeItem().Text(x => x.Span("Estimated Total Cost").SemiBold());
                                r.ConstantItem(140).AlignRight()
                                    .Text(x => x.Span(FormatCurrency(trip.totalEstCost.Value, currency)).SemiBold());
                            });
                        }

                        foreach (var day in safeDays)
                        {
                            var dayNum = day.dayIndex?.ToString() ?? "?";

                            col.Item().PaddingTop(10).Column(dayCol =>
                            {
                                // כותרת היום
                                dayCol.Item().Text(t =>
                                    t.Span($"Day {dayNum}")
                                     .Bold().FontSize(13).FontColor("#D74284"));

                                if (Has(day.summary))
                                {
                                    dayCol.Item().Text(t =>
                                        t.Span(day.summary!).Italic().FontColor(Colors.Grey.Darken1));
                                }

                                var items = (day.items ?? new List<TripItem>())
                                            .Select(i => i ?? new TripItem(null, null, null, null, null, null))
                                            .ToList();

                                if (items.Count == 0)
                                    return; // אין פריטים – דלג על הטבלה ליום הזה

                                dayCol.Item().PaddingTop(6).Table(table =>
                                {
                                    // columns
                                    table.ColumnsDefinition(cols =>
                                    {
                                        cols.ConstantColumn(78);    // Time
                                        cols.RelativeColumn(2.2f);  // Title / Location
                                        cols.RelativeColumn(2.2f);  // Notes
                                        cols.ConstantColumn(100);   // Est. Cost
                                    });

                                    // header
                                    table.Header(header =>
                                    {
                                        header.Cell().Element(HeaderCell).Text("Time");
                                        header.Cell().Element(HeaderCell).Text("Title / Location");
                                        header.Cell().Element(HeaderCell).Text("Notes");
                                        header.Cell().Element(HeaderCell).AlignRight().Text("Est. Cost");

                                        static IContainer HeaderCell(IContainer c) =>
                                            c.DefaultTextStyle(x => x.SemiBold())
                                             .PaddingVertical(6).PaddingHorizontal(6)
                                             .Background(Colors.Grey.Lighten3);
                                    });

                                    // rows
                                    foreach (var it in items)
                                    {
                                        // Time
                                        table.Cell().Element(Cell).Text(TimeOrDash(it.startTime, it.endTime));

                                        // Title / Location
                                        table.Cell().Element(Cell).Text(txt =>
                                        {
                                            var any = false;
                                            if (Has(it.title))
                                            {
                                                txt.Span(it.title!).SemiBold();
                                                any = true;
                                            }
                                            if (Has(it.location))
                                            {
                                                if (any) txt.Span("\n");
                                                txt.Span(it.location!).Light().FontColor(Colors.Grey.Darken1);
                                                any = true;
                                            }
                                            if (!any)
                                                txt.Span("-");
                                        });

                                        // Notes
                                        table.Cell().Element(Cell).Text(OrDash(it.notes));

                                        // Cost
                                        table.Cell().Element(c => Cell(c).AlignRight())
                                                    .Text(Money(it.estCost));
                                    }

                                    static IContainer Cell(IContainer c) =>
                                        c.PaddingVertical(6).PaddingHorizontal(6)
                                         .BorderBottom(1).BorderColor(Colors.Grey.Lighten3);
                                });
                            });
                        }
                    });
                });
            }).GeneratePdf();
        }

        private static string FormatCurrency(decimal amount, string currencyCode)
        {
            // נסה לאתר תרבות למטבע; אם לא – "USD 1,234.56"
            try
            {
                var culture = CultureInfo
                    .GetCultures(CultureTypes.SpecificCultures)
                    .Select(c => (culture: c, ri: new RegionInfo(c.LCID)))
                    .FirstOrDefault(x => x.ri.ISOCurrencySymbol.Equals(currencyCode, StringComparison.OrdinalIgnoreCase))
                    .culture;

                if (culture is not null)
                    return string.Format(culture, "{0:C}", amount);
            }
            catch { /* ignore */ }

            return $"{currencyCode} {amount:N2}";
        }
    }
}
