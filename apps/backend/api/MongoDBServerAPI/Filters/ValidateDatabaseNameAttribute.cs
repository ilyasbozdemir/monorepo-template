using Microsoft.AspNetCore.Mvc.Filters;
using MongoDBServerAPI.Helpers;

namespace MongoDBServerAPI.Filters;

/// <summary>
/// Database name validation filter
/// Tüm DB endpoint’lerinde otomatik olarak DB ismini kontrol eder.
/// </summary>
public class ValidateDatabaseNameAttribute : ActionFilterAttribute
{
    private readonly string _paramName;

    /// <param name="paramName">DB name parametresinin action parametre adı</param>
    public ValidateDatabaseNameAttribute(string paramName = "dbName")
    {
        _paramName = paramName;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ActionArguments.TryGetValue(_paramName, out var value) && value is string dbName)
        {
            var validation = DatabaseGuard.Validate(dbName);
            if (validation != null)
            {
                context.Result = validation;
                return;
            }
        }

        base.OnActionExecuting(context);
    }
}
