import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  activeSession: string;
  activeSlide: Slide;

  slides: Slide[] = [];

  constructor(
    private router: Router
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

    params$.pipe(
      map(params => params.get('slide')),
      distinctUntilChanged())
      .subscribe(slide => {
        if (slide) {
          this.activeSlide = this.slides[parseInt(slide, 10) - 1];
        } else {
          this.activeSlide = null;
        }
      });

    params$.pipe(
      map(params => params.get('sessionId')),
      distinctUntilChanged()
    ).subscribe(session => {
      this.activeSession = session;

      let title = 'Slidezy';

      if (session) {
        title += ` | ${session}`;
      }

      document.title = title;
    });
  }

  addSlide(): void {
    const index = this.slides.length;
    this.slides.push({ index });
    this.navigateToSlide(index);
  }

  navigateToSlide(page: number): void {
    this.router.navigate([this.activeSession, (page + 1).toString()]);
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
}

export interface Slide {
  index: number;
}

export interface Coordinate {
  x: number;
  y: number;
}
