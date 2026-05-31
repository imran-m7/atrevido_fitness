using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedChallenges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Challenges",
                columns: new[] { "Id", "CreatedAt", "Description", "EndDate", "IsPublic", "Rules", "StartDate", "Status", "Title" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4140), "Who can lose the most weight in a month?", new DateTime(2026, 5, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4132), true, "Have fun", new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4131), "Active", "30-Day Fitness Challenge" },
                    { 2, new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4144), "Who can lose the most weight in a week?", new DateTime(2026, 5, 12, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4143), true, "Have fun", new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(4143), "Active", "Weekly Fitness Challenge" }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 27, 17, 21, 0, 780, DateTimeKind.Utc).AddTicks(3456), "$2a$11$uCDUrSmmuW7KL0HC.fqRt.yaMQlhOkM.up1tfAa.dtHQmU1BTECg6" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Challenges",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Challenges",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 19, 11, 29, 24, 703, DateTimeKind.Utc).AddTicks(8803), "$2a$11$tEXKaZmcZ/FRGd.AABA54eGMKBfH8iv5c40jgZQ6mi7KTjYodkC3C" });
        }
    }
}
