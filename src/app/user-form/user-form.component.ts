import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../shared/interface/user.interface';
import { UserService } from '../shared/services/user.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  public formUser: FormGroup

  constructor(
    private formBuilder : FormBuilder,
    public userService: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    private notifyService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  ngOnInit(): void {
    this.createForm()
  }

  createForm(){
    this.formUser = this.formBuilder.group({
      name: [this.data.name, [ Validators.required ]],
      username: [this.data.username, [ Validators.required ]],
      password: [{
        value: this.data.password, disabled: this.data._id}, [
          Validators.required,
          Validators.pattern("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
        ]
      ],
      email: [this.data.email, [
        Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
      ]],
      phone: [this.data.phone, [ Validators.required ]],
      isAdmin: [this.data.isAdmin],
      isActive: [this.data.isActive],
    })
  }

  onSubmit(data: User): void {
    if(this.data._id){
      this.userService
      .updateUser(this.data._id, data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data });
          this.notifyService.showSuccess("Update user successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
    else{
      this.userService
      .addUser(data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data });
          this.notifyService.showSuccess("Add user successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
  }
}
