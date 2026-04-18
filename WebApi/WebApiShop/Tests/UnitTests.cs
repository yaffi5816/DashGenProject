using AutoMapper;
using DTO;
using Entities;
using Microsoft.Extensions.Options;
using Moq;
using Repositories;
using Services;
using Xunit;

namespace Tests
{
    public class UnitTests
    {
        private readonly Mock<IUserRepository> _userRepoMock = new();
        private readonly IMapper _mapper;
        private readonly IOptions<AdminCredentials> _adminOptions;

        public UnitTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<User, UserReadOnlyDTO>();
                cfg.CreateMap<UserRegisterDTO, User>();
                cfg.CreateMap<UserLoginDTO, User>();
            });
            _mapper = config.CreateMapper();
            _adminOptions = Options.Create(new AdminCredentials { Username = "admin@test.com", Password = "AdminPass1!" });
        }

        // Unit Test 1: GetUserById מחזיר DTO תקין
        [Fact]
        public async Task GetUserById_ReturnsCorrectDTO()
        {
            var user = new User { UserId = 1, UserName = "test@test.com", FirstName = "Test", LastName = "User", IsAdmin = false, Password = "hash" };
            _userRepoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);
            var service = new UserService(_userRepoMock.Object, _mapper, _adminOptions);

            var result = await service.GetUserById(1);

            Assert.Equal("test@test.com", result.UserName);
            Assert.Equal(1, result.UserId);
        }

        // Unit Test 2: AddUser עם סיסמה חלשה מחזיר null
        [Fact]
        public async Task AddUser_WeakPassword_ReturnsNull()
        {
            var dto = new UserRegisterDTO("user@test.com", "123", "First", "Last");
            var service = new UserService(_userRepoMock.Object, _mapper, _adminOptions);

            var result = await service.AddUser(dto);

            Assert.Null(result);
        }

        // Unit Test 3: AddUser עם פרטי מנהל ראשי מגדיר IsAdmin=true
        [Fact]
        public async Task AddUser_AdminCredentials_SetsIsAdminTrue()
        {
            var dto = new UserRegisterDTO("admin@test.com", "AdminPass1!", "Admin", "User");
            var savedUser = new User { UserId = 2, UserName = "admin@test.com", FirstName = "Admin", LastName = "User", IsAdmin = true, Password = "hash" };
            _userRepoMock.Setup(r => r.AddUser(It.Is<User>(u => u.IsAdmin))).ReturnsAsync(savedUser);
            var service = new UserService(_userRepoMock.Object, _mapper, _adminOptions);

            var result = await service.AddUser(dto);

            Assert.NotNull(result);
            Assert.True(result.IsAdmin);
        }

        // Unit Test 4: GetAsync זורק UnauthorizedAccessException למשתמש שאינו מנהל
        [Fact]
        public async Task GetAsync_NonAdmin_ThrowsUnauthorized()
        {
            var user = new User { UserId = 1, UserName = "user@test.com", IsAdmin = false, Password = "hash" };
            _userRepoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);
            var service = new UserService(_userRepoMock.Object, _mapper, _adminOptions);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.GetAsync(1));
        }

        // Unit Test 5: DeleteUser זורק UnauthorizedAccessException כשהמשתמש אינו מנהל
        [Fact]
        public async Task DeleteUser_NonAdmin_ThrowsUnauthorized()
        {
            var user = new User { UserId = 1, UserName = "user@test.com", IsAdmin = false, Password = "hash" };
            _userRepoMock.Setup(r => r.GetUserById(1)).ReturnsAsync(user);
            var service = new UserService(_userRepoMock.Object, _mapper, _adminOptions);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.DeleteUser(1, 2));
        }
    }
}
