import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesOrder } from '../shared/interface/sales-order.interface';
import { SalesOrderService } from '../shared/services/sales-order.service';
import { SalesOrderFormComponent } from '../sales-order-form/sales-order-form.component'

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'subject', 'contactName', 'status', 'total', 'actions'];
  public dataSource : SalesOrder[];
  public err: string = '';
  public saleOrder: SalesOrder;

  constructor(
    private salesOrderService: SalesOrderService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.salesOrderService.getSalesOrderList().subscribe((data) => {
      this.dataSource = data.data.salesOrder;
    }, (err) => {
      this.err = err;
    });
  }

  onAdd(){
    this.openDialog()
  }

  onUpdate(salesOrderId: string){
    this.salesOrderService.getSalesOrderDetail(salesOrderId).subscribe((data) => {
      this.saleOrder = data.data.saleOrder;
      this.openDialog(this.saleOrder)
    });
  }

  onDelete(salesOrderId: string){
    this.salesOrderService.deleteSalesOrder(salesOrderId).subscribe((data) => {
      this.loadData()
    });
  }

  openDialog(saleOrder?: SalesOrder): void {
    const dialogRef = this.dialog.open(SalesOrderFormComponent, {
      width: '500px',
      data: {
        _id: saleOrder ? saleOrder._id : null,
        subject: saleOrder ? saleOrder.subject : "",
        contactName: saleOrder ? saleOrder.contactName: "",
        status: saleOrder ? saleOrder.status: "",
        total: saleOrder ? saleOrder.total : "",
        assignedTo: saleOrder ? saleOrder.assignedTo: "",
        creator: saleOrder ? saleOrder.creator : "",
        description: saleOrder ? saleOrder.description: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData()
    });
  }
}
