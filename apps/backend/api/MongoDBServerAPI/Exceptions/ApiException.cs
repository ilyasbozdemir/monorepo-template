namespace MongoDBServerAPI.Exceptions;

public class ApiException : Exception
{
    public int StatusCode { get; }

    public ApiException(string message, int statusCode = 500) : base(message)
    {
        StatusCode = statusCode;
    }

    public ApiException(string message, int statusCode, Exception innerException)
        : base(message, innerException)
    {
        StatusCode = statusCode;
    }
}
