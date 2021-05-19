using CellaioStudio.Server.Storage;
using CellaioStudio.Shared.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CellaioStudio.Server.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly IFileStorageService fileStorageService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ProjectsController(IFileStorageService fileStorageService,
            IHttpContextAccessor httpContextAccessor)
        {
            this.fileStorageService = fileStorageService;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [Route("new")]
        public async Task<ActionResult<Project>> Create()
        {
            var files = await fileStorageService.GetFiles("projects");
            if (files.Count > 20)
                return Unauthorized();

            var id = await GetNewIdPriv();
            var fileName = $"{id}.meta";

            var bytes = System.Text.Encoding.UTF8.GetBytes("Title=Project");
            using var ms = new MemoryStream(bytes);
            await fileStorageService.SaveFile(ms, fileName, "projects");
            return new Project { ID = id, Title = "Heeeejo" };
        }

        [HttpPost]
        public async Task<ActionResult> Post(Project project)
        {
            var files = await fileStorageService.GetFiles("projects");
            if (files.Count > 20)
                return Unauthorized();

            if (project is null)
                return BadRequest();

            if (project.ID <= 0)
                return BadRequest();

            var meta = $"Title={project?.Title}";
            var metaBytes = Encoding.UTF8.GetBytes(meta);
            using var metaMs = new MemoryStream(metaBytes);
            await fileStorageService.SaveFile(metaMs, $"{project.ID}.meta", "projects");

            if (project?.Thumbnail != null)
            {
                var jpgBytes = Convert.FromBase64String(project?.Thumbnail);
                using var jpgMs = new MemoryStream(jpgBytes);
                await fileStorageService.SaveFile(jpgMs, $"{project.ID}.jpg", "projects");
            }

            if (project.Content != null)
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(project.Content);
                using var contentMs = new MemoryStream(bytes);
                await fileStorageService.SaveFile(contentMs, $"{project.ID}.json", "projects");
            }

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<List<Project>>> GetAll()
        {
            var files = await fileStorageService.GetFiles("projects");
            var ids = GetIDs(files);
            if (ids is null)
                return new List<Project>();

            var list = new List<Project>();
            foreach (var id in ids)
            {
                var proj = await Get(id);
                if (proj.Value != null)
                {
                    proj.Value.Content = null;
                    list.Add(proj.Value);
                }
            }
            return list;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Project>> Get(int id)
        {
            var meta = await fileStorageService.GetFileContent("projects", $"{id}.meta");
            var thumb = await fileStorageService.GetFileContent("projects", $"{id}.jpg");
            //var base64 = thumb is null ? null : Convert.ToBase64String(Encoding.UTF8.GetBytes(thumb));
            //var thumbLink = await fileStorageService.GetFileLink("projects", $"{id}.jpg");
            //var json = await fileStorageService.GetFileContent("projects", $"{id}.json");

            var currentUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
            var project = new Project()
            {
                ID = id,
                Title = meta?.Split('\n')?.FirstOrDefault()?.Split('=')?.LastOrDefault(),
                Content = null,
                Thumbnail = Path.Combine(currentUrl, "projects", $"{id}.jpg")
            };
            return project;
        }

        [HttpGet]
        [Route("{id}/content")]
        public async Task<string> GetContent(int id)
        {
            var json = await fileStorageService.GetFileContent("projects", $"{id}.json");
            return json;
        }

        private async Task<int> GetNewIdPriv()
        {
            var files =  await fileStorageService.GetFiles("projects");
            var ids = GetIDs(files);
            if (ids is null || ids.Count == 0)
                return 1;
            else return ids.Last() + 1;
        }

        private List<int> GetIDs(List<string> files)
        {
            return files?.Where(x => x.EndsWith("meta"))
                ?.Select(x => Path.GetFileName(x).Replace(".meta", ""))
                ?.Select(x => int.Parse(x))
                ?.OrderBy(x => x)?.ToList();
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var meta = await fileStorageService.GetFileRoute("projects", $"{id}.meta");
            var jpg = await fileStorageService.GetFileRoute("projects", $"{id}.jpg");
            var json = await fileStorageService.GetFileRoute("projects", $"{id}.json");

            if (meta != null)
                await fileStorageService.DeleteFile(meta, "projects");
            if (jpg != null)
                await fileStorageService.DeleteFile(jpg, "projects");
            if (json != null)
                await fileStorageService.DeleteFile(json, "projects");

            return NoContent();
        }

        [HttpGet]
        [Route("newid")]
        public async Task<int> GetNewId()
        {
            return await GetNewIdPriv();
        }
    }
}
