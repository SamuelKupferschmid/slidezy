import { Injectable, NgZone } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'
import { from, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pencil } from '../types';
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private _connection: HubConnection;
  private _events$ = new Subject<NamedEvent<any>>();
  private _zone = new NgZone({ enableLongStackTrace: false });

  constructor() {
    this._connection = new HubConnectionBuilder()
      .withUrl(environment.eventHub)
      .withAutomaticReconnect()
      .build();

    this.registerHandler('addSlide');
    this.registerHandler('selectSlide');
  }

  private registerHandler<T>(method: keyof EventBusService) {
    this._connection.on(method, (event: T) => this._zone.run(() => this._events$.next({
      method,
      ...event
    })));
  }

  get events$() {
    return this._events$;
  }

  private emit(sessionId: string, method: keyof EventBusService, event: any): void {
    this._events$.next({
      ...event,
      method
    });
    this._connection.send(method, sessionId, event);
  }

  addSlide(sessionId: string, event: AddSlideEvent) {
    this.emit(sessionId, 'addSlide', event);
  }

  selectSlide(sessionId: string, event: SelectSlideEvent) {
    this.emit(sessionId, 'selectSlide', event);
  }

  async connect() {
    await this._connection.start();
  }

  joinSession(sessionId: string) {
    return from(this._connection.invoke('JoinSession', sessionId));
  }

  leaveSession(sessionId: string) {
    return from(this._connection.invoke('LeaveSession', sessionId));
  }
}


export interface StartPathEvent {
  pencil: Pencil;
}

export interface AddSlideEvent {
  id: string;
  index: number;
  background: string;
}

export interface SelectSlideEvent {
  id: string;
}

export type NamedEvent<T> = T & {
  method: keyof EventBusService
}