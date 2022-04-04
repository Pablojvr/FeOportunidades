import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  @Output() addElements = new EventEmitter<any>();
  displayedColumns = [ 'lote','vencimiento','precio','seleccionado'];
  constructor(
    private facturasService: FacturasService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirm() {
    this.addElements.emit(this.listadoLotes);
    this.data.then();
  }

  agregarArticulo(number: number = 0) {
    if (this.data.itemCode && !isNaN(this.data.quantity)) {
      let stockUltimoLote = this.obtenerStockUltimoLotePorItemCode(
        this.data.itemCode,
        number,
        this.data.quantity
      );
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
