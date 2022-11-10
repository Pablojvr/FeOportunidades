import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import { FacturasService } from 'src/app/services/facturas.service';

@Component({
  selector: 'app-agregar-articulo-nota-credito',
  templateUrl: './agregar-articulo-nota-credito.component.html',
  styleUrls: ['./agregar-articulo-nota-credito.component.css'],
})
export class AgregarArticuloNotaCreditoComponent implements OnInit {
  listadoLotes: Array<any> = [];
  lotesSeleccionados: Array<any> = [];

  errorMsg = '';
  filteredItems: Array<any> = [];
  isLoading = false;
  itemCode = new BehaviorSubject<string>('');
  @Output() addElements = new EventEmitter<any>();
  displayedColumns = [
    'fecha',
    'lote',
    'vencido',
    'precio',
    'facturado',
    'devuelto',
    'factura',
    'acciones',
  ];
  batchNum: any;
  cardCode: any;
  constructor(
    private devolucionesService: DevolucionesService,
    private facturasService: FacturasService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.suscribeInputs();
  }

  displayFn(item: any) {
    return item ? `${item.itemCode} - ${item.itemName}` : '';
  }
  onConfirm() {
    this.addElements.emit(this.listadoLotes);
    this.data.then();
  }

  actualizarLotesSeleccionados(item: any) {
    item.selected = !item.selected;
    this.lotesSeleccionados = this.listadoLotes.filter((item) => item.selected);
  }
  getItems() {
    this.isLoading = true;
    this.facturasService.getItems('').subscribe((data: any) => {
      if (data.data?.value == undefined) {
        this.errorMsg = data['Error'];
        this.filteredItems = [];
      } else {
        this.errorMsg = '';
        this.filteredItems = data.data.value;
      }
      this.isLoading = false;
      console.log(data);
      console.log(this.filteredItems);
    });
  }
  changeItems(value: any) {
    console.log(value);
    this.itemCode.next(value);
  }
  suscribeInputs() {
    this.itemCode
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.filteredItems = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.facturasService.getItems(value ?? '').pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        if (data.data?.value == undefined) {
          this.errorMsg = data['Error'];
          this.filteredItems = [];
        } else {
          this.errorMsg = '';
          this.filteredItems = data.data.value;
        }
        console.log(data);
        console.log(this.filteredItems);
      });
  }
  agregarArticulo(number: number = 0) {
    if (
      this.data.item &&
      this.data.item.itemCode &&
      !isNaN(this.data.batchNum)
    ) {
      this.devolucionesService
        .getItemsFacturadosByItemCodeBatchNumAndCardCode(
          this.data.item.itemCode,
          this.data.batchNum,
          this.data.cardCode,
          false
        )
        .subscribe((data) => {
          this.listadoLotes = [];
          this.errorMsg = '';
          if (data == undefined || data == null || data.length == 0) {
            this.errorMsg =
              'No se han vendido articulos de este lote al cliente seleccionado';
            return;
          } else {
            var mappedData = data.map((item: any) => {
              return {
                selected: false,
                batchNum: item.U_EJJE_Lote,
                batchNumber: item.U_EJJE_Lote,
                quantity: 1,
                price: item.U_EJJE_PrecioUnitario,
                cantidadFacturada: item.U_EJJE_CantidadFacturada,
                devuelta: item.U_EJJE_CantidadDevuelta,
                itemDescription: item.Name,
                discountPercent: '0',
                itemCode: item.U_EJJE_CodigoProducto,
                numFactura: item.U_EJJE_NumeroFactura + '',
                u_EJJE_NumeroFactura: item.U_EJJE_NumeroFactura + '',
                fechaFactura: item.U_EJJE_FechaFactura,
                expDate: item.U_EJJE_FechaV,
                vencido: moment(item.U_EJJE_FechaV).isBefore(moment()),
              };
            });
            this.listadoLotes = mappedData;
          }
        });
    }
  }
}
