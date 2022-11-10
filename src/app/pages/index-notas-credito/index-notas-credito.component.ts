import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';
import { Usuario } from '../usuarios/usuarios-datasource';
import { ListadoNotasCreditoDataSource } from './index-notas-credito-datasource';

@Component({
  selector: 'app-index-notas-credito',
  templateUrl: './index-notas-credito.component.html',
  styleUrls: ['./index-notas-credito.component.css']
})
export class IndexNotasCreditoComponent implements OnInit {

  devolucionesForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource: ListadoNotasCreditoDataSource;
  displayedColumns: any[] = [
    'codigo',
    'correlativo',
    'fecha',
    'proveedor',
    'estado',
    'acciones',
  ];

  isLoading = false;
  errorMsg!: string;

  constructor(
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private devolucionesService: FacturasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.devolucionesForm = this._fb.group({
      fechaIni: [null],
      fechaFin: [null],
    });
    this.dataSource = new ListadoNotasCreditoDataSource(this.devolucionesService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
  }

  ngOnInit(): void {
    this.dataSource.getPaginatedSolicitudDeCompra('', '', 0, 10);
  }
  get form() {
    return this.devolucionesForm.controls;
  }
  onSubmit() {
    if (!this.devolucionesForm.valid) {
      Swal.fire({
        title: '',
        text: 'Uno o mas campos estan vacios',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }

    console.log(
      this.form.fechaIni.value,
      this.form.fechaFin.value,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    var fechaIni =
      this.datePipe.transform(this.form.fechaIni.value, 'dd-MM-yyyy') ?? '';
    var fechaFin =
      this.datePipe.transform(this.form.fechaFin.value, 'dd-MM-yyyy') ?? '';
    this.dataSource.getPaginatedSolicitudDeCompra(
      fechaIni,
      fechaFin,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  // deleteSolicitud(item: any) {
  //   Swal.fire({
  //     title: '¿Esta seguro?',
  //     text: 'El elemento se eliminara permanentemente',
  //     icon: 'question',
  //     heightAuto: false,
  //     showCancelButton: true,
  //     showConfirmButton: true,
  //     confirmButtonText: 'Eliminar',
  //     cancelButtonText: 'Cancelar',
  //   }).then(
  //     (result) => {
  //       if (!result.isConfirmed) return;
  //       this.devolucionesService.deleteSolicitudDeCompra(item).subscribe({
  //         next: (_) => {
  //           this.dataSource.removeSolicitud(item);
  //           Swal.fire({
  //             title: 'Eliminado',
  //             text: 'Se ha eliminado correctamente...',
  //             icon: 'success',
  //             timer: 2000,
  //             heightAuto: false,
  //             showCancelButton: false,
  //             showConfirmButton: false,
  //           });
  //         },
  //         error: (error) => {
  //           let errorMsg: string;
  //           if (error.error instanceof ErrorEvent) {
  //             errorMsg = `Error: ${error.error.message}`;
  //           } else {
  //             errorMsg = getServerErrorMessage(error);
  //           }

  //           Swal.fire({
  //             title: '',
  //             text: errorMsg,
  //             icon: 'error',
  //             heightAuto: false,
  //           });
  //         },
  //       });
  //     },
  //     () => {}
  //   );
  // }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap(() => {
          this.onSubmit();
        })
      )
      .subscribe();
  }


}
