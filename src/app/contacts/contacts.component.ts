import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../shared/interface/contact.interface';
import { ContactService } from '../shared/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  private displayedColumns: string[] = ['index', 'name', 'username', 'email', 'is_active', 'is_admin', 'action'];
  private dataSource : Contact[];

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

  }

}
