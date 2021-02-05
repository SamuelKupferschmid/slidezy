import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlidesService {

  constructor() { }
}

export interface Slide {
  backgroundImageUrl: string;
}

export interface Path {

}

export interface Coordinate {
  x: number;
  y: number;
}