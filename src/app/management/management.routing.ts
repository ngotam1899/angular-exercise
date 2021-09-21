import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '../error/not-found/not-found.component';

import { AuthGuard } from '../shared/guard/auth.guard';
import { IsLoggedInGuard } from '../shared/guard/is-logged-in.guard';
import { ForbiddenComponent } from '../error/forbidden/forbidden.component';
import { ManagementComponent } from './management.component';

const routes: Routes = [
  {
    path: 'management',
    component: ManagementComponent,
    canActivateChild: [IsLoggedInGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        loadChildren: () => import('./users/user.module').then(m => m.UserModule)
      },
      {
        path: 'sales-order',
        loadChildren: () => import('./sales-orders/sales-order.module').then(m => m.SalesOrderModule)
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: '403',
        component: ForbiddenComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      },
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
