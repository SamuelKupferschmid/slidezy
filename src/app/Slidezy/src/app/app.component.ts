import { Component } from '@angular/core';
import { SlidesService } from './slide/slides.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public slideService: SlidesService) {
  }
}
