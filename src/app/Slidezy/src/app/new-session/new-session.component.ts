import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewSessionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
