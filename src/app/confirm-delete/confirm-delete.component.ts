import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ContactService } from '../shared/services/contact.service';
import { NotificationService } from '../shared/services/notification.service';
import { SalesOrderService } from '../shared/services/sales-order.service';


@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  constructor(
    private contactService: ContactService,
    private salesOrderService: SalesOrderService,
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    private notifyService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onSubmit(){
    switch(this.data.type){
      case "CONTACT":
        this.contactService.deleteContact(this.data.id).subscribe((data) => {
          this.dialogRef.close({ data });
          this.notifyService.showSuccess("Delete contact successfully", "Success")
        });
        return;
      case "SALES_ORDER":
        this.salesOrderService.deleteSalesOrder(this.data.id).subscribe((data) => {
          this.dialogRef.close({ data });
          this.notifyService.showSuccess("Delete contact successfully", "Success")
        });
        return;
      default:
        return;
    }
  }
}
