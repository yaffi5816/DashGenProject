using Entities;

namespace Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAsync();
        Task<(IEnumerable<Product> products, int total)> GetProductsAsync(int[]? categoryId, string? description, double? minPrice, double? maxPrice, int? limit, int? page, string? sortOrder);
        Task<Product?> GetByIdAsync(int id);
        Task<Product> AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
