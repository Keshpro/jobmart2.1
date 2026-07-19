namespace Backend.Models {
    public class User {
        public int UserId { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public int RoleId { get; set; }
        public required Role Role { get; set; }
        public required string Username { get; set; }
    }
}
