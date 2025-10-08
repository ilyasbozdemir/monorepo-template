using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;

namespace MongoDBServerAPI.Filters
{
    /// <summary>
    /// Per-request session benzeri veri tutan ActionFilter
    /// </summary>
    public class RequestSessionFilter : IActionFilter
    {
        public const string SessionKey = "RequestSession"; 

        public void OnActionExecuting(ActionExecutingContext context)
        {
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
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.HttpContext.Items.TryGetValue(SessionKey, out var sessionObj)
                && sessionObj is Dictionary<string, object> sessionData)
            {
                sessionData["EndTime"] = DateTime.UtcNow;
                sessionData["Exception"] = context.Exception?.Message;

                Console.WriteLine("Request Session:");
                foreach (var kvp in sessionData)
                {
                    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
                }
            }
        }
    }
}
