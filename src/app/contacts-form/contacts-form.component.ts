import { Component, Inject, OnInit } from '@angular/core';
import { Contact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from '../shared/interface/user.interface';
import { UserService } from '../shared/services/user.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-contacts-form',
  templateUrl: './contacts-form.component.html',
  styleUrls: ['./contacts-form.component.scss']
})
export class ContactsFormComponent implements OnInit {
  // (0) Existing Customer, (1) Partner, (2) Conference, (3) Website, (4) Word of mouth, (5) Other
  public leadSrcs = [
    { value: "0", viewValue: "Existing Customer" },
    { value: "1", viewValue: "Partner" },
    { value: "2", viewValue: "Conference" },
    { value: "3", viewValue: "Website" },
    { value: "4", viewValue: "Word of mouth" },
    { value: "5", viewValue: "Other" },
  ]
  public userList: User[]

  constructor(
    public contactService: ContactService,
    public userService: UserService,
    public dialogRef: MatDialogRef<ContactsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact
  ) {}

  stateCtrl = new FormControl();
  filteredStates: Observable<User[]>;

  private _filterStates(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.userList.filter(state => state.username.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.userService.getUserList().subscribe((data) => {
      this.userList = data.data.users;
      this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.userList.slice())
      );
    });
  }

  onSubmit(): void {
    if(this.data._id){
      this.contactService
      .updateContact(this.data._id, this.data)
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
      this.contactService
      .addContact(this.data)
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
