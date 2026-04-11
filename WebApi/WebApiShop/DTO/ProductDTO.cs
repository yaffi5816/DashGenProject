namespace DTO
{
    public class ProductDTO
    {
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string ProductName { get; set; }
        public string? ProductDescreption { get; set; }
        public double Price { get; set; }
        public string? ImgUrl { get; set; }
    }
}
