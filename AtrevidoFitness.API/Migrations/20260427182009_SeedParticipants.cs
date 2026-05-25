using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AtrevidoFitness.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedParticipants : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.InsertData(
                table: "ChallengeParticipants",
                columns: new[] { "Id", "ChallengeId", "JoinedAt", "Status", "UserId" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 2 },
                    { 2, 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 2 },
                    { 3, 1, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 3 },
                    { 4, 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 3 },
                    { 5, 1, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 4 },
                    { 6, 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 4 },
                    { 7, 1, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 5 },
                    { 8, 2, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Active", 5 }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$hYHUHmyZt4qKe2.gGFDNau9Ho2uHoLaEQE.oddlycRn4In1pV6WwC");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$eSLEcEK/fIQa2fbNq5.hzuPLdx2DQW2E6bTnyvOgI0K.1Eb/RH6hy");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$8oymNmewEY7Xrk0bkSOjuOKFGFYvJMaIsj3ly9r.bfnaYaiej35YC");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$Yq/dNl8oUgcucr8390Upw.FCcDPkgVt8zdvleho0Q0K/MvWcJRTqq");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$HKGYkNQMtvrbtA5QGc1rpuBPAajrdKh2fpiOwLBWVc08q2fCyi/b.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ChallengeParticipants",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$bDe6Pr8.lTi8KmRl.jVWDe66n8QDSAHnpjH2y1buToVrgjVWEdLCy");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$Lp7p6Dj0lZ/bu2rp2T2z6OtELLmDR59vuMCZPLwHBBS30P3GXMlmS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$kB.sbvguSKkDUe2N6LNsCuEWtR1S9wc2SvWll57KdjC/gX50NJ.tm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$YqIZ9ag05NJ556aCi/TpXexph4zWG7.TehfFGRMTtIMLy3Ebz0sc2");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$7q0vlztTI1cLpWLIzdpMzOTOzZJ9mMlnyf0JmY6LnZCCsQtghiohi");

            migrationBuilder.DeleteData(
        table: "Users",
        keyColumn: "Id",
        keyValues: new object[] { 2, 3, 4, 5 });

        }
    }
}
