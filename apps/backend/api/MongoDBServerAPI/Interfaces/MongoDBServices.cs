using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json;

namespace MongoDBServerAPI.Interfaces;

public interface IDatabaseService
{
    Task<BsonDocument> GetByIdAsync(string dbName, string collectionName, string id);
    Task<List<Dictionary<string, object>>> GetAllAsync(string dbName, string collectionName, int? page = null, int? size = null);
    Task<ObjectId> InsertAsync(string dbName, string collectionName, BsonDocument document);
    Task InsertManyAsync(string dbName, string collectionName, IEnumerable<BsonDocument> documents);
    Task<long> UpdateAsync(string dbName, string collectionName, string id, BsonDocument updateData);
    Task<long> DeleteAsync(string dbName, string collectionName, string id);
    Task<List<Dictionary<string, object>>> AggregateAsync(string dbName, string collectionName, JsonElement body);
}

public interface IDatabaseAdminService
{
    Task CreateCollectionAsync(string dbName, string collectionName);
    Task DeleteCollectionAsync(string dbName, string collectionName);
    Task<List<string>> ListCollectionsAsync(string dbName);
}

public interface IAuthService
{
    Task<BsonDocument> AddPublicUserAsync(BsonDocument user);
    Task<BsonDocument> GetPublicUserAsync(string userId);
}

public interface IStorageService
{
    Task<BsonDocument> UploadPublicFileAsync(string collection, BsonDocument fileDoc);
    Task<List<BsonDocument>> GetPublicFilesAsync(string collection);
}
