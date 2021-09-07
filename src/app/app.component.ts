import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginFormComponent } from './login-form/login-form.component'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from './shared/services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  public isOpened = false;  // biến chuyển đổi hiệu ứng animate

  constructor(
    public dialog: MatDialog,
    public authService : AuthService
  ) {}

  ngOnInit(): void {

  }

  public openLeftSide() {
    this.isOpened = !this.isOpened;
    this.sidenav.toggle();
  }

  public closeLeftSide() {
    this.isOpened = false;
  }

  public onHandleSignin(){
    this.openDialog()
  }

  openDialog(): void { 
    const dialogRef = this.dialog.open(LoginFormComponent, {
      width: '300px',
      data: {
        username: "",
        password: "",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const username = result && result.data.username;
      const password = result && result.data.password;
      const token = result && result.data.token.data.token;
      if (!!username && !!password && !!token) {
        this.authService.setToken(token);
      }
    });
  }
}
