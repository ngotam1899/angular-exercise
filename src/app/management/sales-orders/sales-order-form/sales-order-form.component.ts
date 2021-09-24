import { Component, Inject, OnInit } from '@angular/core';
import { SalesOrder } from '../../../shared/interface/sales-order.interface';
import { SalesOrderService } from '../../../shared/services/sales-order.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { User } from '../../../shared/interface/user.interface';
import { CommonService } from '../../../shared/services/common.service';
import { Contact } from '../../../shared/interface/contact.interface';
import { ContactService } from '../../../shared/services/contact.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { statuses } from '../../../shared/constants'
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../../shared/services/user.service';
import { UploadFile  } from 'ng-zorro-antd/upload';
import { UploadXHRArgs } from 'ng-zorro-antd';

@Component({
  selector: 'app-sales-order-form',
  templateUrl: './sales-order-form.component.html',
  styleUrls: ['./sales-order-form.component.scss']
})
export class SalesOrderFormComponent implements OnInit {
  public formSalesOrder: FormGroup;
  public statuses = statuses;             // Get list status value
  public creator: string;                   // Creator is the current user
  public admin: boolean;
  filteredContact: Contact[] = [];
  filteredUser: User[] = [];
  public uploadImages = [];

  /* Upload multiple image use Ant Design */
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList: any[];
  previewImage: string | undefined = '';
  previewVisible = false;
  /* Upload multiple image use Ant Design */

  constructor(
    private formBuilder : FormBuilder,
    public salesOrderService: SalesOrderService,
    public contactService: ContactService,
    public userService: UserService,
    public commonService : CommonService,
    public dialogRef: MatDialogRef<SalesOrderFormComponent>,
    private notifyService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: SalesOrder
  ) { }

  /* Upload multiple image use Ant Design */
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url;
    this.previewVisible = true;
  };
  onUpload(){
    this.uploadImages = [];
    this.fileList.map(item => {
      if(item.response && item.status !== "removed"){
        this.uploadImages.push({url: item.response.image})
      } else if(item.url && item.status !== "removed"){
        this.uploadImages.push({url: item.url})
      }
    })
  }

  customUploadReq = (item) => {
    const reader = new FileReader();
    reader.readAsDataURL(item.file);
    reader.onloadend = () => {
      this.userService.uploadAvatar(reader.result).subscribe(res => {
        item.onSuccess(res.data, item.file, res);
      })
    }
  }
  
  /* Upload multiple image use Ant Design */

  createForm(){
    this.formSalesOrder = this.formBuilder.group({
      subject: [this.data.subject, [ Validators.required ]],
      contactName: [this.data.contactName, [ Validators.required ]],
      status: [this.data.status, [ Validators.required ]],
      total: [this.data.total, [ Validators.required ]],
      assignedTo: [this.data.assignedTo, [ Validators.required ]],
      creator: [{
        value: this.data.creator || this.creator,
        disabled: true
      }],
      description: [this.data.description],
    })
    /* Covert _id to uid */
    this.fileList = this.data.images.map(({
      _id: uid,
      ...rest
    }) => ({
      uid,
      ...rest
    }));
  }

  ngOnInit() {
    this.commonService.user$.subscribe((user) => {
      this.creator = user.username;
      this.admin = user.isAdmin;
    });
    this.createForm();
    this.formSalesOrder.get('assignedTo').valueChanges.pipe(
      startWith(''),
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(state => this.userService.getUserList({keyword: state}))
    ).subscribe(data => {
      this.filteredUser = data.data.users
    });

    this.formSalesOrder.get('contactName').valueChanges.pipe(
      startWith(''),
      debounceTime(800),
      distinctUntilChanged(),
      switchMap(state => this.contactService.getContactList({keyword: state}))
    ).subscribe(data => {
      this.filteredContact = data.data.contacts
    });
  }

  onSubmit(data): void {
    data.images = this.uploadImages.length > 0 ? this.uploadImages : this.fileList;
    if(this.data._id){
      this.salesOrderService
      .updateSalesOrder(this.data._id, data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
          this.notifyService.showSuccess("Update sales order successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
    else{
      data.creator = this.creator;
      this.salesOrderService
      .addSalesOrder(data)
      .subscribe(
        (data) => {
          this.dialogRef.close({ data: data });
          this.notifyService.showSuccess("Add sales order successfully", "Success")
        },
        (error) => {
          this.notifyService.showError(error, "Error")
        }
      );
    }
  }
}
