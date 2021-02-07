import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlidesService } from '../slide/slides.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private slideService: SlidesService
  ) { }

  ngOnInit(): void {
  }

  startSession(): void {
    this.slideService.createSession().subscribe(id => {
      this.router.navigate([id]);
    });
  }
}
