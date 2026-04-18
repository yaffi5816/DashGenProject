using Services;
using Microsoft.AspNetCore.Mvc;
using DTO;

namespace WebApiShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _service;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(ICategoryService service, ILogger<CategoriesController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>Get all categories</summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CategoryDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> Get()
        {
            _logger.LogInformation("GetCategories called");
            IEnumerable<CategoryDTO> categories = await _service.GetAsync();
            if (categories != null)
                return Ok(categories);
            _logger.LogWarning("No categories found");
            return NoContent();
        }
    }
}
