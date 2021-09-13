import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NotificationService } from '../shared/services/notification.service';

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
  public formLogin: FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    public authService: AuthService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    private notifyService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: Authorization
  ) { }

  ngOnInit() {
    this.createForm()
  }

  createForm(){
    this.formLogin = this.formBuilder.group({
      username: [this.data.username, [ Validators.required ]],
      password: [this.data.password, [ Validators.required ]],
    })
  }

  onSubmit(_data: Authorization){
    this.authService
      .authLogin(_data.username, _data.password)
      .subscribe(
        (data) => {
          if (Object.prototype.hasOwnProperty.call(data, 'error')) {
            console.log('DialogLoginComponent: login: error', data);
          } else {
            _data.token = data;
            this.dialogRef.close({ data: _data });
          }
          this.notifyService.showSuccess("Login successfully", "Success")
        },
        (error) => {
          this.notifyService.showError( error, "Error")
        }
      );
  }
}
