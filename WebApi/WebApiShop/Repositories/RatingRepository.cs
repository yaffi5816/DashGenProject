using Entities;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Repositories
{
    public class RatingRepository : IRatingRepository
    {
        private readonly string _connectionString;

        public RatingRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("EfratHome");
        }

        public async Task AddRating(Rating rating)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            string sql = @"INSERT INTO RATING (HOST, METHOD, PATH, REFERER, USER_AGENT, Record_Date)
                           VALUES (@Host, @Method, @Path, @Referer, @UserAgent, @RecordDate)";

            using SqlCommand cmd = new SqlCommand(sql, conn);
            cmd.Parameters.Add("@Host",       System.Data.SqlDbType.NVarChar, 50).Value   = (object?)rating.Host      ?? DBNull.Value;
            cmd.Parameters.Add("@Method",     System.Data.SqlDbType.NChar,    10).Value   = (object?)rating.Method    ?? DBNull.Value;
            cmd.Parameters.Add("@Path",       System.Data.SqlDbType.NVarChar, 50).Value   = (object?)rating.Path      ?? DBNull.Value;
            cmd.Parameters.Add("@Referer",    System.Data.SqlDbType.NVarChar, 100).Value  = (object?)rating.Referer   ?? DBNull.Value;
            cmd.Parameters.Add("@UserAgent",  System.Data.SqlDbType.NVarChar, -1).Value   = (object?)rating.UserAgent ?? DBNull.Value;
            cmd.Parameters.Add("@RecordDate", System.Data.SqlDbType.DateTime).Value       = (object?)rating.RecordDate ?? DBNull.Value;

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
