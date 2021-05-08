using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace CellaioStudio.Client.Extensions
{
    public static class IJSRuntimeExtensions
    {
        public static async Task SaveAsFile(this IJSRuntime js, byte[] bytes,
            string fileName)
        {
            await js.InvokeVoidAsync("saveAsFile", fileName, bytes);
        }

        public static async Task Alert(this IJSRuntime js, string message)
        {
            await js.InvokeVoidAsync("alert", message);
        }
    }
}
