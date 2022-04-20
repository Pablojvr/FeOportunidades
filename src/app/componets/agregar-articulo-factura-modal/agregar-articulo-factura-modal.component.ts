import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import { FacturasService } from 'src/app/services/facturas.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-agregar-articulo-factura-modal',
  templateUrl: './agregar-articulo-factura-modal.component.html',
  styleUrls: ['./agregar-articulo-factura-modal.component.css'],
})
export class AgregarArticuloFacturaModalComponent implements OnInit {
  listadoLotes: Array<any> = [];
  errorMsg = '';
  filteredItems: Array<any> = [];
  isLoading = false;
  itemCode = new BehaviorSubject<string>('');
  @Output() addElements = new EventEmitter<any>();
  displayedColumns = ['lote', 'vencimiento', 'precio', 'seleccionado','stock'];
  constructor(
    private facturasService: FacturasService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.suscribeInputs();
  }

  displayFn(item: any) {

    return item ? `${item.itemCode} - ${item.itemName}`  : '';
  }
  onConfirm() {
    this.addElements.emit(this.listadoLotes);
    this.data.then();
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
    if (this.data.item && this.data.item.itemCode && !isNaN(this.data.quantity)) {
      this.facturasService
        .obtenerStockPorItemCode(this.data.item.itemCode, 0)
        .subscribe((data) => {

          this.listadoLotes = [];
          this.errorMsg = "";
          if (data == undefined || data.length == 0) {
            this.errorMsg =
              'Este codigo no pertenece a ningun articulo en inventario';
            return;
          }
          if (data[0].Stock < this.data.quantity) {
            this.errorMsg = 'No hay suficiente existencia de este articulo';
            return;
          }
          let stockUltimoLote = this.obtenerStockUltimoLotePorItemCode(
            this.data.item.itemCode,
            number,
            this.data.quantity
          );
        });
    }
  }

  obtenerStockUltimoLotePorItemCode(
    itemCode: string,
    skip: number,
    quantity: any
  ): any {
    return this.facturasService
      .obtenerStockUltimoLotePorItemCode(itemCode, skip)
      .pipe(catchError(() => of([])))
      .subscribe((data: any) => {
        this.listadoLotes = [];
        let stockPendiente = quantity;
        let i = 0;
        let newItem;
        do {
          let lote = Object.assign({}, data[i]);
          newItem = {
            itemCode: lote.ItemCode,
            itemDescription: lote.ItemName,
            batchNum: lote.BatchNum,
            expDate: lote.ExpDate,
            price: lote.PrecioVenta,
            stock:lote.Quantity,
            discountPercent:this.data.descuento,
            vatCode:'IVACOM',
            quantity: 0,
          };
          if (lote.Quantity - stockPendiente > 0) {
            newItem.quantity = stockPendiente;
          } else {
            newItem.quantity = lote.Quantity;
          }

          this.listadoLotes.push(newItem);
          stockPendiente = stockPendiente - newItem.quantity;
          i++;
        } while (stockPendiente > 0);
      });
  }
}
