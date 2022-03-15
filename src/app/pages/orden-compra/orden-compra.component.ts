import { map } from 'rxjs/operators';
import { ComprasService } from './../../services/compras.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.css'],
})
export class OrdenCompraComponent implements OnInit {
  solicitud!: any;
  ordenes: Array<any> = [];
  displayedColumns: any = [
    'codigo',
    'descripcion',

    'comprado',
    'punit',
    'total',
    'comentario',
  ];
  saving: boolean = false;
  saved: boolean = false;
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private comprasService: ComprasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    var idOrden = this.route.snapshot.paramMap.get('idOrdenCompra');
    if (idOrden) {
      this.comprasService.getOrdenesCompraByID(idOrden).subscribe((data) => {
        if (data == undefined) {
        } else {
          let tempOrdenes = data.data.value.map((item: any) => {
            let newItem = this.capitalizeName(item);
            newItem.DocumentLines = newItem.DocumentLines.map((item2: any) => {
              return this.capitalizeName(item2);
            });
            return newItem;
          });
          console.log(tempOrdenes);
          this.ordenes = tempOrdenes;
        }
        console.log(data);
        console.log(this.solicitud);
      });
    }
    var idSolicitud = this.route.snapshot.paramMap.get('idSolicitudCompra');
    if (idSolicitud) {
      this.comprasService.getSolicitudCompraByID(idSolicitud).subscribe({
        next: (data) => {
          this.solicitud = data;
          this.ordenes = this.groupByProveedor(this.solicitud.articulos);

          Swal.fire({
            title: 'Cargando',
            text: '',
            icon: 'info',
            timer: 2000,
            heightAuto: false,
            showCancelButton: false,
            showConfirmButton: false,
          }).then(
            () => {
              // this._router.navigate(['/compras']);
            },
            (dismiss: any) => {
              // this._router.navigate(['/compras']);
            }
          );
        },
        error: (error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }

          Swal.fire({
            title: '',
            text: errorMsg,
            icon: 'error',
            heightAuto: false,
          });
        },
      });
    }
  }
  private getServerErrorMessage(error: HttpErrorResponse): string {
    console.log(error);
    switch (error.status) {
      case 400: {
        return `${error.error}`;
      }
      case 404: {
        return `Not Found: ${error.error}`;
      }
      case 403: {
        return `Access Denied: ${error.error}`;
      }
      case 500: {
        return `Internal Server Error: ${error.error}`;
      }
      case 0: {
        return `client-side or network error occurred: ${error.error}`;
      }
      default: {
        return `Unknown Server Error`;
      }
    }
  }

  capitalizeName(a: any) {
    for (var key in a) {
      if (a.hasOwnProperty(key)) {
        a[key.charAt(0).toUpperCase() + key.substring(1)] = a[key];
        delete a[key];
      }
    }
    return a;
  }

  groupBy(xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  groupByProveedor(xs: any) {
    var hash = Object.create(null);
    var grouped: any = [];
    var DocEntry = this.solicitud.docEntry;
    xs.forEach((o: any) => {
      var key = ['cardCode', 'cardName']
        .map((k) => {
          return o[k];
        })
        .join('|');
      console.log(key);
      if (!hash[key]) {
        hash[key] = {
          CardCode: o.cardCode,
          CardName: o.cardName,
          DocDate: moment().format(),
          DocumentLines: [],
        };
        grouped.push(hash[key]);
      }
      ['used'].forEach((k) => {
        hash[key]['DocumentLines'].push({
          ItemCode: o['itemCode'],
          ItemName: o['itemName'],
          Quantity: o['amount'],
          UnitPrice: o['price'],
          BaseType: '1470000113',
          BaseEntry: DocEntry,
          BaseLine: o['line'],
          TaxCode: o['vatCode'],
        });
      });
    });

    return grouped;
  }

  generarOrdenesDeCompra() {
    Swal.fire({
      title: '',
      text: 'Guardando...',
      icon: 'info',
      heightAuto: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    this.comprasService
      .saveOrdenesDeCompra({
        orders: this.ordenes,
        idSolicitudCompra: this.solicitud.idSolicitudCompra,
      })
      .subscribe({
        next: (_) => {
          this.saving = false;
          this.saved = true;
          Swal.fire({
            title: 'Guardado',
            text: 'Se ha guardado correctamente...',
            icon: 'success',
            timer: 2000,
            heightAuto: false,
            showCancelButton: false,
            showConfirmButton: false,
          }).then(
            () => {
              this._router.navigate(['/compras']);
            },
            (dismiss: any) => {
              this._router.navigate(['/compras']);
            }
          );
        },
        error: (error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }

          Swal.fire({
            title: '',
            text: errorMsg,
            icon: 'error',
            heightAuto: false,
          });
          this.saving = false;
          this.saved = false;
        },
      });
    console.log(this.ordenes);
  }
}
