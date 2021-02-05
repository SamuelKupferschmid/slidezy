import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':sessionId', component: NewSessionComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SlideListComponent,
    HomeComponent,
    NewSessionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }