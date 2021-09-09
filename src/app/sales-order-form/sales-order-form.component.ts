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
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-sales-order-form',
  templateUrl: './sales-order-form.component.html',
  styleUrls: ['./sales-order-form.component.scss']
})
export class SalesOrderFormComponent implements OnInit {
  // (0) Created, (1) Approved, (2) Delivered, (3) Cancelled
  public statuses = [
    { value: "0", viewValue: "Created" },
    { value: "1", viewValue: "Approved" },
    { value: "2", viewValue: "Delivered" },
    { value: "3", viewValue: "Cancelled" }
  ]
  public creator: User;
  public contactList: Contact[]
  stateCtrl = new FormControl();
  filteredStates: Observable<Contact[]>;

  constructor(
    public salesOrderService: SalesOrderService,
    public contactService: ContactService,
    public commonService : CommonService,
    public dialogRef: MatDialogRef<SalesOrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SalesOrder
  ) { }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.creator = user.username;
      this.data.creator = user.username;
    });
    this.contactService.getContactList().subscribe((data) => {
      this.contactList = data.data.contacts;
      this.filteredStates = this.stateCtrl.valueChanges
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
