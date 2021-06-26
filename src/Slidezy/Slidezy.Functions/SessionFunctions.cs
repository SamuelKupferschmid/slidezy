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
using Slidezy.Core;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;

namespace Slidezy.Functions
{
    public static class SessionFunctions
    {
        [FunctionName(nameof(GetSession))]
        public static IActionResult GetSession(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sessions/{sessionId}")] HttpRequest req, string sessionId,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{sessionId}",
                PartitionKey = "{sessionId}")] Session session,
            ILogger log)
        {
            return new OkObjectResult(session);
        }

        [FunctionName(nameof(PostRandomSession))]
        public static IActionResult PostRandomSession(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "sessions/{sessionId}")] Core.Path path, string sessionId,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{sessionId}",
                PartitionKey = "{sessionId}")] Session existingSession,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{sessionId}")] out Session result,
            ILogger log)
        {
            if (existingSession != null)
            {
                result = null;
                return new ConflictResult();
            }
            else
            {
                result = new Session
                {
                    Id = sessionId,
                    Pencil = new Pencil
                    {
                        Color = "hsla(180, 80%, 33.33333333333333%, 0.7)",
                        Width = 12
                    },
                    Slides = new Slide[] { new Slide {
                        Id = Guid.NewGuid(),
                        Index = 0,
                        Paths = new Core.Path[] { }
                    }
                    },
                    SelectedSlideIndex = 0,
                    Ttl = -1
                };
                return new CreatedResult($"/api/sessions/{sessionId}", result);
            }


        }

        [FunctionName(nameof(AddPath))]
        public static void AddPath(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "sessions/{sessionId}/slides/{slideId}")] Core.Path path, string sessionId, Guid slideId,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{sessionId}",
                PartitionKey = "{sessionId}")] Session session,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{sessionId}")] out Session result,
            ILogger log)
        {
            var slide = session.Slides.First(slide => slide.Id == slideId);
            slide.Paths = slide.Paths.Append(path);

            result = session;
        }

        [FunctionName(nameof(SelectedSlide))]
        public static void SelectedSlide(
    [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "sessions/{sessionId}/selected-slide")] SlideSelection selection, string sessionId,
    [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{sessionId}",
                PartitionKey = "{sessionId}")] Session session,
    [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{sessionId}")] out Session result,
    ILogger log)
        {
            var index = session.Slides.ToList().FindIndex(slide => slide.Id == selection.Id);
            session.SelectedSlideIndex = index;

            result = session;
        }

        [FunctionName(nameof(ClearSlidePaths))]
        public static void ClearSlidePaths(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "sessions/{sessionId}/slides/{slideId}/paths")] HttpRequest req, string sessionId, Guid slideId,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{sessionId}",
                PartitionKey = "{sessionId}")] Session session,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{sessionId}")] out Session result,
            ILogger log)
        {
            var slide = session.Slides.First(slide => slide.Id == slideId);
            slide.Paths = Enumerable.Empty<Core.Path>();
            result = session;
        }

        [FunctionName(nameof(RemovePath))]
        public static void RemovePath(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "sessions/{sessionId}/slides/{slideId}/paths/{pathId}")] HttpRequest req, string sessionId, Guid slideId, Guid pathId,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{sessionId}",
                PartitionKey = "{sessionId}")] Session session,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{sessionId}")] out Session result,
            ILogger log)
        {
            var slide = session.Slides.First(slide => slide.Id == slideId);
            slide.Paths = slide.Paths.Where(path => path.Id != pathId);
            result = session;
        }

        [FunctionName(nameof(SetPencil))]
        public static void SetPencil(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "sessions/{sessionId}/pencil")] Pencil pencil, string sessionId,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{sessionId}",
                PartitionKey = "{sessionId}")] Session session,
            [CosmosDB(
                databaseName: "slidezy-db",
                collectionName: "sessions",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{sessionId}")] out Session result,
            ILogger log)
        {
            session.Pencil = pencil;
            result = session;
        }


    }
}
