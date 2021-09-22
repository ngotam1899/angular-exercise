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
      req = req.clone({ headers: myHeaders });
/*       if (req.body && req.body.image && req.body.image instanceof FormData)
      {
        req = req.clone({ headers: req.headers.delete('Content-Type','application/json') })
        req = req.clone({ headers: req.headers.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryRvvDMUPl5fHcBQos')})
        req.headers.get('Accept')
      } */
      return next.handle(req);
    }
    return next.handle(req);
  }
}
