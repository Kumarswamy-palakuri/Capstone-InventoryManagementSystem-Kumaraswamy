using System.Globalization;
using System.Text;
using CsvHelper;
using InventoryManagement.API.Data;
using InventoryManagement.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager,Admin")]
public class ManagerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ManagerController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs()
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

    [HttpGet("reports/logs.csv")]
    public async Task<IActionResult> ExportLogsCsv()
    {
        var logs = await _context.InventoryMovements
            .Include(m => m.Product)
            .Include(m => m.User)
            .OrderByDescending(m => m.Timestamp)
            .Select(m => new
            {
                MovementId = m.Id,
                ProductId = m.ProductId,
                ProductName = m.Product.Name,
                UserName = $"{m.User.FirstName} {m.User.LastName}",
                UserId=m.UserId,
                Change = m.Change,
                PreviousQuantity = m.PreviousQuantity,
                NewQuantity = m.NewQuantity,
                Reason = m.Reason,
                Type = m.Type.ToString(),
                Timestamp = m.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"),
                Notes = m.Notes
            })
            .ToListAsync();

        using var memoryStream = new MemoryStream();
        using var writer = new StreamWriter(memoryStream, Encoding.UTF8);
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

        await csv.WriteRecordsAsync(logs);
        await writer.FlushAsync();

        var fileName = $"inventory-logs-{DateTime.Now:yyyyMMdd-HHmmss}.csv";
        return File(memoryStream.ToArray(), "text/csv", fileName);
    }

    [HttpGet("reports/inventory.csv")]
    public async Task<IActionResult> ExportInventoryCsv()
    {
        var products = await _context.Products
            .Select(p => new
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Quantity = p.Quantity,
                Price = p.Price,
                LowStockThreshold = p.LowStockThreshold,
                Category = p.Category,
                SKU = p.SKU,
                IsLowStock = p.Quantity <= p.LowStockThreshold,
                CreatedAt = p.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                UpdatedAt = p.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss")
            })
            .ToListAsync();

        using var memoryStream = new MemoryStream();
        using var writer = new StreamWriter(memoryStream, Encoding.UTF8);
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

        await csv.WriteRecordsAsync(products);
        await writer.FlushAsync();

        var fileName = $"inventory-{DateTime.Now:yyyyMMdd-HHmmss}.csv";
        return File(memoryStream.ToArray(), "text/csv", fileName);
    }
}
