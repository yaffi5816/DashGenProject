using Entities;

namespace Services
{
    public interface IRatingService
    {
        Task AddRating(Rating rating);
    }
}
