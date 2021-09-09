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
import { SalesOrder } from '../interface/sales-order.interface';

interface IParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private REST_API_SERVER = 'http://localhost:4040/sales_order';

  constructor(private httpClient: HttpClient) {}

  public getSalesOrderList(queryParams?: IParams) {
    let params = new HttpParams();
    if(queryParams){
      if (queryParams.page && queryParams.limit) {
        params = params.set('page', queryParams.page.toString())
        .set('limit', queryParams.limit.toString());
      }
      if (queryParams.keyword) params = params.set('keyword', queryParams.keyword);
      if (queryParams.status) params = params.set('status', queryParams.status);
    }
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .get<any>(url, { params })
      .pipe(catchError(this.handleError));
  }

  public getSalesOrderDetail(salesOrderId: string) {
    const url = `${this.REST_API_SERVER}/` + salesOrderId;
    return this.httpClient
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }

  public addSalesOrder(data: SalesOrder) {
    const url = `${this.REST_API_SERVER}`;
    return this.httpClient
      .post<any>(url, data)
      .pipe(catchError(this.handleError));
  }

  public updateSalesOrder(salesOrderId: string, data: SalesOrder) {
    const url = `${this.REST_API_SERVER}/` + salesOrderId;
    return this.httpClient
      .put<any>(url, data)
      .pipe(catchError(this.handleError));
  }

  public deleteSalesOrder(salesOrderId: string) {
    const url = `${this.REST_API_SERVER}/` + salesOrderId;
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
