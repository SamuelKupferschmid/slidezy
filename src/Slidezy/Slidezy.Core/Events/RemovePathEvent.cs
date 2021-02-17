using System;

namespace Slidezy.Core.Events
{
    public class RemovePathEvent
    {
        public Guid SlideId { get; set; }
        public Guid PathId { get; set; }
    }
}

