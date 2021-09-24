import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { SalesOrder, IParamsSalesOrder } from '../../../shared/interface/sales-order.interface';
import { SalesOrderService } from '../../../shared/services/sales-order.service';
import { SalesOrderFormComponent } from '../sales-order-form/sales-order-form.component'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeleteComponent } from '../../../confirm-delete/confirm-delete.component';
import { CommonService } from '../../../shared/services/common.service';
import { statuses } from '../../../shared/constants'
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {
  public statuses = statuses;
  public displayedColumns: string[] = ['checkbox', 'index', 'subject', 'contactName', 'status', 'total', 'actions'];
  public dataSource : SalesOrder[];
  public selection = new SelectionModel<string>(true, []);
  public saleOrder: SalesOrder;          // Sale Order detail
  public keyword: string = '';           // Keyword to search
  public queryParams: IParamsSalesOrder; // Query parameters
  public queryCount: number = 0;
  public total: number;                  // Total data
  public status: string;                 // Status order
  public limit: number = 8;              // (Pagination) Limit data in one page
  public page: number = 0;               // (Pagination) Current page
  public admin: boolean = false;
  /* Filter period */
  from = new FormControl()
  to = new FormControl()
  /* Sorting */
  public sortBy: string;
  public sortValue: string;

  constructor(
    private salesOrderService: SalesOrderService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public commonService : CommonService,
    private notifyService : NotificationService,
  ) { }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.admin = user.isAdmin;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadData(params);
      this.queryParams = params;
      this.queryCount = Object.keys(params).length;
      this.keyword = params['keyword'];
      this.page = params['page'];
      this.limit = params['limit'];
      this.status = params['status'];
      this.sortBy = params['sortBy'];
      this.sortValue = params['sortValue'];
      this.from.setValue(new Date(+params['from']));
      this.to.setValue(new Date(+params['to']));
    })
  }

  loadData(queryParams? : IParamsSalesOrder) {
    this.salesOrderService.getSalesOrderList(queryParams).subscribe((data) => {
      this.dataSource = data.data.salesOrder;
      this.total = data.data.total;
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
    this.openConfirm("SALES_ORDER", salesOrderId);
  }

  onView(salesOrderId: string){
    this.router.navigate([`${location.pathname}/${salesOrderId}`])
  }

  onSearch(event){
    this.handleUpdateFilter({
      keyword: event.target.value,
      page: 0
    })
  }

  onPageChange(event) {
    this.handleUpdateFilter({
      limit: event.pageSize,
      page: event.pageIndex || 0
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
        description: saleOrder ? saleOrder.description: "",
        images: saleOrder ? saleOrder.images : []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData(this.queryParams)
    });
  }

  openConfirm(type: string, id: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: {
        message: type === 'SALES_ORDER' ? 'this sales order' : 'all this sales orders'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        switch (type){
          case 'SALES_ORDER':
            this.salesOrderService.deleteSalesOrder(id).subscribe((data) => {
              this.notifyService.showSuccess("Delete sale order successfully", "Success")
              this.loadData(this.queryParams)
            });
          case 'SALES_ORDER_MULTI':
            this.salesOrderService.deleteMultiSalesOrders(id).subscribe((data) => {
              this.notifyService.showSuccess("Delete multiple sales order successfully", "Success")
              this.loadData(this.queryParams)
            });
        }
      }
    });
  }

  onFilterStatus(status: string){
    this.handleUpdateFilter({
      status,
      page: 0
    })
  }

  onFilterPeriod(name: string, event){
    this.handleUpdateFilter({
      [name]: new Date(event.target.value).valueOf()
    })
  }

  onDestroyFilter(){
    const pathname = location.pathname;
    this.router.navigate([`${pathname}`])
  }

  onSort(sort: Sort) {
    this.handleUpdateFilter({
      sortBy: sort.active,
      sortValue: sort.direction
    })
  }

  /* Delete all */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row._id));
  }

  onDeleteAll(){
    this.openConfirm("SALES_ORDER_MULTI", this.selection.selected);
  }
}
