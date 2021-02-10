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
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "sessions/{id}")] HttpRequest req, string id,
            ILogger log)
        {

            return new OkObjectResult(new Session
            {
                Id = id,
                SelectedSlideIndex = 0,
                Slides = new[] {new Slide{
                Index = 0 }
                }
            });
        }

        public class Session
        {
            public string Id { get; set; }
            public int SelectedSlideIndex { get; set; }
            public IEnumerable<Slide> Slides {get;set;}
        }

        public class Slide
        {
            public int Index { get; set; }
        }
    }
}
