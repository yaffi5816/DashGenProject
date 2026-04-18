using Entities;
using Services;
using Microsoft.AspNetCore.Mvc;
using DTO;

namespace WebApiShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService service, ILogger<UsersController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>Get all users (admin only)</summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserReadOnlyDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<IEnumerable<UserReadOnlyDTO>>> GetUsers([FromQuery] int currentId)
        {
            _logger.LogInformation("GetUsers called by userId={CurrentId}", currentId);
            IEnumerable<UserReadOnlyDTO> usersDTO = await _service.GetAsync(currentId);
            if (usersDTO != null && usersDTO.Any())
                return Ok(usersDTO);
            _logger.LogWarning("GetUsers returned no users for userId={CurrentId}", currentId);
            return NoContent();
        }

        /// <summary>Get user by ID</summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<UserReadOnlyDTO>> GetUserById(int id)
        {
            _logger.LogInformation("GetUserById called with id={Id}", id);
            UserReadOnlyDTO user = await _service.GetUserById(id);
            if (user != null)
                return Ok(user);
            _logger.LogWarning("User not found: id={Id}", id);
            return NoContent();
        }

        /// <summary>Register a new user</summary>
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserReadOnlyDTO>> Post([FromBody] UserRegisterDTO user)
        {
            _logger.LogInformation("Register attempt for email={Email}", user.Email);
            UserReadOnlyDTO user1 = await _service.AddUser(user);
            if (user1 != null)
            {
                _logger.LogInformation("User registered successfully: id={Id}", user1.UserId);
                return CreatedAtAction(nameof(GetUserById), new { Id = user1.UserId }, user1);
            }
            _logger.LogWarning("Registration failed for email={Email}", user.Email);
            return BadRequest();
        }

        /// <summary>Login with email and password</summary>
        [HttpPost("Login")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserReadOnlyDTO>> Login([FromBody] UserLoginDTO user)
        {
            _logger.LogInformation("Login attempt for email={Email}", user.Email);
            UserReadOnlyDTO user1 = await _service.Login(user);
            if (user1 != null)
            {
                _logger.LogInformation("Login successful for userId={Id}", user1.UserId);
                return CreatedAtAction(nameof(GetUserById), new { Id = user1.UserId }, user1);
            }
            _logger.LogWarning("Login failed for email={Email}", user.Email);
            return BadRequest();
        }

        /// <summary>Update user details</summary>
        [HttpPut("{id}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Put(int id, [FromBody] UserUpdateDTO user)
        {
            _logger.LogInformation("UpdateUser called for id={Id}", id);
            await _service.UpdateUser(id, user);
            return Ok();
        }

        /// <summary>Delete a user</summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Delete(int id, [FromQuery] int currentUserId)
        {
            _logger.LogInformation("DeleteUser called: targetId={Id} by currentUserId={CurrentUserId}", id, currentUserId);
            await _service.DeleteUser(currentUserId, id);
            return Ok();
        }
    }
}
