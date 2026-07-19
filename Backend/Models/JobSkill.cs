namespace Backend.Models {
    public class JobSkill {
        public int JobId { get; set; }
        public int SkillId { get; set; }
        public required JobPosting JobPosting { get; set; }
        public required Skill Skill { get; set; }
    }
}