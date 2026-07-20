using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixCandidateRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_CandidateProfile_CandidateProfileCandidateId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Resumes_CandidateProfile_CandidateProfileCandidateId",
                table: "Resumes");

            migrationBuilder.DropTable(
                name: "CandidateProfile");

            migrationBuilder.DropIndex(
                name: "IX_Resumes_CandidateProfileCandidateId",
                table: "Resumes");

            migrationBuilder.DropIndex(
                name: "IX_Applications_CandidateProfileCandidateId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "CandidateProfileCandidateId",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "CandidateProfileCandidateId",
                table: "Applications");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CandidateProfileCandidateId",
                table: "Resumes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CandidateProfileCandidateId",
                table: "Applications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CandidateProfile",
                columns: table => new
                {
                    CandidateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CandidateProfile", x => x.CandidateId);
                    table.ForeignKey(
                        name: "FK_CandidateProfile_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_CandidateProfileCandidateId",
                table: "Resumes",
                column: "CandidateProfileCandidateId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_CandidateProfileCandidateId",
                table: "Applications",
                column: "CandidateProfileCandidateId");

            migrationBuilder.CreateIndex(
                name: "IX_CandidateProfile_UserId",
                table: "CandidateProfile",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_CandidateProfile_CandidateProfileCandidateId",
                table: "Applications",
                column: "CandidateProfileCandidateId",
                principalTable: "CandidateProfile",
                principalColumn: "CandidateId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Resumes_CandidateProfile_CandidateProfileCandidateId",
                table: "Resumes",
                column: "CandidateProfileCandidateId",
                principalTable: "CandidateProfile",
                principalColumn: "CandidateId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
