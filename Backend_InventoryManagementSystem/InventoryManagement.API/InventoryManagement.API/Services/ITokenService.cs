using InventoryManagement.API.Models;

namespace InventoryManagement.API.Services;

public interface ITokenService
{
    string CreateToken(User user);
}
