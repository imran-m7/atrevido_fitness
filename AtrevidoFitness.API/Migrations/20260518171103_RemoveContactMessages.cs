using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveContactMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactMessages");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$oTALI3gYmY4j//OFPi8om.yEPRPIOHhYeulI0xlzpCkTKyCQJTtdW");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$PXyNPJU7j6blleqAo5gzz.aL.6169MoR27v1OMabQR/7xUixBmsKG");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$CtzE62AELnfdllgpu2PULu5wVIvXEMKWcLO3CrszpV/j1NQrZgkpy");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$g8eEdRhoEOjrsHZqH2/mfePiFU9KEXP//Z8lPDesLqdQ4OMSGNBJ6");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$G9qpM3dCxkPlytSP3dUPfOokgjzmIT5J5UiXcX19LGs4.Z3ZOhUdi");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });

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
    }
}
