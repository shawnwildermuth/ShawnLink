using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShawnLink.Migrations
{
    public partial class AddDomain : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Domain",
                schema: "Shawn",
                table: "Redirects",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Domain",
                schema: "Shawn",
                table: "Redirects");
        }
    }
}
