import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Contact, IParamsContact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';
import { UserService } from '../shared/services/user.service';
import { ContactsFormComponent } from '../contacts-form/contacts-form.component'
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { leadSrcs } from '../shared/constants'
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms'
import { User } from '../shared/interface/user.interface';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  public leadSrcs = leadSrcs;
  public displayedColumns: string[] = ['checkbox', 'index', 'salutation', 'contactName', 'mobilePhone', 'leadSrc', 'actions'];
  public dataSource : Contact[];
  public selection = new SelectionModel<string>(true, []);
  public contact: Contact;          // Contact detail
  public keyword: string = '';      // Keyword to search
  public leadSrc: string            // Leader source
  public queryParams: IParamsContact;      // Query parameters
  public queryCount: number = 0;
  public total: number;             // Total data
  public limit: number = 8;         // (Pagination) Limit data in one page
  public page: number = 0;          // (Pagination) Current page
  public admin: boolean = false;
  /* Sorting */
  public sortBy: string;
  public sortValue: string;
  /* Filter assignedTo */
  public assignedTo = new FormControl({ value: '' },);  // Filter assignedTo
  public filteredStates$: Observable<User[]>;

  constructor(
    private contactService: ContactService,
    private userService: UserService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public commonService : CommonService,
    private notifyService : NotificationService,
  ) { }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.admin = user.isAdmin;
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadData(params);
      this.queryParams = params;
      this.queryCount = Object.keys(params).length;
      this.keyword = params['keyword'];
      this.page = params['page'];
      this.limit = params['limit'];
      this.leadSrc = params['leadSrc'];
      this.sortValue = params['sortValue'];
      this.sortBy = params['sortBy'];
      this.assignedTo.setValue(params['assignedTo']);
    })
    this.filteredStates$ = this.assignedTo.valueChanges.pipe(
      startWith(''),
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(name => this.userService.getUserList({keyword: name})),
      map(data => data.data.users)
    );
  }

  loadData(queryParams? : IParamsContact){
    this.contactService.getContactList(queryParams).subscribe((data) => {
      this.dataSource = data.data.contacts;
      this.total = data.data.total;
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

  openConfirm(type: string, id: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: {
        message: type === 'CONTACT' ? 'this contact' : 'all this contacts'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        switch (type){
          case 'CONTACT':
            this.contactService.deleteContact(id).subscribe((data) => {
              this.notifyService.showSuccess("Delete contact successfully", "Success")
              this.loadData(this.queryParams)
            });
          case 'CONTACT_MULTI':
            this.contactService.deleteMultiContacts(id).subscribe((data) => {
              this.notifyService.showSuccess("Delete multiple contacts successfully", "Success")
              this.loadData(this.queryParams)
            });
        }
      }
    });
  }

  onDestroyFilter(){
    const pathname = location.pathname;
    this.router.navigate([`${pathname}`])
  }

  onSort(sort: Sort) {
    this.handleUpdateFilter({
      sortBy: sort.active,
      sortValue: sort.direction
    })
  }

    /* Delete all */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row._id));
  }

  onDeleteAll(){
    this.openConfirm("CONTACT_MULTI", this.selection.selected);
  }
}
