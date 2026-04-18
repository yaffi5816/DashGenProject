using Microsoft.EntityFrameworkCore;
using Repositories;
using Services;
using DTO;
using WebApiShop.Middleware;
using NLog.Web;

DotNetEnv.Env.Load();
var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseNLog();

// Add services to the container.

builder.Services.AddControllers();

// Gemini Configuration
builder.Services.Configure<GeminiSettings>(options =>
{
    options.ApiKey = apiKey;
    options.BaseUrl = builder.Configuration["GeminiSettings:BaseUrl"];
});
builder.Services.Configure<AdminCredentials>(builder.Configuration.GetSection("AdminCredentials"));
builder.Services.AddHttpClient<IGeminiService, GeminiService>();

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddTransient<ICategoryRepository, CategoryRepository>();
builder.Services.AddTransient<ICategoryService, CategoryService>();

builder.Services.AddTransient<IProductRepository, ProductRepository>();
builder.Services.AddTransient<IProductService, ProductService>();

builder.Services.AddTransient<IOrderRepository, OrderRepository>();
builder.Services.AddTransient<IOrderService, OrderService>();

builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddTransient<IRatingRepository, RatingRepository>();
builder.Services.AddTransient<IRatingService, RatingService>();

builder.Services.AddDbContext<DashGen2026Context>(
    options=>options.UseSqlServer(
        builder.Configuration.GetConnectionString("EfratHome"),
        x => x.MigrationsAssembly("WebApiShop") ));

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddOpenApi();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "My API V1");
    });
}
else
{
    app.UseHsts();
}
// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<RatingMiddleware>();

app.UseCors("AllowAngular");

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();

