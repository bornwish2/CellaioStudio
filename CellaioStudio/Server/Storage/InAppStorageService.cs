using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CellaioStudio.Server.Storage
{
    public class InAppStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment env;
        private readonly IHttpContextAccessor httpContextAccessor;

        public InAppStorageService(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            this.env = env;
            this.httpContextAccessor = httpContextAccessor;
        }

        public Task DeleteFile(string fileRoute, string containerName)
        {
            var fileName = Path.GetFileName(fileRoute);
            string fileDirectory = Path.Combine(env.WebRootPath, containerName, fileName);

            if (File.Exists(fileDirectory))
                File.Delete(fileDirectory);

            return Task.FromResult(0);
        }

        public async Task<string> EditFile(Stream content, string fileName, string containerName, string fileRoute)
        {
            if (!string.IsNullOrEmpty(fileRoute))
                await DeleteFile(fileRoute, containerName);

            return await SaveFile(content, fileName, containerName);
        }

        public async Task<string> SaveFile(Stream content, string fileName, string containerName)
        {
            string folder = Path.Combine(env.WebRootPath, containerName);
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            string savingPath = Path.Combine(folder, fileName);
            using var fileStream = new FileStream(savingPath, FileMode.OpenOrCreate, FileAccess.Write, FileShare.None);
            await content.CopyToAsync(fileStream);

            var currentUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
            var path = Path.Combine(currentUrl, containerName, fileName);
            return path;
        }

        public async Task<string> GetFileContent(string containerName, string fileName)
        {
            string folder = Path.Combine(env.WebRootPath, containerName);
            if (!Directory.Exists(folder))
                return null;

            var file = Path.Combine(folder, fileName);
            if (!File.Exists(file))
                return null;

            return await File.ReadAllTextAsync(file);
        }

        public async Task<List<string>> GetFiles(string containerName)
        {
            string folder = Path.Combine(env.WebRootPath, containerName);
            if (!Directory.Exists(folder))
                return null;

            var dirInfo = new DirectoryInfo(folder);
            var files = dirInfo.EnumerateFiles();
            var list = files?.Select(f => f.FullName).ToList();
            return await Task.FromResult(list);
        }


        public async Task<string> GetFileRoute(string containerName, string fileName)
        {
            string folder = Path.Combine(env.WebRootPath, containerName);
            if (!Directory.Exists(folder))
                return null;

            var file = Path.Combine(folder, fileName);
            if (!File.Exists(file))
                return null;

            return await Task.FromResult(file);
        }
    }
}
