using MongoDBServerAPI.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace MongoDBServerAPI.Controllers.v1;

[ApiController]
[Route("api/[controller]")]
[ServiceFilter(typeof(RequestSessionFilter))]
public class RulesPlaygroundController : ControllerBase
{
    public class RuleRequest
    {
        public string Rule { get; set; }
        public Dictionary<string, string> Context { get; set; }
    }

    [HttpPost("evaluate")]
    public IActionResult Evaluate([FromBody] RuleRequest request)
    {
        bool result = EvaluateRule(request.Rule, request.Context);
        var supported = new
        {
            Operators = new[] { "&&", "||", "=", "!=" },
            Placeholders = new[] { "@request.auth.id", "@request.auth.collectionId", "recordRef", "collectionRef" }
        };
        return Ok(new { result, supported });
    }

    private bool EvaluateRule(string rule, Dictionary<string, string> context)
    {
        // Basit parser: && ile parçala
        var conditions = rule.Split(new[] { "&&" }, System.StringSplitOptions.RemoveEmptyEntries);

        foreach (var condRaw in conditions)
        {
            var cond = condRaw.Trim();

            // != kontrolü
            if (cond.Contains("!="))
            {
                var parts = cond.Split(new[] { "!=" }, System.StringSplitOptions.RemoveEmptyEntries);
                string left = parts[0].Trim();
                string right = parts[1].Trim().Trim('\'');

                if (!context.ContainsKey(left) || context[left] == right)
                    return false;
            }
            // = kontrolü
            else if (cond.Contains("="))
            {
                var parts = cond.Split(new[] { "=" }, System.StringSplitOptions.RemoveEmptyEntries);
                string left = parts[0].Trim();
                string right = parts[1].Trim();

                if (!context.ContainsKey(left) || !context.ContainsKey(right) || context[left] != context[right])
                    return false;
            }
        }

        return true;
    }
}
