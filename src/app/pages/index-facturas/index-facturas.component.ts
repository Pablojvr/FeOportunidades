import { FacturasDataSource } from './index-facturas-datasource';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from 'sweetalert2';
import { EntradaMercanciaDataSource } from '../index-entrada-mercancia/index-entrada-mercancia-datasource';
import { Usuario } from '../usuarios/usuarios-datasource';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';

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
    'proveedor',
    'estado',
    'acciones',
  ];

  isLoading = false;
  errorMsg!: string;

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

}
