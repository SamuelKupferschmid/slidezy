import { ChangeDetectionStrategy, Component } from '@angular/core';
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

  session$: Observable<{ session: Session }>;

  constructor(slideService: SlidesService) {
    this.session$ = slideService.session$.pipe(
      map(session => ({ session }))
    );
  }
}
