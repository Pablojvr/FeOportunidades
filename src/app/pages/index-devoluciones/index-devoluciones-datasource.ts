import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';

/**
 * Data source for the Usuarios view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ListadoDevolucionesDataSource extends DataSource<Object> {
  public devolucionesSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public solicitudesLength = 0;
  public loading$ = this.loadingSubject.asObservable();
  constructor(private devolucionesService: DevolucionesService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.devolucionesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.devolucionesSubject.complete();
    this.loadingSubject.complete();
  }

  getPaginatedSolicitudDeCompra(
    fechaIni: string = '',
    fechaFin: string = '',
    pageIndex: number = -1,
    pageSize: number = -1
  ) {
    interface Reporte extends Object {}
    this.loadingSubject.next(true);

    this.devolucionesService
      .getPaginatedDevoluciones(fechaIni, fechaFin, pageIndex, pageSize)
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
        this.devolucionesSubject.next(page.items);
      });
  }

  removeSolicitud(data: any) {
    const roomArr: any[] = this.devolucionesSubject.getValue();

    roomArr.forEach((item, index) => {
      if (item === data) {
        roomArr.splice(index, 1);
      }
    });

    this.devolucionesSubject.next(roomArr);
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
