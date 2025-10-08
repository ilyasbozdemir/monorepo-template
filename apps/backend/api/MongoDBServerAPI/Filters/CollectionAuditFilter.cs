using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;

namespace MongoDBServerAPI.Filters
{
    public class CollectionAuditFilter : ActionFilterAttribute
    {
        private readonly string _collectionParam;
        private readonly string _dbParam;
        private const string SessionKey = "RequestSession";
        private const string CollectionKey = "CollectionName";
        private const string DbKey = "DbName";

        // action parametrelerinde collectionName ve dbName varsa onları oku
        public CollectionAuditFilter(string collectionParam = "collectionName", string dbParam = "dbName")
        {
            _collectionParam = collectionParam;
            _dbParam = dbParam;
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

            // --- DB ve Collection parametrelerini oku ---
            if (context.ActionArguments.TryGetValue(_collectionParam, out var collectionValue))
            {
                context.HttpContext.Items[CollectionKey] = collectionValue?.ToString();
            }
            if (context.ActionArguments.TryGetValue(_dbParam, out var dbValue))
            {
                context.HttpContext.Items[DbKey] = dbValue?.ToString();
            }

            // --- Console log ---
            Console.WriteLine("CollectionAuditFilter executing:");
            Console.WriteLine($"RequestId: {sessionData["RequestId"]}");
            Console.WriteLine($"User: {sessionData.GetValueOrDefault("User")}");
            Console.WriteLine($"CollectionName: {context.HttpContext.Items[CollectionKey]}");
            Console.WriteLine($"CollectionName: {context.HttpContext.Items[DbKey]}");

            base.OnActionExecuting(context);
        }
    }
}
