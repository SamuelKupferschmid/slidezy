import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Coordinate } from '../types/coordinate';
import { Slide } from '../types/slide';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnInit {

  @Input() slide: Slide;

  constructor() {

  }

  ngOnInit(): void {
  }

  getImageUrl(slide: Slide) {
    return `${environment.storageUrl}/${slide.background}`;
  }

  getPolyLines(coordinates: Coordinate[]): string {
    return coordinates.map(c => `${c.x},${c.y}`).join(' ');
  }
}
