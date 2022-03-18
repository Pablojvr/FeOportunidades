import Swal from 'sweetalert2';
import { ComprasService } from './../../services/compras.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Usuario, UsuariosDataSource } from '../usuarios/usuarios-datasource';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ListadoComprasDataSource } from './index-compras-datasource';
import * as moment from 'moment';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-index-compras',
  templateUrl: './index-compras.component.html',
  styleUrls: ['./index-compras.component.css'],
})
export class IndexComprasComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource: ListadoComprasDataSource;
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
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.comprasForm = this._fb.group({
      fechaIni: [null],
      fechaFin: [null],
    });
    this.dataSource = new ListadoComprasDataSource(this.comprasService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
  }

  ngOnInit(): void {
    this.dataSource.getPaginatedSolicitudDeCompra('', '', 0, 10);
  }
  get form() {
    return this.comprasForm.controls;
  }
  onSubmit() {
    if (!this.comprasForm.valid) {
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

  deleteSolicitud(item: any) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'El elemento se eliminara permanentemente',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(
      (result) => {
        if (!result.isConfirmed) return;
        this.comprasService.deleteSolicitudDeCompra(item).subscribe({
          next: (_) => {
            this.dataSource.removeSolicitud(item);
            Swal.fire({
              title: 'Eliminado',
              text: 'Se ha eliminado correctamente...',
              icon: 'success',
              timer: 2000,
              heightAuto: false,
              showCancelButton: false,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            let errorMsg: string;
            if (error.error instanceof ErrorEvent) {
              errorMsg = `Error: ${error.error.message}`;
            } else {
              errorMsg = this.getServerErrorMessage(error);
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

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap(() => {
          this.onSubmit();
        })
      )
      .subscribe();
  }
  private getServerErrorMessage(error: HttpErrorResponse): string {
    console.log(error);
    switch (error.status) {
      case 400: {
        return `${error.error}`;
      }
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error`;
      }
    }
  }
  printSolicitud(item: any) {
    Swal.fire({
      title: 'Generar Archivo PDF',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Descargar',
      cancelButtonText: 'Cancelar',
      html:
      '<label> Meses historico:</label><br>' +
        '<input id="swal-input1" class="swal2-input" type="number" max="6" min="1" value="2"><br>' +
        '<label> Meses aprovisionamiento:</label><br>' +
        '<input id="swal-input2" class="swal2-input" type="number" max="6" min="1" value="2"><br>',
      focusConfirm: false,
      preConfirm: () => {
        let el1: any = document.getElementById('swal-input1');
        let el2: any = document.getElementById('swal-input2');
        return [el1.value, el2.value];
      },
    }).then(
      (result: any) => {
        console.log(result);
        if (!result.isConfirmed) return;
        this.comprasService
          .printSolicitudCompra(
            result.value[0],
            result.value[1],
            item.idSolicitudCompra
          )
          .subscribe({
            next: (data) => {
              console.log(data);
              var link = document.createElement('a');
              document.body.appendChild(link);
              link.setAttribute('type', 'hidden');
              link.href = 'data:text/plain;base64,' + data;
              link.download = `SolicitudCompraNum${item.idSolicitudCompra}.pdf`;
              link.click();
              document.body.removeChild(link);
            },
            error: (error) => {
              let errorMsg: string;
              if (error.error instanceof ErrorEvent) {
                errorMsg = `Error: ${error.error.message}`;
              } else {
                errorMsg = this.getServerErrorMessage(error);
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
}
