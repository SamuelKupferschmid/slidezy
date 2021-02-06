import { Component, OnInit } from '@angular/core';
import { SlidesService } from './slides.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit {

  constructor(public slides: SlidesService) {
  }

  ngOnInit(): void {
  }

}
