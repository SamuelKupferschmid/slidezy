import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { EventBusService } from '../event-bus/event-bus.service';
import { Session, SlidesService } from '../slide/slides.service';
import { Coordinate } from '../types';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  session$: Observable<Session>;

  private currentPathId: string;

  constructor(
    private eventBus: EventBusService,
    slides: SlidesService
  ) {
    this.session$ = slides.session$;
  }

  ngOnInit(): void {
  }

  touchstart(ev: TouchEvent) {
    ev.preventDefault();
  }

  touchmove(ev: TouchEvent) {
    ev.preventDefault();
    console.log(this.getTouchCoordinate(ev));
  }

  touchend(ev: TouchEvent) {
    ev.preventDefault();
  }


  mousedown(session: Session, ev: MouseEvent) {
    ev.preventDefault();
    this.currentPathId = Guid.create().toString();
    this.eventBus.startPath(session.id, {
      id: this.currentPathId,
      pencil: null,
      coordinate: this.getMouseCoordinate(ev)
    });
  }

  mousemove(session: Session, ev: MouseEvent) {
    ev.preventDefault();

    if (this.currentPathId) {
      this.eventBus.continuePath(session.id, {
        id: this.currentPathId,
        coordinate: this.getMouseCoordinate(ev)
      });
    }
  }

  mouseup(session: Session, ev: MouseEvent) {
    ev.preventDefault();
    this.eventBus.completePath(session.id, {
      id: this.currentPathId,
      coordinate: this.getMouseCoordinate(ev)
    });

    this.currentPathId = null;
  }

  private getTouchCoordinate(ev: TouchEvent): Coordinate {
    return {
      x: 1920 * ev.touches[0].clientX / (ev.currentTarget as HTMLElement).clientWidth,
      y: 1080 * ev.touches[0].clientY / (ev.currentTarget as HTMLElement).clientHeight,
    }
  }

  private getMouseCoordinate(ev: MouseEvent): Coordinate {
    return {
      x: 1920 * ev.offsetX / (ev.currentTarget as HTMLElement).clientWidth,
      y: 1080 * ev.offsetY / (ev.currentTarget as HTMLElement).clientHeight,
    }
  }

}
