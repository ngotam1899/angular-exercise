import { Component, Inject, OnInit } from '@angular/core';
import { Contact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import { CommonService } from '../shared/services/common.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from '../shared/interface/user.interface';
import { UserService } from '../shared/services/user.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { leadSrcs } from '../shared/constants'

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
  public formContact: FormGroup;
  public leadSrcs = leadSrcs;
  public userList: User[];
  public creator: User;                   // Creator is the current user

  constructor(
    private formBuilder : FormBuilder,
    public contactService: ContactService,
    public userService: UserService,
    public commonService : CommonService,
    public dialogRef: MatDialogRef<ContactsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact
  ) {}

  createForm(){
    this.formContact = this.formBuilder.group({
      contactName: [this.data.contactName, [ Validators.required ]],
      salutation: [this.data.salutation, [ Validators.required ]],
      mobilePhone: [this.data.mobilePhone, [ Validators.required ]],
      email: [this.data.email],
      organization: [this.data.organization],
      dob: [this.data.dob],
      leadSrc: [this.data.leadSrc, [ Validators.required ]],
      assignedTo: [this.data.assignedTo, [ Validators.required ]],
      creator: [{
        value: this.data.creator || this.creator,
        disabled: true
      }],
      address: [this.data.address],
      description: [this.data.description],
    })
  }

  assignedTo = new FormControl();
  filteredStates: Observable<User[]>;

  private _filterStates(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.userList.filter(state => state.username.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.creator = user.username;
    });
    this.createForm();
    this.userService.getUserList().subscribe((data) => {
      this.userList = data.data.users;
      this.filteredStates = this.assignedTo.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.userList.slice())
      );
    });
  }

  onSubmit(data): void {
    if(this.data._id){
      this.contactService
      .updateContact(this.data._id, data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data });
        },
        (error) => {
          console.log('Update contact: failed', error);
        }
      );
    }
    else{
      this.contactService
      .addContact(data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data });
        },
        (error) => {
          console.log('Add contact: failed', error);
        }
      );
    }
  }
}
