using System.Text.Json;
using MongoDBServerAPI.Filters;
using MongoDBServerAPI.Interfaces;
using MongoDBServerAPI.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Nest;

namespace MongoDBServerAPI.Controllers;

[ApiController]
[Route("v{version:apiVersion}/collection-management")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
[ServiceFilter(typeof(CollectionAuditFilter))]
[ServiceFilter(typeof(CollectionMetadataFilter))]
[ValidateDatabaseName]
public class CollectionManagementController : ControllerBase
{
    private readonly IMongoClient _client;
    private readonly IDatabaseService _dbService;

    public CollectionManagementController(IMongoClient client,
        IDatabaseService dbService,
        IConfiguration config)
    {
        _client = client;
        _dbService = dbService;
    }

    // Collection listesi

    [HttpGet("list")]
    public IActionResult ListCollections([FromQuery] string dbName)
    {
        var database = _client.GetDatabase(dbName);

        var collections = database.ListCollectionNames().ToList();
        return Ok(collections);
    }

    // Belirli database’e collection ekle
    [HttpPost("{dbName}/create-collection")]

    public IActionResult CreateCollection(string dbName, [FromQuery] string collectionName)
    {
        if (string.IsNullOrWhiteSpace(collectionName))
        {
            var responseData = new Shared.Results.ActionResult
            {
                Success = false,
                Message = "Collection name is required",
            };

            return Ok(responseData);
        }

        var db = _client.GetDatabase(dbName);
        var existing = db.ListCollectionNames().ToList();

        if (existing.Contains(collectionName))
        {
            var responseData = new Shared.Results.ActionResult
            {
                Success = false,
                Message = $"Collection '{collectionName}' already exists",
            };
            return Ok(responseData);
        }

        db.CreateCollection(collectionName);

        return Ok(
            new Shared.Results.ActionResult<string>
            {
                Success = true,
                Message =
                    $"Collection '{collectionName}' created successfully in database '{dbName}'.",
                Data = collectionName
            }
        );
    }

    // Belirli database’den collection sil
    [HttpDelete("{dbName}/delete-collection")]
    public IActionResult DeleteCollection(string dbName, [FromQuery] string collectionName)
    {
        if (string.IsNullOrWhiteSpace(collectionName))
        {
            var response = new Shared.Results.ActionResult
            {
                Success = false,
                Message = "Collection name is required"
            };
            return Ok(response);
        }

        var db = _client.GetDatabase(dbName);
        var existing = db.ListCollectionNames().ToList();

        if (!existing.Contains(collectionName))
        {
            var response = new Shared.Results.ActionResult
            {
                Success = false,
                Message = $"Collection '{collectionName}' does not exist in database '{dbName}'."
            };
            return Ok(response);
        }

        db.DropCollection(collectionName);

        var successResponse = new Shared.Results.ActionResult<string>
        {
            Success = true,
            Message =
                $"Collection '{collectionName}' deleted successfully from database '{dbName}'.",
            Data = collectionName
        };

        return Ok(successResponse);
    }

    // Tek bir collection içindeki tüm dokümanları getir
    [HttpGet("{collectionName}")]
  
    public IActionResult GetAll(
        [FromQuery] string dbName,
        string collectionName,
        [FromQuery] int? page = null,
        [FromQuery] int? size = null
    )
    {
        var database = _client.GetDatabase(dbName);
        var collection = database.GetCollection<BsonDocument>(collectionName);

        var totalCount = collection.CountDocuments(new BsonDocument());

        int take = size.HasValue && size > 0 ? size.Value : (int)totalCount;
        int skip = page.HasValue && page > 0 ? (page.Value - 1) * take : 0;

        var docs = collection.Find(new BsonDocument()).Skip(skip).Limit(take).ToList();

        var list = docs.Select(d =>
            {
                var dict = d.ToDictionary();
                if (dict.ContainsKey("_id"))
                    dict["_id"] = d["_id"].ToString();
                return dict;
            })
            .ToList();

        return Ok(
            new
            {
                totalCount,
                page = page ?? 1,
                size = size ?? (int)totalCount,
                isPrevious = (page ?? 1) > 1,
                isNext = (page ?? 1) * take < totalCount,
                data = list
            }
        );
    }

    [HttpGet("{collectionName}/cursor")]
    [ValidateDatabaseName]
    public IActionResult GetAllWithCursor(
        string? dbName,
        string collectionName,
        [FromQuery] int? page = null,
        [FromQuery] int? size = null
    )
    {
        var database = _client.GetDatabase(dbName);

        var collection = database.GetCollection<BsonDocument>(collectionName);

        var totalCount = collection.CountDocuments(new BsonDocument());

        int take = size.HasValue && size > 0 ? size.Value : (int)totalCount;
        int skip = page.HasValue && page > 0 ? (page.Value - 1) * take : 0;

        var cursor = collection.Find(new BsonDocument()).Skip(skip).Limit(take).ToCursor();

        var list = new List<Dictionary<string, object>>();

        foreach (var doc in cursor.ToEnumerable())
        {
            var dict = doc.ToDictionary();
            if (dict.ContainsKey("_id"))
                dict["_id"] = doc["_id"].ToString();
            list.Add(dict);
        }

        return Ok(
            new
            {
                totalCount,
                page = page ?? 1,
                size = take,
                isPrevious = (page ?? 1) > 1,
                isNext = (page ?? 1) * take < totalCount,
                data = list
            }
        );
    }

    [HttpPost("{collectionName}/aggregate-run")]
    [ValidateDatabaseName]
    public async Task<IActionResult> AggregateRun(
        string dbName,
        string collectionName,
        [FromBody] JsonElement body
    )
    {

        var result = await _dbService.AggregateAsync(dbName, collectionName, body);
        return Ok(result);

    }

    [HttpPost("{collectionName}/insert")]
    [ValidateDatabaseName]
    public async Task<IActionResult> Insert(
        [FromQuery] string dbName,
        string collectionName,
        [FromBody] JsonElement data
    )
    {
        var database = _client.GetDatabase(dbName);

        var collection = database.GetCollection<BsonDocument>(collectionName);

        var document = BsonDocument.Parse(data.ToString());


        if (document.Contains("_id"))
        {
            document.Remove("_id");
        }

        await collection.InsertOneAsync(document);

        return Ok(new { message = "Inserted successfully", id = document["_id"].ToString() });
    }

    [HttpPost("{collectionName}/insert-many")]
    [ValidateDatabaseName]
    public async Task<IActionResult> InsertMany(
        [FromQuery] string dbName,
        string collectionName,
        [FromBody] JsonElement data
    )
    {
        var database = _client.GetDatabase(dbName);

        var collection = database.GetCollection<BsonDocument>(collectionName);

        if (data.ValueKind != JsonValueKind.Array)
            return BadRequest("JSON array bekleniyor.");

        var docs = data.EnumerateArray().Select(d => BsonDocument.Parse(d.ToString())).ToList();

        await collection.InsertManyAsync(docs);

        return Ok(new { message = $"{docs.Count} belge eklendi" });
    }

    // Tek bir collection içindeki tek dokümanı getir
    [HttpGet("{collectionName}/{id}")]
    [ValidateDatabaseName]
    public IActionResult GetById([FromQuery] string dbName, string collectionName, string id)
    {
        if (!ObjectId.TryParse(id, out ObjectId objectId))
            return BadRequest("Geçersiz ObjectId formatı.");

        var database = _client.GetDatabase(dbName);

        var collection = database.GetCollection<BsonDocument>(collectionName);
        var filter = Builders<BsonDocument>.Filter.Eq("_id", objectId);
        var doc = collection.Find(filter).FirstOrDefault();

        if (doc == null)
            return NotFound();

        // BsonDocument -> Dictionary -> JSON
        var result = doc.ToDictionary();

        // _id'yi string'e çevir (GetAll ile aynı format)
        if (result.ContainsKey("_id"))
        {
            result["_id"] = doc["_id"].ToString();
        }

        return Ok(result);
    }

    // Collection içindeki bir dokümanı güncelle
    [HttpPut("{collectionName}/update/{id}")]
    [ValidateDatabaseName]
    public IActionResult UpdateDocument(
        [FromQuery] string dbName,
        string collectionName,
        string id,
        [FromBody] JsonElement data
    )
    {
        var database = _client.GetDatabase(dbName);

        var collection = database.GetCollection<BsonDocument>(collectionName);
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));

        // JsonElement -> BsonDocument
        var bsonData = BsonDocument.Parse(data.ToString());

        var update = new BsonDocument("$set", bsonData);
        var result = collection.UpdateOne(filter, update);
        return Ok(result.ModifiedCount);
    }

    // Collection içindeki bir dokümanı sil

    [HttpDelete("{collectionName}/delete/{id}")]
    [ValidateDatabaseName]
    public async Task<IActionResult> Delete(
        [FromQuery] string dbName,
        string collectionName,
        string id
    )
    {
        var database = _client.GetDatabase(dbName);

        var collection = database.GetCollection<BsonDocument>(collectionName);
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
        var result = await collection.DeleteOneAsync(filter);
        return Ok(result.DeletedCount);
    }



    // Validator ekle/güncelle
    [HttpPost("{collectionName}/validator")]
    public IActionResult SetValidator(
        [FromQuery] string dbName,
        string collectionName,
        [FromBody] JsonElement schema
    )
    {
        var database = _client.GetDatabase(dbName);

        var command = new BsonDocument
    {
        { "collMod", collectionName },
        { "validator", BsonDocument.Parse(schema.ToString()) },
        { "validationLevel", "strict" },
        { "validationAction", "error" }
    };

        try
        {
            database.RunCommand<BsonDocument>(command);
            return Ok(new { Success = true, Message = "Validator applied successfully." });
        }
        catch (MongoCommandException ex) when (ex.Message.Contains("NamespaceNotFound"))
        {
            return NotFound(new { Success = false, Message = $"Collection '{collectionName}' not found." });
        }
        catch (Exception e)
        {
            return BadRequest(new { Success = false, Message = e.Message });
        }
    }

    // Mevcut validator'u getir
    [HttpGet("{collectionName}/validator")]
    public IActionResult GetValidator([FromQuery] string dbName, string collectionName)
    {
        var database = _client.GetDatabase(dbName);

        var collectionInfo = database.ListCollections(new ListCollectionsOptions
        {
            Filter = Builders<BsonDocument>.Filter.Eq("name", collectionName)
        }).FirstOrDefault();

        if (collectionInfo == null || !collectionInfo.IsBsonDocument)
            return NotFound(new { Success = false, Message = "Collection not found." });

        var doc = collectionInfo.AsBsonDocument;

        // options varsa BsonDocument olarak al, yoksa boş document döndür
        BsonDocument optionsDoc = new BsonDocument();
        if (doc.Contains("options") && doc["options"].IsBsonDocument)
        {
            optionsDoc = doc["options"].AsBsonDocument;
        }

        // validator varsa getir
        BsonDocument validatorDoc = new BsonDocument();
        if (optionsDoc.Contains("validator") && optionsDoc["validator"].IsBsonDocument)
        {
            validatorDoc = optionsDoc["validator"].AsBsonDocument;
        }

        return Ok(new
        {
            Success = true,
            Validator = validatorDoc
        });
    }

    // GET: /v1/collection-management/{collectionName}/indexes?dbName=TESTDB
    [HttpGet("{collectionName}/indexes")]
    public IActionResult GetIndexes([FromQuery] string dbName, string collectionName)
    {
        try
        {
            var database = _client.GetDatabase(dbName);
            var collection = database.GetCollection<BsonDocument>(collectionName);

            var indexes = collection.Indexes.List().ToList();
            return Ok(new
            {
                Success = true,
                Indexes = indexes.Select(i => BsonTypeMapper.MapToDotNetValue(i)).ToList()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Success = false, Message = ex.Message });
        }
    }


    // POST: /v1/collection-management/{collectionName}/indexes?dbName=TESTDB
    [HttpPost("{collectionName}/indexes")]
    public IActionResult CreateIndex([FromQuery] string dbName, string collectionName, [FromBody] JsonElement body)
    {
        try
        {
            var database = _client.GetDatabase(dbName);
            var collection = database.GetCollection<BsonDocument>(collectionName);

            // body içinde keys
            var keysDict = JsonSerializer.Deserialize<Dictionary<string, int>>(body.GetProperty("keys").GetRawText());
            var keys = new BsonDocument(keysDict!);

            // options (varsa)
            CreateIndexOptions? options = null;
            if (body.TryGetProperty("options", out var optionsElement))
            {
                options = new CreateIndexOptions
                {
                    Unique = optionsElement.TryGetProperty("unique", out var u) && u.GetBoolean(),
                    Name = optionsElement.TryGetProperty("name", out var n) ? n.GetString() : null
                };
            }

            var model = new CreateIndexModel<BsonDocument>(new BsonDocumentIndexKeysDefinition<BsonDocument>(keys), options);
            var result = collection.Indexes.CreateOne(model);

            return Ok(new { Success = true, Message = "Index created successfully.", IndexName = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Success = false, Message = ex.Message });
        }
    }



    // DELETE: /v1/collection-management/{collectionName}/indexes/{indexName}?dbName=TESTDB
    [HttpDelete("{collectionName}/indexes/{indexName}")]
    public IActionResult DeleteIndex([FromQuery] string dbName, string collectionName, string indexName)
    {
        try
        {
            var database = _client.GetDatabase(dbName);
            var collection = database.GetCollection<BsonDocument>(collectionName);

            collection.Indexes.DropOne(indexName);

            return Ok(new { Success = true, Message = $"Index '{indexName}' deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Success = false, Message = ex.Message });
        }
    }


   



}
