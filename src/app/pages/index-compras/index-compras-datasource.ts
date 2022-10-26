import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ComprasService } from './../../services/compras.service';

/**
 * Data source for the Usuarios view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ListadoComprasDataSource extends DataSource<Object> {
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

  getPaginatedSolicitudDeCompra(
    fechaIni: string = '',
    fechaFin: string = '',
    estado:number = -1,
    pageIndex: number = -1,
    pageSize: number = -1
  ) {
    interface Reporte extends Object {}
    this.loadingSubject.next(true);

    this.comprasService
      .getPaginatedSolicitudDeCompra(fechaIni, fechaFin,estado, pageIndex, pageSize)
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

export function getServerErrorMessage(error: HttpErrorResponse): string {
  console.log("EL ERROR ES",error);

  switch (error.status) {
    case 400: {
      // console.log("ESTOY VALIDANDO EL ERROR 400:");
      // console.log(error.error);
      return typeof error.error == 'object'?`${error.error.data.error?.message.value}`:`${error.error}`;
    }
    case 404: {
      return `No existe: ${error.message}`;
    }
    case 403: {
      return `Acceso denegado: ${error.message}`;
    }
    case 500: {
      return `Internal Server Error: ${error.message}`;
    }
    case 0: {
      return 'No se puede conectar al servidor';
    }
    default: {
      return `Error desconocido`;
    }
  }
}
