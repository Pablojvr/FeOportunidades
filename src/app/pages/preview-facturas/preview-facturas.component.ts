import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';

@Component({
  selector: 'app-preview-facturas',
  templateUrl: './preview-facturas.component.html',
  styleUrls: ['./preview-facturas.component.css'],
})
export class PreviewFacturasComponent implements OnInit {
  solicitud!: any;
  readOnly: boolean = false;
  ordenes: Array<any> = [];
  displayedColumns: any = [
    'codigo',
    'descripcion',
    'lote',
    // 'vencimiento',
    'UnidadesGravadas',
    'price',
    'totalGravado',
    'descuento',
    'total',
  ];
  saving: boolean = false;
  saved: boolean = false;
  user: any;
  creditoDisponible: any;
  limiteCredito: any;
  isLoadingFacturasMora: boolean = false;
  totalFacturasVencidas: any;
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private facturasService: FacturasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') ?? '{}');
    var idOrden = this.route.snapshot.paramMap.get('idFacturas');
    if (idOrden) {
      this.readOnly = true;
      this.facturasService.getFacturasByID(idOrden).subscribe((data) => {
        if (data == undefined) {
        } else {
          let tempOrdenes = data.data.value.map((item: any) => {
            // let newItem = this.capitalizeName(item);
            item.documentLines = item.documentLines.map((item2: any) => {
              item2.price = item2.unitPrice;
              return item2;
            });
            return item;
          });
          console.log(tempOrdenes);
          this.ordenes = tempOrdenes;
          this.checkData();
        }
        console.log(data);
        console.log(this.solicitud);
      });
    }
    var idSolicitud = this.route.snapshot.paramMap.get('idFactura');
    if (idSolicitud) {
      this.facturasService.getFacturaByID(idSolicitud).subscribe({
        next: (data) => {
          this.solicitud = data;
          this.ordenes = this.genInvoicesByChunkSize(this.solicitud);
          this.checkData();
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
            errorMsg = getServerErrorMessage(error);
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

  public checkData(){
    debugger;
    this.checkFacturasVencidas(this.ordenes[0].cardCode);
    this.facturasService.GetBusinessPartner(this.ordenes[0].cardCode).subscribe({
      next: (data) => {

        this.creditoDisponible = data.data.currentAccountBalance;
        this.limiteCredito = data.data.creditLimit;


      },
      error: (error) => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = getServerErrorMessage(error);
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

  genInvoicesByChunkSize(xs: any, chunkSize = 10) {
    let lines = xs.documentLines;
    let invoices = [];
    for (let i = 0; i < lines.length; i += chunkSize) {
      let chunk = lines.slice(i, i + chunkSize);
      let newInvoice = Object.assign(
        {
          docDate: xs.fecha,
          additionalID: xs.nrc,
          series: this.getSeries(xs.serie)+"",
          u_EJJE_RazonSocial:xs.cardName,
          u_EJJE_NombreSocioNegocio:xs.cardName,
          u_EJJE_Giro:xs.giro,
          u_EJJE_TipoDocumento: this.getTipoDocumento(xs.serie),
          u_EJJE_NitSocioNegocio: xs.nit,
          U_EJJE_CorDes:"DES-FAC-"+this.solicitud.idFactura
          // u_EJJE_TipoDocumento: xs.serie,
        },
        xs
      );
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
    this.ordenes.forEach((orden: any) => {
      orden.documentLines = orden.documentLines.map((line: any) => {
        line.unitPrice = line.price;
        line.batchNumbers = [
          { quantity: line.quantity, batchNumber: line.batchNum },
        ];
        return line;
      });
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
              this._router.navigate(['/facturas']);
            },
            (dismiss: any) => {
              this._router.navigate(['/facturas']);
            }
          );
        },
        error: (error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = getServerErrorMessage(error);
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


  aprobarFacturas() {
    Swal.fire({
      title: '',
      text: 'Guardando...',
      icon: 'info',
      heightAuto: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    this.facturasService
      .aprobarFacturas(
        this.solicitud.idFactura
      )
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
              this._router.navigate(['/facturas']);
            },
            (dismiss: any) => {
              this._router.navigate(['/facturas']);
            }
          );
        },
        error: (error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = getServerErrorMessage(error);
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
  getSeries(serie:any){
    let series:any = {
      "CCF" : 42,
       "COF" : 43,
      "TIC" :154,
      "EXP" : 44,
    }
    return series[serie]??42;
  }
  getTipoDocumento(serie:any){
    let series:any = {
      "CCF" : "CRF",
       "COF" : "COF",
      "TIC" :"TIC",
      "EXP" : "FAE",
    }
    return series[serie]??"CRF";
  }

  checkFacturasVencidas(cardCode: any) {

    this.isLoadingFacturasMora = true;
    this.facturasService.totalFacturasEnMora(cardCode).subscribe({
      next: (value: any) => {
        // debugger;
        this.totalFacturasVencidas = value.data;
        this.isLoadingFacturasMora = false;
      },
      error: (error) => {
        // debugger;
        this.totalFacturasVencidas = null;
        this.isLoadingFacturasMora = false;
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = getServerErrorMessage(error);
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
  }
}
