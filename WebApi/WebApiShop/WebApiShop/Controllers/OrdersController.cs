using DTO;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace WebApiShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        /// <summary>Get all orders, or filter by userId</summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrderDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> Get([FromQuery] int? userId)
        {
            _logger.LogInformation("GetOrders called, userId={UserId}", userId);
            if (userId.HasValue)
                return Ok(await _orderService.GetByUserIdAsync(userId.Value));
            return Ok(await _orderService.GetAsync());
        }

        /// <summary>Get order by ID</summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrderDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDTO>> Get(int id)
        {
            _logger.LogInformation("GetOrder called with id={Id}", id);
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
            {
                _logger.LogWarning("Order not found: id={Id}", id);
                return NotFound();
            }
            return Ok(order);
        }

        /// <summary>Get all orders for a specific user</summary>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<OrderDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetByUserId(int userId)
        {
            _logger.LogInformation("GetByUserId called for userId={UserId}", userId);
            return Ok(await _orderService.GetByUserIdAsync(userId));
        }

        /// <summary>Get the draft order for a specific user</summary>
        [HttpGet("user/{userId}/draft")]
        [ProducesResponseType(typeof(OrderDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDTO>> GetDraftByUserId(int userId)
        {
            _logger.LogInformation("GetDraftByUserId called for userId={UserId}", userId);
            var orders = await _orderService.GetByUserIdAsync(userId);
            var draftOrder = orders.FirstOrDefault(o => !o.CurrentStatus);
            if (draftOrder == null)
            {
                _logger.LogWarning("Draft order not found for userId={UserId}", userId);
                return NotFound();
            }
            return Ok(draftOrder);
        }

        /// <summary>Create a new order</summary>
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(OrderDTO), StatusCodes.Status201Created)]
        public async Task<ActionResult<OrderDTO>> Post([FromBody] OrderDTO order)
        {
            _logger.LogInformation("CreateOrder called for userId={UserId}", order.UserId);
            var newOrder = await _orderService.AddAsync(order);
            _logger.LogInformation("Order created: id={OrderId}", newOrder.OrderId);
            return CreatedAtAction(nameof(Get), new { id = newOrder.OrderId }, newOrder);
        }

        /// <summary>Update an existing order</summary>
        [HttpPut("{id}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Put(int id, [FromBody] OrderDTO order)
        {
            _logger.LogInformation("UpdateOrder called for id={Id}", id);
            await _orderService.UpdateAsync(id, order);
            return NoContent();
        }

        /// <summary>Delete an order</summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("DeleteOrder called for id={Id}", id);
            await _orderService.DeleteAsync(id);
            return NoContent();
        }
    }
}
