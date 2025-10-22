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
        // 🔹 Cluster-level değişiklikleri dinlemek için client üzerinden başlat
        var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>()
            .Match(_ => true);

        _logger.LogInformation("MongoDB Cluster-level Change Stream başlatılıyor...");

        // 🔹 Tüm veritabanlarını ve koleksiyonları izle
        using var cursor = await _client.WatchAsync(pipeline, cancellationToken: stoppingToken);

        _logger.LogInformation("MongoDB Cluster-level Change Stream aktif ✅");

        while (await cursor.MoveNextAsync(stoppingToken))
        {
            foreach (var change in cursor.Current)
            {
                try
                {
                    // 🔹 DB ve koleksiyon ismini yakala
                    var dbName = change.CollectionNamespace.DatabaseNamespace.DatabaseName;
                    var collName = change.CollectionNamespace.CollectionName;

                    // 🔹 FullDocument varsa toDictionary()’e çevir
                    var doc = change.FullDocument?.ToDictionary() ?? new Dictionary<string, object>();

                    // 🔹 Elixir'e gönderilecek payload
                    var payload = new
                    {
                        event_type = change.OperationType.ToString(),
                        database = dbName,
                        collection = collName,
                        data = doc
                    };

                    // 🔹 Elixir API endpoint’ine gönder
                    var client = _httpFactory.CreateClient();
                    var response = await client.PostAsJsonAsync(
                        "http://localhost:4000/api/events",
                        payload,
                        stoppingToken
                    );

                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogInformation("Event gönderildi: {Db}.{Coll} ({Type})",
                            dbName, collName, change.OperationType);
                    }
                    else
                    {
                        _logger.LogWarning("Elixir'e event gönderilemedi: {Status}", response.StatusCode);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Event gönderme hatası");
                }
            }
        }
    }
}
