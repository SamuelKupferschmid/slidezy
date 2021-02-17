using System.Collections.Generic;

using Newtonsoft.Json;

namespace Slidezy.Core
{
    public class Session
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        public int? SelectedSlideIndex { get; set; }
        public IEnumerable<Slide> Slides { get; set; }
    }
}
