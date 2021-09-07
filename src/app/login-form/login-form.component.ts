import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthService } from '../shared/services/auth.service';

export interface Authorization {
  username: string;
  password: string;
  token: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Authorization
  ) { }

  ngOnInit() {
  }

  onSubmitLogin(){
    // this.dialogRef.close({ data: this.data });
    this.authService
      .authLogin(this.data.username, this.data.password)
      .subscribe(
        (data) => {
          console.log('DialogLoginComponent: login, data = ', data);
          if (Object.prototype.hasOwnProperty.call(data, 'error')) {
            console.log('DialogLoginComponent: login: error', data);
          } else {
            this.data.token = data;
            console.log('DialogLoginComponent: this.data', this.data);
            this.dialogRef.close({ data: this.data });
          }
        },
        (error) => {
          console.log('AuthService: failed', error);
        }
      );
  }
}
