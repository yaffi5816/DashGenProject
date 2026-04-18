using System.ComponentModel.DataAnnotations;

namespace DTO
{
    public record UserRegisterDTO
    (
        [Required]
        [EmailAddress]
        string UserName,

        [Required]
        string Password,

        [Required]
        [RegularExpression(@"^[a-zA-Z\u0590-\u05FF]+$", ErrorMessage = "First name must contain letters only.")]
        string FirstName,

        [Required]
        [RegularExpression(@"^[a-zA-Z\u0590-\u05FF]+$", ErrorMessage = "Last name must contain letters only.")]
        string LastName
    );
}
