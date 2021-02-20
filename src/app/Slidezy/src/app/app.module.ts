import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { EventBusService } from './event-bus/event-bus.service';
import { FunctionsInterceptor } from './functionsInterceptor';
import { HomeComponent } from './home/home.component';
import { NewSessionComponent } from './new-session/new-session.component';
import { SlideListComponent } from './slide-list/slide-list.component';
import { SlideComponent } from './slide/slide.component';

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
    ColorPickerComponent,
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

    OverlayModule,
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
