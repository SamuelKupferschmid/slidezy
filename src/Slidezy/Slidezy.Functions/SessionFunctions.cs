using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace Slidezy.Functions
{
    public static class SessionFunctions
    {
        [FunctionName(nameof(GetSession))]
        public static IActionResult GetSession(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sessions/{id}")] HttpRequest req, string id,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{id}",
                PartitionKey = "{id}")] Session session,
            ILogger log)
        {
            return new OkObjectResult(session);
        }

        public class Session
        {
            public string Id { get; set; }
            public int? SelectedSlideIndex { get; set; }
            public IEnumerable<Slide> Slides { get; set; }
        }

        public class Slide
        {
            public Guid Id { get; set; }
            public int Index { get; set; }
            public string Background { get; set; }
        }
    }
}
