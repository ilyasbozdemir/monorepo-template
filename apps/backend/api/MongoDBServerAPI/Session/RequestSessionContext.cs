using MongoDBServerAPI.Interfaces;

namespace MongoDBServerAPI.Session
{
    public class RequestSessionContext : IRequestSessionContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const string SessionKey = "RequestSession";

        public RequestSessionContext(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private Dictionary<string, object> SessionData =>
            _httpContextAccessor.HttpContext?.Items[SessionKey] as Dictionary<string, object>
            ?? new();

        public string RequestId => SessionData.TryGetValue("RequestId", out var v) ? v.ToString()! : "";
        public DateTime StartTime => SessionData.TryGetValue("StartTime", out var v) ? (DateTime)v : default;
        public string? UserName => SessionData.TryGetValue("User", out var v) ? v.ToString() : null;
        public string? ExceptionMessage => SessionData.TryGetValue("Exception", out var v) ? v.ToString() : null;

        public void Set(string key, object value)
        {
            SessionData[key] = value;
        }

        public T? Get<T>(string key)
        {
            if (SessionData.TryGetValue(key, out var val) && val is T typed)
                return typed;
            return default;
        }
    }
}
