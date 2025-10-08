namespace MongoDBServerAPI.Shared.Results;

public class PagedResult<T>
{
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int Size { get; set; }
    public bool IsPrevious { get; set; }
    public bool IsNext { get; set; }
    public List<T> Data { get; set; } = new List<T>();
}
