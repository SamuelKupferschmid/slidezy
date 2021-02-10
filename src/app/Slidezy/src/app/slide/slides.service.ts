import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { EventBusService } from '../event-bus.service';

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  private _session$ = new BehaviorSubject<Session>(null);

  constructor(
    private router: Router,
    api: ApiService,
    eventBus: EventBusService,
  ) {
    const params$ = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      mergeMap(route => route.paramMap)
    );

    const sessionId$ = params$.pipe(
      map(params => params.get('sessionId')),
      distinctUntilChanged()
    );


    sessionId$.pipe(
      filter(id => !id)
    ).subscribe(() => {
      this._session$.next(null);
    });

    sessionId$.pipe(
      filter(id => !!id),
      mergeMap(id => api.getSession(id)),
      mergeMap(session => eventBus.joinSession(session.id).pipe(
        map(() => session))
      )
    ).subscribe(session => {
      this._session$.next(session);
      this.navigateToSlide(session.selectedSlideIndex);
    });

    params$.pipe(
      map(params => params.get('slide')),
      distinctUntilChanged(),
    ).subscribe(slide => {

      const index = slide ? parseInt(slide, 10) - 1 : null;

      if (this._session$.value) {
        this._session$.next({
          ...this._session$.value,
          selectedSlideIndex: index
        });
      }
    });

    this._session$.subscribe(session => {
      let title = 'Slidezy';

      if (session?.id) {
        title += ` / ${session.id}`;
      }

      if (session?.selectedSlideIndex != null) {
        title += ` / Slide ${session.selectedSlideIndex + 1}`;
      }

      document.title = title;
    });
  }

  addSlide(): void {
    const arr = this._session$.value.slides;
    const newSlide = { index: arr.length };
    this._session$.next({
      ...this._session$.value,
      slides: [...this._session$.value.slides, newSlide]
    });

    this.navigateToSlide(newSlide.index);
  }

  navigateToSlide(page: number): void {
    this.router.navigate([this._session$.value.id, (page + 1).toString()]);
  }

  createSession(): Observable<string> {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    const length = 8;
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return of(result);
  }

  get session$() {
    return this._session$.asObservable();
  }

  get currentSlide$() {
    return this._session$.pipe(
      map(session => session.slides[session.selectedSlideIndex])
    );
  }
}

export interface Session {
  id: string;
  slides: Slide[];
  selectedSlideIndex: number;
}

export interface Slide {
  index: number;
}

export interface Coordinate {
  x: number;
  y: number;
}
