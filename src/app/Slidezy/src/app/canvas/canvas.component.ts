import { ChangeDetectorRef, Component, ContentChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { EventBusService } from '../event-bus/event-bus.service';
import { SlidesService } from '../slide/slides.service';
import { Session } from '../types/session';
import { Coordinate } from '../types/coordinate';
import ResizeObserver from 'resize-observer-polyfill';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  session$: Observable<Session>;

  private currentPathId: string;

  @ContentChild('.canvas') canvas: ElementRef<HTMLDivElement>;

  margin: string;

  constructor(
    private eventBus: EventBusService,
    private host: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone,
    slides: SlidesService
  ) {
    this.session$ = slides.session$;
  }

  ngOnInit(): void {
    new ResizeObserver((entries: ResizeObserverEntry[]) => this.zone.run(() => {
      const contentRect = entries[0].contentRect;

      const expectedWidth = contentRect.height * environment.canvasRatio;

      let compensation = (contentRect.width - expectedWidth) / 2;
      if (compensation < 0) {
        compensation = 0;
      }

      this.margin = `0 ${compensation}px`;
      this.changeDetector.markForCheck();
    })).observe(this.host.nativeElement);
  }

  touchstart(session: Session, ev: TouchEvent) {
    ev.preventDefault();
    this.currentPathId = Guid.create().toString();
    this.eventBus.startPath(session.id, {
      id: this.currentPathId,
      pencil: null,
      coordinate: this.getTouchCoordinate(ev)
    });
  }

  touchmove(session: Session, ev: TouchEvent) {
    ev.preventDefault();

    if (this.currentPathId) {
      this.eventBus.continuePath(session.id, {
        id: this.currentPathId,
        coordinate: this.getTouchCoordinate(ev)
      });
    }
  }

  touchend(session: Session, ev: TouchEvent) {
    ev.preventDefault();
    this.eventBus.completePath(session.id, {
      id: this.currentPathId,
      coordinate: this.getTouchCoordinate(ev)
    });

    this.currentPathId = null;
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
      x: 1920 * ((ev.touches[0] ?? ev.changedTouches[0]).clientX - (ev.currentTarget as any).getBoundingClientRect().x) / (ev.currentTarget as HTMLElement).clientWidth,
      y: 1080 * ((ev.touches[0] ?? ev.changedTouches[0]).clientY - (ev.currentTarget as any).getBoundingClientRect().y) / (ev.currentTarget as HTMLElement).clientHeight,
    }
  }

  private getMouseCoordinate(ev: MouseEvent): Coordinate {
    return {
      x: 1920 * (ev.clientX - (ev.currentTarget as any).getBoundingClientRect().x) / (ev.currentTarget as HTMLElement).clientWidth,
      y: 1080 * (ev.clientY - (ev.currentTarget as any).getBoundingClientRect().y) / (ev.currentTarget as HTMLElement).clientHeight,
    }
  }

}
