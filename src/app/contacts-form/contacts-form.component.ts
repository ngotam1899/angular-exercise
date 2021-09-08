import { Component, Inject, OnInit } from '@angular/core';
import { Contact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-contacts-form',
  templateUrl: './contacts-form.component.html',
  styleUrls: ['./contacts-form.component.scss']
})
export class ContactsFormComponent implements OnInit {

  constructor(
    public contactService: ContactService,
    public dialogRef: MatDialogRef<ContactsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact
  ) { }

  ngOnInit() {
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
