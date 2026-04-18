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
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var (statusCode, message) = ex switch
            {
                KeyNotFoundException    => (HttpStatusCode.NotFound,           "The requested resource was not found."),
                UnauthorizedAccessException => (HttpStatusCode.Unauthorized,   "You are not authorized to perform this action."),
                ArgumentException       => (HttpStatusCode.BadRequest,         ex.Message),
                InvalidOperationException => (HttpStatusCode.BadRequest,       ex.Message),
                _                       => (HttpStatusCode.InternalServerError,"An unexpected error occurred.")
            };

            if (statusCode == HttpStatusCode.InternalServerError)
                logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            else
                logger.LogWarning("Handled exception [{Status}]: {Message}", (int)statusCode, ex.Message);

            context.Response.StatusCode = (int)statusCode;
            context.Response.ContentType = "application/json";

            var response = new
            {
                status = (int)statusCode,
                error = message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
