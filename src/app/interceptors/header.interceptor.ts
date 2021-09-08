import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
});

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      let myHeaders = headers.set('Authorization', 'Bearer ' + token);
      const AuthRequest = req.clone({ headers: myHeaders });
      return next.handle(AuthRequest);
    }
    return next.handle(req);
  }
}
