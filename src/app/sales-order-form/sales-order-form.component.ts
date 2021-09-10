import { Component, Inject, OnInit } from '@angular/core';
import { SalesOrder } from '../shared/interface/sales-order.interface';
import { SalesOrderService } from '../shared/services/sales-order.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from '../shared/interface/user.interface';
import { CommonService } from '../shared/services/common.service';
import { Contact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { statuses } from '../shared/constants'

@Component({
  selector: 'app-sales-order-form',
  templateUrl: './sales-order-form.component.html',
  styleUrls: ['./sales-order-form.component.scss']
})
export class SalesOrderFormComponent implements OnInit {
  public formSalesOrder: FormGroup;
  public statuses = statuses;             // Get list status value
  public creator: User;                   // Creator is the current user
  public contactList: Contact[]           // Get contact list
  contactName = new FormControl();        // Display contact list
  filteredStates: Observable<Contact[]>;  // 

  constructor(
    private formBuilder : FormBuilder,
    public salesOrderService: SalesOrderService,
    public contactService: ContactService,
    public commonService : CommonService,
    public dialogRef: MatDialogRef<SalesOrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SalesOrder
  ) { }

  createForm(){
    this.formSalesOrder = this.formBuilder.group({
      subject: [this.data.subject, [ Validators.required ]],
      contactName: [this.data.contactName, [ Validators.required ]],
      status: [this.data.status, [ Validators.required ]],
      total: [this.data.total, [ Validators.required ]],
      assignedTo: [{
        value: this.data.assignedTo,
        disabled: true
      }, [ Validators.required ]],
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
    });
    this.createForm();
    this.contactService.getContactList().subscribe((data) => {
      this.contactList = data.data.contacts;
      this.filteredStates = this.contactName.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.contactList.slice())
      );
    });
  }

  private _filterStates(value: string): Contact[] {
    const filterValue = value.toLowerCase();
    return this.contactList.filter(state => state.contactName.toLowerCase().includes(filterValue));
  }

  onSubmit(data): void {
    if(this.data._id){
      this.salesOrderService
      .updateSalesOrder(this.data._id, data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
        },
        (error) => {
          console.log('Update contact: failed', error);
        }
      );
    }
    else{
      this.salesOrderService
      .addSalesOrder(data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
        },
        (error) => {
          console.log('Add contact: failed', error);
        }
      );
    }
  }
}
