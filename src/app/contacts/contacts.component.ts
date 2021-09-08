import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import { ContactsFormComponent } from '../contacts-form/contacts-form.component'

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'contactName', 'salutation', 'mobilePhone', 'leadSrc', 'actions'];
  public dataSource : Contact[];
  public contact: Contact;
  public err: string = '';
  public keyword: string = '';

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog,

  ) { }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.contactService.getContactList().subscribe((data) => {
      this.dataSource = data.data.contacts;
    }, (err) => {
      this.err = err;
    });
  }

  onAdd(){
    this.openDialog()
  }

  onUpdate(contactId: string){
    this.contactService.getContactDetail(contactId).subscribe((data) => {
      this.contact = data.data.contact;
      this.openDialog(this.contact)
    });
  }

  onDelete(contactId: string){
    this.contactService.deleteContact(contactId).subscribe((data) => {
      this.loadData()
    });
  }

  openDialog(contact?: Contact): void {
    const dialogRef = this.dialog.open(ContactsFormComponent, {
      width: '500px',
      data: {
        _id: contact ? contact._id : null,
        contactName: contact ? contact.contactName : "",
        salutation: contact ? contact.salutation: "",
        mobilePhone: contact ? contact.mobilePhone: "",
        email: contact ? contact.email : "",
        organization: contact ? contact.organization: "",
        dob: contact ? contact.dob : "",
        leadSrc: contact ? contact.leadSrc: "",
        assignedTo: contact ? contact.assignedTo : "",
        creator: contact ? contact.creator: "",
        address: contact ? contact.address : "",
        description: contact ? contact.description: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData()
    });
  }
}
