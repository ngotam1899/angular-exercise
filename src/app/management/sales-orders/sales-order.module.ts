import { SalesOrderFormComponent } from './sales-order-form/sales-order-form.component';
import { SalesOrderComponent } from './sales-order-list/sales-order.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { salesOrderRoutes } from './sales-order.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesOrderDetailComponent } from './sales-order-detail/sales-order-detail.component';

import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [
    SalesOrderFormComponent,
    SalesOrderComponent,
    SalesOrderDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(salesOrderRoutes),
    NzUploadModule,
    NzModalModule,
    SharedModule
  ],
  entryComponents: [
    SalesOrderFormComponent,
  ]
})
export class SalesOrderModule { }
