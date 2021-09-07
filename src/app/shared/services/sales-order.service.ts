import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SalesOrder } from '../interface/sales-order.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token',
      // Authorization: 'Basic ' + btoa('username:password'),
    }),
  };
  private REST_API_SERVER = 'http://localhost:4040/sales_order';

  constructor(private httpClient: HttpClient) {}

  public getSalesOrderList() {
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getSalesOrderDetail(salesOrderId: number) {
    const url = `${this.REST_API_SERVER}` + salesOrderId;
    return this.httpClient
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addSalesOrder(data: SalesOrder) {
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .post<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public updateSalesOrder(salesOrderId: string, data: SalesOrder) {
    const url = `${this.REST_API_SERVER}` + salesOrderId;
    return this.httpClient
      .put<any>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public deleteSalesOrder(salesOrderId: string) {
    const url = `${this.REST_API_SERVER}` + salesOrderId;
    return this.httpClient.delete<any>(url).pipe(catchError(this.handleError));
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
    // return an observable with a SalesOrder-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
