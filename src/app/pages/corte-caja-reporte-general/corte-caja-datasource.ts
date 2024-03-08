import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ComprasService } from '../../services/compras.service';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';

/**
 * Data source for the Usuarios view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CorteCajaDataSource extends DataSource<Object> {
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


  generateFakeData(): any[] {
    const fakeData = [];
    
    for (let i = 1; i <= 15; i++) {
      const currentDate = new Date();
      fakeData.push({
        codigo: i,
        Fecha: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`,
        CodCliente: `CodCliente ${i}`,
        NomCliente: `Nombre Cliente ${i}`,
        NumDoc: `NumDoc ${i}`,
        NumRecibo: `NumRecibo ${i}`,
        CondicionPago: `CondicionPago ${i}`,
        Monto: `$${i * 100}`,
        efectivoR: `$${i * 50}`,
        chequesR: `$${i * 25}`,
        transfR: `$${i * 75}`,
        Estado: `Estado ${i}`,
      });
    }
    return fakeData;
  }


  getPaginatedEntradaMercancia(
    fechaIni: string = '',
    fechaFin: string = '',
    pageIndex: number = -1,
    pageSize: number = -1,
    active:any = '',
    direction:any = ''
  ) {
    interface Reporte extends Object {}
    this.loadingSubject.next(true);

    this.comprasService
      .getPaginatedEntradaMercancia(fechaIni, fechaFin, pageIndex, pageSize,active,direction)
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
