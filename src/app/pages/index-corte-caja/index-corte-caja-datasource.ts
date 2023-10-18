import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { FacturasService } from '../../services/facturas.service';

/**
 * Data source for the Usuarios view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class FacturasDataSource extends DataSource<Object> {
  public facturaSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public solicitudesLength = 0;
  public loading$ = this.loadingSubject.asObservable();
  constructor(private facturaService: FacturasService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.facturaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.facturaSubject.complete();
    this.loadingSubject.complete();
  }

  getPaginatedFacturas(
    fechaIni: string = '',
    fechaFin: string = '',
    estado: number = -1,
    search: string = '',
    pageIndex: number = -1,
    pageSize: number = -1,
    active:any = '',
    direction:any=''
  ) {
    interface Reporte extends Object {}
    this.loadingSubject.next(true);

    this.facturaService
      .getPaginatedFacturas(fechaIni, fechaFin,estado,search, pageIndex, pageSize,active,direction)
      .pipe(
        catchError((error) => {
          Swal.fire({
            title: 'Ha ocurrido un problema!',
            text: getServerErrorMessage(error) ?? '',
            icon: 'error',
            heightAuto: false,
          });
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((page: any) => {
        console.log(page);
        this.solicitudesLength = page.totalItems;
        this.facturaSubject.next(page.items);
      });
  }

  removeFacturas(data: any) {
    const roomArr: any[] = this.facturaSubject.getValue();

    roomArr.forEach((item, index) => {
      if (item === data) {
        debugger;
        item.estado = {IdEstadoFactura:3,NombreEstadoFactura:"Anulada"}
      }
    });

    this.facturaSubject.next(roomArr);
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
