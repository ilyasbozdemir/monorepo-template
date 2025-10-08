using MongoDBServerAPI.Filters;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MongoDBServerAPI.Controllers.v1;

/*
 
👉 Bu controller, Realtime mantığı için hazırlanıyor.
👉 SignalR ve BackgroundService (IHostedService) ile birlikte çalışacak.
   - BackgroundService ile MongoDB ChangeStream dinlenerek arka planda sürekli değişiklikler takip edilecek.
   - SignalR üzerinden client’lara gerçek zamanlı event push yapılacak.
   - İleride webhook veya başka event routing mekanizmaları eklenebilir.

*/



[ApiController]
[Route("v{version:apiVersion}/realtime")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
public class RealtimeController : ControllerBase
{
    private readonly IMongoClient _client;

    public RealtimeController(IMongoClient client)
    {
        _client = client;
    }

    [HttpGet("{collectionName}/changes")]
    public async Task<IActionResult> GetChanges(
        string collectionName,
        [FromQuery] string dbName,
        [FromQuery] DateTime? since = null
    )
    {
        var database = !string.IsNullOrWhiteSpace(dbName)
            ? _client.GetDatabase(dbName)
            : _client.GetDatabase("staging-mainappdb");

        var collection = database.GetCollection<BsonDocument>(collectionName);

        var filter = since.HasValue
            ? Builders<BsonDocument>.Filter.Gt("updatedAt", since.Value)
            : Builders<BsonDocument>.Filter.Empty;

        var docs = await collection.Find(filter).ToListAsync();

        var list = docs.Select(d =>
            {
                var dict = d.ToDictionary();
                if (dict.ContainsKey("_id"))
                    dict["_id"] = d["_id"].ToString();
                return dict;
            })
            .ToList();

        return Ok(new { since = DateTime.UtcNow, data = list });
    }
}
