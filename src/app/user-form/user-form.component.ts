import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../shared/interface/user.interface';
import { UserService } from '../shared/services/user.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  constructor(
    public userService: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  ngOnInit() {
  }


  onSubmit(): void {
    if(this.data._id){
      this.userService
      .updateUser(this.data._id, this.data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: this.data });
        },
        (error) => {
          console.log('Add user: failed', error);
        }
      );
    }
    else{
      this.userService
      .addUser(this.data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: this.data });
        },
        (error) => {
          console.log('Add user: failed', error);
        }
      );
    }
  }
}
