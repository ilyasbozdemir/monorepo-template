using MongoDBServerAPI.Filters;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MongoDBServerAPI.Controllers;

/// <summary>
/// AuthManagementController, kullanıcı kaydı, login ve token işlemlerini yönetir.
/// Keycloak entegrasyonu ile senkronize çalışacaktır.
/// </summary>
[Route("v{version:apiVersion}/auth")]
[ApiVersion("1.0")]
[ApiController]
[ServiceFilter(typeof(RequestSessionFilter))]
public class AuthManagementController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    private readonly IConfiguration _configuration;

    public AuthManagementController(IMongoClient mongoClient, IConfiguration configuration)
    {
        _mongoClient = mongoClient;
        _configuration = configuration;
        var database = _mongoClient.GetDatabase("AuthDB");
    }

    /// <summary>
    /// Yeni kullanıcı kaydı oluşturur.
    /// </summary>
    /// <param name="username">Kullanıcının kullanıcı adı</param>
    /// <param name="password">Kullanıcının şifresi</param>
    [HttpPost("register")]
    public async Task<IActionResult> Register(string username, string password)
    {
        return BadRequest("Registration is not implemented yet.");
    }

    /// <summary>
    /// Kullanıcı giriş işlemi yapar.
    /// </summary>
    /// <param name="username">Kullanıcının kullanıcı adı</param>
    /// <param name="password">Kullanıcının şifresi</param>
    [HttpPost("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        return BadRequest("Login is not implemented yet.");
    }

    /// <summary>
    /// Dış sistem (Keycloak) üzerinden giriş işlemi yapar.
    /// </summary>
    /// <param name="externalToken">Keycloak veya başka dış sistemden alınan token</param>
    [HttpPost("external-login")]
    public async Task<IActionResult> ExternalLogin(string externalToken)
    {
        return BadRequest("External login is not implemented yet.");
    }

    /// <summary>
    /// Kullanıcı için refresh token oluşturur.
    /// </summary>
    /// <param name="refreshToken">Mevcut refresh token</param>
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken(string refreshToken)
    {
        return BadRequest("Refresh token is not implemented yet.");
    }

    /// <summary>
    /// Kullanıcı çıkış yapar.
    /// </summary>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out successfully", success = true });
    }
}
