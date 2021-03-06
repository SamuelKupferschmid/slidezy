import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HslColor } from './color-picker/color-picker.component';
import { EventBusService } from './event-bus/event-bus.service';
import { SlidesService } from './slide/slides.service';
import { Session } from './types/session';

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

  colorPaletteOpen: boolean;

  constructor(
    private breakpoints: BreakpointObserver,
    private eventBus: EventBusService,
    slideService: SlidesService
  ) {
    this.session$ = slideService.session$.pipe(
      map(session => ({ session }))
    );
  }

  setColor(sessionId: string, color: HslColor) {
    this.eventBus.setPencil(sessionId, {
      pencil: {
        width: 12,
        color: `hsla(${color.hue}, ${color.saturationPercentage}%, ${color.lightnessPercentage}%, 0.7)`
      }
    })
    this.colorPaletteOpen = false;

  }

  toggleMenu() {
    this.opened = !this.opened;
  }

  get drawerMode(): MatDrawerMode {
    return this.breakpoints.isMatched('(max-width: 1280px)') ? 'over' : 'side';
  }

  drawerClick(drawer: MatDrawer) {
    if (drawer.mode == 'over') {
      drawer.close();
    }
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

  async enterFullscreen(mode: FullscreenMode) {
    this.opened = false;
    const element = mode === 'app' ? this.appRef.nativeElement : document.querySelector('#canvas');

    const existingFunction =
      ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'].find(func => element[func]);
    await element[existingFunction]();
  }
}

type FullscreenMode = 'app' | 'canvas';
