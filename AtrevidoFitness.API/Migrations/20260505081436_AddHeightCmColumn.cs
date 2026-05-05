using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class AddHeightCmColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
       name: "HeightCm",
       table: "ProgressEntries",
       type: "decimal(5,2)",
       precision: 5,
       scale: 2,
       nullable: true);
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$5.gnCp1pOsMNIctS4TGA6ebnpw09mWeLH.WgLrR0r3k/CiyJoS9S.");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$PTJbTKXxxe0hdGAuX4Tl6uYTOLF.kjDw1AZKl8KRNlP2RAZT0cUwC");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$NfZtgREJjjJa4ebcTuQbK.AXKimTCMybGgajKzr3dMFa7hSwfz.fG");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$OHHZgKg.IIg/KWc1H.BbuOLtT81KMpqqVsgu6L7Xbdz7aYcwiGr8G");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$59mqvjV33hK5ZX4QTGFF7ek2Z8zZ6RE/doFClOo0/hKmug9WZrqge");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
       name: "HeightCm",
       table: "ProgressEntries");
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$KefICmsWWA3i54S4DjnBoeKsu./G1CmkJhHQdRvic2N8rYO5LF6J.");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$9fX18v33rHsony3lv9xrBu3i3RQe2mPOKO5V873ggAn27g0L6jfVW");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$Tyc43W6f/X0Vw9PQ.MipxOgsKriXiIQ9K3z0nzYy/QgQqLSngy0SG");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$PQ0QXB0AYXsqBlnTR.ZOu.9eBEWUBSwGeYh.HNCNfkshPPkAjQ7SK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$4IDi7Msj/ZNdM6Jru85yhu5O5jJEo90ENDEybWwZjDOHy4FT9vYPe");
        }
    }
}
