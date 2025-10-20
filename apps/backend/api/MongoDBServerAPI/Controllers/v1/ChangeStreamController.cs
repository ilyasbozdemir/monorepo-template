using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MongoDBServerAPI.Controllers;

//geçicidir elixir'e vericez bunu
[ApiController]
[Route("v{version:apiVersion}/realtime")]
[ApiVersion("1.0")]
public class ChangeStreamController : ControllerBase
{
    private readonly IMongoClient _client;

    public ChangeStreamController(IMongoClient client)
    {
        _client = client;
    }

    [HttpGet("{dbName}/{collectionName}/watch")]
    public async Task WatchCollection(
        string dbName,
        string collectionName,
        CancellationToken cancellationToken
    )
    {
        var database = _client.GetDatabase(dbName);
        var collection = database.GetCollection<BsonDocument>(collectionName);

        var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>().Match(
            _ => true
        );

        using var cursor = await collection.WatchAsync(
            pipeline,
            cancellationToken: cancellationToken
        );

        Response.ContentType = "text/event-stream";

        while (await cursor.MoveNextAsync(cancellationToken))
        {
            foreach (var change in cursor.Current)
            {
                var json = change.FullDocument?.ToJson() ?? "{}";
                await Response.WriteAsync($"data: {json}\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }
        }
    }
}
