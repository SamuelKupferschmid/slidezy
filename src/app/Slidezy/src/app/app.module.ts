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
import { HomeComponent } from './home/home.component';
import { SlideListComponent } from './slide-list/slide-list.component';
import { NewSessionComponent } from './new-session/new-session.component';
import { SlideComponent } from './slide/slide.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FunctionsInterceptor } from './FunctionsInterceptor';
import { EventBusService } from './event-bus.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':sessionId', component: NewSessionComponent },
  { path: ':sessionId/:slide', component: SlideComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SlideListComponent,
    HomeComponent,
    NewSessionComponent,
    SlideComponent,
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
