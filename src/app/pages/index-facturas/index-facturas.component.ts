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
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { Usuario } from '../usuarios/usuarios-datasource';
import { FacturasDataSource } from './index-facturas-datasource';

@Component({
  selector: 'app-index-facturas',
  templateUrl: './index-facturas.component.html',
  styleUrls: ['./index-facturas.component.css'],
})
export class IndexFacturasComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource: FacturasDataSource;
  displayedColumns: any[] = [
    'codigo',
    // 'correlativo',
    'fecha',
    'tipo',
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
    private facturasService: FacturasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.comprasForm = this._fb.group({
      fechaIni: [null],
      fechaFin: [null],
    });
    this.dataSource = new FacturasDataSource(this.facturasService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') ?? '{}');
    this.dataSource.getPaginatedFacturas('', '', 0, 10);
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
    this.dataSource.getPaginatedFacturas(
      fechaIni,
      fechaFin,
      this.paginator.pageIndex,
      this.paginator.pageSize
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

  anularFacturas(item:any){
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Todas las facturas en sap seran anuladas',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(
      (result) => {
        if (!result.isConfirmed) return;
        this.facturasService.anularFacturasByID(item).subscribe({
          next: (_) => {
            this.dataSource.removeFacturas(item);
            Swal.fire({
              title: '',
              text: 'Se ha anulado correctamente todas las facturas',
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

  generarNotaCreditoFacturas(item:any){
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Se generara una nota de credito para esta factura',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(
      (result) => {
        if (!result.isConfirmed) return;
        this.facturasService.generarNotaCreditoFactura({},item.idFactura).subscribe({
          next: (_) => {
            this.dataSource.removeFacturas(item);
            Swal.fire({
              title: '',
              text: 'La nota de credito se ha creado correctamente',
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

}
