import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/interface/user.interface';
import { UserFormComponent } from '../user-form/user-form.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public displayedColumns: string[] = ['index', 'name', 'username', 'email', 'isActive', 'isAdmin', 'action'];
  public dataSource : User[];
  public user: User;

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadData()
  }

  private loadData() {
    this.userService.getUserList().subscribe((data) => {
      this.dataSource = data.data.users;
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
      this.loadData()
    });
  }
}
