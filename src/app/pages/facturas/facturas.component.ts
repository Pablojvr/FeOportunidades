import { AgregarArticuloFacturaModalComponent } from './../../componets/agregar-articulo-factura-modal/agregar-articulo-factura-modal.component';
import { FacturasService } from 'src/app/services/facturas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ComprasService } from 'src/app/services/compras.service';
import Swal from 'sweetalert2';
import { ComprasDataSource } from '../compras/compras-datasource';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('input') input!: ElementRef;

  monthNames: any = [];
  numFactura: number = 0;
  numOrdenCompra: number = 0;
  laboratory: string = '327573';
  fecha: string = '';

  displayedColumns = [
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
  filteredLabs: any;
  isLoading = false;
  errorMsg!: string;
  solicitud: any = { documentLines: [] };
  saving: any = false;
  saved: any = false;
  expandedElement: any | null;
  isLoadingPO: boolean = false;
  filteredPO!: any[];

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private facturasService: FacturasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.comprasForm = this._fb.group({
      proveedor: [null, Validators.required],
      serie: [null, Validators.required],
      fecha: [new Date(), Validators.required],
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
    return data ? data.cardName : '';
  }

  displayPurchaseOrder(data: any): string {
    console.log(data);
    // if (data.docNum && !this.solicitud) {
    //   this.getPurchaseOrderById(data.docNum);
    // }
    return data ? data.docNum : '';
  }




  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');

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
    let totalFactura = this.solicitud.documentLines.reduce((a:any, b:any) => {

      return a + b.price*b.quantity
    }, 0);
    if(!this.checkValidCredit(this.form.proveedor.value,totalFactura)){
      Swal.fire({
        title: 'Atencion',
        text: 'Esta factura no puede realizarse dado que el monto de la misma excede el limite maximo de credito del socio de negocio',
        icon: 'error',

        heightAuto: false,
        showCancelButton: false,
        showConfirmButton: true,
      })
      return;
    }
    var sol = Object.assign({}, this.solicitud);
    sol.fecha = this.form.fecha.value;

    sol.cardCode = this.form.proveedor.value.cardCode;
    sol.cardName = this.form.proveedor.value.cardName;
    sol.nrc = this.form.proveedor.value.additionalID;
    sol.nit = this.form.proveedor.value.u_EJJE_NitSocioNegocio;
    sol.tipoDocumento = this.form.proveedor.value.u_EJJE_TipoDocumento;
    sol.giro = this.form.proveedor.value.notes;
    // AdditionalID,Notes,U_EJJE_NitSocioNegocio,U_EJJE_TipoDocumento
    sol.serie = this.form.serie.value;
    this.facturasService.guardarFactura(sol).subscribe({
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
            this._router.navigate(['/entrada_mercancia']);
          },
          (dismiss: any) => {
            this._router.navigate(['/entrada_mercancia']);
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

  checkValidCredit(proveedor:any,total:any){

    return eval(proveedor.creditLimit) >= (eval(proveedor.currentAccountBalance) + total)
  }

  updateItemCalculatedValues(item: any) {

    if (item.quantity != '' && item.quantity != null) {
      item.quantity <= 0 ? (item.quantity = 1) : item.quantity;
      item.quantity > item.stock ? (item.quantity = item.stock) : item.quantity;
    }

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
    this.table.renderRows();
  }

  removeItem(item: any) {
    this.solicitud.documentLines = this.solicitud.documentLines.filter((el:any)=>{ return el.itemCode != item.itemCode});
    this.table.renderRows();
  }

  addArticulo(){

    let dialogRef = this.dialog.open(AgregarArticuloFacturaModalComponent, {
      data: {
        articulo: {},
        descuento: this.form.proveedor.value.u_EJJE_DescuentoCliente,
        then: () => {

          dialogRef.close();
        },
      },
      width: '600px',
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.solicitud.documentLines = [...this.solicitud.documentLines,...result];
    });
  }


}
