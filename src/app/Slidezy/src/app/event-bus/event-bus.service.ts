import { Injectable, NgZone } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'
import { from, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddSlideEvent } from '../types/events/add-slide-event';
import { ClearSlidePathsEvent } from '../types/events/clear-slide-paths-event';
import { CompletePathEvent } from '../types/events/complete-path-event';
import { ContinuePathEvent } from '../types/events/continue-path-event';
import { RemovePathEvent } from '../types/events/remove-path-event';
import { SelectSlideEvent } from '../types/events/select-slide-event';
import { StartPathEvent } from '../types/events/start-path-event';

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
    this.registerHandler('startPath');
    this.registerHandler('continuePath');
    this.registerHandler('completePath');
    this.registerHandler('clearSlidePaths');
    this.registerHandler('removePath');
  }

  private registerHandler<T>(method: keyof EventBusService) {
    this._connection.on(method, (event: T) => this._zone.run(() => this._events$.next({
      method,
      remote: true,
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

  startPath(sessionId: string, event: StartPathEvent) {
    this.emit(sessionId, 'startPath', event);
  }

  continuePath(sessionId: string, event: ContinuePathEvent) {
    this.emit(sessionId, 'continuePath', event);
  }

  completePath(sessionId: string, event: CompletePathEvent) {
    this.emit(sessionId, 'completePath', event);
  }

  clearSlidePaths(sessionId: string, event: ClearSlidePathsEvent) {
    this.emit(sessionId, 'clearSlidePaths', event);
  }

  removePath(sessionId: string, event: RemovePathEvent) {
    this.emit(sessionId, 'removePath', event);
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

export type NamedEvent<T> = T & {
  remote: boolean;
  method: keyof EventBusService
}