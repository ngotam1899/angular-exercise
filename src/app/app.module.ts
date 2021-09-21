import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { UserComponent } from './user/user.component';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AuthHeaderInterceptor } from './interceptors/header.interceptor';
import { ContactsFormComponent } from './contacts-form/contacts-form.component';
import { SalesOrderFormComponent } from './sales-order-form/sales-order-form.component';
import { LeadSrcPipe } from './shared/pipe/lead-src.pipe';
import { StatusPipe } from './shared/pipe/status.pipe';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './error/forbidden/forbidden.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { EmptyComponent } from './error/empty/empty.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ContactsComponent,
    SalesOrderComponent,
    UserComponent,
    NotFoundComponent,
    UserFormComponent,
    ContactsFormComponent,
    SalesOrderFormComponent,
    LeadSrcPipe,
    StatusPipe,
    ChangePasswordComponent,
    ConfirmDeleteComponent,
    LoginComponent,
    ForbiddenComponent,
    EmptyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatSortModule,
    MatTabsModule,

    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [
    ThemeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [
    UserFormComponent,
    ContactsFormComponent,
    SalesOrderFormComponent,
    ChangePasswordComponent,
    ConfirmDeleteComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
