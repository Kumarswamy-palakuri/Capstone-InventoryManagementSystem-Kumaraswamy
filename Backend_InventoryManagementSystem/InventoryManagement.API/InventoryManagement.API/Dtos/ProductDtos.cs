using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.API.Dtos;

public record ProductCreateDto(
    [Required][StringLength(100)] string Name,
    string? Description,
    [Range(0, int.MaxValue)] int Quantity,
    [Range(0.01, double.MaxValue)] decimal Price,
    [Range(1, 1000)] int LowStockThreshold,
    string? Category,
    string? SKU
);

public record ProductUpdateDto(
    string? Name,
    string? Description,
    int? Quantity,
    decimal? Price,
    int? LowStockThreshold,
    string? Category
);

public record ProductResponseDto(
    int Id,
    string Name,
    string? Description,
    int Quantity,
    decimal Price,
    int LowStockThreshold,
    string? Category,
    string? SKU,
    bool IsLowStock,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record InventoryMovementCreateDto(
    [Required] int ProductId,
    [Required] int Change,
    [Required] string Reason,
    Models.MovementType Type,
    string? Notes
);

public record InventoryMovementResponseDto(
    int Id,
    int ProductId,
    string ProductName,
    string UserId,
    string UserName,
    int Change,
    int PreviousQuantity,
    int NewQuantity,
    string Reason,
    Models.MovementType Type,
    DateTime Timestamp,
    string? Notes
);
