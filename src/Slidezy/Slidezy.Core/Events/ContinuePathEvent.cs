using System;

namespace Slidezy.Core.Events
{
    public class ContinuePathEvent
    {
        public Guid Id { get; set; }
        public Coordinate Coordinate { get; set; }
    }
}

