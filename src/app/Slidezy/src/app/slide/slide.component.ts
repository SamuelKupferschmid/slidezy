import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SlidesService } from './slides.service';
import { Slide } from './types';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnInit {

  currentSlide$: Observable<Slide>;

  constructor(slides: SlidesService) {
    this.currentSlide$ = slides.currentSlide$;
  }

  ngOnInit(): void {
  }

}
