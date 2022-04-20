import { RolesService } from 'src/app/services/roles.service';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Rol } from '../usuarios/usuarios-datasource';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
export interface Page {
  totalItems: number;
  page: number;
  items: Array<Rol>;
}
export class RolesDataSource extends DataSource<Rol> {
  private rolSubject = new BehaviorSubject<Rol[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public rolesLength = 0;
  public loading$ = this.loadingSubject.asObservable();
  constructor(private rolesService: RolesService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Rol[]> {
    return this.rolSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.rolSubject.complete();
    this.loadingSubject.complete();
  }

  getRols(filter: string, sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
    this.loadingSubject.next(true);

    this.rolesService
      .getPaginatedRoles(filter, sortDirection, pageIndex, pageSize)
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
      .subscribe((page: Page[]) => {
        console.log(page);
        this.rolesLength = page[0].totalItems;
        this.rolSubject.next(page[0].items);
      });
  }
}
