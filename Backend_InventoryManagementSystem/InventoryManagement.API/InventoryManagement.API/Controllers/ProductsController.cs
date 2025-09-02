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
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products
            .Select(p => new ProductResponseDto(
                p.Id,
                p.Name,
                p.Description,
                p.Quantity,
                p.Price,
                p.LowStockThreshold,
                p.Category,
                p.SKU,
                p.IsLowStock,
                p.CreatedAt,
                p.UpdatedAt
            ))
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound("Product not found");
        }

        var productDto = new ProductResponseDto(
            product.Id,
            product.Name,
            product.Description,
            product.Quantity,
            product.Price,
            product.LowStockThreshold,
            product.Category,
            product.SKU,
            product.IsLowStock,
            product.CreatedAt,
            product.UpdatedAt
        );

        return Ok(productDto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct(ProductCreateDto dto)
    {
        try
        {
            // Log the incoming data for debugging
            Console.WriteLine($"Creating product: {dto.Name}, Price: {dto.Price}, Quantity: {dto.Quantity}");

            // Check if SKU already exists
            if (!string.IsNullOrEmpty(dto.SKU) && await _context.Products.AnyAsync(p => p.SKU == dto.SKU))
            {
                return BadRequest(new { message = "SKU already exists" });
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Quantity = dto.Quantity,
                Price = dto.Price,
                LowStockThreshold = dto.LowStockThreshold,
                Category = dto.Category,
                SKU = dto.SKU,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var productDto = new ProductResponseDto(
                product.Id,
                product.Name,
                product.Description,
                product.Quantity,
                product.Price,
                product.LowStockThreshold,
                product.Category,
                product.SKU,
                product.IsLowStock,
                product.CreatedAt,
                product.UpdatedAt
            );

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }
        catch (Exception ex)
        {
            // Log the full exception details
            Console.WriteLine($"Error creating product: {ex.Message}");
            Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");

            return StatusCode(500, new
            {
                message = "Internal server error",
                error = ex.Message,
                innerError = ex.InnerException?.Message
            });
        }
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<IActionResult> UpdateProduct(int id, ProductUpdateDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound("Product not found");
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        // Managers can only update name and quantity
        if (userRole == "Manager")
        {
            if (dto.Name != null) product.Name = dto.Name;
            if (dto.Quantity.HasValue) product.Quantity = dto.Quantity.Value;
        }
        else // Admin can update everything
        {
            if (dto.Name != null) product.Name = dto.Name;
            if (dto.Description != null) product.Description = dto.Description;
            if (dto.Quantity.HasValue) product.Quantity = dto.Quantity.Value;
            if (dto.Price.HasValue) product.Price = dto.Price.Value;
            if (dto.LowStockThreshold.HasValue) product.LowStockThreshold = dto.LowStockThreshold.Value;
            if (dto.Category != null) product.Category = dto.Category;
        }

        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound("Product not found");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("low-stock")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<IActionResult> GetLowStockProducts()
    {
        var lowStockProducts = await _context.Products
            .Where(p => p.Quantity <= p.LowStockThreshold)
            .Select(p => new ProductResponseDto(
                p.Id,
                p.Name,
                p.Description,
                p.Quantity,
                p.Price,
                p.LowStockThreshold,
                p.Category,
                p.SKU,
                p.IsLowStock,
                p.CreatedAt,
                p.UpdatedAt
            ))
            .ToListAsync();

        return Ok(lowStockProducts);
    }
}
