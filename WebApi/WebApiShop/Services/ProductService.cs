using AutoMapper;
using DTO;
using Entities;
using Repositories;

namespace Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDTO>> GetAsync()
        {
            var products = await _repository.GetAsync();
            return _mapper.Map<IEnumerable<ProductDTO>>(products);
        }

        public async Task<(IEnumerable<ProductDTO>, int)> GetProductsAsync(int[]? categoryId, string? description, double? minPrice, double? maxPrice, int? limit, int? page, string? sortOrder)
        {
            var (products, total) = await _repository.GetProductsAsync(categoryId, description, minPrice, maxPrice, limit, page, sortOrder);
            var productsDTO = _mapper.Map<IEnumerable<ProductDTO>>(products);
            return (productsDTO, total);
        }

        public async Task<ProductDTO?> GetByIdAsync(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            return product != null ? _mapper.Map<ProductDTO>(product) : null;
        }

        public async Task<ProductDTO> AddAsync(ProductDTO productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            product.ProductId = 0;
            var newProduct = await _repository.AddAsync(product);
            return _mapper.Map<ProductDTO>(newProduct);
        }

        public async Task UpdateAsync(int id, ProductDTO productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            product.ProductId = id;
            await _repository.UpdateAsync(product);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
