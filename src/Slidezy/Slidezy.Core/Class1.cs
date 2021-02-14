using System;
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

    public class Slide
    {
        
        public Guid Id { get; set; }
        public int Index { get; set; }
        public string Background { get; set; }

        public IEnumerable<Path> Paths { get; set; }
    }

    public class Path
    {
        public string Id { get; set; }
        public Pencil Pencil { get; set; }
        public IEnumerable<Coordinate> Coordinates { get; set; }
    }

    public class Pencil
    {
        public double Width { get; set; }
        public string Color { get; set; }
    }

    public class Coordinate
    {
        public double X { get; set; }
        public double Y { get; set; }
    }
}
