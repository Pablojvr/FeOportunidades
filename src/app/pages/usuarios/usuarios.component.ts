import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfirmacionModalComponent } from './../../componets/confirmacion-modal/confirmacion-modal.component';
import { EditarUsuarioModalComponent } from './../../componets/editar-usuario-modal/editar-usuario-modal.component';
import { UserService } from './../../services/user.service';
import { Usuario, UsuariosDataSource } from './usuarios-datasource';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  @ViewChild('input') input!: ElementRef;
  dataSource: UsuariosDataSource;
  filter: string = '';
  sortOrder: string = 'asc';
  pageNumber: number = 1;
  pageSize: number = 10;
  editedUsuario!: Usuario;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'login', 'name', 'rol', 'acciones'];
  showEditModal: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.dataSource = new UsuariosDataSource(this.userService);
    this.dataSource.getUsuarios('', 'asc', 0, 10);
  }

  ngAfterViewInit() {
    // server-side search
    // fromEvent(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.loadDataPage();
    //     })
    //   )
    //   .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadDataPage()))
      .subscribe();

    // fromEvent(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     debounceTime(150),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.loadDataPage();
    //     })
    //   )
    //   .subscribe();
  }

  loadDataPage() {
    this.dataSource.getUsuarios(
      '',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  addItem() {
    this.editedUsuario = Object.assign({});
    this.editedUsuario.password = '';
    let dialogRef = this.dialog.open(EditarUsuarioModalComponent, {
      data: {
        editedUsuario: this.editedUsuario,
        then: () => {
          this.loadDataPage();
          dialogRef.close();
        },
      },
      width: '600px',
      maxWidth: '600px',
    });
  }
  editItemDialog(item: any) {
    this.editedUsuario = Object.assign({}, item);
    this.editedUsuario.password = '';
    let dialogRef = this.dialog.open(EditarUsuarioModalComponent, {
      data: {
        editedUsuario: this.editedUsuario,
        then: () => {
          this.loadDataPage();
          dialogRef.close();
        },
      },
      width: '600px',
      maxWidth: '600px',
    });
    //  dialogRef.afterClosed().subscribe()
  }

  deleteItemDialog(item: any) {
    this.editedUsuario = Object.assign({}, item);
    let dialogRef = this.dialog.open(ConfirmacionModalComponent, {
      data: {
        title: 'Eliminacion de usuario',
        actionText: 'Eliminar',
        actionFunction: () => {
          this.userService.deleteUser(this.editedUsuario).subscribe({
            next: (_) => {
              console.log('Se elimino correctamente');
              this.loadDataPage();
              dialogRef.close();
            },
            error: (_) => console.log('error'),
          });
          console.log('EliminarUsuario');
        },
        message: '¿Esta seguro que desea eliminar este usuario?',
      },
      width: '600px',
      maxWidth: '600px',
    });
    //  dialogRef.afterClosed().subscribe()
  }
}
