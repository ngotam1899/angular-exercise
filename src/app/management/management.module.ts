import { ForbiddenComponent } from '../error/forbidden/forbidden.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management.routing';
import { ManagementComponent } from './management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from '../error/not-found/not-found.component';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { UserFormComponent } from '../management/users/user-form/user-form.component';

@NgModule({
  declarations: [
    ManagementComponent,
    DashboardComponent,
    ForbiddenComponent,
    NotFoundComponent,
    ChangePasswordComponent,
    ConfirmDeleteComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    SharedModule,
    ChartsModule,
  ],
  providers: [
    ThemeService,
  ],
  entryComponents: [
    ChangePasswordComponent,
    ConfirmDeleteComponent,
    UserFormComponent,
  ],
})
export class ManagementModule { }
