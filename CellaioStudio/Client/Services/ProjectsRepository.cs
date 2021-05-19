using CellaioStudio.Client.Models;
using CellaioStudio.Shared.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CellaioStudio.Client.Services
{
    public class ProjectsRepository : IProjectsRepository
    {
        private readonly HttpClient httpClient;
        private readonly string Url = "/api/projects";
        private JsonSerializerOptions defaultJsonSerializerOptions =>
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true };

        public ProjectsRepository(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public async Task<Project> Create()
        {
            var response = await httpClient.GetAsync($"{Url}/new");
            if (!response.IsSuccessStatusCode)
                return null;

            var jsonString = await response.Content.ReadAsStringAsync();
            var project = JsonSerializer.Deserialize<Project>(jsonString, defaultJsonSerializerOptions);
            return project;
        }

        public async Task DeleteProject(int id)
        {
            await httpClient.DeleteAsync($"{Url}/{id}");
        }

        public async Task<Project> GetProject(int id)
        {
            var response = await httpClient.GetAsync($"{Url}/{id}");
            if (!response.IsSuccessStatusCode)
                return null;

            var jsonString = await response.Content.ReadAsStringAsync();
            var project = JsonSerializer.Deserialize<Project>(jsonString, defaultJsonSerializerOptions);
            return project;
        }

        public async Task<string> GetProjectContent(int id)
        {
            var response = await httpClient.GetAsync($"{Url}/{id}/content");
            if (!response.IsSuccessStatusCode)
                return null;

            var content = await response.Content.ReadAsStringAsync();
            return content;
        }

        public async Task<List<Project>> GetProjects()
        {
            var list = new List<Project>()
            {
                new ExampleProject()
            };

            var response = await httpClient.GetAsync($"{Url}");
            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();
                var projects = JsonSerializer.Deserialize<List<Project>>(jsonString, defaultJsonSerializerOptions);
                list.AddRange(projects);
            }

            return await Task.FromResult(list);
        }

        public async Task SaveProject(Project project)
        {
            System.Console.WriteLine("Saving: " + project.ID);

            var dataJson = JsonSerializer.Serialize(project);
            var stringContent = new StringContent(dataJson, Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync($"{Url}", stringContent);
            
            if (response.IsSuccessStatusCode)
            {
                
            }
            else
            {

            }
        }

        public async Task<int> GetNewId()
        {
            var response = await httpClient.GetAsync($"{Url}/newid");
            if (response.IsSuccessStatusCode)
            {
                var str = await response.Content.ReadAsStringAsync();
                return int.Parse(str);
            }

            return -1;
        }
    }
}
