using System;

namespace Slidezy.Core.Events
{
    public class StartPathEvent
    {
        public Guid Id { get; set; }
        public Coordinate Coordinate { get; set; }
        public Pencil Pencil { get; set; }
    }
}

