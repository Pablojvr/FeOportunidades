import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Usuario } from '../usuarios/usuarios-datasource';
import { ComprasService } from './../../services/compras.service';
import {
  ListadoComprasDataSource,
  getServerErrorMessage
} from './index-compras-datasource';

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
  isLoadingLab = false;
  errorMsg!: string;
  ListadoEstados: Array<any> = [];
  term$: any;
  appService: any;
  resultsLength: any;
  data: any;
  filteredLabs: any[] = [];

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
      estado: -1,
      laboratory: '',
      numSolicitud:'',
    });
    this.dataSource = new ListadoComprasDataSource(this.comprasService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
    this.comprasForm.controls.laboratory.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.filteredLabs = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.comprasService.getProveedores(value ?? '').pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        if (data.data?.value == undefined) {
          this.errorMsg = data['Error'];
          this.filteredLabs = [];
        } else {
          this.errorMsg = '';
          this.filteredLabs = data.data.value;
        }
        console.log(data);
        console.log(this.filteredLabs);
      });
  }

  ngOnInit(): void {
    this.dataSource.getPaginatedSolicitudDeCompra('', '','','', -1, 0, 10, 'codigo','desc');
    this.comprasService
      .getEstados()
      .toPromise()
      .then((data) => {
        this.ListadoEstados = data;
        this.ListadoEstados.push({
          idEstadoSolicitud: -1,
          nombreEstadoSolicitud: 'Todos',
        });
      });
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
    console.log('SORT ES');
    console.log(this.sort);
    this.dataSource.getPaginatedSolicitudDeCompra(
      fechaIni,
      fechaFin,
      this.form.laboratory.value.number,
      this.form.numSolicitud.value,
      this.form.estado.value,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );
  }
  orderByColumn(
    fechaIni: string,
    fechaFin: string,
    value: any,
    pageIndex: number,
    pageSize: number,
    orderByColumn: any
  ) {
    throw new Error('Method not implemented.');
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
        var dialog = Swal;
        dialog.fire({
          title: 'Generando PDF',
          html: `<style>.loader {
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
          .printSolicitudCompra(
            result.value[0],
            result.value[1],
            item.idSolicitudCompra
          )
          .subscribe({
            next: (data) => {
              dialog.close();
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
  getProveedores() {
    this.isLoading = true;
    this.comprasService.getProveedores('').subscribe((data) => {
      if (data.data?.value == undefined) {
        this.errorMsg = data['Error'];
        this.filteredLabs = [];
      } else {
        this.errorMsg = '';
        this.filteredLabs = data.data.value;
      }
      this.isLoading = false;
      console.log(data);
      console.log(this.filteredLabs);
    });
  }
  displayFn(data: any): string {
    console.log(data);
    return data ? data.groupName : '';
  }
}

