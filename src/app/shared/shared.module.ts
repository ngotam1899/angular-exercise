import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { LeadSrcPipe } from './pipe/lead-src.pipe';
import { StatusPipe } from './pipe/status.pipe';
import { EmptyComponent } from '../error/empty/empty.component';
@NgModule({
  declarations: [
    LeadSrcPipe,
    StatusPipe,
    EmptyComponent
  ],
  exports: [
    EmptyComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
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

    LeadSrcPipe,
    StatusPipe,
  ],
})
export class SharedModule {}
