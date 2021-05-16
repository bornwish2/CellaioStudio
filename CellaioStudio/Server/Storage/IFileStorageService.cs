using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CellaioStudio.Server.Storage
{
    public interface IFileStorageService
    {
        Task<string> EditFile(Stream content, string fileName, string containerName, string fileRoute);
        Task DeleteFile(string fileRoute, string containerName);
        Task<string> SaveFile(Stream content, string fileName, string containerName);
        Task<List<string>> GetFiles(string containerName);
        Task<string> GetFileContent(string containerName, string fileName);
        Task<string> GetFileRoute(string containerName, string fileName);
    }
}
