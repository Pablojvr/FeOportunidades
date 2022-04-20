import { ComprasService } from './../../services/compras.service';
import { UserService } from '../../services/user.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, merge, BehaviorSubject, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';

/**
 * Data source for the Usuarios view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ComprasDataSource extends DataSource<Object> {
  public usuarioSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public usuariosLength = 0;
  public loading$ = this.loadingSubject.asObservable();
  constructor(private comprasService: ComprasService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.usuarioSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usuarioSubject.complete();
    this.loadingSubject.complete();
  }

  getReporte(
    numMonths: number = 2,
    numMonthsCob: number = 2,
    supplier = '10',
    then: any = null
  ) {
    interface Reporte extends Object {}
    this.loadingSubject.next(true);

    this.comprasService
      .getSuggestedPurchaseOrderReport(numMonths, numMonthsCob, supplier)
      .pipe(
        catchError((error) => {
          Swal.fire({
            title: 'Ha ocurrido un problema!',
            text: getServerErrorMessage(error),
            icon: 'error',
            heightAuto: false,
          });
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((page: any) => {
        console.log(page);
        // this.usuariosLength = page[0].totalItems;
        this.usuarioSubject.next(page);
        if (typeof then === 'function') {
          then();
        }
      });
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
