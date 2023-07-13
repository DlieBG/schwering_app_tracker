import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { WidgetComponent } from './components/widget/widget.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    WidgetComponent,
    HomeComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
