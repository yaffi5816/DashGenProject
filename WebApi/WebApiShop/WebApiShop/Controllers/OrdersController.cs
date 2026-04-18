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

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>Get all orders, or filter by userId</summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrderDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> Get([FromQuery] int? userId)
        {
            if (userId.HasValue)
            {
                var userOrders = await _orderService.GetByUserIdAsync(userId.Value);
                return Ok(userOrders);
            }
            var orders = await _orderService.GetAsync();
            return Ok(orders);
        }

        /// <summary>Get order by ID</summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrderDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDTO>> Get(int id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
                return NotFound();
            return Ok(order);
        }

        /// <summary>Get all orders for a specific user</summary>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<OrderDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetByUserId(int userId)
        {
            var orders = await _orderService.GetByUserIdAsync(userId);
            return Ok(orders);
        }

        /// <summary>Get the draft order for a specific user</summary>
        [HttpGet("user/{userId}/draft")]
        [ProducesResponseType(typeof(OrderDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDTO>> GetDraftByUserId(int userId)
        {
            var orders = await _orderService.GetByUserIdAsync(userId);
            var draftOrder = orders.FirstOrDefault(o => !o.CurrentStatus);
            if (draftOrder == null)
                return NotFound();
            return Ok(draftOrder);
        }

        /// <summary>Create a new order</summary>
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(OrderDTO), StatusCodes.Status201Created)]
        public async Task<ActionResult<OrderDTO>> Post([FromBody] OrderDTO order)
        {
            var newOrder = await _orderService.AddAsync(order);
            return CreatedAtAction(nameof(Get), new { id = newOrder.OrderId }, newOrder);
        }

        /// <summary>Update an existing order</summary>
        [HttpPut("{id}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Put(int id, [FromBody] OrderDTO order)
        {
            await _orderService.UpdateAsync(id, order);
            return NoContent();
        }

        /// <summary>Delete an order</summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(int id)
        {
            await _orderService.DeleteAsync(id);
            return NoContent();
        }
    }
}
