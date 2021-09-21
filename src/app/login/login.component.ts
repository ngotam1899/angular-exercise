import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NotificationService } from '../shared/services/notification.service';
import { Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service'

export interface Authorization {
  username: string;
  password: string;
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  hide = true;

  constructor(
    private formBuilder : FormBuilder,
    public authService: AuthService,
    private router: Router,
    private notifyService : NotificationService,
    public commonService : CommonService,
  ) { }

  ngOnInit() {
    this.createForm()
  }

  createForm(){
    this.formLogin = this.formBuilder.group({
      username: ['', [ Validators.required ]],
      password: ['', [ Validators.required ]],
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
          }
          this.notifyService.showSuccess("Login successfully", "Success")
          const username = _data.username;
          const password = _data.password;
          const token = data.data.token;
          if (!!username && !!password && !!token) {
            this.authService.setToken(token);
          }
          this.authService.getProfile().subscribe(
            (data) => {
              this.commonService.setUser(data.data.user);
              this.router.navigate(["/management"])
            }
          )
        },
        (error) => {
          this.notifyService.showError( error, "Error")
        }
      );
  }
}
