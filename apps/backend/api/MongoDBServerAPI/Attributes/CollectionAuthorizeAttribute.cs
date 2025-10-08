using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MongoDBServerAPI.Attributes;

// Genel Attirubte yapıclak bu test içindi.

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public class CollectionAuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public string Collection { get; }
    public string Action { get; }

    public CollectionAuthorizeAttribute(string collection, string action)
    {
        Collection = collection;
        Action = action;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new ForbidResult();
            return;
        }

        var userId = user.FindFirst("sub")?.Value;

        // Burada collection ve action bazlı check yapabilirsin
        // Mesela "users" collection için "update" action sadece kendi id'si ile yapılabilir
        if (Collection == "users" && Action == "update")
        {
            var routeId = context.RouteData.Values["id"]?.ToString();
            if (routeId != userId)
            {
                context.Result = new ForbidResult();
            }
        }

    }
}
