public class CandidateResume {
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public int AiScore { get; set; } // AI analysis result
    public DateTime UploadedAt { get; set; } = DateTime.Now;
}