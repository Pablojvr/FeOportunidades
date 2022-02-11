import { RolesService } from './../../services/roles.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfirmacionModalComponent } from 'src/app/componets/confirmacion-modal/confirmacion-modal.component';
import { UserService } from 'src/app/services/user.service';
import { Rol } from '../usuarios/usuarios-datasource';
import { RolesDataSource } from './roles-datasource';
import { EditarRolModalComponent } from 'src/app/componets/editar-rol-modal/editar-rol-modal.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Rol>;
  @ViewChild('input') input!: ElementRef;
  dataSource: RolesDataSource;
  filter: string = '';
  sortOrder: string = 'asc';
  pageNumber: number = 1;
  pageSize: number = 10;
  editedRol!: Rol;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'descripcion',
    'compras',
    'facturacion',
    'devoluciones',
    'acciones',
  ];
  showEditModal: boolean = false;

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.dataSource = new RolesDataSource(this.rolesService);
    this.dataSource.getRols('', 'asc', 0, 10);
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
    this.dataSource.getRols(
      '',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  addItem() {
    this.editedRol = Object.assign({});
    let dialogRef = this.dialog.open(EditarRolModalComponent, {
      data: {
        editedRol: this.editedRol,
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
    this.editedRol = Object.assign({}, item);
    let dialogRef = this.dialog.open(EditarRolModalComponent, {
      data: {
        editedRol: this.editedRol,
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
    this.editedRol = Object.assign({}, item);
    let dialogRef = this.dialog.open(ConfirmacionModalComponent, {
      data: {
        title: 'Eliminacion de rol',
        actionText: 'Eliminar',
        actionFunction: () => {
          this.rolesService.deleteRol(this.editedRol).subscribe({
            next: (_) => {
              console.log('Se elimino correctamente');
              this.loadDataPage();
              dialogRef.close();
            },
            error: (_) => console.log('error'),
          });
          console.log('EliminarRol');
        },
        message: '¿Esta seguro que desea eliminar este rol?',
      },
      width: '600px',
      maxWidth: '600px',
    });
    //  dialogRef.afterClosed().subscribe()
  }
}
