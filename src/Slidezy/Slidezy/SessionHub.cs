﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

using Slidezy.Core;
using Slidezy.Core.Events;

namespace Slidezy
{
    public class SessionHub : Hub
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

        public async Task StartPath(string sessionId, StartPathEvent @event)
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(StartPath), @event);
        }

        public async Task ContinuePath(string sessionId, ContinuePathEvent @event)
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(ContinuePath), @event);
        }

        public async Task CompletePath(string sessionId, CompletePathEvent @event)
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(CompletePath), @event);
        }

        public async Task ClearSlidePaths(string sessionId, ClearSlidePathsEvent @event)
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(ClearSlidePaths), @event);
        }

        public async Task RemovePath(string sessionId, RemovePathEvent @event)
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(RemovePath), @event);
        }

        public async Task SetPencil(string sessionId, SetPencilEvent @event)
        {
            await this.Clients.OthersInGroup(sessionId).SendAsync(nameof(SetPencil), @event);
        }
    }
}

