using System;

namespace Slidezy.Core.Events
{
    public class AddSlideEvent
    {
        public Guid Id { get; set; }
        public int Index { get; set; }

        public string Background { get; set; }
    }
}

