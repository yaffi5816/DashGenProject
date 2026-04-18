using Entities;
using Services;

namespace WebApiShop.Middleware
{
    public class RatingMiddleware(RequestDelegate next)
    {
        public async Task Invoke(HttpContext httpContext, IRatingService ratingService)
        {
            var rating = new Rating
            {
                Host       = httpContext.Request.Host.Value,
                Method     = httpContext.Request.Method,
                Path       = httpContext.Request.Path.Value,
                Referer    = httpContext.Request.Headers["Referer"].ToString(),
                UserAgent  = httpContext.Request.Headers["User-Agent"].ToString(),
                RecordDate = DateTime.Now
            };

            await ratingService.AddRating(rating);

            await next(httpContext);
        }
    }
}
