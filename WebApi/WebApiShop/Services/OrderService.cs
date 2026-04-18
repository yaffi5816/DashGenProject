using AutoMapper;
using DTO;
using Entities;
using Microsoft.Extensions.Logging;
using Repositories;

namespace Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<OrderService> _logger;

        public OrderService(IOrderRepository repository, IProductRepository productRepository, IMapper mapper, ILogger<OrderService> logger)
        {
            _repository = repository;
            _productRepository = productRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<OrderDTO>> GetAsync()
        {
            var orders = await _repository.GetAsync();
            return _mapper.Map<IEnumerable<OrderDTO>>(orders);
        }

        public async Task<OrderDTO?> GetByIdAsync(int id)
        {
            var order = await _repository.GetByIdAsync(id);
            return order != null ? _mapper.Map<OrderDTO>(order) : null;
        }

        public async Task<IEnumerable<OrderDTO>> GetByUserIdAsync(int userId)
        {
            var orders = await _repository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<OrderDTO>>(orders);
        }

        public async Task<OrderDTO> AddAsync(OrderDTO orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);

            if (orderDto.OrdersItems != null && orderDto.OrdersItems.Any())
            {
                double serverSum = 0;
                foreach (var item in orderDto.OrdersItems)
                {
                    var product = await _productRepository.GetByIdAsync(item.ProductId);
                    if (product != null)
                        serverSum += product.Price * item.Quantity;
                }

                double clientSum = orderDto.OrdersSum;
                if (Math.Abs(serverSum - clientSum) > 0.01)
                    throw new InvalidOperationException(
                        $"Order amount mismatch: client sent {clientSum}, server calculated {serverSum}");

                order.OrdersSum = serverSum;
            }

            var newOrder = await _repository.AddAsync(order);
            return _mapper.Map<OrderDTO>(newOrder);
        }

        public async Task UpdateAsync(int id, OrderDTO orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);
            order.OrderId = id;
            await _repository.UpdateAsync(order);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
