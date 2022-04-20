import { ComprasService } from '../../services/compras.service';
import { UserService } from '../../services/user.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, merge, BehaviorSubject, of } from 'rxjs';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';

/**
 * Data source for the Usuarios view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EntradaMercanciaDataSource extends DataSource<Object> {
  public solicudesSubject = new BehaviorSubject<Object[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public solicitudesLength = 0;
  public loading$ = this.loadingSubject.asObservable();
  constructor(private comprasService: ComprasService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.solicudesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.solicudesSubject.complete();
    this.loadingSubject.complete();
  }

  getPaginatedEntradaMercancia(
    fechaIni: string = '',
    fechaFin: string = '',
    pageIndex: number = -1,
    pageSize: number = -1
  ) {
    interface Reporte extends Object {}
    this.loadingSubject.next(true);

    this.comprasService
      .getPaginatedEntradaMercancia(fechaIni, fechaFin, pageIndex, pageSize)
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
        this.solicudesSubject.next(page.items);
      });
  }

  removeSolicitud(data: any) {
    const roomArr: any[] = this.solicudesSubject.getValue();

    roomArr.forEach((item, index) => {
      if (item === data) {
        roomArr.splice(index, 1);
      }
    });

    this.solicudesSubject.next(roomArr);
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
