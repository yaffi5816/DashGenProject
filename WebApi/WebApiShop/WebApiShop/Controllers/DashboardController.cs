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
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IGeminiService geminiService, ILogger<DashboardController> logger)
    {
        _geminiService = geminiService;
        _logger = logger;
    }

    /// <summary>Generate dashboard code using Gemini AI</summary>
    [HttpPost("generate")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateDashboard([FromBody] DashboardRequest request)
    {
        if (request == null || request.Schema == null || request.Components == null)
        {
            _logger.LogWarning("CreateDashboard called with invalid request");
            return BadRequest(new { error = "Invalid request. Schema and Components are required." });
        }
        _logger.LogInformation("CreateDashboard called");
        var code = await _geminiService.GenerateDashboardCodeAsync(request);
        _logger.LogInformation("Dashboard generated successfully");
        return Ok(new { generatedCode = code });
    }
}
