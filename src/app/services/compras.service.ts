import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  public baseUrl = 'https://localhost:44398/api';
  constructor(private http: HttpClient) {}

  getProveedores(filter = '') {
    return this.http.get<any>(`${this.baseUrl}/Compras/getSuppliers`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter),
    });
  }

  getReporteCompras(
    numMonths: number = 2,
    numMonthsCob: number = 2,
    supplier = '10'
  ) {
    return this.http.get<Object>(`${this.baseUrl}/Compras/getReporteCompras`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('numMonths', numMonths.toString())
        .set('numMonthsCob', numMonthsCob.toString())
        .set('supplier', supplier.toString()),
    });
  }
}
