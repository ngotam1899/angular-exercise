import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

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



  constructor(
    private formBuilder : FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePassword
  ) { }

  ngOnInit() {
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
    /* if(this.data._id){
      this.salesOrderService
      .updateSalesOrder(this.data._id, data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
        },
        (error) => {
          console.log('Update contact: failed', error);
        }
      );
    }
    else{
      this.salesOrderService
      .addSalesOrder(data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
        },
        (error) => {
          console.log('Add contact: failed', error);
        }
      );
    } */
  }
}
