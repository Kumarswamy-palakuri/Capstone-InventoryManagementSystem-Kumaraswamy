using InventoryManagement.API.Data;
using InventoryManagement.API.Dtos;
using InventoryManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Staff,Manager,Admin")]
public class StaffController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StaffController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("movements")]
    public async Task<IActionResult> CreateMovement(InventoryMovementCreateDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null)
        {
            return NotFound("Product not found");
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var previousQuantity = product.Quantity;
        var newQuantity = previousQuantity + dto.Change;

        // Validate that the stock won't go negative
        if (newQuantity < 0)
        {
            return BadRequest("Insufficient stock. Cannot reduce quantity below zero.");
        }

        var movement = new InventoryMovement
        {
            ProductId = dto.ProductId,
            UserId = userId,
            Change = dto.Change,
            PreviousQuantity = previousQuantity,
            NewQuantity = newQuantity,
            Reason = dto.Reason,
            Type = dto.Type,
            Notes = dto.Notes
        };

        // Update product quantity
        product.Quantity = newQuantity;
        product.UpdatedAt = DateTime.UtcNow;

        _context.InventoryMovements.Add(movement);
        await _context.SaveChangesAsync();

        var movementDto = new InventoryMovementResponseDto(
            movement.Id,
            movement.ProductId,
            product.Name,
            movement.UserId,
            User.Identity!.Name!,
            movement.Change,
            movement.PreviousQuantity,
            movement.NewQuantity,
            movement.Reason,
            movement.Type,
            movement.Timestamp,
            movement.Notes
        );

        return CreatedAtAction(nameof(GetMovement), new { id = movement.Id }, movementDto);
    }

    [HttpGet("movements/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetMovement(int id)
    {
        var movement = await _context.InventoryMovements
            .Include(m => m.Product)
            .Include(m => m.User)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (movement == null)
        {
            return NotFound("Movement not found");
        }

        var movementDto = new InventoryMovementResponseDto(
            movement.Id,
            movement.ProductId,
            movement.Product.Name,
            movement.UserId,
            $"{movement.User.FirstName} {movement.User.LastName}",
            movement.Change,
            movement.PreviousQuantity,
            movement.NewQuantity,
            movement.Reason,
            movement.Type,
            movement.Timestamp,
            movement.Notes
        );

        return Ok(movementDto);
    }
    [HttpGet("movements/product/{productId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetMovementsByProductId(int productId)
    {
        try
        {
            var movements = await _context.InventoryMovements
                .Include(m => m.Product)
                .Include(m => m.User)
                .Where(m => m.ProductId == productId) // Filter by productId
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

            return Ok(movements);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("movements")]
    public async Task<IActionResult> GetUserMovements()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

        var movements = await _context.InventoryMovements
            .Include(m => m.Product)
            .Include(m => m.User)
            .Where(m => m.UserId == userId)
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

        return Ok(movements);
    }
}
//using InventoryManagement.API.Data;
//using InventoryManagement.API.Dtos;
//using InventoryManagement.API.Models;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Linq;
//using System.Security.Claims;

//namespace InventoryManagement.API.Controllers;

//[ApiController]
//[Route("api/[controller]")]
//[Authorize(Roles = "Staff,Manager,Admin")]
//public class StaffController : ControllerBase
//{
//    private readonly ApplicationDbContext _context;

//    public StaffController(ApplicationDbContext context)
//    {
//        _context = context;
//    }

//    [HttpPost("movements")]
//    public async Task<IActionResult> CreateMovement(InventoryMovementCreateDto dto)
//    {
//        var product = await _context.Products.FindAsync(dto.ProductId);
//        if (product == null)
//        {
//            return NotFound("Product not found");
//        }

//        // Validate the movement type by casting int to enum
//        if (!Enum.IsDefined(typeof(MovementType), dto.Type))
//        {
//            return BadRequest("Invalid movement type");
//        }

//        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
//        var previousQuantity = product.Quantity;
//        int newQuantity = previousQuantity;

//        // Cast int to MovementType enum for switch statement
//        var movementType = (MovementType)dto.Type;

//        // Calculate new quantity based on movement type
//        switch (movementType)
//        {
//            case MovementType.StockIn: // Stock In - ADD quantity
//                newQuantity = previousQuantity + dto.Change;
//                break;

//            case MovementType.StockOut: // Stock Out - SUBTRACT quantity
//                newQuantity = previousQuantity - dto.Change;
//                if (newQuantity < 0)
//                {
//                    return BadRequest("Insufficient stock. Cannot reduce quantity below zero.");
//                }
//                break;

//            case MovementType.Adjustment: // Adjustment - SET to exact quantity
//                newQuantity = dto.Change;
//                break;

//            case MovementType.Sale: // Sale - SUBTRACT quantity
//                newQuantity = previousQuantity - dto.Change;
//                if (newQuantity < 0)
//                {
//                    return BadRequest("Insufficient stock for sale.");
//                }
//                break;

//            case MovementType.Return: // Return - ADD quantity
//                newQuantity = previousQuantity + dto.Change;
//                break;

//            case MovementType.Damage: // Damage - SUBTRACT quantity
//                newQuantity = previousQuantity - dto.Change;
//                if (newQuantity < 0)
//                {
//                    newQuantity = 0; // Set to 0 if damage exceeds current stock
//                }
//                break;

//            default:
//                return BadRequest("Invalid movement type");
//        }

//        // Create the movement record - cast int back to enum
//        var movement = new InventoryMovement
//        {
//            ProductId = dto.ProductId,
//            UserId = userId,
//            Change = dto.Change,
//            PreviousQuantity = previousQuantity,
//            NewQuantity = newQuantity,
//            Reason = dto.Reason,
//            Type = (MovementType)dto.Type, // Cast int to enum
//            Notes = dto.Notes,
//            Timestamp = DateTime.UtcNow
//        };

//        // Update the product quantity and timestamp
//        product.Quantity = newQuantity;
//        product.UpdatedAt = DateTime.UtcNow;

//        _context.InventoryMovements.Add(movement);
//        await _context.SaveChangesAsync();

//        var movementDto = new InventoryMovementResponseDto(
//            movement.Id,
//            movement.ProductId,
//            product.Name,
//            movement.UserId,
//            User.Identity!.Name!,
//            movement.Change,
//            movement.PreviousQuantity,
//            movement.NewQuantity,
//            movement.Reason,
//            movement.Type, // Cast enum back to int for DTO
//            movement.Timestamp,
//            movement.Notes
//        );

//        return CreatedAtAction(nameof(GetMovement), new { id = movement.Id }, movementDto);
//    }

//    [HttpGet("movements/{id}")]
//    //[AllowAnonymous]
//    public async Task<IActionResult> GetMovement(int id)
//    {
//        var movement = await _context.InventoryMovements
//            .Include(m => m.Product)
//            .Include(m => m.User)
//            .FirstOrDefaultAsync(m => m.Id == id);

//        if (movement == null)
//        {
//            return NotFound("Movement not found");
//        }

//        var movementDto = new InventoryMovementResponseDto(
//            movement.Id,
//            movement.ProductId,
//            movement.Product.Name,
//            movement.UserId,
//            $"{movement.User.FirstName} {movement.User.LastName}",
//            movement.Change,
//            movement.PreviousQuantity,
//            movement.NewQuantity,
//            movement.Reason,
//            movement.Type, // Cast enum to int for DTO
//            movement.Timestamp,
//            movement.Notes
//        );

//        return Ok(movementDto);
//    }

//    [HttpGet("movements/product/{productId}")]
//    //[AllowAnonymous]
//    public async Task<IActionResult> GetMovementsByProductId(int productId)
//    {
//        try
//        {
//            var movements = await _context.InventoryMovements
//                .Include(m => m.Product)
//                .Include(m => m.User)
//                .Where(m => m.ProductId == productId)
//                .OrderByDescending(m => m.Timestamp)
//                .Select(m => new InventoryMovementResponseDto(
//                    m.Id,
//                    m.ProductId,
//                    m.Product.Name,
//                    m.UserId,
//                    $"{m.User.FirstName} {m.User.LastName}",
//                    m.Change,
//                    m.PreviousQuantity,
//                    m.NewQuantity,
//                    m.Reason,
//                    m.Type, // Cast enum to int for DTO
//                    m.Timestamp,
//                    m.Notes
//                ))
//                .ToListAsync();

//            return Ok(movements);
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, "Internal server error");
//        }
//    }

//    [HttpGet("movements")]
//    public async Task<IActionResult> GetUserMovements()
//    {
//        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

//        var movements = await _context.InventoryMovements
//            .Include(m => m.Product)
//            .Include(m => m.User)
//            .Where(m => m.UserId == userId)
//            .OrderByDescending(m => m.Timestamp)
//            .Select(m => new InventoryMovementResponseDto(
//                m.Id,
//                m.ProductId,
//                m.Product.Name,
//                m.UserId,
//                $"{m.User.FirstName} {m.User.LastName}",
//                m.Change,
//                m.PreviousQuantity,
//                m.NewQuantity,
//                m.Reason,
//                m.Type, // Cast enum to int for DTO
//                m.Timestamp,
//                m.Notes
//            ))
//            .ToListAsync();

//        return Ok(movements);
//    }
//    [HttpGet("all-movements")]
//    [Authorize(Roles = "Manager,Admin")] // Only Manager and Admin can see all movements
//    public async Task<IActionResult> GetAllMovements()
//    {
//        try
//        {
//            var movements = await _context.InventoryMovements
//                .Include(m => m.Product)
//                .Include(m => m.User)
//                .OrderByDescending(m => m.Timestamp)
//                .Select(m => new InventoryMovementResponseDto(
//                    m.Id,
//                    m.ProductId,
//                    m.Product.Name,
//                    m.UserId,
//                    $"{m.User.FirstName} {m.User.LastName}",
//                    m.Change,
//                    m.PreviousQuantity,
//                    m.NewQuantity,
//                    m.Reason,
//                    m.Type,
//                    m.Timestamp,
//                    m.Notes
//                ))
//                .ToListAsync();

//            return Ok(movements);
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, "Internal server error");
//        }
//    }
//}
