using System.Collections.Generic;

public class ResumeParseRequestDto
{
    public string ResumeUrl { get; set; }
}

public class SkillExtractionRequestDto
{
    public string TextContent { get; set; }
}

public class ParsedResumeDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public List<string> Skills { get; set; }
    public int ExperienceYears { get; set; }
}

public class MatchScoreResponseDto
{
    public decimal MatchPercentage { get; set; }
    public string Summary { get; set; }
    public List<string> MissingSkills { get; set; }
}