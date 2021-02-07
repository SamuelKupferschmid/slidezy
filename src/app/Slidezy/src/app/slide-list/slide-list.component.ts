import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Session, SlidesService } from '../slide/slides.service';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideListComponent implements OnInit {
  session$: Observable<Session>;

  constructor(public slideService: SlidesService) {
    this.session$ = slideService.session$;
  }

  ngOnInit(): void {

  }

}
