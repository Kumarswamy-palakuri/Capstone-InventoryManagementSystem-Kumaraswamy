using System.ComponentModel.DataAnnotations;
using InventoryManagement.API.Models;

namespace InventoryManagement.API.Dtos;

public record UserRegistrationDto(
    [Required] string Username,
    [Required][EmailAddress] string Email,
    [Required][StringLength(100, MinimumLength = 6)] string Password,
    [Required] string FirstName,
    [Required] string LastName
);

public record UserLoginDto(
    [Required] string Username,
    [Required] string Password
);
//new 
public class UpdateUserDto
{
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } // Optional for updates

    public int Role { get; set; }
}
public record UserResponseDto(
    string Id,
    string Username,
    string Email,
    string FirstName,
    string LastName,
    UserRole Role,
    ApprovalStatus Status,
    DateTime CreatedAt
);

public record PendingUserDto(
    string Id,
    string Username,
    string Email,
    string FirstName,
    string LastName,
    DateTime CreatedAt
);

public record ApproveUserDto(
    [Required] UserRole Role
);

public record LoginResponseDto(
    string Token,
    UserResponseDto User
);
public class UpdateRoleDto
{
    [Required]
    [Range(1, 3, ErrorMessage = "Role must be between 1 and 3")]
    public int Role { get; set; } // 1 = Staff, 2 = Manager, 3 = Admin
}