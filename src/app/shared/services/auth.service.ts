import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service'
import { Router } from '@angular/router';
import { urlConstant } from '../constants/url.constant'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public commonService : CommonService
  ) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
      // Authorization: 'Basic ' + btoa('username:password'),
    }),
  };

  public setToken(token: string) {
    localStorage.setItem('token', token);
    window.location.reload()
  }

  public removeToken() {
    localStorage.removeItem('token');
    window.location.reload()
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  public logout() {
    this.removeToken();
    this.router.navigate(['/']);
    this.commonService.deleteUserName()
  }

  public authLogin(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return (
      this.httpClient
        .post<any>(urlConstant.API.AUTH.SIGNIN, payload, this.httpOptions)
        .pipe(catchError(this.handleError))
    );
  }

  public getProfile(): Observable<any> {
    return (
      this.httpClient
        .get<any>(urlConstant.API.AUTH.GET_PROFILE, this.httpOptions)
        .pipe(catchError(this.handleError))
    );
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = error.error.message.message;
    }
    console.log('Error', errorMessage);
    return throwError(errorMessage);
  }
}
