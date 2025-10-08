using MongoDBServerAPI.Filters;
using MongoDBServerAPI.Helpers;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MongoDBServerAPI.Controllers;

/// <summary>
/// DBCollectionsController, MongoDB üzerindeki koleksiyonlar için CRUD işlemlerini sağlar.
/// </summary>
[ApiController]
[Route("v{version:apiVersion}/database-management")]
[ApiVersion("1.0")]
[ServiceFilter(typeof(RequestSessionFilter))]
[ServiceFilter(typeof(CollectionAuditFilter))]
[ServiceFilter(typeof(CollectionMetadataFilter))]
[ValidateDatabaseName]
public class DatabaseManagementController : ControllerBase
{
    private readonly IMongoClient _client;

    public DatabaseManagementController(IMongoClient client)
    {
        _client = client;
    }

    // Tüm database’leri listele
    [HttpGet("list")]
    public IActionResult ListDatabases([FromQuery] bool excludeSystem = true)
    {
        var dbs = _client.ListDatabaseNames().ToList();
        var filteredDbs = DatabaseGuard.FilterSystemDbs(dbs, excludeSystem);
        return Ok(filteredDbs);
    }


    /// <summary>
    /// MongoDB bağlantısını test eder.
    /// </summary>
    [HttpGet("test-connection")]
    public IActionResult TestConnection()
    {
        try
        {
            // DB isimlerini çekerek test edebiliriz
            var dbs = _client.ListDatabaseNames().ToList();

            // Basit bir check: eğer liste alabiliyorsa bağlantı var
            if (dbs.Any())
            {
                return Ok(new
                {
                    serverStatus = "connected",
                    dbStatus = "ready",
                    databases = dbs
                });
            }
            else
            {
                return Ok(new
                {
                    serverStatus = "connected",
                    dbStatus = "empty",
                    databases = dbs
                });
            }
        }
        catch (MongoConnectionException ex)
        {
            // Bağlantı kurulamazsa
            return StatusCode(503, new
            {
                serverStatus = "disconnected",
                dbStatus = "error",
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            // Diğer hatalar
            return StatusCode(500, new
            {
                serverStatus = "error",
                dbStatus = "error",
                message = ex.Message
            });
        }
    }


    [HttpGet("db-summary-list")]
    public IActionResult GetDatabaseSummary([FromQuery] bool excludeSystem = true)
    {
        var dbs = _client.ListDatabaseNames().ToList();
        var filteredDbs = DatabaseGuard.FilterSystemDbs(dbs, excludeSystem);

        var result = new List<object>();

        foreach (var dbName in filteredDbs)
        {
            var db = _client.GetDatabase(dbName);
            var collections = db.ListCollectionNames().ToList();

            var collectionSummaries = new List<object>();
            foreach (var colName in collections)
            {
                var col = db.GetCollection<BsonDocument>(colName);
                var count = col.CountDocuments(new BsonDocument());
                collectionSummaries.Add(new { Name = colName, DocumentCount = count });
            }

            result.Add(
                new
                {
                    Database = dbName,
                    CollectionCount = collections.Count,
                    Collections = collectionSummaries
                }
            );
        }

        return Ok(result);
    }

    // Database detayları: collection sayısı + her collection doc count ve boyut
    [HttpGet("{dbName}/details")]
    [ValidateDatabaseName]
    public IActionResult GetDatabaseDetails(string dbName)
    {
        var dbs = _client.ListDatabaseNames().ToList();
        if (!dbs.Contains(dbName))
            return NotFound($"Database '{dbName}' does not exist.");

        var db = _client.GetDatabase(dbName);
        var collections = db.ListCollectionNames().ToList();

        var collectionSummaries = new List<object>();
        foreach (var colName in collections)
        {
            var stats = db.RunCommand<BsonDocument>(new BsonDocument { { "collStats", colName } });

            var countValue = stats["count"];
            long documentCount = countValue.IsInt32 ? countValue.AsInt32 : countValue.AsInt64;

            collectionSummaries.Add(
                new
                {
                    Name = colName,
                    DocumentCount = documentCount,
                    SizeMB = Math.Round(stats["size"].ToDouble() / (1024 * 1024), 2),
                    StorageMB = Math.Round(stats["storageSize"].ToDouble() / (1024 * 1024), 2)
                }
            );
        }

        return Ok(
            new
            {
                Database = dbName,
                CollectionCount = collections.Count,
                Collections = collectionSummaries
            }
        );
    }

    [HttpPost("create")]
    [ValidateDatabaseName]
    public IActionResult CreateDatabase(
        [FromQuery] string dbName,
        [FromQuery] string? firstCollection = "defaultCollection"
    )
    {
        var dbs = _client.ListDatabaseNames().ToList();
        if (dbs.Contains(dbName))
            return Ok(
              new
              {
                  statusCode = 409,
                  status = false,
                  message = $"Database '{dbName}' already exists."
              });

        var db = _client.GetDatabase(dbName);

        // İlk collection'u oluştur (boş da olsa)
        db.CreateCollection(firstCollection);

        return Ok(
            new
            {
                statusCode = 200,
                status = true,
                message = $"Database '{dbName}' created successfully with initial collection '{firstCollection}'."
            }
        );
    }

    // Database silme (force param ile dolu olsa da silebilirsin)
    [HttpDelete("delete")]
    [ValidateDatabaseName]
    public IActionResult DeleteDatabase([FromQuery] string dbName, [FromQuery] bool force = false)
    {
        if (string.IsNullOrWhiteSpace(dbName))
            return Ok(new
            {
                statusCode = 400,
                status = false,
                message = "Database name is required."
            });

        var dbs = _client.ListDatabaseNames().ToList();
        if (!dbs.Contains(dbName))
            return Ok(new
            {
                statusCode = 404,
                status = false,
                message = $"Database '{dbName}' does not exist."
            });

        var db = _client.GetDatabase(dbName);
        var collections = db.ListCollectionNames().ToList();

        var collectionDetails = new List<object>();
        foreach (var colName in collections)
        {
            var stats = db.RunCommand<BsonDocument>(new BsonDocument { { "collStats", colName } });

            var countValue = stats["count"];
            long documentCount = countValue.IsInt32 ? countValue.AsInt32 : countValue.AsInt64;

            collectionDetails.Add(
                new
                {
                    Name = colName,
                    DocumentCount = documentCount,
                    SizeMB = Math.Round(stats["size"].ToDouble() / (1024 * 1024), 2),
                    StorageMB = Math.Round(stats["storageSize"].ToDouble() / (1024 * 1024), 2)
                }
            );
        }

        if (!force && collections.Any())
        {
            return Ok(new
            {
                statusCode = 409,
                status = false,
                message = $"Database '{dbName}' has {collections.Count} collections. Cannot delete without force=true.",
                collections = collectionDetails
            });
        }

        // Sil
        _client.DropDatabase(dbName);
        return Ok(new
        {
            statusCode = 200,
            status = true,
            message = $"Database '{dbName}' deleted successfully.",
            collectionsDeleted = collectionDetails
        });
    }

    // Belirli database içindeki collection’ları listele
    [HttpGet("{dbName}/collections")]
    [ValidateDatabaseName]
    public IActionResult ListCollections(string dbName)
    {
        var db = _client.GetDatabase(dbName);
        var collections = db.ListCollectionNames().ToList();
        return Ok(collections);
    }
}
