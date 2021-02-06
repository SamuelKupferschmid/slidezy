import { Component, OnInit } from '@angular/core';
import { SlidesService } from '../slide/slides.service';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent implements OnInit {

  constructor(public slides: SlidesService) { }

  ngOnInit(): void {

  }

}
