using CellaioStudio.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CellaioStudio.Client.Services
{
    public interface IProjectsRepository
    {
        Task<List<Project>> GetProjects();
    }
}
