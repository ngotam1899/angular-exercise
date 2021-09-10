import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Contact, IParamsContact } from '../interface/contact.interface';
import { urlConstant } from '../constants/url.constant'

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private REST_API_SERVER = urlConstant.API.CONTACT;

  constructor(private httpClient: HttpClient) {}

  public getContactList(queryParams?: IParamsContact) {
    let params = new HttpParams();
    if(queryParams){
      if (queryParams.page && queryParams.limit) {
        params = params.set('page', queryParams.page.toString())
        .set('limit', queryParams.limit.toString());
      }
      if (queryParams.keyword) params = params.set('keyword', queryParams.keyword);
      if (queryParams.leadSrc) params = params.set('leadSrc', queryParams.leadSrc);
      if (queryParams.assignedTo) params = params.set('assignedTo', queryParams.assignedTo);
    }
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .get<any>(url, { params })
      .pipe(catchError(this.handleError));
  }

  public getContactDetail(contactId: string) {
    const url = `${this.REST_API_SERVER}/` + contactId;
    return this.httpClient
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }

  public getContactLatest(queryParams: any) {
    let params = new HttpParams();
    if(queryParams){
      if (queryParams.pageContact && queryParams.limitContact) {
        params = params.set('page', queryParams.pageContact.toString())
        .set('limit', queryParams.limitContact.toString());
      }
    }
    const url = `${this.REST_API_SERVER}/latest`;
    return this.httpClient
      .get<any>(url, { params })
      .pipe(catchError(this.handleError));
  }

  public addContact(data: Contact) {
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .post<any>(url, data)
      .pipe(catchError(this.handleError));
  }

  public updateContact(contactId: string, data: Contact) {
    const url = `${this.REST_API_SERVER}/` + contactId;
    return this.httpClient
      .put<any>(url, data)
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
