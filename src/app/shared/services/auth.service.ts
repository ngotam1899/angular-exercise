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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private REST_API_SERVER = 'http://localhost:4040';

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
        .post<any>(`${this.REST_API_SERVER}/signin`, payload, this.httpOptions)
        .pipe(catchError(this.handleError))
    );
  }

  public getProfile(): Observable<any> {
    return (
      this.httpClient
        .get<any>(`${this.REST_API_SERVER}/userProfile`, this.httpOptions)
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    console.log('Error', errorMessage);
    return throwError(errorMessage);
  }
}
