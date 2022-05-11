import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { AgregarArticuloDevolucionModalComponent } from './../../componets/agregar-articulo-devolucion-modal/agregar-articulo-devolucion-modal.component';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css']
})
export class DevolucionesComponent implements OnInit {

  devolucionesForm!: FormGroup;
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
    'cantDevuelta',
    'cantFacturada',
    'price',
    'numeroFactura',
    'saldo'
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
  readOnly: boolean = false;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private devolucionesService: DevolucionesService,
    private facturasService: FacturasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.devolucionesForm = this._fb.group({
      proveedor: [null, Validators.required],
      fecha: [new Date(), Validators.required],
    });

    // this.dataSource.getReporte(this.numFactura, this.numOrdenCompra, this.laboratory);


    this.suscribeInputs();
  }
  suscribeInputs() {
    this.devolucionesForm.controls.proveedor.valueChanges
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
    return data ? `${data.cardName} (${data.cardCode})` : '';
  }

  displayPurchaseOrder(data: any): string {
    console.log(data);
    // if (data.docNum && !this.solicitud) {
    //   this.getPurchaseOrderById(data.docNum);
    // }
    return data ? data.docNum : '';
  }




  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('idDevolucion');
    if(id){
      this.readOnly = true;
      this.devolucionesService.getDevolucionesByID(id).subscribe((data) => {
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.solicitud = null;
        } else {
          this.errorMsg = '';
          this.solicitud = data;

          this.devolucionesForm.setValue({
            proveedor: {
              cardName: this.solicitud.cardName,
              cardCode: this.solicitud.cardCode,
            },
            fecha: this.solicitud.fecha,
          });

        }
        this
        this.isLoading = false;
        console.log(data);
        console.log(this.solicitud);
      });
    }

  }


  get form() {
    return this.devolucionesForm.controls;
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








  guardarDevolucion() {
    Swal.fire({
      title: '',
      text: 'Guardando...',
      icon: 'info',
      heightAuto: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    var sol = Object.assign({}, this.solicitud);
    sol.fecha = this.form.fecha.value;
    sol.cardCode = this.form.proveedor.value.cardCode;
    sol.cardName = this.form.proveedor.value.cardName;
    sol.estadoDevolucionFK = 2;
    this.devolucionesService.guardarDevolucion(sol).subscribe({
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
            this._router.navigate(['/devoluciones']);
          },
          (dismiss: any) => {
            this._router.navigate(['/devoluciones']);
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
    console.log(item.quantity);
    if (item.quantity != '' && item.quantity != null) {
      item.quantity <= 0 ? (item.quantity = 1) : item.quantity;
      eval(item.quantity) > (item.cantidadFacturada - item.devuelta) ? item.quantity = (item.cantidadFacturada - item.devuelta) : item.quantity;

    }

  }

  keyPressNumbers(event:any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
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

    let dialogRef = this.dialog.open(AgregarArticuloDevolucionModalComponent, {
      data: {

        cardCode: this.form.proveedor.value.cardCode,
        then: () => {
          dialogRef.close();
        },
      },
      width: '700px',
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.solicitud.documentLines = [...this.solicitud.documentLines,...result];
    });
  }

}
