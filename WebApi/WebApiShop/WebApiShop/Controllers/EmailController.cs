using Microsoft.AspNetCore.Mvc;
using Services;

namespace WebApiShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        /// <summary>Send a dashboard code email to the user</summary>
        [HttpPost("send-code")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SendCode([FromBody] EmailRequest request)
        {
            await _emailService.SendCodeEmailAsync(request.Email, request.Code, request.FileName, request.Subject);
            return Ok(new { message = "Email sent successfully" });
        }

        /// <summary>Send a contact form message</summary>
        [HttpPost("contact")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SendContactMessage([FromBody] ContactRequest request)
        {
            await _emailService.SendContactEmailAsync(request.Name, request.Email, request.Subject, request.Message);
            return Ok(new { message = "Contact message sent successfully" });
        }
    }

    public record EmailRequest(string Email, string Code, string FileName, string Subject);
    public record ContactRequest(string Name, string Email, string Subject, string Message);
}
