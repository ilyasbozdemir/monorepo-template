using System.Security.Claims;

namespace MongoDBServerAPI.Middlewares;

public class AuthRuleMiddleware
{
    private readonly RequestDelegate _next;

    // Örnek kurallar, HTTP method’a göre
    private readonly Dictionary<string, string> _methodRules = new()
    {
        ["POST"] = "@request.auth.id != null",              // Create
        ["PUT"] = "@request.auth.id != null && @request.auth.role == 'admin'", // Update
        ["PATCH"] = "@request.auth.id != null && @request.auth.role == 'admin'", // Partial Update
        ["DELETE"] = "@request.auth.id != null && @request.auth.role == 'admin'", // Delete
        ["GET"] = "@request.auth.id != null"               // View/List
    };

    public AuthRuleMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Kullanıcı bilgilerini al
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = context.User.FindFirst(ClaimTypes.Role)?.Value;

        // HTTP method’a göre kural
        var method = context.Request.Method.ToUpper();
        if (!_methodRules.TryGetValue(method, out var rule))
        {
            // Eğer kural yoksa default olarak izin ver
            await _next(context);
            return;
        }

        // Context dictionary oluştur
        var ruleContext = new Dictionary<string, string>
        {
            ["@request.auth.id"] = userId ?? "",
            ["@request.auth.role"] = userRole ?? ""
        };

        // Rule engine çalıştır
        var allowed = EvaluateRule(rule, ruleContext);

        if (!allowed)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsync("Forbidden: You are not authorized for this action.");
            return;
        }

        // İzin varsa devam et
        await _next(context);
    }

    // Basit rule engine
    // tabi RuleEngine yazılcak buna.
    private bool EvaluateRule(string rule, Dictionary<string, string> context)
    {
        // Çok basit: && ile split, != ve == kontrolü
        var conditions = rule.Split(new[] { "&&" }, StringSplitOptions.RemoveEmptyEntries);

        foreach (var condRaw in conditions)
        {
            var cond = condRaw.Trim();

            if (cond.Contains("!="))
            {
                var parts = cond.Split("!=");
                var left = parts[0].Trim();
                var right = parts[1].Trim().Trim('\'');
                if (!context.ContainsKey(left) || context[left] == right)
                    return false;
            }
            else if (cond.Contains("=="))
            {
                var parts = cond.Split("==");
                var left = parts[0].Trim();
                var right = parts[1].Trim().Trim('\'');
                if (!context.ContainsKey(left) || context[left] != right)
                    return false;
            }
            else if (cond.Contains("!= null"))
            {
                var left = cond.Replace("!= null", "").Trim();
                if (!context.ContainsKey(left) || string.IsNullOrEmpty(context[left]))
                    return false;
            }
            else if (cond.Contains("== null"))
            {
                var left = cond.Replace("== null", "").Trim();
                if (!context.ContainsKey(left) || !string.IsNullOrEmpty(context[left]))
                    return false;
            }
        }

        return true;
    }
}