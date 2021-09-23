import { SalesOrderComponent } from './sales-order-list/sales-order.component';
import { SalesOrderDetailComponent } from './sales-order-detail/sales-order-detail.component';
import { Routes } from '@angular/router';

export const salesOrderRoutes: Routes = [
  {
    path: '',
    component: SalesOrderComponent
  },
  {
    path: ':id',
    component: SalesOrderDetailComponent
  }
];
