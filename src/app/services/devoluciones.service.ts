import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Page } from '../pages/usuarios/usuarios-datasource';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {
  public baseUrl = environment.apiURL;
  constructor(private http: HttpClient) { }

  getPaginatedDevoluciones(
    fechaIni = '',
    fechaFin = '',
    pageNumber = 0,
    pageSize = 10
  ) {
    return this.http.get<Page[]>(`${this.baseUrl}/Devoluciones`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString()),
    });
  }

  getDevolucionesByID(id: any) {
    return this.http.get<any>(`${this.baseUrl}/Devoluciones/${id}`, {});
  }

  guardarDevolucion(devolucion: any) {

      return this.http.post(`${this.baseUrl}/Devoluciones`, devolucion);

  }

  getItemsFacturadosByItemCodeBatchNumAndCardCode(itemCode:any, batchNum:any,  cardCode:any,vencidos:boolean = true){
    return this.http.get<Page[]>(`${this.baseUrl}/Devoluciones/getItemsFacturadosByItemCodeBatchNumAndCardCode`, {
      params: new HttpParams()
        // .set('courseId', UserId.toString())
        .set('vencidos', vencidos?'1':'-1')
        .set('itemCode', itemCode)
        .set('batchNum', batchNum)
        .set('cardCode', cardCode)

    });
  }
}
