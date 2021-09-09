import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../interface/user.interface';

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private REST_API_SERVER = 'http://localhost:4040/user_management';

  constructor(private httpClient: HttpClient) {}

  public getUserList(queryParams?: IParams) {
    let params = new HttpParams();
    if(queryParams){
      if (queryParams.page && queryParams.limit) {
        params = params.set('page', queryParams.page.toString())
        .set('limit', queryParams.limit.toString());
      }
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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
