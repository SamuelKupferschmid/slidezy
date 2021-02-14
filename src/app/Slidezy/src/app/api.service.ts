import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from './slide/slides.service';
import { Path } from './types';

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

  clearSlidePaths(sessionId: string, slideId: string) {
    return this.httpClient.delete<void>(`sessions/${sessionId}/slides/${slideId}/paths`);
  }
}
