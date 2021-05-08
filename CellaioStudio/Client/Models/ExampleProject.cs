using CellaioStudio.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CellaioStudio.Client.Models
{
    public class ExampleProject : Project
    {
        public ExampleProject()
        {
            this.Title = "Example 1";
            this.ID = ExampleProjectID;
        }

        public static int ExampleProjectID = -1;
    }
}
