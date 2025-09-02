using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.API.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Quantity must be non-negative")]
    public int Quantity { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Range(1, 1000, ErrorMessage = "Low stock threshold must be between 1 and 1000")]
    public int LowStockThreshold { get; set; } = 10;

    [StringLength(50)]
    public string? Category { get; set; }

    [StringLength(50)]
    public string? SKU { get; set; }
    //public string? Sku { get; internal set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<InventoryMovement> InventoryMovements { get; set; } = new List<InventoryMovement>();

    // Computed property
    public bool IsLowStock => Quantity <= LowStockThreshold;
}
