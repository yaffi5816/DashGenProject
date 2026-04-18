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

        public UsersController(IUserService service)
        {
            _service = service;
        }

        /// <summary>Get all users (admin only)</summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserReadOnlyDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<IEnumerable<UserReadOnlyDTO>>> GetUsers([FromQuery] int currentId)
        {
            IEnumerable<UserReadOnlyDTO> usersDTO = await _service.GetAsync(currentId);
            if (usersDTO != null && usersDTO.Any())
                return Ok(usersDTO);
            return NoContent();
        }

        /// <summary>Get user by ID</summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<UserReadOnlyDTO>> GetUserById(int id)
        {
            UserReadOnlyDTO user = await _service.GetUserById(id);
            if (user != null)
                return Ok(user);
            return NoContent();
        }

        /// <summary>Register a new user</summary>
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserReadOnlyDTO>> Post([FromBody] UserRegisterDTO user)
        {
            UserReadOnlyDTO user1 = await _service.AddUser(user);
            if (user1 != null)
                return CreatedAtAction(nameof(GetUserById), new { Id = user1.UserId }, user1);
            return BadRequest();
        }

        /// <summary>Login with email and password</summary>
        [HttpPost("Login")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(UserReadOnlyDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserReadOnlyDTO>> Login([FromBody] UserLoginDTO user)
        {
            UserReadOnlyDTO user1 = await _service.Login(user);
            if (user1 != null)
                return CreatedAtAction(nameof(GetUserById), new { Id = user1.UserId }, user1);
            return BadRequest();
        }

        /// <summary>Update user details</summary>
        [HttpPut("{id}")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Put(int id, [FromBody] UserUpdateDTO user)
        {
            await _service.UpdateUser(id, user);
            return Ok();
        }

        /// <summary>Delete a user</summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Delete(int id, [FromQuery] int currentUserId)
        {
            await _service.DeleteUser(currentUserId, id);
            return Ok();
        }
    }
}
