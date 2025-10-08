using Microsoft.AspNetCore.Mvc;

namespace MongoDBServerAPI.Helpers;

public static class DatabaseGuard
{
    // İzin verilmeyen sistem db’leri
    private static readonly HashSet<string> ForbiddenDatabases = new()
    {
        "admin", "local", "config"
    };

    public static bool IsAllowed(string dbName) =>
        !string.IsNullOrWhiteSpace(dbName) && !ForbiddenDatabases.Contains(dbName);

    public static IActionResult? Validate(string dbName)
    {
        if (string.IsNullOrWhiteSpace(dbName))
        {
            return new JsonResult(new
            {
                error = true,
                message = "Database name is required."
            })
            { StatusCode = 400 };
        }

        if (ForbiddenDatabases.Contains(dbName))
        {
            return new JsonResult(new
            {
                error = true,
                message = $"Access to database '{dbName}' is not allowed."
            })
            { StatusCode = 403 };
        }

        var invalidChars = new[] { " ", "/", "\\", "$" };
        if (invalidChars.Any(c => dbName.Contains(c)))
        {
            return new JsonResult(new
            {
                error = true,
                message = "Database name contains invalid characters."
            })
            { StatusCode = 400 };
        }

        return null; // geçerli dbName
    }


    public static IEnumerable<string> FilterSystemDbs(IEnumerable<string> dbs, bool excludeSystemDbs = true)
    {
        if (!excludeSystemDbs) return dbs;
        return dbs.Where(db => !ForbiddenDatabases.Contains(db));
    }
}
