import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preview-facturas',
  templateUrl: './preview-facturas.component.html',
  styleUrls: ['./preview-facturas.component.css']
})
export class PreviewFacturasComponent implements OnInit {

  solicitud!: any;
  readOnly: boolean = false;
  ordenes: Array<any> = [];
  displayedColumns: any = [
    'codigo',
    'descripcion',
    'lote',
    'vencimiento',
    'UnidadesGravadas',
    'price',
    'totalGravado',
    'descuento',
    'total'

  ];
  saving: boolean = false;
  saved: boolean = false;
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private facturasService: FacturasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    var idOrden = this.route.snapshot.paramMap.get('idOrdenCompra');
    if (idOrden) {
      this.readOnly = true;
      // this.facturasService.getOrdenesCompraByID(idOrden).subscribe((data) => {
      //   if (data == undefined) {
      //   } else {
      //     let tempOrdenes = data.data.value.map((item: any) => {
      //       let newItem = this.capitalizeName(item);
      //       newItem.DocumentLines = newItem.DocumentLines.map((item2: any) => {
      //         return this.capitalizeName(item2);
      //       });
      //       return newItem;
      //     });
      //     console.log(tempOrdenes);
      //     this.ordenes = tempOrdenes;
      //   }
      //   console.log(data);
      //   console.log(this.solicitud);
      // });
    }
    var idSolicitud = this.route.snapshot.paramMap.get('idFactura');
    if (idSolicitud) {
      this.facturasService.getFacturaByID(idSolicitud).subscribe({
        next: (data) => {
          this.solicitud = data;
          this.ordenes = this.genInvoicesByChunkSize(this.solicitud);

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

  genInvoicesByChunkSize(xs: any,chunkSize = 10) {
  let lines = xs.documentLines;
  let invoices = [];
  for (let i = 0; i < lines.length; i += chunkSize) {
      let chunk = lines.slice(i, i + chunkSize);
      let newInvoice = Object.assign({docDate:xs.fecha},xs);
      newInvoice.documentLines = chunk;
      invoices.push(newInvoice);
      // do whatever
  }
    return invoices;
  }

  generarFacturas() {
    Swal.fire({
      title: '',
      text: 'Guardando...',
      icon: 'info',
      heightAuto: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    this.ordenes.forEach((orden:any)=>{

      orden.documentLines = orden.documentLines.map((line:any)=>{

        line.batchNumbers = [{quantity:line.quantity,batchNumber:line.batchNum}];
        return line;
      })

    });
    this.facturasService
      .saveInvoices({
        orders: this.ordenes,
        idFactura: this.solicitud.idFactura,
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
