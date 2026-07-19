using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<JobPosting> JobPostings { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<JobSkill> JobSkills { get; set; }
        public DbSet<Interview> Interviews { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<CandidateProfile>().HasKey(c => c.CandidateId);
    modelBuilder.Entity<Role>().HasKey(r => r.RoleId);
    modelBuilder.Entity<User>().HasKey(u => u.UserId);
    modelBuilder.Entity<JobPosting>().HasKey(j => j.JobId);
    modelBuilder.Entity<Application>().HasKey(a => a.ApplicationId);
    modelBuilder.Entity<Resume>().HasKey(r => r.ResumeId);
    modelBuilder.Entity<Skill>().HasKey(s => s.SkillId);
    modelBuilder.Entity<Interview>().HasKey(i => i.InterviewId);
    modelBuilder.Entity<Evaluation>().HasKey(e => e.EvaluationId);
    
    // Junction table
    modelBuilder.Entity<JobSkill>().HasKey(js => new { js.JobId, js.SkillId });
}
    }
}