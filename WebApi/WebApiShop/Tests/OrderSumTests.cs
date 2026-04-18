using AutoMapper;
using DTO;
using Entities;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Repositories;
using Services;
using Xunit;

namespace Tests
{
    public class OrderSumTests
    {
        private readonly Mock<IOrderRepository> _orderRepoMock = new();
        private readonly Mock<IProductRepository> _productRepoMock = new();
        private readonly IMapper _mapper;

        public OrderSumTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Order, OrderDTO>()
                    .ForMember(d => d.OrdersItems, o => o.MapFrom(s => s.OrdersItems));
                cfg.CreateMap<OrderDTO, Order>();
                cfg.CreateMap<OrdersItem, OrderItemDTO>()
                    .ForMember(d => d.Product, o => o.MapFrom(s => s.Product));
                cfg.CreateMap<OrderItemDTO, OrdersItem>();
                cfg.CreateMap<Product, ProductDTO>()
                    .ForMember(d => d.CategoryName, o => o.Ignore());
            });
            _mapper = config.CreateMapper();
        }

        // Happy Path: הסכום שהלקוח שלח תואם לחישוב השרת
        [Fact]
        public async Task AddOrder_CorrectSum_SavesServerCalculatedSum()
        {
            var product = new Product { ProductId = 1, ProductName = "P1", Price = 50, CategoryId = 1 };
            _productRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            var orderDto = new OrderDTO(0, 1, true, null, 100.0, null, null,
                new List<OrderItemDTO> { new(0, 1, 0, 2, null) }); // 2 * 50 = 100

            var savedOrder = new Order { OrderId = 1, UserId = 1, OrdersSum = 100, CurrentStatus = true };
            _orderRepoMock.Setup(r => r.AddAsync(It.IsAny<Order>())).ReturnsAsync(savedOrder);

            var service = new OrderService(_orderRepoMock.Object, _productRepoMock.Object, _mapper, NullLogger<OrderService>.Instance);

            var result = await service.AddAsync(orderDto);

            Assert.Equal(100.0, result.OrdersSum);
            _orderRepoMock.Verify(r => r.AddAsync(It.Is<Order>(o => Math.Abs(o.OrdersSum - 100.0) < 0.01)), Times.Once);
        }

        // Unhappy Path: הסכום שהלקוח שלח שגוי – השרת זורק שגיאה
        [Fact]
        public async Task AddOrder_WrongClientSum_ThrowsInvalidOperationException()
        {
            var product = new Product { ProductId = 2, ProductName = "P2", Price = 30, CategoryId = 1 };
            _productRepoMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(product);

            var orderDto = new OrderDTO(0, 1, true, null, 999.0, null, null,
                new List<OrderItemDTO> { new(0, 2, 0, 3, null) }); // 3 * 30 = 90, לקוח שלח 999

            var service = new OrderService(_orderRepoMock.Object, _productRepoMock.Object, _mapper, NullLogger<OrderService>.Instance);

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.AddAsync(orderDto));
        }
    }
}
