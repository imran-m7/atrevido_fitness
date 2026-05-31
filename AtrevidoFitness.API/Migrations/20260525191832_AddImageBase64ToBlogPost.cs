using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class AddImageBase64ToBlogPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageBase64",
                table: "BlogPosts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$9X54vtzpELoCeh3YGuLYje8yPBBh8.OiGu2Sw9YJivu/uPdaTMOZC");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$nHqUhaTpSV6554EydEPaR.d3Agwj5cwCUdrYQWLD7tKo9O3g9e7l2");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$QJ/00BUdc5vNqHpjGWFaF.PZhIDoiH2FljheI7usFsG0zqlrDBOwm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$NbYzy8BZGFyDNNXpkmfwKO/fdn93wg1JJDXEaqXRt9wJy4iC/mdAS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$K2dcCeJgViV0Zudaw4TFC.nhEMhD8KkODPUlSss2jB3ptSVZJFU9i");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageBase64",
                table: "BlogPosts");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$e4svQpmyNyb.Grli5hpE1.hqMpJvTqOo23/ZnEELO6rpeCPVMDuta");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$0NrDC2.R9hXAGJzJLPyGQunSmhaaRzE6INJAhSs3ZVS3./e7RrOIS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$KNqBfmKBlhPXEb/Y1JG22u6usLqjhJLkI43ff3MXsFha.ZZwpeapW");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$xeUznbLoeiDESjU.gg95C.mg4vX0uvWln3HBijdCEdDEWys7veenK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$BghqWPTsY/.ux7EfgOVJnufoy1SwQefQL.jb5RBdjqNiHgJys513.");
        }
    }
}
