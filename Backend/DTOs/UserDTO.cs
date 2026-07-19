namespace Backend.DTOs
{
    public class UserDTO
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public int RoleId { get; set; }
    }
}