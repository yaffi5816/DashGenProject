using DTO;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace WebApiShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> Get([FromQuery] int[]? categoryId, [FromQuery] string? description, [FromQuery] double? minPrice, [FromQuery] double? maxPrice, [FromQuery] int? limit, [FromQuery] int? page, [FromQuery] string? sortOrder)
        {
            _logger.LogInformation("GetProducts called with filters: categoryId={CategoryId}, description={Description}, minPrice={MinPrice}, maxPrice={MaxPrice}", categoryId, description, minPrice, maxPrice);
            if (categoryId != null || description != null || minPrice != null || maxPrice != null || limit != null || page != null || sortOrder != null)
            {
                var (products, total) = await _productService.GetProductsAsync(categoryId, description, minPrice, maxPrice, limit, page, sortOrder);
                return Ok(new { products, total });
            }
            var allProducts = await _productService.GetAsync();
            return Ok(new { products = allProducts, total = allProducts.Count() });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> Get(int id)
        {
            _logger.LogInformation("GetProduct called with id={Id}", id);
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                _logger.LogWarning("Product not found: id={Id}", id);
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> Post([FromBody] ProductDTO product)
        {
            _logger.LogInformation("CreateProduct called");
            var newProduct = await _productService.AddAsync(product);
            _logger.LogInformation("Product created: id={ProductId}", newProduct.ProductId);
            return CreatedAtAction(nameof(Get), new { id = newProduct.ProductId }, newProduct);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ProductDTO product)
        {
            _logger.LogInformation("UpdateProduct called for id={Id}", id);
            await _productService.UpdateAsync(id, product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("DeleteProduct called for id={Id}", id);
            await _productService.DeleteAsync(id);
            return NoContent();
        }
    }
}
