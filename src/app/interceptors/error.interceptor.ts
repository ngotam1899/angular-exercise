import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

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
    private router: Router,
  ) { }

  convertError(err: ResponseErrorData) {
    if (err.status === 403) {
      this.router.navigate(['/management/403']);
      //this.router.navigate(['/login']);
    } else if (err.status === 500) {
      this.router.navigate(['/management/403']);
      //this.router.navigate(['/login']);
    } else {
      console.error(err)
    }
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(
        err =>
          new Observable<HttpEvent<unknown>>(observer => {
            this.convertError(err);
            observer.error(err);
            observer.complete();
          })
      )
    );
  }
}
