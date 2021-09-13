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
import { SalesOrder, IParamsSalesOrder } from '../interface/sales-order.interface';
import { urlConstant } from '../constants/url.constant'

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private REST_API_SERVER = urlConstant.API.SALES_ORDER;

  constructor(private httpClient: HttpClient) {}

  public getSalesOrderList(queryParams?: IParamsSalesOrder) {
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

  public getSalesOrderLatest(queryParams? : any) {
    let params = new HttpParams();
    if(queryParams){
      if (queryParams.pageSalesOrder && queryParams.limitSalesOrder) {
        params = params.set('page', queryParams.pageSalesOrder.toString())
        .set('limit', queryParams.limitSalesOrder.toString());
      }
    }
    const url = `${this.REST_API_SERVER}/latest`;
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
