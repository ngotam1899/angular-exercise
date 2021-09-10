import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../shared/interface/contact.interface';
import { SalesOrder } from '../shared/interface/sales-order.interface';
import { ContactService } from '../shared/services/contact.service';
import { SalesOrderService } from '../shared/services/sales-order.service';

interface IParams {
  leadSrc?: string;
  status?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public err: string = '';              // Error display
  public leadSrc: string = "-1";        // LeadSrc filter
  public totalContact: number = 0;      // Total contact
  public status: string = "-1";         // Status filter
  public totalSalesOrder: number = 0;   // Total sales order
  public queryParams: IParams;          // Query parameters
  /* Contact table */
  public displayedColumnsContact: string[] = ['index', 'contactName', 'assignedTo', 'createdTime'];
  public dataSourceContact : Contact[];
  public total_Contact: number;               // Total data
  public limitContact: number = 8;           // (Pagination) Limit data in one page
  public pageContact: number = 0;            // (Pagination) Current page
  /* SalesOrder table */
  public displayedColumnsSalesOrder: string[] = ['index', 'subject', 'total', 'createdTime'];
  public dataSourceSalesOrder : SalesOrder[];
  public total_SalesOrder: number;               // Total data
  public limitSalesOrder: number = 8;           // (Pagination) Limit data in one page
  public pageSalesOrder: number = 0;            // (Pagination) Current page

  public leadSource = [
    { value: "-1", viewValue: "All contracts" },
    { value: "0", viewValue: "Existing Customer" },
    { value: "1", viewValue: "Partner" },
    { value: "2", viewValue: "Conference" },
    { value: "3", viewValue: "Website" },
    { value: "4", viewValue: "Word of mouth" },
    { value: "5", viewValue: "Other" },
  ]

  public statuses = [
    { value: "-1", viewValue: "All sales" },
    { value: "0", viewValue: "Created" },
    { value: "1", viewValue: "Approved" },
    { value: "2", viewValue: "Delivered" },
    { value: "3", viewValue: "Cancelled" }
  ]

  constructor(
    private salesOrderService: SalesOrderService,
    private contactService: ContactService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.revenueContact(params);
      this.revenueSalesOrder(params);
      this.loadLatestContact(params);
      this.loadLatestSalesOrder(params);
      this.queryParams = params;
      this.leadSrc = params['leadSrc'] || -1;
      this.status = params['status'] || -1;
      this.limitContact = params['limitContact'];
      this.pageContact = params['pageContact'];
      this.limitSalesOrder = params['limitSalesOrder'];
      this.pageSalesOrder = params['pageSalesOrder'];
    })
  }

  loadLatestContact(queryParams? : any){
    this.contactService.getContactLatest(queryParams).subscribe((data) => {
      this.dataSourceContact = data.data.contacts;
      this.total_Contact = data.data.total;
    });
  }

  loadLatestSalesOrder(queryParams? : any){
    this.salesOrderService.getSalesOrderLatest(queryParams).subscribe((data) => {
      this.dataSourceSalesOrder = data.data.salesOrder;
      this.total_SalesOrder = data.data.total;
    });
  }

  revenueContact(queryParams? : IParams){
    this.salesOrderService.getSalesOrderList(queryParams).subscribe((data) => {
      this.totalSalesOrder = data.data.total;
    }, (err) => {
      this.err = err;
    })
  }

  revenueSalesOrder(queryParams? : IParams){
    this.contactService.getContactList(queryParams).subscribe((data) => {
      this.totalContact = data.data.total;
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

  onRedirect = (url : string, assignedTo? : string) => {
    if(assignedTo){
      this.router.navigate([`${url}`], { queryParams : { assignedTo } })
    }
    else this.router.navigate([`${url}`], { queryParams : this.queryParams })
  }

  onPageChangeContact(event) {
    this.handleUpdateFilter({
      limitContact: event.pageSize || 0,
      pageContact: event.pageIndex
    })
  }

  onPageChangeSalesOrder(event) {
    this.handleUpdateFilter({
      limitSalesOrder: event.pageSize || 0,
      pageSalesOrder: event.pageIndex
    })
  }

  onRecord(event) {
    console.log(event)
  }
}
