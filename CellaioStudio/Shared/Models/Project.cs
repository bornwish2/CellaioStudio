using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CellaioStudio.Shared.Models
{
    [Serializable]
    public class Project
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Thumbnail { get; set; }
        public string Content { get; set; }
    }
}
