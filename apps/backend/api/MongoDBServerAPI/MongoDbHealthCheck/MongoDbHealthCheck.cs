using Microsoft.Extensions.Diagnostics.HealthChecks;
using MongoDB.Bson;
using MongoDB.Driver;


namespace MongoDBServerAPI.HealthChecks;

public class MongoDbHealthCheck : IHealthCheck
{
    private readonly IMongoClient _mongoClient;

    public MongoDbHealthCheck(IMongoClient mongoClient)
    {
        _mongoClient = mongoClient;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var db = _mongoClient.GetDatabase("admin");
            await db.RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1), cancellationToken: cancellationToken);
            return HealthCheckResult.Healthy("MongoDB is connected");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("MongoDB is disconnected", ex);
        }
    }
}