using System.Net;
using System.Text.Json;

namespace WebApiShop.Middleware
{
    public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unhandled exception");
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                var response = new { error = "An unexpected error occurred.", detail = ex.Message };
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }
}
