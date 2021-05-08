using CellaioStudio.Client.Models;
using CellaioStudio.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CellaioStudio.Client.Services
{
    public class ProjectsRepository : IProjectsRepository
    {
        public async Task<List<Project>> GetProjects()
        {
            return new List<Project>()
            {
                new ExampleProject()
            };
        }
    }
}
