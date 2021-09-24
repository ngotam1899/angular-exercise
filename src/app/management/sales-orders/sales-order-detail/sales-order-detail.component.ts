import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from '../../../shared/services/sales-order.service';
import { ContactService } from '../../../shared/services/contact.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/interface/user.interface';
import { CommonService } from '../../../shared/services/common.service';
import { Contact } from '../../../shared/interface/contact.interface';
import { SalesOrder } from '../../../shared/interface/sales-order.interface';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { statuses } from '../../../shared/constants'

@Component({
  selector: 'app-sales-order-detail',
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.scss']
})
export class SalesOrderDetailComponent implements OnInit {
  public statuses = statuses;
  public saleOrderId: string;
  public salesOrder: SalesOrder;
  public formSalesOrder: FormGroup;
  public creator: string;                   // Creator is the current user
  public admin: boolean;
  filteredContact: Contact[] = [];
  filteredUser: User[] = [];

  constructor(
    private formBuilder : FormBuilder,
    private salesOrderService: SalesOrderService,
    private router: Router,
    private activeRoute : ActivatedRoute,
    public commonService : CommonService,
    public contactService: ContactService,
    public userService: UserService,
  ) { }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.creator = user.username;
      this.admin = user.isAdmin;
    });
    this.activeRoute.params.subscribe(data=>{
      this.saleOrderId = data.id;
      this.salesOrderService.getSalesOrderDetail(data.id).subscribe( res => {
        this.salesOrder = res.data.saleOrder
        this.createForm()
        this.formSalesOrder.get('assignedTo').valueChanges.pipe(
          startWith(''),
          debounceTime(800),
          distinctUntilChanged(),
          switchMap(state => this.userService.getUserList({keyword: state}))
        ).subscribe(data => {
          this.filteredUser = data.data.users
        });

        this.formSalesOrder.get('contactName').valueChanges.pipe(
          startWith(''),
          debounceTime(800),
          distinctUntilChanged(),
          switchMap(state => this.contactService.getContactList({keyword: state}))
        ).subscribe(data => {
          this.filteredContact = data.data.contacts
        });
      });
    })
  }

  createForm(){
    this.formSalesOrder = this.formBuilder.group({
      subject: [this.salesOrder.subject, [ Validators.required ]],
      contactName: [this.salesOrder.contactName, [ Validators.required ]],
      status: [this.salesOrder.status, [ Validators.required ]],
      total: [this.salesOrder.total, [ Validators.required ]],
      assignedTo: [this.salesOrder.assignedTo, [ Validators.required ]],
      creator: [{
        value: this.salesOrder.creator || this.creator,
        disabled: true
      }],
      description: [this.salesOrder.description],
    })
  }

  onBack(){
    this.router.navigate(['/management/sales-order'])
  }
}
