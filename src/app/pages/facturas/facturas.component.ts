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
  displayedColumns: any[] = [];
  initialColumns = [
    'codigo',
    'descripcion',
    'lote',
    'vencimiento',
    'UnidadesGravadas',
    'price',
    'totalGravado',
  ];
  middleColumns = ['M1', 'M2'];
  onlyNewColums = [];
  endColumns = [];
  filteredLabs: any;
  isLoading = false;
  errorMsg!: string;
  solicitud: any = { documentLines: [{}] };
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
      numFactura: [2, [Validators.required]],
      proveedor: [null, Validators.required],
      numOrdenCompra: [null, Validators.required],
      laboratory: [null, Validators.required],
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

    var sol = Object.assign({}, this.solicitud);
    sol.fecha = this.form.fecha.value;
    sol.NumeroFactura = this.form.numFactura.value;
    sol.cardCode = this.form.proveedor.value.cardCode;
    sol.NumeroOrden = this.form.numOrdenCompra.value.docNum;
    sol.BaseEntry = this.solicitud.docEntry;
    sol.DocNum = null;
    sol.DocEntry = null;
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

    console.log(this.solicitud);
  }

  updateItemCalculatedValues(item: any) {
    console.log('HA CAMBIADO UN VALOR');

    item.totalUnidades =
      !isNaN(item.unidadesGravadas) && !isNaN(item.unidadesBonificadas)
        ? item.unidadesGravadas + item.unidadesBonificadas
        : 0;
    item.valorGravado =
      !isNaN(item.totalUnidades) && !isNaN(item.price)
        ? (item.totalUnidades * item.price).toFixed(4)
        : 0;
    item.valorBonificado =
      !isNaN(item.unidadesBonificadas) && !isNaN(item.price)
        ? (item.unidadesBonificadas * item.price).toFixed(4)
        : 0;

    item.totalGravado =
      !isNaN(item.valorGravado) && !isNaN(item.valorBonificado)
        ? (item.valorGravado - item.valorBonificado).toFixed(4)
        : 0;
    item.valorDescuento =
      !isNaN(item.totalGravado) && !isNaN(item.descuento)
        ? (item.totalGravado * (item.descuento / 100)).toFixed(4)
        : 0;

    item.costoReal =
      !isNaN(item.unidadesGravadas) &&
      !isNaN(item.valorDescuento) &&
      !isNaN(item.price) &&
      !isNaN(item.unidadesBonificadas)
        ? ((item.totalGravado - item.valorDescuento)/ item.totalUnidades).toFixed(4)
        : 0;

    item.precioVenta =
      !isNaN(item.costoReal) && !isNaN(item.rentabilidad)
        ? (item.costoReal * (item.rentabilidad / 100 + 1)).toFixed(4)
        : 0;
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
    var index = this.solicitud.documentLines.indexOf(item);
    this.solicitud.documentLines.splice(index, 1);
    this.table.renderRows();
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

  actualizarArticulo(item:any, number:number = 0){
    if(item.itemCode && !isNaN(item.quantity)){
      let stockUltimoLote = this.obtenerStockUltimoLotePorItemCode(item.itemCode,number);
      let stockPendiente = 0;
      if(stockUltimoLote.quantity < item.quantity){
          stockPendiente =  item.quantity - stockUltimoLote.quantity;
          item.quantity = stockUltimoLote.quantity;
          item.bashCode = stockUltimoLote.bashCode;
          let newItem = this.solicitud.documentLines.push({ itemCode:item.itemCode,itemDescription:item.itemDescription,quantity:stockPendiente,generated:true});
          this.actualizarArticulo(newItem,number++);
      }else{
        item.bashCode = stockUltimoLote.bashCode;
      }
    }
  }

  obtenerStockUltimoLotePorItemCode(itemCode:string,skip:number) : any{
     return this.facturasService.obtenerStockUltimoLotePorItemCode(itemCode,skip);
  }

}
