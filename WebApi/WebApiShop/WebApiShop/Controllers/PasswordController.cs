using Entities;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace WebApiShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class PasswordController : ControllerBase
    {
        private readonly PasswordService _passwordService = new();

        /// <summary>Check password strength (score 0-4)</summary>
        [HttpPost]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(Password), StatusCodes.Status200OK)]
        public ActionResult<Password> Post([FromBody] Password passwordFromUser)
        {
            Password result = _passwordService.CheckPassword(passwordFromUser.ThePassword);
            return Ok(result);
        }
    }
}
