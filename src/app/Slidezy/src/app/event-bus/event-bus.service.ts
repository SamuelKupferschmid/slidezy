import { Injectable, NgZone } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr'
import { from, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coordinate, Pencil } from '../types';
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

export interface AddSlideEvent {
  id: string;
  index: number;
  background: string;
}

export interface SelectSlideEvent {
  id: string;
}

export interface StartPathEvent {
  id: string;
  coordinate: Coordinate;
  pencil: Pencil;
}

export interface ContinuePathEvent {
  id: string;
  coordinate: Coordinate,
}

export interface CompletePathEvent {
  id: string;
  coordinate: Coordinate;
}

export interface ClearSlidePathsEvent {
  id: string;
}

export interface RemovePathEvent {
  slideId: string;
  pathId: string;
}

export type NamedEvent<T> = T & {
  remote: boolean;
  method: keyof EventBusService
}