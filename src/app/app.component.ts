import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ChangePasswordComponent } from './change-password/change-password.component'
import { UserFormComponent } from './management/users/user-form/user-form.component'
import { MatDialog } from '@angular/material/dialog'
import { AuthService } from './shared/services/auth.service'
import { CommonService } from './shared/services/common.service'
import { User } from './shared/interface/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
  ) {}

  ngOnInit(): void {

  }

}
