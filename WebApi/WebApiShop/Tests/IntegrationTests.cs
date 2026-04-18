using Entities;
using Microsoft.EntityFrameworkCore;
using Repositories;
using Xunit;

namespace Tests
{
    public class IntegrationTests
    {
        private DashGen2026Context CreateContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<DashGen2026Context>()
                .UseInMemoryDatabase(dbName)
                .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.AmbientTransactionWarning))
                .Options;
            // עוקפים את OnConfiguring שמגדיר SqlServer
            return new TestDbContext(options);
        }

        private class TestDbContext : DashGen2026Context
        {
            public TestDbContext(DbContextOptions<DashGen2026Context> options) : base(options) { }
            protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                // לא קוראים ל-base כדי למנוע רישום SqlServer
            }
        }

        // Integration Test 1: הוספת משתמש ושליפתו מה-DB
        [Fact]
        public async Task AddUser_ThenGetById_ReturnsUser()
        {
            using var ctx = CreateContext(nameof(AddUser_ThenGetById_ReturnsUser));
            var repo = new UserRepository(ctx);
            var user = new User { UserName = "a@a.com", Password = "hash", FirstName = "A", LastName = "B", IsAdmin = false };

            var added = await repo.AddUser(user);
            var fetched = await repo.GetUserById(added.UserId);

            Assert.NotNull(fetched);
            Assert.Equal("a@a.com", fetched.UserName);
        }

        // Integration Test 2: שליפת כל המשתמשים מחזירה את הרשימה הנכונה
        [Fact]
        public async Task GetAsync_ReturnsAllUsers()
        {
            using var ctx = CreateContext(nameof(GetAsync_ReturnsAllUsers));
            ctx.Users.AddRange(
                new User { UserName = "u1@a.com", Password = "h", FirstName = "U", LastName = "1", IsAdmin = false },
                new User { UserName = "u2@a.com", Password = "h", FirstName = "U", LastName = "2", IsAdmin = false }
            );
            await ctx.SaveChangesAsync();
            var repo = new UserRepository(ctx);

            var users = await repo.GetAsync();

            Assert.Equal(2, users.Count());
        }

        // Integration Test 3: הוספת הזמנה ושליפתה לפי UserId
        [Fact]
        public async Task AddOrder_ThenGetByUserId_ReturnsOrder()
        {
            using var ctx = CreateContext(nameof(AddOrder_ThenGetByUserId_ReturnsOrder));
            var user = new User { UserName = "o@a.com", Password = "h", FirstName = "O", LastName = "R", IsAdmin = false };
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();

            var repo = new OrderRepository(ctx);
            var order = new Order { UserId = user.UserId, CurrentStatus = true, OrdersSum = 100, OrderDate = DateOnly.FromDateTime(DateTime.Today) };
            await repo.AddAsync(order);

            var orders = await repo.GetByUserIdAsync(user.UserId);

            Assert.Single(orders);
            Assert.Equal(100, orders.First().OrdersSum);
        }

        // Integration Test 4: עדכון משתמש מתעדכן ב-DB
        [Fact]
        public async Task UpdateUser_ChangesArePersisted()
        {
            using var ctx = CreateContext(nameof(UpdateUser_ChangesArePersisted));
            var user = new User { UserName = "upd@a.com", Password = "h", FirstName = "Old", LastName = "Name", IsAdmin = false };
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();
            var repo = new UserRepository(ctx);

            user.FirstName = "New";
            await repo.UpdateUser(user.UserId, user);
            var updated = await repo.GetUserById(user.UserId);

            Assert.Equal("New", updated.FirstName);
        }

        // Integration Test 5: מחיקת הזמנה מסירה אותה מה-DB
        [Fact]
        public async Task DeleteOrder_RemovesFromDb()
        {
            using var ctx = CreateContext(nameof(DeleteOrder_RemovesFromDb));
            var user = new User { UserName = "del@a.com", Password = "h", FirstName = "D", LastName = "E", IsAdmin = false };
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();

            var repo = new OrderRepository(ctx);
            var order = new Order { UserId = user.UserId, CurrentStatus = false, OrdersSum = 50, OrderDate = DateOnly.FromDateTime(DateTime.Today) };
            await repo.AddAsync(order);
            await repo.DeleteAsync(order.OrderId);

            var result = await repo.GetByIdAsync(order.OrderId);
            Assert.Null(result);
        }
    }
}
