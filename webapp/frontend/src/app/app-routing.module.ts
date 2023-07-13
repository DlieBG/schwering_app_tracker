import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { WidgetComponent } from './components/widget/widget.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', component: TestComponent },
  { path: '401', component: UnauthorizedComponent },
  { path: 'widget', component: WidgetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
