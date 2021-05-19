using CellaioStudio.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CellaioStudio.Client.Services
{
    public interface IProjectsRepository
    {
        Task<List<Project>> GetProjects();
        Task<Project> GetProject(int id);
        Task<string> GetProjectContent(int id);
        Task<int> GetNewId();
        Task<Project> Create();
        Task DeleteProject(int id);
        Task SaveProject(Project project);
    }
}
