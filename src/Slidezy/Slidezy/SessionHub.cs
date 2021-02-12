using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace Slidezy
{
    public class SessionHub: Hub
    {
        public async Task JoinSession(string sessionId)
        {
            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, sessionId, this.Context.ConnectionAborted);
        }

        public async Task AddSlide(string sessionId, AddSlideEvent @event) 
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(AddSlide), @event);
        }

        public async Task SelectSlide(string sessionId, SelectSlideEvent @event)
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(SelectSlide), @event);
        }
    }

    public class AddSlideEvent
    {
        public Guid Id { get; set; }
        public int Index { get; set; }
    }

    public class SelectSlideEvent
    {
        public Guid Id { get; set; }
    }
}
