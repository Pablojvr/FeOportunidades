import { UserService } from './../../services/user.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, merge, BehaviorSubject, of } from 'rxjs';
import Swal from 'sweetalert2';

export interface Page {
  totalItems: number;
  page: number;
  items: Array<Usuario>;
}
export interface Usuario {
  login: string;
  nombre: number;
  password: string;
  passwordConfirm: string;
  idUsuario: number;
  rol: Rol;
  rolFK: number;
}
export interface Rol {
  idRol: number;
  descripcion: string;
  compras: boolean;
  facturacion: boolean;
  devoluciones: boolean;
}
/**
 * Data source for the Usuarios view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class UsuariosDataSource extends DataSource<Usuario> {
  private usuarioSubject = new BehaviorSubject<Usuario[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public usuariosLength = 0;
  public loading$ = this.loadingSubject.asObservable();
  constructor(private userService: UserService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Usuario[]> {
    return this.usuarioSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usuarioSubject.complete();
    this.loadingSubject.complete();
  }

  getUsuarios(
    filter: string,
    sortDirection = 'asc',
    pageIndex = 0,
    pageSize = 3
  ) {
    this.loadingSubject.next(true);

    this.userService
      .getUsers(filter, sortDirection, pageIndex, pageSize)
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
      .subscribe((page: Page[]) => {
        console.log(page);
        this.usuariosLength = page[0].totalItems;
        this.usuarioSubject.next(page[0].items);
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
