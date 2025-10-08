using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace MongoDBServerAPI.Helpers;

public class RoutePrefixConvention : IApplicationModelConvention
{
    private readonly AttributeRouteModel _routePrefix;

    public RoutePrefixConvention(string prefix)
    {
        if (!string.IsNullOrEmpty(prefix))
            _routePrefix = new AttributeRouteModel(new RouteAttribute(prefix));
    }

    public void Apply(ApplicationModel application)
    {
        if (_routePrefix == null) return;

        foreach (var controller in application.Controllers)
        {
            foreach (var selector in controller.Selectors.Where(s => s.AttributeRouteModel != null))
            {
                var originalRoute = selector.AttributeRouteModel.Template;

                var segments = originalRoute.Split('/', StringSplitOptions.RemoveEmptyEntries);
                if (segments.Length > 0 && segments[0].Equals("api", StringComparison.OrdinalIgnoreCase))
                {
                    segments = segments.Skip(1).ToArray();
                }

                var cleanedRoute = string.Join("/", segments);

                selector.AttributeRouteModel = AttributeRouteModel.CombineAttributeRouteModel(
                    _routePrefix,
                    new AttributeRouteModel(new RouteAttribute(cleanedRoute))
                );
            }
        }
    }
}
