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
  public leadSrc: string = "-1";        // LeadSrc filter
  public totalContact: number = 0;      // Total contact
  public revenueContact: any[] = [];
  public status: string = "-1";         // Status filter
  public totalSalesOrder: number = 0;   // Total sales order
  public revenueSalesOrder: any[] = [];
  public queryParams: IParams;          // Query parameters
  /* Contact table */
  public displayedColumnsContact: string[] = ['index', 'contactName', 'assignedTo', 'createdTime'];
  public dataSourceContact : Contact[];
  public total_Contact: number;               // Total data
  public limitContact: number = 5;            // (Pagination) Limit data in one page
  public pageContact: number = 0;             // (Pagination) Current page
  /* SalesOrder table */
  public displayedColumnsSalesOrder: string[] = ['index', 'subject', 'total', 'createdTime'];
  public dataSourceSalesOrder : SalesOrder[];
  public total_SalesOrder: number;                // Total data
  public limitSalesOrder: number = 5;             // (Pagination) Limit data in one page
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
      position: 'left',
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
    backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#2C4D75', '#9BBB59'],
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
    this.loadRevenueContact();
    this.loadRevenueSalesOrder();
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadLatestContact(params);
      this.loadLatestSalesOrder(params);
      this.queryParams = params;
      this.limitContact = params['limitContact'];
      this.pageContact = params['pageContact'];
      this.limitSalesOrder = params['limitSalesOrder'];
      this.pageSalesOrder = params['pageSalesOrder'];
    })
  }

  loadRevenueContact(){
    this.contactService.revenueContacts().subscribe((data) => {
      this.pieChartLabelsContacts = data.data.contacts.map((item) => item['_id']);
      this.pieChartDataContacts = data.data.contacts.map((item) => item['count']);
      for(let i=0; i < leadSrcs.length; i++){
        for(let j=0; j < this.pieChartLabelsContacts.length; j++){
          if(leadSrcs[i].value === this.pieChartLabelsContacts[j]){
            this.pieChartLabelsContacts[j] = leadSrcs[i].viewValue
          }
        }
      }
      this.totalContact = data.data.total;
      this.revenueContact = [...data.data.contacts, { _id: "-1", count: this.totalContact}];
    })
  }

  loadRevenueSalesOrder(){
    this.salesOrderService.revenueSalesOrder().subscribe((data) => {
      this.pieChartLabelsSalesOrder = data.data.salesOrder.map((item) => item['_id']);
      this.pieChartDataSalesOrder = data.data.salesOrder.map((item) => item['count']);
      for(let i=0; i < statuses.length; i++){
        for(let j=0; j < this.pieChartLabelsSalesOrder.length; j++){
          if(statuses[i].value === this.pieChartLabelsSalesOrder[j]){
            this.pieChartLabelsSalesOrder[j] = statuses[i].viewValue
          }
        }
      }
      this.totalSalesOrder = data.data.total;
      this.revenueSalesOrder = [...data.data.salesOrder, { _id: "-1", count: this.totalSalesOrder}];
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

  getStatus(status: string){
    this.status = status;
    this.queryParams = { ...this.queryParams, status };
    const found = this.revenueSalesOrder.find(s => s._id === status)
    this.totalSalesOrder = found ? found.count : 0;
  }

  getLeadSrc(leadSrc: string){
    this.leadSrc = leadSrc;
    this.queryParams = { ...this.queryParams, leadSrc };
    const found = this.revenueContact.find(s => s._id === leadSrc)
    this.totalContact = found ? found.count : 0;
  }

  chartClicked(e, url: string){
    if (e.active.length > 0) {
    const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event);
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        if(url === "sales-order") {
          this.queryParams = { ...this.queryParams, status: statuses.find(s => s.viewValue === label).value };
          this.onRedirect("sales-order")
        }
        else {
          this.queryParams = { ...this.queryParams, leadSrc: leadSrcs.find(s => s.viewValue === label).value };
          this.onRedirect("contacts")
        }
      }
    }
  }
}
