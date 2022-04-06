import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rol, Page } from '../pages/usuarios/usuarios-datasource';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  public baseUrl = 'https://localhost:44398/api';
  constructor(private http: HttpClient) {}

  getRoles(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
    return this.http.get<Rol[]>(`${this.baseUrl}/Rols`, {});
  }

  getPaginatedFacturas(
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 10
  ) {
    return this.http.get<Page[]>(`${this.baseUrl}/Facturas`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }

  saveRol(user: any) {
    let userId = user.idRol;
    if (!userId) {
      return this.http.post(`${this.baseUrl}/Facturas`, user);
    } else {
      return this.http.put(`${this.baseUrl}/Facturas/${userId}`, user);
    }
  }

  deleteRol(user: any) {
    let userId = user.idRol;
    return this.http.delete(`${this.baseUrl}/Facturas/${userId}`, user);
  }

  getClientes(filter = '') {
    return this.http.get<any>(`${this.baseUrl}/Facturas/GetCustomersList`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter),
    });
  }

  getItems(filter = '') {
    return this.http.get<any>(`${this.baseUrl}/Facturas/GetItemsList`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter),
    });
  }

  guardarFactura(sol: any) {
    let solId = sol.idFactura;
    if (!solId) {
      return this.http.post(`${this.baseUrl}/Facturas`, sol);
    } else {
      return this.http.put(`${this.baseUrl}/Facturas/${solId}`, sol);
    }
  }

  getFacturaByID(idFactura: any) {
    return this.http.get(`${this.baseUrl}/Facturas/${idFactura}`);
  }

  saveInvoices(sol: any) {
    return this.http.post(`${this.baseUrl}/Facturas/newInvoice`, sol);
  }

  obtenerStockUltimoLotePorItemCode(itemCode: string, skip: number) {
    return this.http.get<any>(
      `${this.baseUrl}/Facturas/getBatchByItemCodeOrderByExpDate`,
      {
        params: new HttpParams()
          // .set('courseId', UserId.toString())
          .set('itemCode', itemCode)
          .set('skip', skip.toString()),
      }
    );
  }

  obtenerStockPorItemCode(itemCode: string, skip: number) {
    return this.http.get<any>(
      `${this.baseUrl}/Facturas/getItemStockByItemCode`,
      {
        params: new HttpParams()
          // .set('courseId', UserId.toString())
          .set('itemCode', itemCode)
          .set('skip', skip.toString()),
      }
    );
  }
}
