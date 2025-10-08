using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;

namespace MongoDBServerAPI.Filters
{
    public class CollectionMetadataFilter : ActionFilterAttribute
    {
        private readonly string _dbParam;
        private readonly string _collectionParam;
        private readonly string _descParam;
        private const string SessionKey = "RequestSession";

        public CollectionMetadataFilter(
            string dbParam = "dbName",
            string collectionParam = "collectionName",
            string descParam = "collectionDesc")
        {
            _dbParam = dbParam;
            _collectionParam = collectionParam;
            _descParam = descParam;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // --- Session başlat ---
            var sessionData = new Dictionary<string, object>
            {
                { "RequestId", Guid.NewGuid().ToString() },
                { "StartTime", DateTime.UtcNow }
            };

            if (context.HttpContext.User.Identity?.IsAuthenticated == true)
            {
                sessionData["User"] = context.HttpContext.User.Identity.Name;
            }

            context.HttpContext.Items[SessionKey] = sessionData;

            // --- Parametreleri oku ---
            context.ActionArguments.TryGetValue(_dbParam, out var dbValue);
            context.ActionArguments.TryGetValue(_collectionParam, out var collectionValue);
            context.ActionArguments.TryGetValue(_descParam, out var descValue);

            var dbName = dbValue?.ToString();
            var collectionName = collectionValue?.ToString();
            var collectionDesc = descValue?.ToString();

            // --- Console log ---
            Console.WriteLine("CollectionMetadataFilter executing:");
            Console.WriteLine($"RequestId: {sessionData["RequestId"]}");
            Console.WriteLine($"User: {sessionData.GetValueOrDefault("User")}");
            Console.WriteLine($"DbName: {dbName}");
            Console.WriteLine($"CollectionName: {collectionName}");
            Console.WriteLine($"CollectionDesc: {collectionDesc}");

            // --- Sahte metadata listesi (yalandan) ---
            if (!string.IsNullOrEmpty(collectionName))
            {
                Console.WriteLine($"Fake Metadata for '{collectionName}':");
                Console.WriteLine($"- Fields: field1, field2, field3");
                Console.WriteLine($"- Indexes: _id, createdAt");
                Console.WriteLine($"- Rules: createRule=@request.auth.id != null");
            }

            base.OnActionExecuting(context);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            // Session log
            if (context.HttpContext.Items.TryGetValue("RequestSession", out var sessionObj)
                && sessionObj is Dictionary<string, object> sessionData)
            {
                sessionData["EndTime"] = DateTime.UtcNow;
                sessionData["Exception"] = context.Exception?.Message;

                Console.WriteLine("Request Session (Completed):");
                foreach (var kvp in sessionData)
                {
                    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
                }
            }

            // Collection audit log
            if (context.HttpContext.Items.TryGetValue("CollectionName", out var collectionName))
            {
                Console.WriteLine("CollectionAuditFilter (Completed):");
                Console.WriteLine($"CollectionName: {collectionName}");
            }

            // Metadata log (yalancı)
            if (context.HttpContext.Items.TryGetValue("DbName", out var dbName) &&
                context.HttpContext.Items.TryGetValue("CollectionDesc", out var collectionDesc) &&
                context.HttpContext.Items.TryGetValue("CollectionName", out var colName))
            {
                Console.WriteLine("CollectionMetadataFilter (Completed):");
                Console.WriteLine($"DbName: {dbName}");
                Console.WriteLine($"CollectionName: {colName}");
                Console.WriteLine($"CollectionDesc: {collectionDesc}");
                Console.WriteLine($"Fake Metadata for '{colName}':");
                Console.WriteLine("- Fields: field1, field2, field3");
                Console.WriteLine("- Indexes: _id, createdAt");
                Console.WriteLine("- Rules: createRule=@request.auth.id != null");
            }

            base.OnActionExecuted(context);
        }

    }
}
