using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.API.Models;

public enum MovementType
{
    StockIn = 1,
    StockOut = 2,
    Adjustment = 3,
    Sale = 4,
    Return = 5,
    Damage = 6
}

public class InventoryMovement
{
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }
    public virtual Product Product { get; set; } = null!;

    [Required]
    public string UserId { get; set; } = string.Empty;
    public virtual User User { get; set; } = null!;

    [Range(int.MinValue, int.MaxValue, ErrorMessage = "Change value is required")]
    public int Change { get; set; } // Positive for stock in, negative for stock out

    public int PreviousQuantity { get; set; }
    public int NewQuantity { get; set; }

    [Required]
    [StringLength(200)]
    public string Reason { get; set; } = string.Empty;

    public MovementType Type { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [StringLength(500)]
    public string? Notes { get; set; }
}
