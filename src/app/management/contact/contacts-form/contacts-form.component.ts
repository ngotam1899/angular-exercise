import { Component, Inject, OnInit } from '@angular/core';
import { Contact } from '../../../shared/interface/contact.interface';
import { ContactService } from '../../../shared/services/contact.service';
import { CommonService } from '../../../shared/services/common.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from '../../../shared/interface/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { debounceTime, distinctUntilChanged, switchMap, startWith, map } from 'rxjs/operators';
import { leadSrcs } from '../../../shared/constants'
import { NotificationService } from '../../../shared/services/notification.service';
import { Observable } from 'rxjs';

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
  public creator: string;                   // Creator is the current user
  public admin: boolean;
  public salutations: String[] = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];
  public userList: User[] = [];
  public filteredStates$: Observable<User[]>;

  constructor(
    private formBuilder : FormBuilder,
    public contactService: ContactService,
    public userService: UserService,
    public commonService : CommonService,
    private notifyService : NotificationService,
    public dialogRef: MatDialogRef<ContactsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact
  ) {}

  createForm(){
    this.formContact = this.formBuilder.group({
      contactName: [this.data.contactName, [ Validators.required ]],
      salutation: [this.data.salutation],
      mobilePhone: [this.data.mobilePhone, [ Validators.required ]],
      email: [this.data.email, [Validators.pattern("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")]],
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

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.creator = user.username;
      this.admin = user.isAdmin
    });
    this.createForm();
    this.userService.getUserList().subscribe((data) => {
      this.userList = data.data.users;
    })
    this.filteredStates$ = this.formContact.get('assignedTo').valueChanges.pipe(
      startWith(''),
      map(state => state ? this._filterStates(state) : this.userList)
    );
  }

  _filterStates(value){
    const filterValue = value.toLowerCase();
    return this.userList.filter(state => state.username.toLowerCase().includes(filterValue));
  }

  onSubmit(data): void {
    if(this.data._id){
      this.contactService
      .updateContact(this.data._id, data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data });
          this.notifyService.showSuccess("Update contact successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
    else{
      data.creator = this.creator;
      this.contactService
      .addContact(data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data });
          this.notifyService.showSuccess("Add contact successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
  }
}
