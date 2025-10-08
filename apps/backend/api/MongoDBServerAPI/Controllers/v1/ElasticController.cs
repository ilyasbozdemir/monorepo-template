using MongoDBServerAPI.Filters;
using Microsoft.AspNetCore.Mvc;
using Nest; // Elasticsearch client
using System.Text.Json;

namespace MongoDBServerAPI.Controllers;

[ApiController]
[Route("v{version:apiVersion}/elastic")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
public class ElasticController : ControllerBase
{
    private readonly IElasticClient _elasticClient;

    public ElasticController(IElasticClient elasticClient)
    {
        _elasticClient = elasticClient;
    }

    // Index oluştur
    [HttpPost("{indexName}/create")]
    public IActionResult CreateIndex(string indexName)
    {
        var existsResponse = _elasticClient.Indices.Exists(indexName);
        if (existsResponse.Exists) return Conflict($"Index '{indexName}' already exists.");

        var createResponse = _elasticClient.Indices.Create(indexName);
        if (!createResponse.IsValid) return BadRequest(createResponse.ServerError);

        return Ok($"Index '{indexName}' created successfully.");
    }

    // Doküman ekle
    [HttpPost("{indexName}/insert")]
    public IActionResult InsertDocument(string indexName, [FromBody] JsonElement document)
    {
        var doc = JsonSerializer.Deserialize<Dictionary<string, object>>(document.GetRawText());
        var response = _elasticClient.Index(doc, idx => idx.Index(indexName));
        if (!response.IsValid) return BadRequest(response.ServerError);

        return Ok(new { Id = response.Id });
    }

    // Aggregation örneği (field bazlı count)
    [HttpPost("{indexName}/aggregate")]
    public IActionResult Aggregate(string indexName, [FromBody] JsonElement filter)
    {
        var filterDict = JsonSerializer.Deserialize<Dictionary<string, object>>(filter.GetRawText());

        var searchResponse = _elasticClient.Search<object>(s => s
            .Index(indexName)
            .Query(q =>
            {
                QueryContainer container = null;
                foreach (var kv in filterDict)
                {
                    container &= q.Term(kv.Key, kv.Value);
                }
                return container;
            })
            .Aggregations(a => a
                .Terms("aggregation_results", t => t.Field("someField.keyword"))
            )
        );

        return Ok(searchResponse.Aggregations);
    }
}
