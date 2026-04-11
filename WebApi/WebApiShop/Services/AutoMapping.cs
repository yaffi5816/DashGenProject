using AutoMapper;
using DTO;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    internal class AutoMapping:Profile
    {
        public AutoMapping()
        {
            CreateMap<User, UserReadOnlyDTO>();
            CreateMap<UserRegisterDTO, User>();
            CreateMap<UserLoginDTO, User>();
            CreateMap<UserLoginDTO, UserReadOnlyDTO>();
            CreateMap<UserLoginDTO, UserRegisterDTO>();
            CreateMap<UserUpdateDTO, User>();
            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryDTO, Category>();
            //CreateMap<Product, ProductDTO>();

            CreateMap<Product, ProductDTO>()
            .ForMember(dest => dest.CategoryName,
             opt => opt.MapFrom(src => src.Category != null ? src.Category.CategoryName : null));
            CreateMap<ProductDTO, Product>()
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.OrdersItems, opt => opt.Ignore());
            //CreateMap<ProductDTO, Product>();
            CreateMap<Order, OrderDTO>()
            .ForMember(dest => dest.OrdersItems,
             opt => opt.MapFrom(src => src.OrdersItems));
            CreateMap<OrderDTO, Order>();
            CreateMap<OrdersItem, OrderItemDTO>()
            .ForMember(dest => dest.Product,
             opt => opt.MapFrom(src => src.Product));
            CreateMap<OrderItemDTO, OrdersItem>();
        }
    }
}
