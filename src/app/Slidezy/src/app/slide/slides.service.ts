import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { AddSlideEvent, ClearSlidePathsEvent, CompletePathEvent, ContinuePathEvent, EventBusService, NamedEvent, SelectSlideEvent, StartPathEvent } from '../event-bus/event-bus.service';
import { Slide } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  private _session$ = new BehaviorSubject<Session>(null);

  constructor(
    private router: Router,
    eventBus: EventBusService,
    private api: ApiService,
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

    eventBus.events$.subscribe(event => this.handleEvent(event));
  }

  private handleEvent<T>(event: NamedEvent<T>) {
    switch (event.method) {
      case 'addSlide':
        this.handleAddSlide(event as unknown as NamedEvent<AddSlideEvent>);
        break;
      case 'selectSlide':
        this.handleSelectSlide(event as unknown as NamedEvent<SelectSlideEvent>);
        break;
      case 'startPath':
        this.handleStartPath(event as unknown as NamedEvent<StartPathEvent>);
        break;
      case 'continuePath':
        this.handleContinuePath(event as unknown as NamedEvent<ContinuePathEvent>);
        break;
      case 'completePath':
        this.handleCompletePath(event as unknown as NamedEvent<CompletePathEvent>);
        break;
      case 'clearSlidePaths':
        this.handleClearSlidePaths(event as unknown as NamedEvent<ClearSlidePathsEvent>);
        break;
    };
  }

  private handleAddSlide(event: AddSlideEvent) {
    const slides = this._session$.value.slides;
    this._session$.next({
      ...this._session$.value,
      slides: [
        ...slides.slice(0, event.index),
        { ...event, paths: [] },
        ...slides.slice(event.index)
      ]
    });
  }

  private handleSelectSlide(event: SelectSlideEvent) {
    this._session$.next({
      ...this._session$.value,
      selectedSlideIndex: this._session$.value.slides.findIndex(slide => slide.id === event.id)
    });
  }

  private handleStartPath(event: StartPathEvent) {
    this._session$.next({
      ...this._session$.value,
      slides: this._session$.value.slides.map(slide => {
        if (slide.index === this._session$.value.selectedSlideIndex) {
          return {
            ...slide,
            paths: [...slide.paths, {
              ...event,
              coordinates: [event.coordinate]
            }]
          }
        } else {
          return slide;
        }
      })
    });
  }

  private handleContinuePath(event: ContinuePathEvent) {
    const newSession = { ...this._session$.value };

    const paths = newSession.slides[newSession.selectedSlideIndex].paths;
    const path = paths[paths.length - 1];
    paths[paths.length - 1] = {
      ...path,
      coordinates: [...path.coordinates, event.coordinate]
    };

    newSession.slides[newSession.selectedSlideIndex] = {
      ...newSession.slides[newSession.selectedSlideIndex]
    };

    this._session$.next(newSession);
  }

  private handleCompletePath(event: NamedEvent<CompletePathEvent>) {
    const newSession = { ...this._session$.value };

    const paths = newSession.slides[newSession.selectedSlideIndex].paths;
    paths[paths.length - 1].coordinates.push(event.coordinate);

    this._session$.next(newSession);

    if (!event.remote) {
      this.api.addPath(newSession.id, newSession.slides[newSession.selectedSlideIndex].id, paths[paths.length - 1]).subscribe();
    }
  }

  private handleClearSlidePaths(event: NamedEvent<ClearSlidePathsEvent>) {
    const session = this._session$.value;

    this._session$.next({
      ...session,
      slides: session.slides.map(slide => {
        if (slide.id === event.id) {
          return {
            ...slide,
            paths: []
          };
        } else {
          return slide;
        }
      })
    });

    if (!event.remote) {
      this.api.clearSlidePaths(session.id, session.slides[session.selectedSlideIndex].id).subscribe();
    }
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
      map(session => session?.slides[session?.selectedSlideIndex])
    );
  }
}

export interface Session {
  id: string;
  slides: Slide[];
  selectedSlideIndex: number;
}