using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNutritionPdf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PdfBase64",
                table: "NutritionPlans",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PdfFileName",
                table: "NutritionPlans",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PdfFileSize",
                table: "NutritionPlans",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PdfUploadedAt",
                table: "NutritionPlans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 29, 18, 3, 5, 968, DateTimeKind.Utc).AddTicks(4379), "$2a$11$Zx1hEu73638APuSfiIqUaur7xytyRupCsOUtR5mzw.OJNQgc5qpcy" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PdfBase64",
                table: "NutritionPlans");

            migrationBuilder.DropColumn(
                name: "PdfFileName",
                table: "NutritionPlans");

            migrationBuilder.DropColumn(
                name: "PdfFileSize",
                table: "NutritionPlans");

            migrationBuilder.DropColumn(
                name: "PdfUploadedAt",
                table: "NutritionPlans");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 25, 11, 18, 11, 830, DateTimeKind.Utc).AddTicks(2986), "$2a$11$ZPu4RNcj4Oen7SBbpv6WLeIWmFz/0uW2eg2sHIZPIPRwC8pojGTT." });
        }
    }
}
