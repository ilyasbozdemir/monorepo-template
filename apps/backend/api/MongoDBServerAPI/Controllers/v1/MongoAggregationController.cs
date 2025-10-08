using MongoDBServerAPI.Filters;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json;

namespace MongoDBServerAPI.Controllers;

[ApiController]
[Route("v{version:apiVersion}/mongo-aggregate")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
public class MongoAggregationController : ControllerBase
{
    private readonly IMongoClient _client;

   private IMongoDatabase Database =>
        _client.GetDatabase(HttpContext.Items["DatabaseName"]?.ToString() ?? "staging-mainappdb");


    public MongoAggregationController(IMongoClient client, IConfiguration config)
    {
        _client = client;
    }

    // Aggregation çalıştır
    [HttpPost("{collectionName}")]
    public IActionResult Aggregate(
        string collectionName,
        [FromQuery] string dbName,
        [FromBody] JsonElement pipelineJson)
    {
        var database = !string.IsNullOrWhiteSpace(dbName)
            ? _client.GetDatabase(dbName)
            : Database;

        var collection = database.GetCollection<BsonDocument>(collectionName);

        if (pipelineJson.ValueKind != JsonValueKind.Array)
            return BadRequest("Pipeline must be a JSON array.");

        var pipeline = new List<BsonDocument>();
        foreach (var stage in pipelineJson.EnumerateArray())
        {
            pipeline.Add(BsonDocument.Parse(stage.ToString()));
        }

        var result = collection.Aggregate<BsonDocument>(pipeline).ToList();

        var output = result.Select(d =>
        {
            var dict = d.ToDictionary();
            if (dict.ContainsKey("_id"))
                dict["_id"] = d["_id"].ToString();
            return dict;
        }).ToList();

        return Ok(new
        {
            count = output.Count,
            data = output
        });
    }
}
