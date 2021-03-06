import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ChangePasswordComponent } from '../change-password/change-password.component'
import { UserFormComponent } from './users/user-form/user-form.component'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from '../shared/services/auth.service'
import { CommonService } from '../shared/services/common.service'
import { User } from '../shared/interface/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_AVATAR } from '../shared/constants/index'

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  public isOpened = false;  // biến chuyển đổi hiệu ứng animate
  public userName = ""
  public image = ""
  public user: User;
  public NOAVATAR = NO_AVATAR

  constructor(
    public dialog: MatDialog,
    public authService : AuthService,
    public commonService : CommonService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.commonService.user$.subscribe((user) => {
      this.userName = user.username;
      this.image = user.image;
      this.user = user;
    });
    this.authService.getProfile().subscribe(
      (data) => {
        this.commonService.setUser(data.data.user);
      },
      (err) => {
        this.snackBar.open("Your login session has expired! Please login again", "Cancel", {
          duration: 2000,
        });
        this.authService.removeToken();
      }
    )
  }

  public openLeftSide() {
    this.sidenav.toggle();
  }

  public onGetProfile(){
    this.openDialogUser(this.user)
  }

  public onChangePassword(){
    this.openDialogChangePassword()
  }

  openDialogChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '300px',
      data: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.authService.logout()
    });
  }

  openDialogUser(user?: User): void {
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
        isActive: user ? user.isActive: "",
        image: user ? user.image: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) window.location.reload()
    });
  }

}
