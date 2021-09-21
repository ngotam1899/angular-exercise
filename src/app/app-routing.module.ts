import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AccessGuard } from './shared/guard/access.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canDeactivate: [AccessGuard], },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'management', loadChildren: () => import(`./management/management.module`).then(m => m.ManagementModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
