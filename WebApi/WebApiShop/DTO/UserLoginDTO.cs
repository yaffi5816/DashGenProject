using System.ComponentModel.DataAnnotations;

namespace DTO
{
    public record UserLoginDTO
    (
        [Required]
        [EmailAddress]
        string UserName,

        [Required]
        string Password
    );
}
