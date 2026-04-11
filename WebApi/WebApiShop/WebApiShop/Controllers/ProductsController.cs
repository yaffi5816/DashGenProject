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

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult> Get([FromQuery] int[]? categoryId, [FromQuery] string? description, [FromQuery] double? minPrice, [FromQuery] double? maxPrice, [FromQuery] int? limit, [FromQuery] int? page, [FromQuery] string? sortOrder)
        {
            if (categoryId != null || description != null || minPrice != null || maxPrice != null || limit != null || page != null || sortOrder != null)
            {
                var (products, total) = await _productService.GetProductsAsync(categoryId, description, minPrice, maxPrice, limit, page, sortOrder);
                return Ok(new { products, total });
            }
            else
            {
                var products = await _productService.GetAsync();
                return Ok(new { products, total = products.Count() });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> Get(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
                return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> Post([FromBody] ProductDTO product)
        {
            var newProduct = await _productService.AddAsync(product);
            return CreatedAtAction(nameof(Get), new { id = newProduct.ProductId }, newProduct);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ProductDTO product)
        {
            await _productService.UpdateAsync(id, product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteAsync(id);
            return NoContent();
        }
    }
}
