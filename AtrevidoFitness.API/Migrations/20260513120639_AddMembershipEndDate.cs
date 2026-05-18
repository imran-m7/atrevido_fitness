using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMembershipEndDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "UserTrainingMemberships",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$/VqZyPDKX02LQQ0N3k4hdOCXnO2pqQf3OAQuFjsCoMX0CT2ptq5fK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$cSe47iAHw/B7wNcjLYEfJ.mNEgJSQ.OXGNnfA6KnP9XI4XSOWRA/K");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$hlHDE9lpHR4JohaHMbNT6ue7H9m4OZ2tfSNZ78JQsuqB2FqxU4dsK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$r9oq.FRzsHMzixTrBMOymOFIBGGSpBsQpsDMgJBvMk3XzUS2jvfNC");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$eLaGAYDC/U3AJNCAOZ.DKOIE1iR7.2zGPPsa8dPIB2roHIsYL.RIS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "UserTrainingMemberships");

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
    }
}
