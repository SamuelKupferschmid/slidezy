using System;
using System.Collections.Generic;

namespace Slidezy.Core
{
    public class Path
    {
        public Guid Id { get; set; }
        public Pencil Pencil { get; set; }
        public IEnumerable<Coordinate> Coordinates { get; set; }
    }
}
