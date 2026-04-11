using Entities;
using Zxcvbn;
namespace Services
{
    public class PasswordService
    {
        public Password CheckPassword(string password)
        {
            var result = Zxcvbn.Core.EvaluatePassword(password);
            return new Password { ThePassword = password, Level = result.Score };
        }

        public string Hash(string password) =>
            BCrypt.Net.BCrypt.HashPassword(password);

        public bool Verify(string password, string hash) =>
            BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
