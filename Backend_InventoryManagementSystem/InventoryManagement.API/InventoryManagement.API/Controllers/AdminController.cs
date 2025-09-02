using InventoryManagement.API.Data;
using InventoryManagement.API.Dtos;
using InventoryManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InventoryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(UserManager<User> userManager, ApplicationDbContext context, ILogger<AdminController> logger)
        {
            _userManager = userManager;
            _context = context;
            _logger = logger;
        }

        [HttpGet("approvals")]
        public async Task<IActionResult> GetPendingApprovals()
        {
            var pendingUsers = await _userManager.Users
                .Where(u => u.Status == ApprovalStatus.Pending)
                .Select(u => new PendingUserDto(
                    u.Id,
                    u.UserName!,
                    u.Email!,
                    u.FirstName,
                    u.LastName,
                    u.CreatedAt
                ))
                .ToListAsync();
            return Ok(pendingUsers);
        }

        [HttpPost("approvals/{id}/approve")]
        public async Task<IActionResult> ApproveUser(string id, ApproveUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            if (user.Status != ApprovalStatus.Pending)
            {
                return BadRequest("User is not in pending status");
            }

            user.Status = ApprovalStatus.Approved;
            user.Role = dto.Role;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Add user to role
            await _userManager.AddToRoleAsync(user, dto.Role.ToString());
            return Ok(new { message = "User approved successfully" });
        }

        [HttpPost("approvals/{id}/reject")]
        public async Task<IActionResult> RejectUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            if (user.Status != ApprovalStatus.Pending)
            {
                return BadRequest("User is not in pending status");
            }

            user.Status = ApprovalStatus.Rejected;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "User rejected successfully" });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Select(u => new UserResponseDto(
                    u.Id,
                    u.UserName!,
                    u.Email!,
                    u.FirstName,
                    u.LastName,
                    u.Role,
                    u.Status,
                    u.CreatedAt
                ))
                .ToListAsync();
            return Ok(users);
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(string id, ApproveUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Remove from current role
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            // Update role and add to new role
            user.Role = dto.Role;
            user.UpdatedAt = DateTime.UtcNow;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            await _userManager.AddToRoleAsync(user, dto.Role.ToString());
            return Ok(new { message = "User role updated successfully" });
        }

        [HttpGet("logs")]
        public async Task<IActionResult> GetAllLogs()
        {
            var logs = await _context.InventoryMovements
                .Include(m => m.Product)
                .Include(m => m.User)
                .OrderByDescending(m => m.Timestamp)
                .Select(m => new InventoryMovementResponseDto(
                    m.Id,
                    m.ProductId,
                    m.Product.Name,
                    m.UserId,
                    $"{m.User.FirstName} {m.User.LastName}",
                    m.Change,
                    m.PreviousQuantity,
                    m.NewQuantity,
                    m.Reason,
                    m.Type,
                    m.Timestamp,
                    m.Notes
                ))
                .ToListAsync();
            return Ok(logs);
        }

        /// <summary>
        /// Update user details by Admin - Fixed version using UserManager
        /// </summary>
        /// <param name="userId">User ID to update</param>
        /// <param name="updateUserDto">Updated user data</param>
        /// <returns>Success/failure response</returns>
        [HttpPut("users/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Find the user to update using UserManager
                var existingUser = await _userManager.FindByIdAsync(userId);
                if (existingUser == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Prevent admin from updating their own role to avoid lockout
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == currentUserId && ((UserRole)updateUserDto.Role != existingUser.Role))
                {
                    return BadRequest(new { message = "Cannot modify your own role" });
                }

                // Check if email is being changed and if it already exists
                if (updateUserDto.Email != existingUser.Email)
                {
                    var emailExists = await _userManager.Users
                        .AnyAsync(u => u.Email!.ToLower() == updateUserDto.Email.ToLower() && u.Id != userId);

                    if (emailExists)
                    {
                        return BadRequest(new { message = "Email already exists" });
                    }
                }

                // Update user properties
                existingUser.FirstName = updateUserDto.FirstName;
                existingUser.LastName = updateUserDto.LastName;
                existingUser.Email = updateUserDto.Email;
                existingUser.UpdatedAt = DateTime.UtcNow;

                // Handle role change using UserManager
                // ✅ Correct way
                if ((UserRole)updateUserDto.Role != existingUser.Role)

                {
                    // Remove from current roles
                    var currentRoles = await _userManager.GetRolesAsync(existingUser);
                    await _userManager.RemoveFromRolesAsync(existingUser, currentRoles);

                    // Update role property
                    // ✅ Correct way
                    existingUser.Role = (UserRole)updateUserDto.Role;


                    // Add to new role
                    await _userManager.AddToRoleAsync(existingUser, updateUserDto.Role.ToString());
                }

                // Update password if provided
                if (!string.IsNullOrEmpty(updateUserDto.Password))
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(existingUser);
                    var passwordResult = await _userManager.ResetPasswordAsync(existingUser, token, updateUserDto.Password);

                    if (!passwordResult.Succeeded)
                    {
                        return BadRequest(new { message = "Failed to update password", errors = passwordResult.Errors });
                    }
                }

                // Update the user
                var result = await _userManager.UpdateAsync(existingUser);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Failed to update user", errors = result.Errors });
                }

                _logger.LogInformation($"User {userId} updated by Admin {currentUserId}");

                return Ok(new
                {
                    message = "User updated successfully",
                    user = new
                    {
                        existingUser.Id,
                        existingUser.FirstName,
                        existingUser.LastName,
                        existingUser.Email,
                        existingUser.UserName,
                        existingUser.Role,
                        existingUser.Status,
                        existingUser.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user {userId}");
                return StatusCode(500, new { message = "Internal server error occurred" });
            }
        }

        /// <summary>
        /// Delete user by Admin - Fixed version using UserManager
        /// </summary>
        /// <param name="userId">User ID to delete</param>
        /// <returns>Success/failure response</returns>
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                // Find the user to delete using UserManager
                var userToDelete = await _userManager.FindByIdAsync(userId);
                if (userToDelete == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Prevent admin from deleting themselves
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == currentUserId)
                {
                    return BadRequest(new { message = "Cannot delete your own account" });
                }

                // Check if user has related data (movements, logs, etc.)
                var hasMovements = await _context.InventoryMovements
                    .AnyAsync(pm => pm.UserId == userId);

                if (hasMovements)
                {
                    // Soft delete - just deactivate the user instead of hard delete
                    userToDelete.Status = ApprovalStatus.Rejected; // Mark as inactive
                    userToDelete.UpdatedAt = DateTime.UtcNow;
                    userToDelete.Email = $"deleted_{DateTime.UtcNow.Ticks}_{userToDelete.Email}";
                    userToDelete.UserName = $"deleted_{DateTime.UtcNow.Ticks}_{userToDelete.UserName}";

                    var result = await _userManager.UpdateAsync(userToDelete);
                    if (!result.Succeeded)
                    {
                        return BadRequest(new { message = "Failed to deactivate user", errors = result.Errors });
                    }

                    _logger.LogInformation($"User {userId} soft deleted by Admin {currentUserId} (has related data)");

                    return Ok(new
                    {
                        message = "User deactivated successfully (user had related data)",
                        type = "soft_delete"
                    });
                }
                else
                {
                    // Hard delete - completely remove the user
                    var result = await _userManager.DeleteAsync(userToDelete);
                    if (!result.Succeeded)
                    {
                        return BadRequest(new { message = "Failed to delete user", errors = result.Errors });
                    }

                    _logger.LogInformation($"User {userId} hard deleted by Admin {currentUserId}");

                    return Ok(new
                    {
                        message = "User deleted successfully",
                        type = "hard_delete"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting user {userId}");
                return StatusCode(500, new { message = "Internal server error occurred" });
            }
        }

        /// <summary>
        /// Get user details by ID for editing - Fixed version using UserManager
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>User details</returns>
        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.UserName,
                    user.Role,
                    user.Status,
                    user.CreatedAt,
                    user.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving user {userId}");
                return StatusCode(500, new { message = "Internal server error occurred" });
            }
        }
    }
}
