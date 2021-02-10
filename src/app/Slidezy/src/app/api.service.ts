import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from './slide/slides.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {

  }

  getSession(id: string): Observable<Session> {
    return this.httpClient.get<Session>(`sessions/${id}`);
  }
}
