namespace MongoDBServerAPI.Shared.Results;

public class ActionResult<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
}

public class ActionResult
{
    public bool Success { get; set; } = true;
    public string? Message { get; set; }
    public string? Error { get; set; }

    public ActionResult() { }

    public ActionResult(bool success, string? message = null, string? error = null)
    {
        Success = success;
        Message = message;
        Error = error;
    }
}
