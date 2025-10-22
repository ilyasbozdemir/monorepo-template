using MongoDBServerAPI.Filters;
using MongoDBServerAPI.Interfaces;
using MongoDBServerAPI.Middlewares;
using MongoDBServerAPI.Services;
using MongoDBServerAPI.Session;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDBServerAPI.Background;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = null
});
// CORS

builder.Services.AddCors();

// MongoDB Client
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var connectionString = config.GetValue<string>("MongoDbSettings:ConnectionString");
    var settings = MongoClientSettings.FromConnectionString(connectionString);
    settings.ServerApi = new ServerApi(ServerApiVersion.V1);
    /*
        settings.SslSettings = new SslSettings
       {
           EnabledSslProtocols = System.Security.Authentication.SslProtocols.Tls12
       };
     */

    return new MongoClient(settings);
});

builder
    .Services.AddHealthChecks()
    .AddCheck<MongoDBServerAPI.HealthChecks.MongoDbHealthCheck>("MongoDB");

// Controller



builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddHealthChecks();



builder.Services.AddScoped<RequestSessionFilter>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IRequestSessionContext, RequestSessionContext>();
builder.Services.AddScoped<CollectionAuditFilter>();
builder.Services.AddScoped<CollectionMetadataFilter>();

builder.Services.AddScoped<IDatabaseService, DatabaseService>();
builder.Services.AddScoped<IDatabaseAdminService, DatabaseAdminService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStorageService, StorageService>();

builder.Services.AddHostedService<MongoToElixirBridgeService>();


builder.Logging.ClearProviders();
builder.Logging.AddConsole();


builder.Services.AddEndpointsApiExplorer();

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

// Swagger

builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

    c.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "MainAPP API",
            Version = "v1",
            Description = "MainAPP platformu için MongoDB tabanlı API.",
            Contact = new OpenApiContact
            {
                Name = "MainAPP Destek",
                Email = "support@ilyasbozdemir.dev",
                Url = new Uri("https://api.ilyasbozdemir.dev")
            }
        }
    );

    string serverUrl = builder.Environment.IsDevelopment()
       ? "http://localhost:58837"
       : builder.Environment.IsStaging()
           ? "https://api.ilyasbozdemir.dev"
           : "https://api.ilyasbozdemir.dev";

    c.AddServer(new OpenApiServer
    {
        Url = serverUrl,
        Description = builder.Environment.EnvironmentName + " server"
    });

    // ObjectId tipi Swagger'da string olarak gösterilsin
    c.MapType<ObjectId>(
        () =>
            new OpenApiSchema
            {
                Type = "string",
                Example = new Microsoft.OpenApi.Any.OpenApiString("64a218e8829421ef667823fc")
            }
    );

    c.TagActionsBy(api => new[] { api.ActionDescriptor.RouteValues["controller"] });

    c.AddSecurityDefinition(
        "ApiKey",
        new OpenApiSecurityScheme
        {
            Description =
                "API Key needed to access the endpoints. Example: 'Authorization: APP-LIVE-xxxx'",
            In = ParameterLocation.Header,
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "ApiKeyScheme"
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "ApiKey"
                    }
                },
                Array.Empty<string>()
            }
        }
    );
});

var app = builder.Build();


app.Use(
    async (context, next) =>
    {
        context.Response.OnStarting(() =>
        {
            context.Response.Headers.Remove("Server");
            context.Response.Headers.Remove("X-Powered-By");
            context.Response.Headers.Remove("X-AspNet-Version");
            return Task.CompletedTask;
        });
        await next.Invoke();
    }
);

//app.UseCors("AllowNextJS");
if (app.Environment.IsDevelopment())
    app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
else
{
    app.UseCors(policy => policy
        .SetIsOriginAllowed(origin =>
            origin.EndsWith("prod-url.com") ||
            origin.Contains("localhost")
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
}

app.UseSwagger();
app.UseSwaggerUI();


if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

// app.UseMiddleware<MongoDBServerAPI.Middlewares.ApiKeyMiddleware>();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();


app.UseAuthorization();
app.MapControllers();

app.MapHealthChecks(
    "/health",
    new HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            var result = new
            {
                status = report.Status.ToString(),
                checks = report.Entries.Select(
                    e =>
                        new
                        {
                            name = e.Key,
                            status = e.Value.Status.ToString(),
                            exception = e.Value.Exception?.Message
                        }
                )
            };
            await context.Response.WriteAsJsonAsync(result);
        }
    }
);

app.MapGet(
    "/favicon.ico",
    () =>
    {
        return Results.Redirect("https://cdn.ilyasbozdemir.dev/favicon.ico");
    }
);

app.Run();
