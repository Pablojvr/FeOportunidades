import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { ComprasService } from './../../services/compras.service';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.css'],
})
export class OrdenCompraComponent implements OnInit {
  solicitud!: any;
  readOnly: boolean = false;
  ordenes: Array<any> = [];
  displayedColumns: any = [
    'codigo',
    'descripcion',
    'comprado',
    'punit',
    'ubonif',
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
      this.readOnly = true;
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
          U_EJJE_CorDes:"DES-ORD-SOL-"+this.solicitud.idSolicitudCompra,
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
          BaseLine: `${o['line']}`,
          TaxCode: o['vatCode'],
          U_EJJE_UBonificada: 0,
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

  printSolicitud(item: any) {
    Swal.fire({
      title: 'Generar Archivo PDF',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Descargar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
    }).then(
      (result: any) => {
        console.log(result);
        if (!result.isConfirmed) return;
        var dialog = Swal;
        dialog.fire({
          title: 'Generando PDF',
          html:`<style>.loader {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }</style><div class="flex align-middle justify-center"><div class="loader"></div></div>`,

          heightAuto: false,
          showCancelButton: false,
          showConfirmButton: false,

          focusConfirm: false,
        });
        this.comprasService
          .printOrdenCompra(
            item.DocNum
          )
          .subscribe({

            next: (data) => {
              dialog.close();
              console.log(data);
              var link = document.createElement('a');
              document.body.appendChild(link);
              link.setAttribute('type', 'hidden');
              link.href = 'data:text/plain;base64,' + data;
              link.download = `OrdenCompra${item.DocNum}.pdf`;
              link.click();
              document.body.removeChild(link);
            },
            error: (error) => {
              dialog.close();
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
      },
      () => {}
    );
  }
}
