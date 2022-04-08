import { FacturasService } from './../../services/facturas.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, merge, BehaviorSubject, of } from 'rxjs';
import Swal from 'sweetalert2';

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
    pageIndex: number = -1,
    pageSize: number = -1
  ) {
    interface Reporte extends Object {}
    this.loadingSubject.next(true);

    this.facturaService
      .getPaginatedFacturas(fechaIni, fechaFin, pageIndex, pageSize)
      .pipe(
        catchError((error) => {
          Swal.fire({
            title: 'Ha ocurrido un problema!',
            text: error.message ?? '',
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
