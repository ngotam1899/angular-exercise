import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { User, IParamsUser } from '../../../shared/interface/user.interface';
import { UserFormComponent } from '../user-form/user-form.component'
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'name', 'username', 'email', 'isActive', 'isAdmin', 'action'];
  public dataSource : User[];
  public user: User;                  // User detail
  public keyword: string = '';        // Keyword to search
  public queryParams: IParamsUser;    // Query parameters
  public queryCount: number = 0;
  public total: number;               // Total data
  public status: string;              // Status order
  public limit: number = 8;           // (Pagination) Limit data in one page
  public page: number = 0;            // (Pagination) Current page
  public isAdmin: string = '';                 // Status order
  public isActive: string = '';                 // Status order

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadData(params);
      this.queryParams = params;
      this.queryCount = Object.keys(params).length;
      this.keyword = params['keyword'];
      this.page = params['page'];
      this.limit = params['limit'];
      this.isAdmin = params['isAdmin'] || "";
      this.isActive = params['isActive'] || "";
    })
  }

  private loadData(queryParams? : IParamsUser) {
    this.userService.getUserList(queryParams).subscribe((data) => {
      this.dataSource = data.data.users;
      this.total = data.data.total;
    });
  }

  onUpdate(userId: string){
    this.userService.getUserDetail(userId).subscribe((data) => {
      this.user = data.data.user;
      this.openDialog(this.user)
    });
  }

  onAdd(){
    this.openDialog()
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

  openDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: {
        _id: user ? user._id : null,
        name: user ? user.name : "",
        username: user ? user.username: "",
        password: user ? user.password: "",
        email: user ? user.email : "",
        phone: user ? user.phone: "",
        isAdmin: user ? user.isAdmin : "",
        isActive: user ? user.isActive: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData(this.queryParams)
    });
  }

  onDestroyFilter(){
    const pathname = location.pathname;
    this.router.navigate([`${pathname}`])
  }
}
