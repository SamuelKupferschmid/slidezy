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
        public static async Task<IActionResult> GetSession(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sessions/{id}")] HttpRequest req, string id,
            ILogger log)
        {
            return await Task.FromResult(new OkObjectResult(new Session
            {
                Id = id,
                SelectedSlideIndex = null,
                Slides = Enumerable.Empty<Slide>()
            }));
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
        }
    }
}
