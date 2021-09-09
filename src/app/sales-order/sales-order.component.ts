import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesOrder } from '../shared/interface/sales-order.interface';
import { SalesOrderService } from '../shared/services/sales-order.service';
import { SalesOrderFormComponent } from '../sales-order-form/sales-order-form.component'
import { ActivatedRoute, Router } from '@angular/router';

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
}

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'subject', 'contactName', 'status', 'total', 'actions'];
  public dataSource : SalesOrder[];
  public err: string = '';            // Error display
  public saleOrder: SalesOrder;       // Sale Order detail
  public keyword: string = '';        // Keyword to search
  public queryParams: IParams;        // Query parameters
  public total: number;               // Total data
  public status: string;              // Status order
  public limit: number = 8;           // (Pagination) Limit data in one page
  public page: number = 0;            // (Pagination) Current page

  constructor(
    private salesOrderService: SalesOrderService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadData(params);
      this.queryParams = params;
      this.keyword = params['keyword'];
      this.page = params['page'];
      this.limit = params['limit'];
      this.status = params['status'];
    })
  }

  loadData(queryParams? : IParams) {
    this.salesOrderService.getSalesOrderList(queryParams).subscribe((data) => {
      this.dataSource = data.data.salesOrder;
      this.total = data.data.total;
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

  onSearch(event){
    this.handleUpdateFilter({
      keyword: event.target.value,
      page: 0
    })
  }

  onPageChange(event) {
    this.handleUpdateFilter({
      limit: event.pageSize || 0,
      page: event.pageIndex
    })
  }

  handleUpdateFilter = (data: any) => {
    const pathname = location.pathname;
    this.queryParams = {
      ...this.queryParams,
      ...data,
    };
    this.router.navigate([`${pathname}`], { queryParams : this.queryParams })
  };

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
      this.loadData(this.queryParams)
    });
  }
}
