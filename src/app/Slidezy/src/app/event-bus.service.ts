import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private _connection: HubConnection;

  constructor() {
    this._connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44338/sessions")
      .withAutomaticReconnect()
      .build();

    this._connection.on("send", data => {
      console.log(data);
    });
  }

  async connect() {
    await this._connection.start();
  }

  joinSession(sessionId: string) {
    return from(this._connection.invoke('JoinSession', sessionId));
  }
}
