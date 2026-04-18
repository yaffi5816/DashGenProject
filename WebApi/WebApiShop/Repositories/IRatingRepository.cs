using Entities;

namespace Repositories
{
    public interface IRatingRepository
    {
        Task AddRating(Rating rating);
    }
}
