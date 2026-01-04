using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeIsGiving_Website2025.Migrations
{
    /// <inheritdoc />
    public partial class AddWinningModelAndUpdateAnotherModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Winnings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrizeId = table.Column<int>(type: "int", nullable: false),
                    WinnerUserId = table.Column<int>(type: "int", nullable: false),
                    LotteryDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Winnings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Winnings_Prizes_PrizeId",
                        column: x => x.PrizeId,
                        principalTable: "Prizes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Winnings_Users_WinnerUserId",
                        column: x => x.WinnerUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Winnings_PrizeId",
                table: "Winnings",
                column: "PrizeId");

            migrationBuilder.CreateIndex(
                name: "IX_Winnings_WinnerUserId",
                table: "Winnings",
                column: "WinnerUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Winnings");
        }
    }
}
