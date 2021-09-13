import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UserService } from '../shared/services/user.service';
import { CommonService } from '../shared/services/common.service';
import { NotificationService } from '../shared/services/notification.service';
import { User } from '../shared/interface/user.interface';

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public formChangePassword: FormGroup;
  public user: User;

  constructor(
    private formBuilder : FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    public userService: UserService,
    private commonService: CommonService,
    private notifyService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: ChangePassword
  ) { }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.user = user;
    });
    this.createForm();
  }

  createForm(){
    this.formChangePassword = this.formBuilder.group({
      currentPassword: ['', [ Validators.required ]],
      newPassword: ['', [ Validators.required ]],
      confirmNewPassword: ['', [ Validators.required ]],
    })
  }

  onSubmit(data): void {
    const { currentPassword, newPassword, confirmNewPassword } = data;
    if(newPassword !== confirmNewPassword) {
      this.notifyService.showWarning("The new password and the confirm password is not the same", "Warning")
    }
    else {
      this.userService.changePassword(this.user._id, {
        newPass: newPassword,
        curPass: currentPassword
      })
      .subscribe(
        (data) => {
          this.dialogRef.close({ data });
          this.notifyService.showSuccess("Change password successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }

  }
}
