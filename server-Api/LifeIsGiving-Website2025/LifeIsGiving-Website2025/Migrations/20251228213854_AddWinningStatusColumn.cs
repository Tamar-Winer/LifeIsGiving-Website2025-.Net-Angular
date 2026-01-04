using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeIsGiving_Website2025.Migrations
{
    /// <inheritdoc />
    public partial class AddWinningStatusColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WinningStatus",
                table: "Winnings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "CanPurchase",
                table: "Prizes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WinningStatus",
                table: "Winnings");

            migrationBuilder.DropColumn(
                name: "CanPurchase",
                table: "Prizes");
        }
    }
}
