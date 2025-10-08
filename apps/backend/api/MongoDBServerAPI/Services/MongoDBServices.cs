using System.Text.Json;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDBServerAPI.Exceptions;
using MongoDBServerAPI.Interfaces;

namespace MongoDBServerAPI.Services;

public class DatabaseService : IDatabaseService
{
    private readonly IMongoClient _client;

    public DatabaseService(IMongoClient client)
    {
        _client = client;
    }

    public async Task<BsonDocument> GetByIdAsync(string dbName, string collectionName, string id)
    {
        var collection = _client.GetDatabase(dbName).GetCollection<BsonDocument>(collectionName);
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
        return await collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Dictionary<string, object>>> GetAllAsync(
        string dbName,
        string collectionName,
        int? page = null,
        int? size = null
    )
    {
        var collection = _client.GetDatabase(dbName).GetCollection<BsonDocument>(collectionName);
        var totalCount = await collection.CountDocumentsAsync(new BsonDocument());

        int take = size.HasValue && size > 0 ? size.Value : (int)totalCount;
        int skip = page.HasValue && page > 0 ? (page.Value - 1) * take : 0;

        var docs = await collection.Find(new BsonDocument()).Skip(skip).Limit(take).ToListAsync();

        return docs.Select(d =>
            {
                var dict = d.ToDictionary();
                if (dict.ContainsKey("_id"))
                    dict["_id"] = d["_id"].ToString();
                return dict;
            })
            .ToList();
    }

    public async Task<ObjectId> InsertAsync(
        string dbName,
        string collectionName,
        BsonDocument document
    )
    {
        var collection = _client.GetDatabase(dbName).GetCollection<BsonDocument>(collectionName);
        await collection.InsertOneAsync(document);
        return document["_id"].AsObjectId;
    }

    public async Task InsertManyAsync(
        string dbName,
        string collectionName,
        IEnumerable<BsonDocument> documents
    )
    {
        var collection = _client.GetDatabase(dbName).GetCollection<BsonDocument>(collectionName);
        await collection.InsertManyAsync(documents);
    }

    public async Task<long> UpdateAsync(
        string dbName,
        string collectionName,
        string id,
        BsonDocument updateData
    )
    {
        var collection = _client.GetDatabase(dbName).GetCollection<BsonDocument>(collectionName);
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
        var update = new BsonDocument("$set", updateData);
        var result = await collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount;
    }

    public async Task<long> DeleteAsync(string dbName, string collectionName, string id)
    {
        var collection = _client.GetDatabase(dbName).GetCollection<BsonDocument>(collectionName);
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
        var result = await collection.DeleteOneAsync(filter);
        return result.DeletedCount;
    }

    public async Task<List<Dictionary<string, object>>> AggregateAsync(
        string dbName,
        string collectionName,
        JsonElement body
    )
    {
        if (body.ValueKind != JsonValueKind.Array)
            throw new ApiException("Pipeline JSON array olmalı", 400);

        try
        {
            var database = _client.GetDatabase(dbName);

            var pipelineArray = new BsonArray(
                body.EnumerateArray().Select(e => BsonDocument.Parse(e.GetRawText()))
            );
            var pipelineDocs = pipelineArray.Select(b => b.AsBsonDocument).ToArray();
            var pipelineDef = PipelineDefinition<BsonDocument, BsonDocument>.Create(pipelineDocs);

            var collection = database.GetCollection<BsonDocument>(collectionName);
            var results = await collection.Aggregate(pipelineDef).ToListAsync();

            return results
                .Select(d =>
                {
                    var dict = d.ToDictionary();
                    if (dict.ContainsKey("_id"))
                        dict["_id"] = d["_id"].ToString();
                    return dict;
                })
                .ToList();
        }
        catch (MongoException ex)
        {
            throw new ApiException($"MongoDB hatası: {ex.Message}", 500, ex);
        }
        catch (Exception ex)
        {
            throw new ApiException($"Beklenmeyen hata: {ex.Message}", 500, ex);
        }
    }
}

public class DatabaseAdminService : IDatabaseAdminService
{
    private readonly IMongoClient _client;

    public DatabaseAdminService(IMongoClient client)
    {
        _client = client;
    }

    public async Task CreateCollectionAsync(string dbName, string collectionName)
    {
        await _client.GetDatabase(dbName).CreateCollectionAsync(collectionName);
    }

    public async Task DeleteCollectionAsync(string dbName, string collectionName)
    {
        await _client.GetDatabase(dbName).DropCollectionAsync(collectionName);
    }

    public async Task<List<string>> ListCollectionsAsync(string dbName)
    {
        return await _client.GetDatabase(dbName).ListCollectionNames().ToListAsync();
    }
}

public class AuthService : IAuthService
{
    private readonly IMongoClient _client;
    private readonly string _dbName = "public";

    public AuthService(IMongoClient client)
    {
        _client = client;
    }

    public async Task<BsonDocument> AddPublicUserAsync(BsonDocument user)
    {
        var collection = _client.GetDatabase(_dbName).GetCollection<BsonDocument>("users");
        await collection.InsertOneAsync(user);
        return user;
    }

    public async Task<BsonDocument> GetPublicUserAsync(string userId)
    {
        var collection = _client.GetDatabase(_dbName).GetCollection<BsonDocument>("users");
        var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(userId));
        return await collection.Find(filter).FirstOrDefaultAsync();
    }
}

public class StorageService : IStorageService
{
    private readonly IMongoClient _client;
    private readonly string _dbName = "public";

    public StorageService(IMongoClient client)
    {
        _client = client;
    }

    public async Task<BsonDocument> UploadPublicFileAsync(string collection, BsonDocument fileDoc)
    {
        var coll = _client.GetDatabase(_dbName).GetCollection<BsonDocument>(collection);
        await coll.InsertOneAsync(fileDoc);
        return fileDoc;
    }

    public async Task<List<BsonDocument>> GetPublicFilesAsync(string collection)
    {
        var coll = _client.GetDatabase(_dbName).GetCollection<BsonDocument>(collection);
        return await coll.Find(new BsonDocument()).ToListAsync();
    }
}
