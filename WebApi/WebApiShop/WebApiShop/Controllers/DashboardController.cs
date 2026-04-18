using Microsoft.AspNetCore.Mvc;
using Services;
using DTO;

namespace WebApiShop.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class DashboardController : ControllerBase
{
    private readonly IGeminiService _geminiService;

    public DashboardController(IGeminiService geminiService)
    {
        _geminiService = geminiService;
    }

    /// <summary>Generate dashboard code using Gemini AI</summary>
    [HttpPost("generate")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateDashboard([FromBody] DashboardRequest request)
    {
        if (request == null || request.Schema == null || request.Components == null)
            return BadRequest(new { error = "Invalid request. Schema and Components are required." });

        var code = await _geminiService.GenerateDashboardCodeAsync(request);
        return Ok(new { generatedCode = code });
    }
}
