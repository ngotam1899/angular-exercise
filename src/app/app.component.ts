import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ChangePasswordComponent } from './change-password/change-password.component'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from './shared/services/auth.service'
import { CommonService } from './shared/services/common.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  public isOpened = false;  // biến chuyển đổi hiệu ứng animate
  public userName = ""

  constructor(
    public dialog: MatDialog,
    public authService : AuthService,
    public commonService : CommonService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.commonService.user$.subscribe((user) => {
      this.userName = user.username;
    });
    this.authService.getProfile().subscribe(
      (data) => {
        this.commonService.setUser(data.data.user);
      }
    )
  }

  public openLeftSide() {
    this.isOpened = !this.isOpened;
    this.sidenav.toggle();
  }

  public closeLeftSide() {
    this.isOpened = false;
  }

  public onHandleSignin(){
    this.openDialogSignin()
  }

  public onChangePassword(){
    this.openDialogChangePassword()
  }

  openDialogSignin(): void {
    //this.router.navigate([`/login`])
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
}
