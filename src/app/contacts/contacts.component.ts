import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import { ContactsFormComponent } from '../contacts-form/contacts-form.component'
import { ActivatedRoute, Router } from '@angular/router';

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
  leadSrc?: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'contactName', 'salutation', 'mobilePhone', 'leadSrc', 'actions'];
  public dataSource : Contact[];
  public contact: Contact;          // Contact detail
  public err: string = '';          // Error display
  public keyword: string = '';      // Keyword to search
  public leadSrc: string            // Leader source
  public queryParams: IParams;      // Query parameters
  public total: number;             // Total data
  public limit: number = 8;         // (Pagination) Limit data in one page
  public page: number = 0;          // (Pagination) Current page

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadData(params);
      this.queryParams = params;
      this.keyword = params['keyword'];
      this.page = params['page'];
      this.limit = params['limit'];
      this.leadSrc = params['leadSrc'];
    })
  }

  loadData(queryParams? : IParams){
    this.contactService.getContactList(queryParams).subscribe((data) => {
      this.dataSource = data.data.contacts;
      this.total = data.data.total;
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

  onSearch(event){
    this.handleUpdateFilter({
      keyword: event.target.value,
      page: 0
    })
  }

  onPageChange(event) {
    this.handleUpdateFilter({
      limit: event.pageSize || 0,
      page: event.pageIndex
    })
  }

  handleUpdateFilter = (data: any) => {
    const pathname = location.pathname;
    this.queryParams = {
      ...this.queryParams,
      ...data,
    };
    this.router.navigate([`${pathname}`], { queryParams : this.queryParams })
  };

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
      this.loadData(this.queryParams)
    });
  }
}
