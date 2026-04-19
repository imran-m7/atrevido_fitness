using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastName", "PasswordHash", "PhoneNumber", "Role" },
                values: new object[] { 1, new DateTime(2026, 4, 19, 11, 29, 24, 703, DateTimeKind.Utc).AddTicks(8803), "dika@atrevido.ba", "Dika", true, "Admin", "$2a$11$tEXKaZmcZ/FRGd.AABA54eGMKBfH8iv5c40jgZQ6mi7KTjYodkC3C", null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
