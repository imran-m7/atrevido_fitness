using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedMembers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Challenges",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "EndDate", "StartDate" },
                values: new object[] { new DateTime(2026, 3, 25, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Challenges",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "EndDate", "StartDate" },
                values: new object[] { new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$bDe6Pr8.lTi8KmRl.jVWDe66n8QDSAHnpjH2y1buToVrgjVWEdLCy" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastName", "PasswordHash", "PhoneNumber", "Role" },
                values: new object[,]
                {
                    { 2, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), "sarah@atrevido.ba", "Sarah", true, "Johnson", "$2a$11$Lp7p6Dj0lZ/bu2rp2T2z6OtELLmDR59vuMCZPLwHBBS30P3GXMlmS", null, "Member" },
                    { 3, new DateTime(2026, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), "maria@atrevido.ba", "Maria", true, "Smith", "$2a$11$kB.sbvguSKkDUe2N6LNsCuEWtR1S9wc2SvWll57KdjC/gX50NJ.tm", null, "Member" },
                    { 4, new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "jennifer@atrevido.ba", "Jennifer", true, "Kane", "$2a$11$YqIZ9ag05NJ556aCi/TpXexph4zWG7.TehfFGRMTtIMLy3Ebz0sc2", null, "Member" },
                    { 5, new DateTime(2026, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), "amanda@atrevido.ba", "Amanda", true, "Ross", "$2a$11$7q0vlztTI1cLpWLIzdpMzOTOzZJ9mMlnyf0JmY6LnZCCsQtghiohi", null, "Member" }
                });

            migrationBuilder.InsertData(
                table: "ProgressEntries",
                columns: new[] { "Id", "ArmCm", "ChallengeId", "ChestCm", "CreatedAt", "EntryDate", "HipsCm", "Notes", "ThighCm", "UserId", "WaistCm", "WeightKg" },
                values: new object[,]
                {
                    { 1, 28.00m, 1, 88.00m, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 1), 96.00m, "Starting measurements", 54.00m, 2, 78.00m, 72.50m },
                    { 2, 27.80m, 1, 87.50m, new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 10), 95.00m, "Feeling great!", 53.50m, 2, 77.00m, 71.20m },
                    { 3, 27.50m, 1, 87.00m, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 20), 94.50m, "Consistent progress", 53.00m, 2, 76.00m, 70.10m },
                    { 4, 26.50m, 1, 85.00m, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 1), 92.00m, "Starting measurements", 51.00m, 3, 74.00m, 68.00m },
                    { 5, 26.00m, 1, 84.50m, new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 15), 91.00m, "Good progress", 50.50m, 3, 73.00m, 66.80m },
                    { 6, 29.00m, 1, 90.00m, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 1), 98.00m, "Starting measurements", 56.00m, 4, 80.00m, 75.00m },
                    { 7, 28.70m, 1, 89.50m, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 20), 97.00m, "Steady progress", 55.50m, 4, 79.00m, 73.50m },
                    { 8, 25.00m, 1, 83.00m, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 1), 89.00m, "Starting measurements", 49.00m, 5, 70.00m, 65.00m },
                    { 9, 24.80m, 1, 82.50m, new DateTime(2026, 4, 18, 0, 0, 0, 0, DateTimeKind.Utc), new DateOnly(2026, 4, 18), 88.50m, "Feeling lighter", 48.50m, 5, 69.50m, 64.00m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ProgressEntries",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.UpdateData(
                table: "Challenges",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "EndDate", "StartDate" },
                values: new object[] { new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4140), new DateTime(2026, 5, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4132), new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4131) });

            migrationBuilder.UpdateData(
                table: "Challenges",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "EndDate", "StartDate" },
                values: new object[] { new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4144), new DateTime(2026, 5, 12, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4143), new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4143) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(3456), "$2a$11$uCDUrSmmuW7KL0HC.fqRt.yaMQlhOkM.up1tfAa.dtHQmU1BTECg6" });
        }
    }
}
