import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contact, IParamsContact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import { ContactsFormComponent } from '../contacts-form/contacts-form.component'
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';

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
  public queryParams: IParamsContact;      // Query parameters
  public total: number;             // Total data
  public limit: number = 8;         // (Pagination) Limit data in one page
  public page: number = 0;          // (Pagination) Current page
  public admin: boolean = false;

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public commonService : CommonService,
  ) { }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.admin = user.isAdmin;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadData(params);
      this.queryParams = params;
      this.keyword = params['keyword'];
      this.page = params['page'];
      this.limit = params['limit'];
      this.leadSrc = params['leadSrc'];
    })
  }

  loadData(queryParams? : IParamsContact){
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
    this.openConfirm("CONTACT", contactId);
  }

  onSearch(event){
    this.handleUpdateFilter({
      keyword: event.target.value,
      page: 0
    })
  }

  onPageChange(event) {
    this.handleUpdateFilter({
      limit: event.pageSize,
      page: event.pageIndex || 0
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

  openConfirm(type: string, id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: {
        id,
        type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData(this.queryParams)
    });
  }
}
