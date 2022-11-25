import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ComprasService } from 'src/app/services/compras.service';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { Usuario } from '../usuarios/usuarios-datasource';
import { EntradaMercanciaDataSource } from './index-entrada-mercancia-datasource';

@Component({
  selector: 'app-index-entrada-mercancia',
  templateUrl: './index-entrada-mercancia.component.html',
  styleUrls: ['./index-entrada-mercancia.component.css'],
})
export class IndexEntradaMercanciaComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource: EntradaMercanciaDataSource;
  displayedColumns: any[] = [
    'codigo',
    'correlativo',
    'fecha',
    'proveedor',
    // 'estado',
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
    this.dataSource = new EntradaMercanciaDataSource(this.comprasService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
  }

  ngOnInit(): void {
    this.dataSource.getPaginatedEntradaMercancia('', '', 0, 10,'fecha','desc');
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
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );
    var fechaIni =
      this.datePipe.transform(this.form.fechaIni.value, 'dd-MM-yyyy') ?? '';
    var fechaFin =
      this.datePipe.transform(this.form.fechaFin.value, 'dd-MM-yyyy') ?? '';
    this.dataSource.getPaginatedEntradaMercancia(
      fechaIni,
      fechaFin,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
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


  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap(() => {
          this.onSubmit();
        })
      )
      .subscribe();
      this.sort.sortChange.subscribe(() => {
        this.paginator.pageIndex = 0;
        this.onSubmit();
      });
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
      focusConfirm: false,
    }).then(
      (result: any) => {
        console.log(result);
        if (!result.isConfirmed) return;
        var dialog = Swal;
        dialog.fire({
          title: 'Generando PDF',
          html:`<style>.loader {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }</style><div class="flex align-middle justify-center"><div class="loader"></div></div>`,

          heightAuto: false,
          showCancelButton: false,
          showConfirmButton: false,

          focusConfirm: false,
        });
        this.comprasService
          .printEntradaMercancia(
            item.docNum
          )
          .subscribe({

            next: (data) => {
              dialog.close();
              console.log(data);
              var link = document.createElement('a');
              document.body.appendChild(link);
              link.setAttribute('type', 'hidden');
              link.href = 'data:text/plain;base64,' + data;
              link.download = `IngresoCompras${item.DocNum}.pdf`;
              link.click();
              document.body.removeChild(link);
            },
            error: (error) => {
              dialog.close();
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
}
