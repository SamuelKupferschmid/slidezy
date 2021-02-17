using System;
using System.Collections.Generic;

namespace Slidezy.Core
{
    public class Slide
    {
        
        public Guid Id { get; set; }
        public int Index { get; set; }
        public string Background { get; set; }

        public IEnumerable<Path> Paths { get; set; }
    }
}
