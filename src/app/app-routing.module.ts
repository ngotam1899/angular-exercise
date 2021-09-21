import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './error/not-found/not-found.component';

import { AccessGuard } from './shared/guard/access.guard';
import { AuthGuard } from './shared/guard/auth.guard';
import { IsLoggedInGuard } from './shared/guard/is-logged-in.guard';
import { ForbiddenComponent } from './error/forbidden/forbidden.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [IsLoggedInGuard] },
  { path: 'login', component: LoginComponent, canDeactivate: [AccessGuard], },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard, IsLoggedInGuard], },
  { path: 'sales-order', component: SalesOrderComponent, canActivate: [IsLoggedInGuard] },
  { path: 'contacts', component: ContactsComponent, canActivate: [IsLoggedInGuard] },
  { path: '403', component: ForbiddenComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
