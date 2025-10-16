namespace MongoDBServerAPI.Middlewares;

public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _config;

    public ApiKeyMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _config = config;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue("Authorization", out var extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("API Key is missing");
            return;
        }

        var apiKey = _config.GetValue<string>("API_SERVER_APIKEY");


        // Bearer varsa ayıklıyoruz
        var token = extractedApiKey.ToString().StartsWith("Bearer ")
            ? extractedApiKey.ToString().Substring("Bearer ".Length)
            : extractedApiKey.ToString();

        if (!apiKey.Equals(token))
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Unauthorized client");
            return;
        }

     
        await _next(context);
    }
}
