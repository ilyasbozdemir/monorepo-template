namespace MongoDBServerAPI.Services;

using StackExchange.Redis;

public class RedisService
{
    private readonly ConnectionMultiplexer _redis;
    private readonly IDatabase _db;

    public RedisService(IConfiguration config)
    {
        _redis = ConnectionMultiplexer.Connect(config["Redis:ConnectionString"]);
        _db = _redis.GetDatabase();
    }

    public async Task<string?> GetCacheAsync(string key)
    {
        return await _db.StringGetAsync(key);
    }

    public async Task SetCacheAsync(string key, string value, TimeSpan ttl)
    {
        await _db.StringSetAsync(key, value, ttl);
    }
}
