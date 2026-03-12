import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { retry } from 'rxjs/internal/operators/retry';
import { Product } from '../model/product';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  // Backend API URL
  private apiUrl = 'http://localhost:3004';

  constructor(private _http: HttpClient) {}

  // Cấu hình headers dùng chung (theo tài liệu trang 57)
  private getRequestOptions(): Object {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8');
    return { headers: headers, responseType: 'text' };
  }

  private getJsonRequestOptions(): Object {
    const headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');
    return { headers: headers, responseType: 'text' };
  }

  // GET tất cả Products (theo tài liệu Exercise 53, trang 101)
  getProducts(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/products`, this.getRequestOptions()).pipe(
      map(res => JSON.parse(res) as Array<Product>),
      retry(3),
      catchError(this.handleError)
    );
  }

  // GET 1 Product theo ID (theo tài liệu Exercise 54, trang 105)
  getProduct(id: string): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/products/${id}`, this.getRequestOptions()).pipe(
      map(res => JSON.parse(res) as Product),
      retry(3),
      catchError(this.handleError)
    );
  }

  // GET tất cả Categories (Q9: Search by Category)
  getCategories(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/categories`, this.getRequestOptions()).pipe(
      map(res => JSON.parse(res)),
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
