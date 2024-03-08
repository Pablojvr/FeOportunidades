import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ComprasService } from 'src/app/services/compras.service';
import Swal from 'sweetalert2';
import { getServerErrorMessage } from '../index-compras/index-compras-datasource';
import { Usuario } from '../usuarios/usuarios-datasource';
import {
  CorteCaja,
  DetallePago,
  FacturaData,
} from '../../interfaces/FacturaData';
import { CorteCajaDataSource } from './corte-caja-datasource';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabsModalComponent } from 'src/app/componets/tabs-modal/tabs-modal.component';
import { ErrorCorteCajaComponent } from 'src/app/componets/error-corte-caja/error-corte-caja.component';
import { FacturasService } from '../../services/facturas.service'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import * as moment from 'moment';

@Component({
  selector: 'app-corte-caja-reporte-general',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.css'],
})
export class CorteCajaReporteGeneralComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource: CorteCajaDataSource;
  factura: any;
  fakeData: any[] = [];
  Cuentas: any[] = [];

  Corte: CorteCaja = new CorteCaja("", 0, '', '', '', 1, 0, [], 0);

  totalEfectivo: number = 0.0;
  totalContado: number = 0.0;
  diferencia: number = 0.0;

  readOnly: boolean = false;

  saving: boolean = false;
  displayedColumns: any[] = [
    'codigo',
    'fecha',
    'codCliente',
    'nomCliente',
    'numeroDocumento',
    'numRecibo',
    'condicionPago',
    'monto',
    'efectivoR',
    'chequesR',
    'transfR',
    'estado',
  ];

  user: any;

  numeroDocumento: string = ''; // Inicializamos con valor 0, puedes cambiarlo al valor inicial que desees
  FechaInicio: string = '';
  FechaFin: string = '';


  isLoading = false;
  errorMsg!: string;
  rol: any;

  constructor(
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private FacturasService: FacturasService,
    private _router: Router
  ) {
    this.comprasForm = this._fb.group({
      fechaIni: [null],
      fechaFin: [null],
    });
    this.dataSource = new CorteCajaDataSource(this.comprasService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
  }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') ?? '{}');
    this.rol = this.user.rol.id;


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
  }




  generarReporte() {

    

    var fechaIni =
      this.datePipe.transform(this.FechaInicio, 'dd-MM-yyyy') ?? '';

    var fechaFin =
      this.datePipe.transform(this.FechaFin, 'dd-MM-yyyy') ?? '';

    console.log(fechaFin)
    console.log(this.FechaInicio)

    window.open(`http://172.16.0.4:82/api/OrdenCompra/?FInicio=${fechaIni}&FFin=${fechaFin}`, "_blank");


    // this.FacturasService.GenerarDetalleIngreso(fechaIni,fechaFin)
    //   .then((result: any) => {
    //     Swal.fire({
    //       title: 'Corte Aplicado',
    //       text: '',
    //       icon: 'success',
    //       heightAuto: false,
    //     });



    //   })
    //   .catch((error: any) => {
    //     Swal.fire({
    //       title: 'Error al aplicar corte',
    //       text: 'Error: ' + JSON.stringify(error, null, 2),
    //       icon: 'error',
    //       heightAuto: false,
    //     });
    //   });


  }





}
