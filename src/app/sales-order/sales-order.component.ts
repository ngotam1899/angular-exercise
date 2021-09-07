import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SalesOrder } from '../shared/interface/sales-order.interface';
import { ContactService } from '../shared/services/contact.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {
  private displayedColumns: string[] = ['index', 'name', 'username', 'email', 'is_active', 'is_admin', 'action'];
  private dataSource : SalesOrder[];

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

}
