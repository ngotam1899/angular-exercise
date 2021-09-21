import { ContactsFormComponent } from './contacts-form/contacts-form.component';
import { ContactsComponent } from './contact-list/contacts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { contactRoutes } from './contact.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ContactsFormComponent,
    ContactsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(contactRoutes),
    SharedModule
  ],
  entryComponents: [
    ContactsFormComponent,
  ]
})
export class ContactModule { }
