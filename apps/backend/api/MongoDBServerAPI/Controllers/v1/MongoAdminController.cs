using System.Text.Json;
using MongoDBServerAPI.Filters;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MongoDBServerAPI.Controllers.v1;

[ApiController]
[Route("v{version:apiVersion}/admin/mongo")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
//test aşamasında
public class MongoAdminController : ControllerBase
{
    private readonly IMongoClient _client;
    private IMongoDatabase SystemDb => _client.GetDatabase("gp_system");

    public MongoAdminController(IMongoClient client)
    {
        _client = client;
    }

    private IMongoDatabase GetDatabase(string dbName) => _client.GetDatabase(dbName);

    // -----------------------------
    // Index işlemleri
    // -----------------------------

    [HttpPost("{dbName}/{collectionName}/apply-indexes")]
    public IActionResult ApplyIndexes(
        string dbName,
        string collectionName,
        [FromBody] JsonElement indexesJson
    )
    {
        var database = GetDatabase(dbName);
        var collection = database.GetCollection<BsonDocument>(collectionName);

        try
        {
            foreach (var indexElem in indexesJson.EnumerateArray())
            {
                var keysDoc = indexElem.GetProperty("keys").ToString();
                var keysBson = BsonDocument.Parse(keysDoc);

                var indexOptions = new CreateIndexOptions();
                if (
                    indexElem.TryGetProperty("unique", out var uniqueProp)
                    && uniqueProp.GetBoolean()
                )
                    indexOptions.Unique = true;

                if (
                    indexElem.TryGetProperty("sparse", out var sparseProp)
                    && sparseProp.GetBoolean()
                )
                    indexOptions.Sparse = true;

                if (indexElem.TryGetProperty("expireAfterSeconds", out var ttlProp))
                    indexOptions.ExpireAfter = TimeSpan.FromSeconds(ttlProp.GetInt32());

                var indexModel = new CreateIndexModel<BsonDocument>(keysBson, indexOptions);
                collection.Indexes.CreateOne(indexModel);
            }

            return Ok(new { message = "Indexes applied successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("{dbName}/{collectionName}/list-indexes")]
    public IActionResult ListIndexes(string dbName, string collectionName)
    {
        var database = GetDatabase(dbName);
        var collection = database.GetCollection<BsonDocument>(collectionName);

        var indexes = collection.Indexes.List().ToList();
        return Ok(indexes);
    }

    // -----------------------------
    // Rule işlemleri (crud)
    // -----------------------------
    [HttpPost("{dbName}/{collectionName}/apply-rules")]
    public IActionResult ApplyRules(
        string dbName,
        string collectionName,
        [FromBody] JsonElement rulesJson
    )
    {
        // Basit sistem collection örneği: "gp_system_collections"
        var sysCollection = GetDatabase(dbName)
            .GetCollection<BsonDocument>("gp_system_collections");

        var doc = new BsonDocument
        {
            { "collectionName", collectionName },
            { "rules", BsonDocument.Parse(rulesJson.ToString()) },
            { "updatedAt", DateTime.UtcNow }
        };

        sysCollection.ReplaceOne(
            Builders<BsonDocument>.Filter.Eq("collectionName", collectionName),
            doc,
            new ReplaceOptions { IsUpsert = true }
        );

        return Ok(new { message = "Rules applied successfully." });
    }

    [HttpGet("{dbName}/{collectionName}/get-rules")]
    public IActionResult GetRules(string dbName, string collectionName)
    {
        var sysCollection = GetDatabase(dbName)
            .GetCollection<BsonDocument>("gp_system_collections");
        var ruleDoc = sysCollection
            .Find(Builders<BsonDocument>.Filter.Eq("collectionName", collectionName))
            .FirstOrDefault();
        return Ok(ruleDoc);
    }

    // gp_system_collections'dan tüm koleksiyonları al
    private List<BsonDocument> GetAllSystemCollections()
    {
        // Varsayılan db listesi
        var databases = new[] { "mainappdb", "staging-mainappdb" };
        var allCollections = new List<BsonDocument>();

        foreach (var dbName in databases)
        {
            var db = _client.GetDatabase(dbName);
            var systemCollection = db.GetCollection<BsonDocument>("gp_system_collections");
            allCollections.AddRange(systemCollection.Find(new BsonDocument()).ToList());
        }

        return allCollections;
    }

    [HttpPost("apply-all-indexes")]
    public IActionResult ApplyAllIndexes()
    {
        var allCollections = GetAllSystemCollections();

        foreach (var col in allCollections)
        {
            if (!col.Contains("indexes") || !col.Contains("dbName") || !col.Contains("name"))
                continue;

            var dbName = col["dbName"].AsString;
            var collectionName = col["name"].AsString;
            var indexes = col["indexes"].AsBsonArray;

            var db = _client.GetDatabase(dbName);
            var targetCollection = db.GetCollection<BsonDocument>(collectionName);

            foreach (var idx in indexes)
            {
                var idxDoc = idx.AsBsonDocument;
                var keys = idxDoc["keys"].AsBsonDocument;
                var options = new CreateIndexOptions
                {
                    Unique = idxDoc.Contains("unique") ? idxDoc["unique"].AsBoolean : false,
                    Sparse = idxDoc.Contains("sparse") ? idxDoc["sparse"].AsBoolean : false,
                    ExpireAfter = idxDoc.Contains("expireAfterSeconds")
                        ? TimeSpan.FromSeconds(idxDoc["expireAfterSeconds"].AsInt32)
                        : (TimeSpan?)null
                };

                var model = new CreateIndexModel<BsonDocument>(keys, options);
                targetCollection.Indexes.CreateOne(model);
            }
        }

        return Ok(new { message = "All indexes applied successfully" });
    }

    [HttpPost("apply-all-rules")]
    public IActionResult ApplyAllRules()
    {
        var allCollections = GetAllSystemCollections();

        foreach (var col in allCollections)
        {
            if (!col.Contains("rules") || !col.Contains("dbName") || !col.Contains("name"))
                continue;

            var dbName = col["dbName"].AsString;
            var collectionName = col["name"].AsString;

            var db = _client.GetDatabase(dbName);
            var systemCollection = db.GetCollection<BsonDocument>("gp_system_collections");

            var filter = Builders<BsonDocument>.Filter.Eq("name", collectionName);
            var update = Builders<BsonDocument>.Update.Set("rules", col["rules"].AsBsonDocument);

            systemCollection.UpdateOne(filter, update);
        }

        return Ok(new { message = "All rules applied successfully" });
    }
}
