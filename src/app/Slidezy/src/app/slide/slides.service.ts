import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, mergeMap, take } from 'rxjs/operators';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  activeSlide: Slide;

  slides: Slide[] = [];

  constructor(
    private router: Router,
    private session: SessionService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      mergeMap(route => route.paramMap),
      map(params => params.get('slide'))
    ).subscribe(slide => {
      this.activeSlide = this.slides[parseInt(slide) - 1];
    });
  }

  addSlide() {
    const index = this.slides.length;
    this.slides.push({ index })
    this.navigateToSlide(index);
  }

  navigateToSlide(number: number) {
    this.router.navigate([this.session.activeSession, (number + 1).toString()])

  }
}

export interface Slide {
  index: number;
}

export interface Path {

}

export interface Coordinate {
  x: number;
  y: number;
}