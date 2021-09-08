import { Component, Inject, OnInit } from '@angular/core';
import { SalesOrder } from '../shared/interface/sales-order.interface';
import { SalesOrderService } from '../shared/services/sales-order.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-sales-order-form',
  templateUrl: './sales-order-form.component.html',
  styleUrls: ['./sales-order-form.component.scss']
})
export class SalesOrderFormComponent implements OnInit {

  constructor(
    public salesOrderService: SalesOrderService,
    public dialogRef: MatDialogRef<SalesOrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SalesOrder
  ) { }

  ngOnInit() {
  }

  onSubmit(): void {
    if(this.data._id){
      this.salesOrderService
      .updateSalesOrder(this.data._id, this.data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: this.data });
        },
        (error) => {
          console.log('Update contact: failed', error);
        }
      );
    }
    else{
      this.salesOrderService
      .addSalesOrder(this.data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: this.data });
        },
        (error) => {
          console.log('Add contact: failed', error);
        }
      );
    }
  }
}
