import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Slide } from '../types';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnInit {

  @Input() slide: Slide;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  getImageUrl(slide: Slide) {
    return this.sanitizer.bypassSecurityTrustUrl(`${environment.storageUrl}/${slide.background}`);
  }
}
