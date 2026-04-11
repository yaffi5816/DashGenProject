using DTO;

namespace Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>> GetAsync();
        Task<(IEnumerable<ProductDTO>, int)> GetProductsAsync(int[]? categoryId, string? description, double? minPrice, double? maxPrice, int? limit, int? page, string? sortOrder);
        Task<ProductDTO?> GetByIdAsync(int id);
        Task<ProductDTO> AddAsync(ProductDTO product);
        Task UpdateAsync(int id, ProductDTO product);
        Task DeleteAsync(int id);
    }
}
