import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ResponseErrorData {
  timestamp: Date;
  status: number;
  error: string;
  message: string;
  path: string;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
  ) { }
  /* convertError(err: ResponseErrorData) {
    this.spinner.hide();
    if (err.status === 401) {
      const lang = localStorage.getItem('language');
      localStorage.clear();
      setTimeout(() => {
        if (lang) {
          localStorage.setItem('language', lang);
        } else {
          localStorage.setItem('language', 'en');
        }
        setTimeout(() => {
          window.location.href = '../';
        }, 100);
      }, 100);
      this.alert.error(MessageConstant[this.langCode].MSG_ERROR_AUTH);
    } else if (err.status === 403) {
      this.alert.error(MessageConstant[this.langCode].MSG_ERR_AUTH);
    } else if (err.status === 500) {
      this.alert.error(MessageConstant[this.langCode].MSG_ERR_SYSTEM);
    } else {
      // err.message undefined thì xem lại api, nếu {responseType: 'text'} thì undefined đúng rùi
      this.alert.error(err.message ? err.message : MessageConstant[this.langCode].MSG_ERR_SYSTEM);
    }
  } */

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(
        err =>
          new Observable<HttpEvent<unknown>>(observer => {
            //this.convertError(err.error);
            observer.error(err);
            observer.complete();
          })
      )
    );
    // return next.handle(req)
  }


}
