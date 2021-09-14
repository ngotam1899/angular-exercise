import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../shared/interface/contact.interface';
import { SalesOrder } from '../shared/interface/sales-order.interface';
import { User } from '../shared/interface/user.interface';
import { ContactService } from '../shared/services/contact.service';
import { SalesOrderService } from '../shared/services/sales-order.service';
import { CommonService } from '../shared/services/common.service';
import { statuses, leadSrcs } from '../shared/constants'
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

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
  public admin: boolean = false;
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
  public limitContact: number = 8;            // (Pagination) Limit data in one page
  public pageContact: number = 0;             // (Pagination) Current page
  /* SalesOrder table */
  public displayedColumnsSalesOrder: string[] = ['index', 'subject', 'total', 'createdTime'];
  public dataSourceSalesOrder : SalesOrder[];
  public total_SalesOrder: number;                // Total data
  public limitSalesOrder: number = 8;             // (Pagination) Limit data in one page
  public pageSalesOrder: number = 0;              // (Pagination) Current page
  /* Options of menu select*/
  public leadSource = leadSrcs
  public statuses = statuses
  /* Show infomation sale order */
  public saleOrder: SalesOrder | null;            // Sale order detail 

  /* Pie chart area */
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabelsContacts: Label[] = [];
  public pieChartDataContacts: number[] = []
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;  // Chú thích
  public pieChartPlugins = [];
  public pieChartColors = [{
    backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
  }];
  public pieChartLabelsSalesOrder: Label[] = [];
  public pieChartDataSalesOrder: number[] = []
  /* Pie chart area */

  constructor(
    private salesOrderService: SalesOrderService,
    private contactService: ContactService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public commonService: CommonService,
  ) { }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.admin = user.isAdmin;
    });
    this.contactService.revenueContacts().subscribe((data) => {
      this.pieChartLabelsContacts = data.data.contacts.map((item) => item['_id']);
      this.pieChartDataContacts = data.data.contacts.map((item) => item['count']);
    })
    this.salesOrderService.revenueSalesOrder().subscribe((data) => {
      this.pieChartLabelsSalesOrder = data.data.salesOrder.map((item) => item['_id']);
      this.pieChartDataSalesOrder = data.data.salesOrder.map((item) => item['count']);
    })
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
    this.salesOrderService.getSalesOrderDetail(event._id).subscribe((data) => {
      this.saleOrder = data.data.saleOrder;
    })
  }
}
