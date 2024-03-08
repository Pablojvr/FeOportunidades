import { HttpClient, HttpParams,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Page } from '../pages/usuarios/usuarios-datasource';
import { ResponseData, CodeRequest } from '../interfaces/RutaCobro';
import { map } from 'rxjs/operators'; // Importa el operador map de 'rxjs/operators']
import { Observable } from 'rxjs';
import {
  CorteCaja,
  DetallePago,
  FacturaData,
} from '../interfaces/FacturaData'


@Injectable({
  providedIn: 'root',
})
export class FacturasService {

  public baseUrl = environment.apiURL;
  public reporteURL = "http://172.16.0.4:82/api";
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

  anularNotasCreditoByID(item: any) {

    return this.http.get<any>(
      `${this.baseUrl}/NotasCredito/cancel`,
      {
        params: new HttpParams().set('id', item.idNotaCredito)
      }
    );
  }

  generarNotaCreditoFactura(notaCredito: any,idFactura:any) {

    return this.http.post<any>(
      `${this.baseUrl}/Facturas/notaCredito/?id=${idFactura}`,
      notaCredito
    );
  }

  generarPago(notaCredito: any,idFactura:any) {

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

  getAllCortes(fechaInicio: Date | null, fechaFin: Date | null) {


    let params = new HttpParams();

    // Validar y agregar parámetro solo si la fecha de inicio no es nula
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio.toISOString());
    }

    // Validar y agregar parámetro solo si la fecha final no es nula
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin.toISOString());
    }



    return this.http.get<any>(
      `${this.baseUrl}/Facturas/getAllCortes`,
      { params }
    ).toPromise();

    
  }


  getPaginatedFacturas(
    fechaIni = '',
   fechaFin='',
    estado = -1,
    search = '',
    pageNumber = 0,
    pageSize = 10,
    active = '',
    direction = '',
  ) {
    return this.http.get<Page[]>(`${this.baseUrl}/Facturas`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
        .set('search', search)
        .set('estado', estado.toString())
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('orderBy', active.toString())
        .set('direction', direction.toString()),
    });
  }

  // Este método consulta la API para obtener una Ruta de Cobro por código
  getRutaCobroByCode(code: string): Observable<ResponseData> {
    const requestBody: CodeRequest = { code };
    return this.http.post<ResponseData>(
      `${this.baseUrl}/Facturas/getRutaCobro`,
      requestBody
    );
  }

  getConsolidadoByCode(code: string): Observable<ResponseData> {

    const requestBody: CodeRequest = { code };
    return this.http.post<ResponseData>(
      `${this.baseUrl}/Facturas/getConsolidado`,
      requestBody
    );
  }


  getCorteCajaById(code: string): Observable<ResponseData> {
  
    return this.http.get<ResponseData>(
      `${this.baseUrl}/Facturas/getCorteById?corteCajaId=${code}`
    );
  }

  saveCorteCaja(CorteCaja : CorteCaja) {
  
    return this.http.post(`${this.baseUrl}/Facturas/guardarCorte`, CorteCaja).toPromise();

  }


  deleteCorteCaja(id : any) {
  
    return this.http.delete(`${this.baseUrl}/Facturas/eliminarCorteCaja/${id}`).toPromise();

  }

  aplicarCorteCaja(CorteCaja : number) {
  
    return this.http.get(`${this.baseUrl}/Facturas/aplicarCorte?idCorte=${CorteCaja}`).toPromise();

  }

  GenerarDetalleIngreso(FInicio : any,FFin : any) {
  
    return this.http.get(`${this.reporteURL}/OrdenCompra/?FInicio=${FInicio}&FFin=${FFin}`).toPromise();

  }

  GenerarResumenCorte(fechaCorte : any) {
  
    return this.http.get(`${this.reporteURL}/EntradaMercancia/?fechaCorte=${fechaCorte}`).toPromise();

  }


  GenerarCorteReporteID(IdCorte : any) {
  
    return this.http.get(`${this.reporteURL}/Reportes/${IdCorte}`).toPromise();

  }


  getCuentasBanco() {
  
    return this.http.get(`${this.baseUrl}/Facturas/getCuentaBancos`).toPromise();

  }

  updateCorteCaja(CorteCaja : CorteCaja) {
  
    return this.http.post(`${this.baseUrl}/Facturas/updateCorte`, CorteCaja).toPromise();
 
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

  aprobarFacturas( idFactura: any, estado:any) {
    return this.http.get<any>(
      `${this.baseUrl}/Facturas/aprobarFacturas/?id=${idFactura}&estado=${estado}`,
      {}
    );
  }

  abrirFacturas( idFactura: any) {
    return this.http.get<any>(
      `${this.baseUrl}/Facturas/abrirFacturas/?id=${idFactura}`,
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
