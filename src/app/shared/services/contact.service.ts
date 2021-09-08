import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Contact } from '../interface/contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
      // Authorization: 'Basic ' + btoa('username:password'),
    }),
  };
  private REST_API_SERVER = 'http://localhost:4040/contacts';

  constructor(private httpClient: HttpClient) {}

  public getContactList() {
    const url = `${this.REST_API_SERVER}/list`;
    return this.httpClient
      .post<any>(url, null, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getContactDetail(contactId: string) {
    const url = `${this.REST_API_SERVER}/` + contactId;
    return this.httpClient
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addContact(data: Contact) {
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public updateContact(contactId: string, data: Contact) {
    const url = `${this.REST_API_SERVER}/` + contactId;
    return this.httpClient
      .put<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public deleteContact(contactId: string) {
    const url = `${this.REST_API_SERVER}/` + contactId;
    return this.httpClient.delete<any>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      return throwError(
        `Backend returned code ${error.status}, ` + `body was: ${error.error.message}`
      );
    }
    // return an observable with a Contact-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
