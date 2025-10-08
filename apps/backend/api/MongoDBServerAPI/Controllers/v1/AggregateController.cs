using Elasticsearch.Net;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Nest;
using System.Text.Json;

namespace MongoDBServerAPI.Controllers;

//[ApiController]
[NonController]
[Route("v{version:apiVersion}/aggregate")]
[ApiVersion("1.0")]
public class AggregateController : ControllerBase
{
    private readonly IElasticClient _elasticClient;
    private readonly IMongoDatabase _mongoDb;
    private readonly IMongoClient _mongoClient;


    private IMongoDatabase Database =>
        _mongoClient.GetDatabase(HttpContext.Items["DatabaseName"]?.ToString() ?? "staging-mainappdb");


    public AggregateController(IMongoClient mongoClient, IElasticClient elasticClient, IConfiguration config)
    {
        _mongoClient = mongoClient;
    }

    [HttpPost("run")]
    public async Task<IActionResult> Run([FromBody] JsonElement body)
    {
        try
        {
            var bodyDict = JsonSerializer.Deserialize<Dictionary<string, object>>(body.GetRawText());

            if (!bodyDict.ContainsKey("engine"))
                return BadRequest("Engine parametresi gerekli: 'mongo' veya 'elk'");

            string engine = bodyDict["engine"].ToString().ToLower();

            if (engine == "mongo")
            {
                if (!bodyDict.ContainsKey("pipeline"))
                    return BadRequest("Mongo pipeline JSON gerekli");

                var pipelineJson = bodyDict["pipeline"].ToString();

                // PipelineDefinition oluştur
                var pipelineArray = BsonSerializer.Deserialize<BsonArray>(pipelineJson);
                var pipelineDocs = pipelineArray.Select(b => b.AsBsonDocument).ToArray();
                var pipelineDef = PipelineDefinition<BsonDocument, BsonDocument>.Create(pipelineDocs);

                var collection = _mongoDb.GetCollection<BsonDocument>("CarListings");
                var results = await collection.Aggregate(pipelineDef).ToListAsync();

                return Ok(results);
            }
            else if (engine == "elk")
            {
                if (!bodyDict.ContainsKey("query"))
                    return BadRequest("Elasticsearch query JSON gerekli");

                var queryDsl = bodyDict["query"];
                var indexName = "carlistings";

                var response = await _elasticClient.LowLevel.SearchAsync<StringResponse>(
                    indexName,
                    PostData.String(JsonSerializer.Serialize(queryDsl))
                );

                return Ok(response.Body);
            }
            else
            {
                return BadRequest("Engine parametresi 'mongo' veya 'elk' olmalı");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }

}
