//using InventoryManagement.API.Data;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using System.Text;
//using Microsoft.EntityFrameworkCore;
////using Microsoft.AspNetCore.Mvc;
////using Microsoft.AspNetCore.Authorization;
//using Microsoft.EntityFrameworkCore;
//using InventoryManagement.API.Models;
////using System.Text;
//namespace InventoryManagement.API.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    [Authorize(Roles = "Manager,Admin")]
//    public class ReportsController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;

//        public ReportsController(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        [HttpGet("logs.csv")]
//        public async Task<IActionResult> ExportLogsCsv([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
//        {
//            try
//            {
//                var query = _context.InventoryMovements
//                    .Include(m => m.Product)
//                    .Include(m => m.User)
//                    .AsQueryable();

//                if (startDate.HasValue)
//                    query = query.Where(m => m.Timestamp >= startDate.Value);

//                if (endDate.HasValue)
//                    query = query.Where(m => m.Timestamp <= endDate.Value.AddDays(1).AddSeconds(-1));

//                var logs = await query
//                    .OrderByDescending(m => m.Timestamp)
//                    .ToListAsync();

//                var csv = new StringBuilder();
//                csv.AppendLine("ID,Product Name,User Name,Movement Type,Change,Previous Quantity,New Quantity,Reason,Date,Notes");

//                foreach (var log in logs)
//                {
//                    var movementType = GetMovementType(log.Type);
//                    var userName = $"{log.User?.FirstName} {log.User?.LastName}".Trim();
//                    var productName = log.Product?.Name ?? "Unknown";
//                    var reason = EscapeCsvField(log.Reason ?? "");
//                    var notes = EscapeCsvField(log.Notes ?? "");

//                    csv.AppendLine($"{log.Id},\"{productName}\",\"{userName}\",\"{movementType}\",{log.Change},{log.PreviousQuantity},{log.NewQuantity},\"{reason}\",\"{log.Timestamp:yyyy-MM-dd HH:mm:ss}\",\"{notes}\"");
//                }

//                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
//                var fileName = $"inventory_logs_{DateTime.Now:yyyyMMdd_HHmmss}.csv";

//                return File(bytes, "text/csv", fileName);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, "Error generating CSV report");
//            }
//        }

//        private object GetMovementType(MovementType type)
//        {
//            throw new NotImplementedException();
//        }

//        [HttpGet("inventory.csv")]
//        public async Task<IActionResult> ExportInventoryCsv([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
//        {
//            try
//            {
//                var query = _context.Products.AsQueryable();

//                if (startDate.HasValue)
//                    query = query.Where(p => p.UpdatedAt >= startDate.Value);

//                if (endDate.HasValue)
//                    query = query.Where(p => p.UpdatedAt <= endDate.Value.AddDays(1).AddSeconds(-1));

//                var products = await query.ToListAsync();

//                var csv = new StringBuilder();
//                csv.AppendLine("ID,Name,Category,SKU,Price,Quantity,Low Stock Threshold,Is Low Stock,Last Updated");

//                foreach (var product in products)
//                {
//                    var name = EscapeCsvField(product.Name ?? "");
//                    var category = EscapeCsvField(product.Category ?? "");
//                    var sku = EscapeCsvField(product.Sku ?? "");

//                    csv.AppendLine($"{product.Id},\"{name}\",\"{category}\",\"{sku}\",{product.Price},{product.Quantity},{product.LowStockThreshold},{(product.IsLowStock ? "Yes" : "No")},\"{product.UpdatedAt:yyyy-MM-dd HH:mm:ss}\"");
//                }

//                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
//                var fileName = $"inventory_{DateTime.Now:yyyyMMdd_HHmmss}.csv";

//                return File(bytes, "text/csv", fileName);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, "Error generating CSV report");
//            }
//        }

//        private string GetMovementType(int type)
//        {
//            return type switch
//            {
//                1 => "Stock In",
//                2 => "Stock Out",
//                3 => "Adjustment",
//                4 => "Sale",
//                5 => "Return",
//                6 => "Damage",
//                _ => "Unknown"
//            };
//        }

//        private string EscapeCsvField(string field)
//        {
//            if (string.IsNullOrEmpty(field))
//                return "";

//            return field.Replace("\"", "\"\"");
//        }
//    }
//}
