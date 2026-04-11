using AutoMapper;
using DTO;
using Entities;
using Repositories;
using Microsoft.Extensions.Options;
using System.Text.Json;
namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;
        private readonly AdminCredentials _adminCredentials;
        PasswordService password = new PasswordService();

        public UserService(IUserRepository repository, IMapper mapper, IOptions<AdminCredentials> adminCredentials)
        {
            _repository = repository;
            _mapper = mapper;
            _adminCredentials = adminCredentials.Value;
        }

        public async Task<UserReadOnlyDTO> GetUserById(int id)
        {
            var userEntity = await _repository.GetUserById(id);
            return _mapper.Map<UserReadOnlyDTO>(userEntity);
        }
        public async Task<UserReadOnlyDTO> AddUser(UserRegisterDTO user)
        {
            var userEntity = _mapper.Map<User>(user);
            if (password.CheckPassword(userEntity.Password).Level < 3)
                return null;

            // בדיקה אם זה חשבון מנהל ראשי
            if (userEntity.UserName == _adminCredentials.Username &&
                userEntity.Password == _adminCredentials.Password)
            {
                userEntity.IsAdmin = true;
            }
            else
            {
                userEntity.IsAdmin = false;
            }

            userEntity.Password = password.Hash(userEntity.Password);
            var newUser = await _repository.AddUser(userEntity);
            return _mapper.Map<UserReadOnlyDTO>(newUser);
        }
        public async Task<UserReadOnlyDTO> Login(UserLoginDTO user)
        {
            var userEntity = _mapper.Map<User>(user);
            var newUser = await _repository.Login(userEntity);
            return _mapper.Map<UserReadOnlyDTO>(newUser);

        }
        public async Task UpdateUser(int id, UserUpdateDTO user)
        {
            var userEntity= await _repository.GetUserById(id);
            userEntity.IsAdmin = user.IsAdmin; 
            userEntity.UserName=user.UserName;
            userEntity.FirstName=user.FirstName;
            userEntity.LastName=user.LastName;
            //var userEntity = _mapper.Map<User>(user);
            await _repository.UpdateUser(id, userEntity);
        }


        public async Task<IEnumerable<UserReadOnlyDTO>> GetAsync(int currentUserId)
        {
            var user = await _repository.GetUserById(currentUserId);
            if (user == null)
            {
                throw new UnauthorizedAccessException($"User with ID {currentUserId} not found.");
            }
            if (!user.IsAdmin)
            {
                throw new UnauthorizedAccessException($"User {user.UserName} (ID: {currentUserId}) is not an admin. IsAdmin={user.IsAdmin}");
            }
            IEnumerable<User> users = await _repository.GetAsync();
            IEnumerable<UserReadOnlyDTO> usersDTO = _mapper.Map<IEnumerable<User>, IEnumerable<UserReadOnlyDTO>>(users);
            return usersDTO;
        }


        public async Task DeleteUser(int currentUserId, int userId)
        {
            var user = await _repository.GetUserById(currentUserId);
            if (user == null || !user.IsAdmin)
            {
                throw new UnauthorizedAccessException("Only admins can perform this action.");
            }
            await _repository.DeleteUser(userId, currentUserId);
        }







    }
}
