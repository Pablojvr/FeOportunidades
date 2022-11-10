import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Page } from '../pages/usuarios/usuarios-datasource';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {

  public baseUrl = environment.apiURL;
  constructor(private http: HttpClient) {}



  getFacturasByID(id: any) {
    return this.http.get<any>(
      `${this.baseUrl}/Facturas/GetInvoicesByFacturaId/?id=${id}`,
      {}
    );
  }

  anularFacturasByID(item: any) {

    return this.http.get<any>(
      `${this.baseUrl}/Facturas/cancelInvoices/?id=${item.idFactura}`,
      {}
    );
  }

  generarNotaCreditoFactura(notaCredito: any,idFactura:any) {

    return this.http.post<any>(
      `${this.baseUrl}/Facturas/notaCredito/?id=${idFactura}`,
      notaCredito
    );
  }

  totalFacturasEnMora(cardCode: any) {

    return this.http.get<any>(
      `${this.baseUrl}/Facturas/totalExpiredInvoices?cardCode=${cardCode}`,
      {}
    );
  }
  getPaginatedFacturas(
    fechaIni = '',
   fechaFin='',
    estado = -1,
    search = '',
    pageNumber = 0,
    pageSize = 10
  ) {
    return this.http.get<Page[]>(`${this.baseUrl}/Facturas`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
        .set('search', search)
        .set('estado', estado.toString())
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }

  getPaginatedNotasCredito(
    fechaIni = '',
    fechaFin = '',
    pageNumber = 0,
    pageSize = 10
  ) {
    return this.http.get<Page[]>(`${this.baseUrl}/NotasCredito`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }

  saveNotaCredito(sol:any){

      return this.http.post(`${this.baseUrl}/Facturas/newCreditNote`, sol);

  }

  getClientes(filter = '') {
    return this.http.get<any>(`${this.baseUrl}/Facturas/GetCustomersList`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter),
    });
  }

  GetBusinessPartner(cardCode = '') {
    return this.http.get<any>(`${this.baseUrl}/Facturas/GetBusinessPartner`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('cardCode', cardCode),
    });
  }

  getItems(filter = '') {
    return this.http.get<any>(`${this.baseUrl}/Facturas/GetItemsList`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter),
    });
  }

  getLotes(itemCode='',filter = '') {
    return this.http.get<any>(`${this.baseUrl}/NotasCredito/GetLotesList`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('filter', filter)
        .set('itemCode', itemCode),
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

  guardarNotaCredito(sol: any) {
    let solId = sol.idNotaCredito;
    if (!solId) {
      return this.http.post(`${this.baseUrl}/NotasCredito`, sol);
    } else {
      return this.http.put(`${this.baseUrl}/NotasCredito/${solId}`, sol);
    }
  }

  getFacturaByID(idFactura: any) {
    return this.http.get(`${this.baseUrl}/Facturas/${idFactura}`);
  }

  getNotaCreditoByID(idFactura: any) {
    return this.http.get(`${this.baseUrl}/NotasCredito/${idFactura}`);
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

  aprobarFacturas( idFactura: any) {
    return this.http.get<any>(
      `${this.baseUrl}/Facturas/aprobarFacturas/?id=${idFactura}`,
      {}
    );
  }
  getEstados() {
    return this.http.get<any>(
      `${this.baseUrl}/Facturas/Estados/ALL`,
      {}
    );
  }
}
