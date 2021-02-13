import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from './home/home.component';
import { SlideListComponent } from './slide-list/slide-list.component';
import { NewSessionComponent } from './new-session/new-session.component';
import { SlideComponent } from './slide/slide.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FunctionsInterceptor } from './functionsInterceptor';
import { EventBusService } from './event-bus/event-bus.service';
import { CanvasComponent } from './canvas/canvas.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':sessionId', component: CanvasComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SlideListComponent,
    HomeComponent,
    NewSessionComponent,
    SlideComponent,
    CanvasComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    MatMenuModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: FunctionsInterceptor,
    multi: true,
  }, {
    provide: APP_INITIALIZER,
    useFactory: eventBusInitializer,
    deps: [EventBusService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function eventBusInitializer(eventBus: EventBusService) {
  return async () => await eventBus.connect();
}
