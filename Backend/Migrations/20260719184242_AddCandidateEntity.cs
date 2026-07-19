using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidateEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_CandidateProfiles_CandidateProfileCandidateId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_CandidateProfiles_Users_UserId",
                table: "CandidateProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Resumes_CandidateProfiles_CandidateProfileCandidateId",
                table: "Resumes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CandidateProfiles",
                table: "CandidateProfiles");

            migrationBuilder.RenameTable(
                name: "CandidateProfiles",
                newName: "CandidateProfile");

            migrationBuilder.RenameIndex(
                name: "IX_CandidateProfiles_UserId",
                table: "CandidateProfile",
                newName: "IX_CandidateProfile_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CandidateProfile",
                table: "CandidateProfile",
                column: "CandidateId");

            migrationBuilder.CreateTable(
                name: "Candidates",
                columns: table => new
                {
                    CandidateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResumePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Candidates", x => x.CandidateId);
                    table.ForeignKey(
                        name: "FK_Candidates_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Candidates_UserId",
                table: "Candidates",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_CandidateProfile_CandidateProfileCandidateId",
                table: "Applications",
                column: "CandidateProfileCandidateId",
                principalTable: "CandidateProfile",
                principalColumn: "CandidateId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CandidateProfile_Users_UserId",
                table: "CandidateProfile",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Resumes_CandidateProfile_CandidateProfileCandidateId",
                table: "Resumes",
                column: "CandidateProfileCandidateId",
                principalTable: "CandidateProfile",
                principalColumn: "CandidateId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_CandidateProfile_CandidateProfileCandidateId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_CandidateProfile_Users_UserId",
                table: "CandidateProfile");

            migrationBuilder.DropForeignKey(
                name: "FK_Resumes_CandidateProfile_CandidateProfileCandidateId",
                table: "Resumes");

            migrationBuilder.DropTable(
                name: "Candidates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CandidateProfile",
                table: "CandidateProfile");

            migrationBuilder.RenameTable(
                name: "CandidateProfile",
                newName: "CandidateProfiles");

            migrationBuilder.RenameIndex(
                name: "IX_CandidateProfile_UserId",
                table: "CandidateProfiles",
                newName: "IX_CandidateProfiles_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CandidateProfiles",
                table: "CandidateProfiles",
                column: "CandidateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_CandidateProfiles_CandidateProfileCandidateId",
                table: "Applications",
                column: "CandidateProfileCandidateId",
                principalTable: "CandidateProfiles",
                principalColumn: "CandidateId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CandidateProfiles_Users_UserId",
                table: "CandidateProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Resumes_CandidateProfiles_CandidateProfileCandidateId",
                table: "Resumes",
                column: "CandidateProfileCandidateId",
                principalTable: "CandidateProfiles",
                principalColumn: "CandidateId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
