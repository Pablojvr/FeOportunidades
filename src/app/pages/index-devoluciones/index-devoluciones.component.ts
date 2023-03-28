import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { Usuario } from '../usuarios/usuarios-datasource';
import { ListadoDevolucionesDataSource } from './index-devoluciones-datasource';

@Component({
  selector: 'app-index-devoluciones',
  templateUrl: './index-devoluciones.component.html',
  styleUrls: ['./index-devoluciones.component.css'],
})
export class IndexDevolucionesComponent implements OnInit {
  devolucionesForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource: ListadoDevolucionesDataSource;
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
  user: any;

  constructor(
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private devolucionesService: DevolucionesService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.devolucionesForm = this._fb.group({
      fechaIni: [null],
      fechaFin: [null],
    });
    this.dataSource = new ListadoDevolucionesDataSource(this.devolucionesService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') ?? '{}');
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

  anularFacturas(item:any){
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta nota de credito se anulara',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(
      (result) => {
        if (!result.isConfirmed) return;
        Swal.fire({
          title: '',
          text: 'Anulando devolucion #'+item.idDevolucion,
          icon: 'info',
          heightAuto: false,
          showCancelButton: false,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        this.devolucionesService.anularDevolucionByID(item).subscribe({
          next: (_) => {
            this.dataSource.removeSolicitud(item);
            Swal.fire({
              title: '',
              text: 'Se ha anulado correctamente la nota de credito',
              icon: 'success',
              timer: 2000,
              heightAuto: false,
              showCancelButton: false,
              showConfirmButton: false,
            });

            this.onSubmit()
          },
          error: (error) => {
            let errorMsg: string;
            if (error.error instanceof ErrorEvent) {
              errorMsg = `Error: ${error.error.message}`;
            } else {
              errorMsg = getServerErrorMessage(error);
            }

            Swal.fire({
              title: '',
              text: errorMsg,
              icon: 'error',
              heightAuto: false,
            });
          },
        });
      },
      () => {}
    );
  }
  // printSolicitud(item: any) {
  //   Swal.fire({
  //     title: 'Generar Archivo PDF',
  //     icon: 'question',
  //     heightAuto: false,
  //     showCancelButton: true,
  //     showConfirmButton: true,
  //     confirmButtonText: 'Descargar',
  //     cancelButtonText: 'Cancelar',
  //     html:
  //       '<label> Meses historico:</label><br>' +
  //       '<input id="swal-input1" class="swal2-input" type="number" max="6" min="1" value="2"><br>' +
  //       '<label> Meses aprovisionamiento:</label><br>' +
  //       '<input id="swal-input2" class="swal2-input" type="number" max="6" min="1" value="2"><br>',
  //     focusConfirm: false,
  //     preConfirm: () => {
  //       let el1: any = document.getElementById('swal-input1');
  //       let el2: any = document.getElementById('swal-input2');
  //       return [el1.value, el2.value];
  //     },
  //   }).then(
  //     (result: any) => {
  //       console.log(result);
  //       if (!result.isConfirmed) return;
  //       this.devolucionesService
  //         .printSolicitudCompra(
  //           result.value[0],
  //           result.value[1],
  //           item.idSolicitudCompra
  //         )
  //         .subscribe({
  //           next: (data) => {
  //             console.log(data);
  //             var link = document.createElement('a');
  //             document.body.appendChild(link);
  //             link.setAttribute('type', 'hidden');
  //             link.href = 'data:text/plain;base64,' + data;
  //             link.download = `SolicitudCompraNum${item.idSolicitudCompra}.pdf`;
  //             link.click();
  //             document.body.removeChild(link);
  //           },
  //           error: (error) => {
  //             let errorMsg: string;
  //             if (error.error instanceof ErrorEvent) {
  //               errorMsg = `Error: ${error.error.message}`;
  //             } else {
  //               errorMsg = getServerErrorMessage(error);
  //             }

  //             Swal.fire({
  //               title: '',
  //               text: errorMsg,
  //               icon: 'error',
  //               heightAuto: false,
  //             });
  //           },
  //         });
  //     },
  //     () => {}
  //   );
  // }
}
