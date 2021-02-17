using System;
using System.Linq;

using Slidezy.Core;

using TypeScriptModelsGenerator;
using TypeScriptModelsGenerator.Definitions;

namespace Slidezy.Typegenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            var definition = TypeScriptDefinitionFactory.Create()
                .Include(typeof(Session).Assembly);

            TypeScriptModelsGeneration.Setup(definition, "../../../../../app/Slidezy/src/app/types", options =>
            {
                options.GenerationMode = TypeScriptModelsGenerator.Options.GenerationMode.Crawl;
                options.InitializeTypes = false;
                options.AddNamespaceReplaceRule("Slidezy.Core", string.Empty);
            }).Execute();
        }
    }
}