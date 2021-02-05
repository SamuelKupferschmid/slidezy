import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _activeSession: Observable<string>;

  constructor(private router: Router) {
    this._activeSession = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      mergeMap(route => route.paramMap),
      map(params => params.get('sessionId')),
      shareReplay(1)
    );

    this._activeSession.subscribe(session => {
      let title = 'Slidezy'

      if (session) {
        title += ` | ${session}`;
      }

      document.title = title;
    });
  }

  get activeSession$() {
    return this._activeSession;
  }

  createSession(): Observable<string> {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    const length = 8;
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return of(result);
  }
}
