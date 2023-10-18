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
  selector: 'app-corte-caja',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.css'],
})
export class CorteCajaComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  dataSource: CorteCajaDataSource;
  factura: any;
  fakeData: any[] = [];

  Corte: CorteCaja = new CorteCaja(0, '', '', '', 1, 0, [], 0);

  totalEfectivo: number = 0.0;
  totalContado: number = 0.0;
  diferencia: number = 0.0;

  readOnly : boolean = false;

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

  user : any;

  numeroDocumento: string = ''; // Inicializamos con valor 0, puedes cambiarlo al valor inicial que desees
  nombreEntrega: string = '';
  estadoSeleccionado: string = ''; // Inicializamos con una cadena vacía
  hora: string = ''; // Inicializamos con una cadena vacía
  tipoLiquidacionSeleccionado: string = ''; // Inicializamos con una cadena vacía
  tipoDocumentoSeleccionado: number = 1; // Inicializamos con el valor 1, puedes cambiarlo al valor inicial que desees
  estados = [
    {
      value: '1',
      viewValue: 'Recibido',
    },
    {
      value: '2',
      viewValue: 'Aplicado',
    },
  ];
  estadosConsolidado = [
    {
      value: 0,
      viewValue: 'No Entregado',
    },
    {
      value: 1,
      viewValue: 'Entregado',
    },
  ];
  estadosCobro = [
    {
      value: 0,
      viewValue: 'No Cobrado',
    },
    {
      value: 1,
      viewValue: 'Cobrado',
    },
  ];
  tipoLiquidacion = [
    {
      value: '1',
      viewValue: 'Despacho',
    },
    {
      value: '2',
      viewValue: 'Vendedor',
    },
  ];

  tipoDocumento = [
    {
      value: 1,
      viewValue: 'Consolidado',
    },
    {
      value: 2,
      viewValue: 'Ruta de cobro',
    },
  ];

  isLoading = false;
  errorMsg!: string;

  constructor(
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private FacturasService: FacturasService
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

    this.Corte.fecha = moment().format();

    this.Corte.usuario = this.user.username;

    var id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.readOnly = true;
      this.obtenerCorteCajaPorId(id);
    } else {
      console.log('Crear Corte Caja');
    }
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

  calcularSumatoria() {
    this.totalContado =
      this.Corte.b1 * 1.0 +
      this.Corte.b5  * 5.0 +
      this.Corte.b10  * 10.0 +
      this.Corte.b20  * 20.0 +
      this.Corte.b50  * 50.0 +
      this.Corte.b100  * 100.0 +
      this.Corte.milesimasCentavo  * 1 +
      this.Corte.mCentavo  * 0.01 +
      this.Corte.m5  * 0.05 +
      this.Corte.m10  * 0.1 +
      this.Corte.m25  * 0.25 +
      this.Corte.m1  * 1;
  }

  GetDocumento(): void {
    const numeroDocumentoActual = this.Corte.numeroDocumento;
    const tipoDocumentoActual = this.tipoDocumentoSeleccionado;

    if (this.Corte.numeroDocumento === null) {
      Swal.fire({
        title: 'Error de Validacion',
        text: 'Ingrese un numero de documento valido',
        icon: 'error',
        heightAuto: false,
      });

      return;
    }

    if (this.Corte.tipoDocumento < 1) {
      Swal.fire({
        title: 'Error de Validacion',
        text: 'Ingrese un tipo de documento',
        icon: 'error',
        heightAuto: false,
      });

      return;
    }

    if (this.Corte.tipoDocumento == 1) {
      // Tipo de documento es Consolidado
      this.obtenerConsolidadoPorCodigo(numeroDocumentoActual);
    } else if (this.Corte.tipoDocumento == 2) {
      // Tipo de documento es Ruta de Cobro
      this.obtenerRutaCobroPorCodigo(numeroDocumentoActual);
    } else {
      // Tipo de documento desconocido o no válido, manejar el caso según tus necesidades
      Swal.fire({
        title: 'Error de Validacion',
        text: 'Tipo documento no valido ' + this.Corte.tipoDocumento,
        icon: 'error',
        heightAuto: false,
      });

      return;
    }
  }

  obtenerRutaCobroPorCodigo(codigo: any) {
    this.FacturasService.getRutaCobroByCode(codigo).subscribe(
      (result: any) => {
        let i = 0;
        const facturaDataArray = result.data.map((item: any) => {
          const fechaCompleta = item.fecha;
          const fechaArray = fechaCompleta.split('T');
          const fecha = fechaArray[0];

          i++;
          return new FacturaData(
            i,
            item.numeroDocumento,
            fecha,
            item.codCliente,
            item.nomCliente,
            item.numRecibo,
            item.condicionPago,
            item.monto,
            0.0,
            0.0,
            0.0,
            item.estadoDocumento,
            new DetallePago(0.0, 0.0, 0.0, '', '', '', '', '', '')
          );
        });

        // Asigna el arreglo de FacturaData al dataSource
        this.Corte.documentLines = facturaDataArray;

        for (let i = 0; i < this.Corte.documentLines.length; i++) {
          this.totalEfectivo =
            this.totalEfectivo + this.Corte.documentLines[i].efectivoR;
        }

        console.log(this.Corte.documentLines);
      },
      (error: any) => {
        // Maneja errores aquí
        console.error(error);
      }
    );
  }

  obtenerCorteCajaPorId(codigo: any) {
    
    console.log('Actualizar Corte Caja ' + codigo);

    this.FacturasService.getCorteCajaById(codigo).subscribe((result: any) => {

      console.log(result)
      
      this.Corte = result;


    });
  }

  obtenerConsolidadoPorCodigo(codigo: any) {
    this.FacturasService.getConsolidadoByCode(codigo).subscribe(
      (result: any) => {
        console.log(result);

        let i = 0;
        const facturaDataArray = result.data.map((item: any) => {
          i++;

          const fechaCompleta = item.fecha;
          const fechaArray = fechaCompleta.split('T');
          const fecha = fechaArray[0];

          return new FacturaData(
            i,
            fecha,
            item.codCliente,
            item.nomCliente,
            item.numeroDocumento,
            item.numRecibo,
            item.condicionPago,
            item.monto,
            0.0,
            0.0,
            0.0,
            item.estadoDocumento,
            new DetallePago(0.0, 0.0, 0.0, '', '', '', '', '', '')
          );
        });

        // Asigna el arreglo de FacturaData al dataSource
        this.Corte.documentLines = facturaDataArray;

        for (let i = 0; i < this.Corte.documentLines.length; i++) {
          this.totalEfectivo =
            this.totalEfectivo + this.Corte.documentLines[i].efectivoR;
        }
        console.log(this.Corte.documentLines);
      },
      (error: any) => {
        // Maneja errores aquí
        console.error(error);
      }
    );
  }

  savePago(row: any, Estado: any, CondicionPago: any, pago: DetallePago) {
    console.log(row);
    console.log(Estado);
    console.log(CondicionPago);

    
      let dialogRef = this.dialog.open(TabsModalComponent, {
        data: {
          index: row,
          pago: pago,
        },
        width: '800px',
        maxWidth: '800px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        if (result) {
          let index = result.index;
          let pagos = result.pago;

          this.Corte.documentLines[index].efectivoR = pagos.montoEfectivo;
          this.Corte.documentLines[index].chequesR = pagos.montoCheque;
          this.Corte.documentLines[index].transfR = pagos.montoTransfer;

          this.Corte.documentLines[index].pagos = pagos;


          this.totalEfectivo = 0;

          for (let i = 0; i < this.Corte.documentLines.length; i++) {
            this.totalEfectivo += this.Corte.documentLines[i].efectivoR;
          }

          console.log(this.totalEfectivo);
          console.log(JSON.stringify(this.Corte.documentLines[index], null, 2));
        }
      });
    
  }

  aplicarCorte() {


    if(this.totalContado != this.totalEfectivo){

      Swal.fire({
        title: 'Error de Validacion',
        text: 'Existe un error de validacion entre el arqueo de caja y el total',
        icon: 'error',
        heightAuto: false,
      });

    }else{


      this.FacturasService.aplicarCorteCaja(this.Corte.idCortedeCaja).then((result : any) => {

        Swal.fire({
          title: 'Corte Aplicado',
          text: '',
          icon: 'success',
          heightAuto: false,
        });

      }).catch((error : any ) => {
      

      Swal.fire({
        title: 'Error al aplicar corte',
        text: 'Error: ' + JSON.stringify(error, null, 2),
        icon: 'error',
        heightAuto: false,
      });


    })

    }


  }

  guardarCorte() {
    this.FacturasService.saveCorteCaja(this.Corte).then((result : any) => {

      Swal.fire({
        title: 'Corte Guardado',
        text: 'El Corte ha sido guardado con exito',
        icon: 'success',
        heightAuto: false,
      });



    }).catch((error : any ) => {
      

      Swal.fire({
        title: 'Error de guardado',
        text: 'Error: ' + JSON.stringify(error, null, 2),
        icon: 'error',
        heightAuto: false,
      });


    })
  }


  updateCorte() {
    this.FacturasService.updateCorteCaja(this.Corte).then((result : any) => {

      Swal.fire({
        title: 'Corte Guardado',
        text: 'El Corte ha sido guardado con exito',
        icon: 'success',
        heightAuto: false,
      });



    }).catch((error : any ) => {
      

      Swal.fire({
        title: 'Error de guardado',
        text: 'Error: ' + JSON.stringify(error, null, 2),
        icon: 'error',
        heightAuto: false,
      });


    })
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

 
}
