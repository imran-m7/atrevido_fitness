using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileImageToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageBase64",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "ProfileImageBase64" },
                values: new object[] { "$2a$11$e4svQpmyNyb.Grli5hpE1.hqMpJvTqOo23/ZnEELO6rpeCPVMDuta", null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "PasswordHash", "ProfileImageBase64" },
                values: new object[] { "$2a$11$0NrDC2.R9hXAGJzJLPyGQunSmhaaRzE6INJAhSs3ZVS3./e7RrOIS", null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "PasswordHash", "ProfileImageBase64" },
                values: new object[] { "$2a$11$KNqBfmKBlhPXEb/Y1JG22u6usLqjhJLkI43ff3MXsFha.ZZwpeapW", null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "PasswordHash", "ProfileImageBase64" },
                values: new object[] { "$2a$11$xeUznbLoeiDESjU.gg95C.mg4vX0uvWln3HBijdCEdDEWys7veenK", null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "PasswordHash", "ProfileImageBase64" },
                values: new object[] { "$2a$11$BghqWPTsY/.ux7EfgOVJnufoy1SwQefQL.jb5RBdjqNiHgJys513.", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageBase64",
                table: "Users");

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
    }
}
