import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Path } from './types/path';
import { Pencil } from './types/pencil';
import { Session } from './types/session';
import { SlideSelection } from './types/slide-selection';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {

  }

  getSession(id: string): Observable<Session> {
    return this.httpClient.get<Session>(`sessions/${id}`);
  }

  addPath(sessionId: string, slideId: string, path: Path) {
    return this.httpClient.post<void>(`sessions/${sessionId}/slides/${slideId}`, path);
  }

  selectedSlide(sessionId: string, selection: SlideSelection) {
    return this.httpClient.put<void>(`sessions/${sessionId}/selected-slide`, selection);
  }

  clearSlidePaths(sessionId: string, slideId: string) {
    return this.httpClient.delete<void>(`sessions/${sessionId}/slides/${slideId}/paths`);
  }

  removePath(sessionId: string, slideId: string, pathId: string) {
    return this.httpClient.delete<void>(`sessions/${sessionId}/slides/${slideId}/paths/${pathId}`);
  }

  setPencil(sessionId: string, pencil: Pencil) {
    return this.httpClient.put<void>(`sessions/${sessionId}/pencil`, pencil);
  }
}
