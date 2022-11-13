import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { AgregarArticuloFacturaModalComponent } from './../../componets/agregar-articulo-factura-modal/agregar-articulo-factura-modal.component';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css'],
})
export class FacturasComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('input') input!: ElementRef;

  monthNames: any = [];
  addresses: any = [];
  numFactura: number = 0;
  numOrdenCompra: number = 0;
  laboratory: string = '327573';
  fecha: string = '';
  displayedColumns = [
    'index',
    'codigo',
    'descripcion',
    'lote',
    'vencimiento',
    'UnidadesGravadas',
    'priceDesc',
    'price',
    'Retener',
    'totalGravado',
    'descuento',
    'total',
  ];
  filteredLabs: any;
  isLoading = false;
  errorMsg!: string;
  solicitud: any = { documentLines: [] };
  saving: any = false;
  saved: any = false;
  expandedElement: any | null;
  isLoadingPO: boolean = false;
  filteredPO!: any[];
  creditoDisponible: any;
  limiteCredito: any;
  user: any;
  readOnly: boolean = false;
  totalFactura: any = 0;
  totalFacturasVencidas: any;
  isLoadingFacturasMora: boolean = false;
  overrideAdministrador: boolean = false;
  subtotalFactura: any = 0;
  iva: any = 0;
  dialogCargando: typeof Swal = Swal;
  tipoContribuyente: any;
  retener: any;
  percepcion: any = 0;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private facturasService: FacturasService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.comprasForm = this._fb.group({
      proveedor: [null, Validators.required],
      serie: [null, Validators.required],
      fecha: [new Date(), Validators.required],
      ShipToCode: [null, Validators.required],
    });

    // this.dataSource.getReporte(this.numFactura, this.numOrdenCompra, this.laboratory);

    this.suscribeInputs();
  }
  suscribeInputs() {
    this.comprasForm.controls.proveedor.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.filteredLabs = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.facturasService.getClientes(value ?? '').pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        if (data.data?.value == undefined) {
          this.errorMsg = data['Error'];
          this.filteredLabs = [];
        } else {
          this.errorMsg = '';
          this.filteredLabs = data.data.value;
        }
        console.log(data);
        console.log(this.filteredLabs);
      });
  }
  displayFn(data: any): string {
    console.log(data);
    return data ? `${data.cardForeignName} (${data.cardCode})` : '';
  }

  displayPurchaseOrder(data: any): string {
    console.log(data);
    // if (data.docNum && !this.solicitud) {
    //   this.getPurchaseOrderById(data.docNum);
    // }
    return data ? data.docNum : '';
  }

  updateSerie() {
    let value = this.form.proveedor.value;
    debugger;
    this.addresses = value.bpAddresses;
    this.form.ShipToCode.setValue(this.addresses[0].addressName);
    this.checkFacturasVencidas(value.cardCode);
    this.form.serie.setValue(value.u_EJJE_TipoDoc);
    this.creditoDisponible = value.currentAccountBalance;
    this.limiteCredito = value.creditLimit;
    this.retener = value.subjectToWithholdingTax;
    this.tipoContribuyente = value.u_EJJE_TipoContribuyente;
  }

  updateTaxCode() {
    console.log('updatingTaxCode');
    this.solicitud.documentLines = this.solicitud.documentLines.map(
      (element: any) => {
        return Object.assign(element, {
          taxCode: this.getTaxCode(this.form.serie.value),
        });
      }
    );
  }
  updateRetencion(menorDe100: boolean) {
    // console.log("updatingRetencion"+ [menorDe100,this.retener,this.tipoContribuyente])
    var retener = '';
    var codigoImpuesto = this.getTaxCode(this.form.serie.value);
    if (
      (this.tipoContribuyente == '03' || this.tipoContribuyente == '02') &&
      !menorDe100
    ) {
      var retener = 'tNO';
      if (this.form.serie.value == 'CCF') {
        codigoImpuesto = 'IVAPER';
        this.percepcion = (this.subtotalFactura * 0.01).toFixed(4);
      } else {
        this.percepcion = 0;
      }
    } else {
      var retener = 'tNO';
      this.percepcion = 0;
    }
    console.log(
      'updatingRetencion' +
        [menorDe100, this.retener, this.tipoContribuyente, retener]
    );
    this.solicitud.documentLines = this.solicitud.documentLines.map(
      (element: any) => {
        return Object.assign(element, {
          wTLiable: retener,
          taxCode: codigoImpuesto,
        });
      }
    );
  }
  updateLineNum() {
    console.log('updatingLineNum');
    this.solicitud.documentLines = this.solicitud.documentLines.map(
      (element: any, index: any) => {
        return Object.assign(element, { line: index });
      }
    );
  }
  public checkData() {
    debugger;
    this.checkFacturasVencidas(this.solicitud.cardCode);
    this.facturasService.GetBusinessPartner(this.solicitud.cardCode).subscribe({
      next: (data) => {
        this.form.proveedor.setValue(data.data);
        this.creditoDisponible = data.data.currentAccountBalance;
        this.limiteCredito = data.data.creditLimit;
        this.dialogCargando.close();
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
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') ?? '{}');
    var id = this.route.snapshot.paramMap.get('idFacturas');
    if (id) {
      this.getFactura(id);
    }
  }
  getFactura(idFacturas: any) {
    // this.dialogCargando =  Swal;
    this.dialogCargando.fire({
      title: '',
      text: 'Cargando...',
      icon: 'info',
      heightAuto: false,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
    this.facturasService.getFacturaByID(idFacturas).subscribe({
      next: (data) => {
        this.solicitud = data;
        this.solicitud.estadoFacturaFK = 1;
        this.form.proveedor.setValue({
          cardCode: this.solicitud.cardCode,
          cardForeignName: this.solicitud.cardName,
        });
        this.form.proveedor.disable;
        this.form.serie.setValue(this.solicitud.serie);

        this.form.ShipToCode.setValue(this.solicitud.shipToCode);
        this.addresses.push({ addressName: this.solicitud.shipToCode });

        this.updateTotal();
        this.readOnly = true;
        this.checkData();
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
  get form() {
    return this.comprasForm.controls;
  }

  getProveedores() {
    this.isLoading = true;
    this.facturasService.getClientes('').subscribe((data) => {
      if (data.data?.value == undefined) {
        this.errorMsg = data['Error'];
        this.filteredLabs = [];
      } else {
        this.errorMsg = '';
        this.filteredLabs = data.data.value;
      }
      this.isLoading = false;
      console.log(data);
      console.log(this.filteredLabs);
    });
  }

  guardarSolicitud() {
    Swal.fire({
      title: '',
      text: 'Guardando...',
      icon: 'info',
      heightAuto: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    debugger;
    if (!this.checkValidCredit(this.form.proveedor.value, this.totalFactura)) {
      Swal.fire({
        title: 'Atención',
        html: 'El monto de esta factura excede el limite maximo de credito del socio de negocio, si continua se guardara como un borrador y tendra que solicitar autorizacion para emitirla.',
        icon: 'error',
        heightAuto: false,
        showCancelButton: true,
        showConfirmButton: true,
      }).then((value) => {
        if (value.isConfirmed) {
          if (this.totalFacturasVencidas > 0) {
            Swal.fire({
              title: 'Atención',
              html: 'Este cliente presenta facturas en mora,si continua se guardara como un borrador y tendra que solicitar autorizacion para emitirla.',
              icon: 'error',
              heightAuto: false,
              showCancelButton: true,
              showConfirmButton: true,
            }).then((value2) => {
              if (value2.isConfirmed) {
                this.facturar(false);
              }
            });
          } else {
            this.facturar(false);
          }
        }
      });
    } else if (this.totalFacturasVencidas > 0) {
      Swal.fire({
        title: 'Atención',
        html: 'Este cliente presenta facturas en mora,si continua se guardara como un borrador y tendra que solicitar autorizacion para emitirla.',
        icon: 'error',
        heightAuto: false,
        showCancelButton: true,
        showConfirmButton: true,
      }).then((value2) => {
        if (value2.isConfirmed) {
          this.facturar(false);
        }
      });
    } else {
      this.facturar(true);
    }
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
  facturar(valid: boolean, readOnly: boolean = false) {
    this.updateTaxCode();
    this.updateTotal();
    this.updateLineNum();
    var sol = Object.assign({}, this.solicitud);
    if (sol.idFactura == null) {
      debugger;
      sol.fecha = this.form.fecha.value;
      sol.cardCode = this.form.proveedor.value.cardCode;
      sol.cardName = this.form.proveedor.value.cardForeignName;
      sol.razonSocial = this.form.proveedor.value.cardName;
      sol.shipToCode = this.form.ShipToCode.value;
      sol.nrc = this.form.proveedor.value.additionalID;
      sol.nit = this.form.proveedor.value.u_EJJE_NitSocioNegocio;
      sol.tipoDocumento = this.form.serie.value;
      sol.giro = this.form.proveedor.value.notes;
      sol.estadoFacturaFK = valid ? 2 : 1;
      // AdditionalID,Notes,U_EJJE_NitSocioNegocio,U_EJJE_TipoDocumento
      sol.serie = this.form.serie.value;
    }

    this.facturasService.guardarFactura(sol).subscribe({
      next: (value: any) => {
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
            let route;
            if (valid) {
              route = ['/facturas', value.idFactura];
            } else {
              route = ['/facturas'];
            }
            this._router.navigate(route);
          },
          (dismiss: any) => {
            let route;
            if (valid) {
              route = ['/facturas', value.idFactura];
            } else {
              route = ['/facturas'];
            }
            this._router.navigate(route);
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

    console.log(this.solicitud);
  }

  checkValidCredit(proveedor: any, total: any) {
    console.log(
      eval(proveedor.creditLimit),
      eval(proveedor.currentAccountBalance) + eval(total)
    );
    return (
      eval(proveedor.creditLimit) >=
      eval(proveedor.currentAccountBalance) + eval(total)
    );
  }
  manualOverrideAdministrador() {
    Swal.fire({
      title: 'Generar Archivo PDF',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Descargar',
      cancelButtonText: 'Cancelar',
      html:
        '<label> Usuario:</label><br>' +
        '<input id="swal-input1" class="swal2-input" type="text" max="6" min="1" value="2"><br>' +
        '<label> Contraseña:</label><br>' +
        '<input id="swal-input2" class="swal2-input" type="password" max="6" min="1" value="2"><br>',
      focusConfirm: false,
      preConfirm: () => {
        let el1: any = document.getElementById('swal-input1');
        let el2: any = document.getElementById('swal-input2');
        return [el1.value, el2.value];
      },
    }).then(
      (result: any) => {
        console.log(result);
        if (!result.isConfirmed) return;
        this.authService.checkUser(result.value[0], result.value[1]).subscribe({
          next: (data) => {
            this.overrideAdministrador = true;
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
      },
      () => {}
    );
  }
  updateItemCalculatedValues(item: any) {
    if (item.quantity != '' && item.quantity != null) {
      item.quantity <= 0 ? (item.quantity = 1) : item.quantity;
      item.quantity > item.stock ? (item.quantity = item.stock) : item.quantity;
    }
    this.updateTotal();
  }

  updateItemCalculatedValuesDiscount(item: any) {
    if (item.quantity != '' && item.quantity != null) {
      item.quantity <= 0 ? (item.quantity = 1) : item.quantity;
      item.quantity > item.stock ? (item.quantity = item.stock) : item.quantity;
    }
    item.discountPercent = ((1 - (item.priceDiscount/item.price))*100).toFixed(2)+"";
    this.updateTotal();
  }

  updateTotal() {
    this.subtotalFactura = this.solicitud.documentLines
      .reduce((a: any, b: any) => {
        console.log(
          a + b.price * b.quantity * (1 - parseInt(b.discountPercent) / 100)
        );
        return (
          a + b.price * b.quantity * (1 - parseInt(b.discountPercent) / 100)
        );
      }, 0.0)
      .toFixed(4);
    this.iva = (this.subtotalFactura * 0.13).toFixed(4);
    this.updateRetencion(Number(this.subtotalFactura) < 100);
    this.totalFactura = Number(this.subtotalFactura) + Number(this.iva) + Number(this.percepcion);
  }
  duplicateItem(item: any) {
    var index = this.solicitud.documentLines.indexOf(item);

    var { itemCode, itemDescription, baseLine, baseEntry, baseType, taxCode } =
      item;
    var newObj = Object.assign(
      {},
      { itemCode, itemDescription, baseLine, baseEntry, baseType, taxCode }
    );
    console.log(newObj);
    this.solicitud.documentLines.splice(index + 1, 0, newObj);
    this.updateTotal();
    this.table.renderRows();
  }

  removeItem(item: any) {
    this.solicitud.documentLines = this.solicitud.documentLines.filter(
      (el: any) => {
        return el.itemCode != item.itemCode;
      }
    );
    this.updateTotal();
    this.table.renderRows();
  }

  addArticulo() {
    let dialogRef = this.dialog.open(AgregarArticuloFacturaModalComponent, {
      data: {
        articulo: {},
        taxCode: this.getTaxCode(this.form.proveedor.value.u_EJJE_TipoDoc),
        descuento: this.form.proveedor.value.u_EJJE_Descuento,
        overrideAdministrador: this.overrideAdministrador,
        then: () => {
          dialogRef.close();
        },
      },
      width: '600px',
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // debugger;
      if (result) {
        var filteredResults = result.items.filter(
          (item: any) => !!item.quantity
        );

        var tempDocumentList = [
          ...this.solicitud.documentLines.filter((item: any) => {
            // debugger;
            return item.itemCode != result.itemCode;
          }),
          ...filteredResults,
        ];
        if(tempDocumentList.length > 21){
          Swal.fire({
            title: 'Atención',
            html: 'No se puede incluir este articulo porque excede las 21 lineas',
            icon: 'error',
            heightAuto: false,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }else{
          this.solicitud.documentLines = tempDocumentList;
        }
        this.updateTotal();

        this.addArticulo();
      }
    });
  }

  getTaxCode(TipoDocumento: any) {
    let series: any = {
      CCF: 'IVACRF',
      COF: 'IVACOF',
      TIC: 'IVACOF',
      EXP: 'IVAEXP',
    };
    return series[TipoDocumento] ?? '';
  }
}
