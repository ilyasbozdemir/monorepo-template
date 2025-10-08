using Nest;
using System.Text.Json;
namespace MongoDBServerAPI.Services;

public class ElasticService
{
    private readonly ElasticClient _client;

    public ElasticService(string elasticUrl)
    {
        var settings = new Nest.ConnectionSettings(new Uri(elasticUrl));
        _client = new ElasticClient(settings);
    }

    public async Task<ISearchResponse<dynamic>> SearchAsync(string index, object filterJson)
    {
        var jsonFilter = JsonSerializer.Serialize(filterJson);

        var response = await _client.SearchAsync<dynamic>(s => s
            .Index(index)
            .Query(q => q.Raw(jsonFilter))
        );

        return response;
    }
}
