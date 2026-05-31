using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveNutritionRecipeAndContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NutritionRecipes");

            migrationBuilder.DropColumn(
                name: "Content",
                table: "NutritionPlans");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 29, 18, 53, 52, 964, DateTimeKind.Utc).AddTicks(4636), "$2a$11$mYgL1jico8ZwbgE7vjjo1eqNIz7hKl.AzbS2ngSA7EU2h2CLKUr7m" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "NutritionPlans",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "NutritionRecipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NutritionPlanId = table.Column<int>(type: "int", nullable: false),
                    CaloriesPerServing = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ingredients = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NutritionRecipes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NutritionRecipes_NutritionPlans_NutritionPlanId",
                        column: x => x.NutritionPlanId,
                        principalTable: "NutritionPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2026, 4, 29, 18, 3, 5, 968, DateTimeKind.Utc).AddTicks(4379), "$2a$11$Zx1hEu73638APuSfiIqUaur7xytyRupCsOUtR5mzw.OJNQgc5qpcy" });

            migrationBuilder.CreateIndex(
                name: "IX_NutritionRecipes_NutritionPlanId",
                table: "NutritionRecipes",
                column: "NutritionPlanId");
        }
    }
}
