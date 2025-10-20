using System.Net.Http.Json;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MongoDBServerAPI.Background;

public class MongoToElixirBridgeService : BackgroundService
{
    private readonly IMongoClient _client;
    private readonly IHttpClientFactory _httpFactory;
    private readonly ILogger<MongoToElixirBridgeService> _logger;

    public MongoToElixirBridgeService(
        IMongoClient client,
        IHttpClientFactory httpFactory,
        ILogger<MongoToElixirBridgeService> logger)
    {
        _client = client;
        _httpFactory = httpFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var db = _client.GetDatabase("testdb");
        var collection = db.GetCollection<BsonDocument>("messages");

        var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>()
            .Match(_ => true);

        using var cursor = await collection.WatchAsync(pipeline, cancellationToken: stoppingToken);
        _logger.LogInformation("MongoDB Change Stream başlatıldı.");

        while (await cursor.MoveNextAsync(stoppingToken))
        {
            foreach (var change in cursor.Current)
            {
                try
                {
                    var doc = change.FullDocument?.ToDictionary() ?? new Dictionary<string, object>();
                    var payload = new
                    {
                        event_type = change.OperationType.ToString(),
                        collection = "messages",
                        data = doc
                    };

                    var client = _httpFactory.CreateClient();
                    var response = await client.PostAsJsonAsync("http://localhost:4000/api/events", payload, stoppingToken);

                    if (response.IsSuccessStatusCode)
                        _logger.LogInformation("Event gönderildi: {Type}", change.OperationType);
                    else
                        _logger.LogWarning("Elixir'e event gönderilemedi: {Status}", response.StatusCode);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Event gönderme hatası");
                }
            }
        }
    }
}
