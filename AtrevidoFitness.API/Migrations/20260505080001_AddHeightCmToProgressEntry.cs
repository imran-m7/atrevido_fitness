using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class AddHeightCmToProgressEntry : Migration
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
                value: "$2a$11$EAIgH8.PIEVzCxNUPdSZi.hyXW2iRdrDMraq7O7eKy732qALEQzR6");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$UuBJ/H1Oiq3jQu/ck5ti4O026fW1MxTZz5v9dKGK2cJeS2gldH6Ou");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$vUDA0J30N9f1JqGKKluZAuBPqu19pAFsFC8vjLVpjuJg2UxL6IvQq");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$VdWU21sL8pPZWxtDtKvZr.WQ2LsS5203P.ZZIrIbF2qEjfWvieGS.");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$DpakNa4qxo57xVxlNzV5g.J3vVmPj0BnGTYhXQ0Hvxhpz./M7x5wq");
        }
    }
}
