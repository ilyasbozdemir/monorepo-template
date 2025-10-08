using MongoDBServerAPI.Filters;
using MongoDBServerAPI.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MongoDBServerAPI.Controllers.v1;


[ApiController]
[Route("v{version:apiVersion}/example")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
public class ExampleController : ControllerBase
{
    private readonly IRequestSessionContext _session;

    public ExampleController(IRequestSessionContext session)
    {
        _session = session;
    }

    [HttpGet("demo")]
    public IActionResult Demo()
    {
        var id = _session.RequestId;
        var user = _session.UserName;
        return Ok(new { id, user });
    }
}
