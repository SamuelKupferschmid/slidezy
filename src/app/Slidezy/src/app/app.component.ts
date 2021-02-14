import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventBusService } from './event-bus/event-bus.service';
import { Session, SlidesService } from './slide/slides.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  @ViewChild('app') appRef: ElementRef<HTMLDivElement>;

  session$: Observable<{ session: Session }>;
  opened = true;

  constructor(
    private eventBus: EventBusService,
    slideService: SlidesService
  ) {
    this.session$ = slideService.session$.pipe(
      map(session => ({ session }))
    );
  }

  toggleMenu() {
    this.opened = !this.opened;
  }

  clearSlidePaths(session: Session) {
    const id = session.slides[session.selectedSlideIndex].id;
    this.eventBus.clearSlidePaths(session.id, {
      id
    });
  }

  removeLastPath(session: Session) {
    const slide = session.slides[session.selectedSlideIndex];
    this.eventBus.removePath(session.id, {
      slideId: slide.id,
      pathId: slide.paths[slide.paths.length - 1].id
    });
  }

  enterFullscreen(mode: FullscreenMode) {
    this.opened = false;
    const element = mode === 'app' ? this.appRef.nativeElement : document.querySelector('#canvas');
    element.requestFullscreen();

  }
}

type FullscreenMode = 'app' | 'canvas';
