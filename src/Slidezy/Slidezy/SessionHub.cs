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
    }
}
