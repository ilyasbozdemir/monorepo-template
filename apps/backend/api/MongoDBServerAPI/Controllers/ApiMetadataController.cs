using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace MongoDBServerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApiMetadataController : ControllerBase
{
    private readonly IApiDescriptionGroupCollectionProvider _apiExplorer;
    private readonly IApiVersionDescriptionProvider _versionProvider;
    private readonly IConfiguration _configuration;

    public ApiMetadataController(
        IApiDescriptionGroupCollectionProvider apiExplorer,
        IApiVersionDescriptionProvider versionProvider,
        IConfiguration configuration)
    {
        _apiExplorer = apiExplorer;
        _versionProvider = versionProvider;
        _configuration = configuration;
    }

    [HttpGet]
    public IActionResult GetMetadata()
    {
        var baseUrl = _configuration["API_SERVER_BASE_URL"] ?? "http://localhost:58837";

        var controllers = _apiExplorer.ApiDescriptionGroups.Items
            .SelectMany(group => group.Items)
            .Select(api => new
            {
                Controller = api.ActionDescriptor.RouteValues["controller"],
                Action = api.ActionDescriptor.RouteValues["action"],
                HttpMethod = api.HttpMethod,
                Route = "/" + api.RelativePath,
                Parameters = api.ParameterDescriptions.Select(p => new
                {
                    Name = p.Name,
                    Source = GetSourceName(p.Source),
                    Type = FormatTypeName(p.Type),
                    IsRequired = p.IsRequired
                }),
                RequestExample = BuildRequestExample(api.ParameterDescriptions, api.HttpMethod, "/" + api.RelativePath)
            });

        var result = new
        {
            BaseUrl = baseUrl,
            Headers = new
            {
                Authorization = "Bearer <token>"
            },
            Versions = _versionProvider.ApiVersionDescriptions
                .Select(v => v.ApiVersion.ToString())
                .ToArray(),
            Controllers = controllers
        };



        return Ok(result);
    }

    /// <summary>
    /// Kaynak bilgisini okunabilir string döndürür.
    /// </summary>
    private string GetSourceName(BindingSource source)
    {
        if (source == BindingSource.Query) return "FromQuery";
        if (source == BindingSource.Path) return "FromRoute";
        if (source == BindingSource.Body) return "FromBody";
        if (source == BindingSource.Header) return "FromHeader";
        if (source == BindingSource.Form) return "FromForm";

        return source?.DisplayName ?? "Unknown";
    }

    /// <summary>
    /// Tipi string olarak okunabilir hale getirir.
    /// </summary>
    private string FormatTypeName(Type? type)
    {
        if (type == null) return "Unknown";
        if (Nullable.GetUnderlyingType(type) is Type underlying)
            return $"{underlying.Name}?";

        return type.Name;
    }

    /// <summary>
    /// API için örnek bir request çıktısı oluşturur.
    /// </summary>
    private object BuildRequestExample(IEnumerable<ApiParameterDescription> parameters, string httpMethod, string route)
    {
        var query = new Dictionary<string, object?>();
        var headers = new Dictionary<string, object?>();
        var body = new Dictionary<string, object?>();

        foreach (var p in parameters)
        {
            var exampleValue = GetExampleValue(p.Type);
            var source = GetSourceName(p.Source);

            switch (source)
            {
                case "FromQuery":
                    query[p.Name] = exampleValue;
                    break;

                case "FromRoute":
                    // Route parametrelerini örnek değerle değiştir
                    route = route.Replace("{" + p.Name + "}", exampleValue?.ToString() ?? "value");
                    break;

                case "FromHeader":
                    headers[p.Name] = exampleValue;
                    break;

                case "FromBody":
                case "FromForm":
                    body[p.Name] = exampleValue;
                    break;
            }
        }

        return new
        {
            Method = httpMethod,
            Url = route + (query.Any()
                ? "?" + string.Join("&", query.Select(q => $"{q.Key}={q.Value}"))
                : ""),
            Headers = headers.Any() ? headers : null,
            Body = body.Any() ? body : null
        };
    }

    /// <summary>
    /// Tipine göre örnek değer döndürür.
    /// </summary>
    private object GetExampleValue(Type? type)
    {
        if (type == null) return "string";

        type = Nullable.GetUnderlyingType(type) ?? type;

        return type switch
        {
            Type t when t == typeof(string) => "string",
            Type t when t == typeof(int) => 0,
            Type t when t == typeof(bool) => true,
            Type t when t == typeof(DateTime) => DateTime.UtcNow.ToString("o"),
            _ => "object"
        };
    }
}
