import { Component, Inject, OnInit } from '@angular/core';
import { SalesOrder } from '../../../shared/interface/sales-order.interface';
import { SalesOrderService } from '../../../shared/services/sales-order.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from '../../../shared/interface/user.interface';
import { CommonService } from '../../../shared/services/common.service';
import { Contact } from '../../../shared/interface/contact.interface';
import { ContactService } from '../../../shared/services/contact.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { statuses } from '../../../shared/constants'
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-sales-order-form',
  templateUrl: './sales-order-form.component.html',
  styleUrls: ['./sales-order-form.component.scss']
})
export class SalesOrderFormComponent implements OnInit {
  public formSalesOrder: FormGroup;
  public statuses = statuses;             // Get list status value
  public creator: string;                   // Creator is the current user
  public admin: boolean;
  filteredContact: Contact[] = [];
  filteredUser: User[] = [];

  constructor(
    private formBuilder : FormBuilder,
    public salesOrderService: SalesOrderService,
    public contactService: ContactService,
    public userService: UserService,
    public commonService : CommonService,
    public dialogRef: MatDialogRef<SalesOrderFormComponent>,
    private notifyService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: SalesOrder
  ) { }

  createForm(){
    this.formSalesOrder = this.formBuilder.group({
      subject: [this.data.subject, [ Validators.required ]],
      contactName: [this.data.contactName, [ Validators.required ]],
      status: [this.data.status, [ Validators.required ]],
      total: [this.data.total, [ Validators.required ]],
      assignedTo: [this.data.assignedTo, [ Validators.required ]],
      creator: [{
        value: this.data.creator || this.creator,
        disabled: true
      }],
      description: [this.data.description],
    })
  }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.creator = user.username;
      this.admin = user.isAdmin;
    });
    this.createForm();
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
  }

  onSubmit(data): void {
    if(this.data._id){
      this.salesOrderService
      .updateSalesOrder(this.data._id, data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
          this.notifyService.showSuccess("Update sales order successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
    else{
      data.creator = this.creator;
      this.salesOrderService
      .addSalesOrder(data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
          this.notifyService.showSuccess("Add sales order successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
  }
}