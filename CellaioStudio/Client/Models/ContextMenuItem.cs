using System;

namespace CellaioStudio.Client.Models
{
    public class ContextMenuItem
    {
        public ContextMenuItem(string title, Action action = null)
        {
            this.Title = title;
            this.Action = action;
        }
        public string Title { get; set; }
        public Action Action { get; set; }
    }
}
