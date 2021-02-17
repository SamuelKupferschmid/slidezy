using System;

namespace Slidezy.Core.Events
{
    public class CompletePathEvent
    {
        public Guid Id { get; set; }
        public Coordinate Coordinate { get; set; }
    }
}

