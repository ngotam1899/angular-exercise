import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, IParamsUser } from '../interface/user.interface';
import { urlConstant } from '../constants/url.constant'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private REST_API_SERVER = urlConstant.API.USER;

  constructor(private httpClient: HttpClient) {}

  public getUserList(queryParams?: IParamsUser) {
    let params = new HttpParams();
    if(queryParams){
      if (queryParams.page && queryParams.limit) {
        params = params.set('page', queryParams.page.toString())
        .set('limit', queryParams.limit.toString());
      }
      if (queryParams.isAdmin) params = params.set('isAdmin', queryParams.isAdmin);
      if (queryParams.isActive) params = params.set('isActive', queryParams.isActive);
      if (queryParams.keyword) params = params.set('keyword', queryParams.keyword);
    }
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .get<any>(url, { params })
      .pipe(catchError(this.handleError));
  }

  public getUserDetail(userId: string) {
    const url = `${this.REST_API_SERVER}/` + userId;
    return this.httpClient
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }

  public uploadAvatar(file: any) {
    const url = `${this.REST_API_SERVER}/avatar`;
    return this.httpClient
      .post<any>(url, {image: file})
      .pipe(catchError(this.handleError));
  }


  public addUser(data: User) {
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .post<any>(url, data)
      .pipe(catchError(this.handleError));
  }

  public updateUser(userId: string, data: User) {
    const url = `${this.REST_API_SERVER}/` + userId;
    return this.httpClient
      .put<any>(url, data)
      .pipe(catchError(this.handleError));
  }

  public changePassword(userId: string, data: any) {
    const url = `${this.REST_API_SERVER}/` + userId;
    return this.httpClient
      .post<any>(url, data)
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = error.error.message;
    }
    console.log('Error', errorMessage);
    return throwError(errorMessage);
  }
}
