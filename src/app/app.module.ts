import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';

import { AuthHeaderInterceptor } from './interceptors/header.interceptor';
import { LoginComponent } from './login/login.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { SharedModule } from './shared/shared.module';
import { ManagementModule } from './management/management.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxDropzoneModule,
    SharedModule,
    ManagementModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    NgZorroAntdModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
