import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { EventBusService } from '../event-bus/event-bus.service';
import { Session, SlidesService } from '../slide/slides.service';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideListComponent implements OnInit {
  session$: Observable<Session>;

  constructor(
    public slideService: SlidesService,
    public eventBus: EventBusService,
  ) {
    this.session$ = slideService.session$;
  }

  ngOnInit(): void {

  }

  addSlide(session: Session) {
    this.eventBus.addSlide(session.id, {
      id: Guid.create().toString(),
      index: session.slides.length,
      background: '',
    });
  }

}
