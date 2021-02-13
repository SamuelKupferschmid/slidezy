import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SlidesService } from '../slide/slides.service';
import { Slide } from '../types';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  currentSlide$: Observable<Slide>;

  constructor(slides: SlidesService) {
    this.currentSlide$ = slides.currentSlide$;
  }

  ngOnInit(): void {
  }

}
