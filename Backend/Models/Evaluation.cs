namespace Backend.Models {
    public class Evaluation {
        public int EvaluationId { get; set; }
        public int InterviewId { get; set; }
        public int Score { get; set; }
        public required string Comments { get; set; }
        public required Interview Interview { get; set; }
    }
}