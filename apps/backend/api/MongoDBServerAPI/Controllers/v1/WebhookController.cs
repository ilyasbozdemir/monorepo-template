using MongoDBServerAPI.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MongoDBServerAPI.Controllers.v1;


[ApiController]
[Route("v{version:apiVersion}/webhook")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
public class WebhookController : ControllerBase
{
    // Generic event alımı
    [HttpPost("receive")]
    public IActionResult ReceiveEvent([FromBody] WebhookEvent payload)
    {
        Console.WriteLine($"Webhook event received: {payload.EventType}");
        // payload.Data ile işleyebilirsin
        return Ok(new { success = true, message = "Event received" });
    }

    // Event health check
    [HttpGet("ping")]
    public IActionResult Ping() => Ok(new { success = true, message = "Webhook controller is alive" });
}


public class WebhookEvent
{
    public string EventType { get; set; } = default!;
    public object Data { get; set; } = default!;
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}
