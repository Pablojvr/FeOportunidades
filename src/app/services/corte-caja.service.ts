import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CorteCajaService {

  public baseUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  // Método para realizar una solicitud POST
  public pagarFactura(pago: any): Observable<any> {
    const url = `${this.baseUrl}/Facturas/savePago`; // Reemplaza '/savePago' con tu ruta API adecuada
    return this.http.post<any>(url, pago);
  }
}