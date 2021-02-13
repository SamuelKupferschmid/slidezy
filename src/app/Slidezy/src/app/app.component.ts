import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  constructor(slideService: SlidesService) {
    this.session$ = slideService.session$.pipe(
      map(session => ({ session }))
    );
  }

  toggleMenu() {
    this.opened = !this.opened;
  }

  enterFullscreen(mode: FullscreenMode) {
    this.opened = false;
    const element = mode === 'app' ? this.appRef.nativeElement : document.querySelector('#canvas');
    element.requestFullscreen();

  }
}

type FullscreenMode = 'app' | 'canvas';
