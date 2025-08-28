using Server.BL;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ���� Model + ApiKey �-appsettings
builder.Services.Configure<GeminiOptions>(builder.Configuration.GetSection("Gemini"));

// Typed HttpClient �� �-BaseAddress �����
builder.Services.AddHttpClient<GeminiService>(client =>
{
    client.BaseAddress = new Uri("https://generativelanguage.googleapis.com");
    client.Timeout = TimeSpan.FromSeconds(30);
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
