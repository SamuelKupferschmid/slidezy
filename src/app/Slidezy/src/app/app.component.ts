import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeSession$: Observable<string>;

  constructor(session: SessionService) {
    this.activeSession$ = session.activeSession$;
  }
}
