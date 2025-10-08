namespace MongoDBServerAPI.Interfaces;

public interface IRequestSessionContext
{
    string RequestId { get; }
    DateTime StartTime { get; }
    string? UserName { get; }
    string? ExceptionMessage { get; }

    void Set(string key, object value);
    T? Get<T>(string key);
}