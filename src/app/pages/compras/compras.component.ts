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
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ComprasDataSource } from './compras-datasource';
import * as moment from 'moment';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
})
export class ComprasComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;
  @ViewChild('input') input!: ElementRef;
  dataSource: ComprasDataSource;
  monthNames: any = [];
  numMonths: number = 0;
  numMontsCob: number = 0;
  laboratory: string = '327573';
  fecha: string = '';
  displayedColumns: any[] = [];
  initialColumns = ['codigo', 'descripcion', 'proveedor'];
  middleColumns = ['M1', 'M2'];
  endColumns = [
    'vtaProm',
    'existencia',
    'sugerido',
    'comprado',
    'punit',
    'total',
  ];
  filteredLabs: any;
  isLoading = false;
  errorMsg!: string;
  solicitud: any;
  saving: any = false;
  saved: any = false;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.comprasForm = this._fb.group({
      numMonths: [2, [Validators.required]],
      nombreProveedor: [null],
      numMontsCob: [2, Validators.required],
      laboratory: [null, Validators.required],
      fecha: [new Date(), Validators.required],
    });
    this.dataSource = new ComprasDataSource(this.comprasService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.laboratory);
    this.updateDisplayedColumns();

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

  displayFn(data: any): string {
    console.log(data);
    return data ? data.groupName : '';
  }

  openChanged(event: any, item: any) {
    this.isLoading = true;
    console.log('Se abrio', event);
    if (event) {
      this.editProveedor(item);
    }
  }
  selectionChange(event: any, item: any) {
    this.isLoading = true;
    console.log('Se selecciono', event);
    item.CARDCODE = event.value;
  }

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.comprasService.getSolicitudCompraByID(id).subscribe((data) => {
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.solicitud = null;
        } else {
          this.errorMsg = '';
          this.solicitud = data;
          this.comprasForm.setValue({
            laboratory: {
              groupName: this.solicitud.groupName,
              number: this.solicitud.groupCode,
            },
            numMonths: 1,
            numMontsCob: 1,
            nombreProveedor: '',
            fecha: this.solicitud.fecha,
          });
          this.dataSource.getReporte(1, 0, this.solicitud.groupCode, () => {
            this.setSolicitudData();
          });
        }
        this.isLoading = false;
        console.log(data);
        console.log(this.solicitud);
      });
    }
  }
  get form() {
    return this.comprasForm.controls;
  }
  onSubmit() {
    this.numMonths = this.form.numMonths.value;
    this.numMontsCob = this.form.numMontsCob.value;
    var laboratoryData = this.form.laboratory.value;
    this.laboratory = laboratoryData.number;
    this.fecha = this.form.fecha.value;
    this.updateDisplayedColumns();
    if (!this.numMonths || !this.numMontsCob || !this.laboratory) {
      Swal.fire({
        title: '',
        text: 'Uno o mas campos estan vacios',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    console.log(this.numMonths, this.numMontsCob, this.laboratory);
    this.dataSource.getReporte(
      this.numMonths,
      this.numMontsCob,
      this.laboratory
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

  updateDisplayedColumns() {
    // var currentMonth = moment().locale('es').format('MMMM');
    // this.monthNames = [currentMonth];
    this.middleColumns = [...Array(this.numMonths).keys()].map((value, i) => {
      this.monthNames.push(
        moment().add(-i, 'M').locale('es').format('MMMM - YY')
      );
      return `M${i + 1}`;
    });
    this.monthNames = this.monthNames.reverse();
    this.displayedColumns = [
      ...this.initialColumns,
      ...this.middleColumns,
      ...this.endColumns,
    ];
  }

  editProveedor(item: any) {
    item.editing = false;
    item.loadingSuppliers = true;
    this.comprasService
      .getVendorsByItemCode(item.ITEMCODE)
      .subscribe((data) => {
        if (data == undefined) {
          this.errorMsg = data.Error;
          item.suppliers = [];
        } else {
          this.errorMsg = '';
          item.suppliers = data;
        }
        item.loadingSuppliers = false;
        item.editing = true;
        console.log('datos', data);
        console.log('en el item', item.suppliers);
      });
  }
  setSolicitudData() {
    var listadoActiculosDataSource = this.dataSource.usuarioSubject.getValue();
    console.log('Solicitud de Datos', listadoActiculosDataSource);
    this.solicitud.articulos.forEach((item: any) => {
      var found = listadoActiculosDataSource.find(
        (i: any) => item.itemCode == i.ITEMCODE
      );
      if (found) {
        var index = listadoActiculosDataSource.indexOf(found);
        listadoActiculosDataSource[index] = Object.assign(found, {
          COMPRAR: item.amount,
          PUNIT: parseInt(item.price),
        });
      }
    });
    this.dataSource.usuarioSubject.next(listadoActiculosDataSource);
  }
  // guardarSolicitud() {
  //   var articulosSolicitados = this.dataSource.usuarioSubject
  //     .getValue()
  //     .filter((item: any) => item.COMPRAR > 0)
  //     .map((item: any, index) => {
  //       return {
  //         ItemCode: item.ITEMCODE,
  //         LineVendor: item.CARDCODE,
  //         Quantity: item.COMPRAR,
  //         Price: item.PUNIT,
  //         LineNum: index,
  //       };
  //     });

  //   var solicitud = {
  //     RequriedDate: this.fecha,
  //     DocumentLines: articulosSolicitados,
  //   };

  //   console.log(solicitud);
  // }

  guardarSolicitud() {
    var articulosSolicitados = this.dataSource.usuarioSubject
      .getValue()
      .filter((item: any) => item.COMPRAR > 0)
      .map((item: any) => {
        return {
          itemCode: item.ITEMCODE,
          cardCode: item.CARDCODE,
          cardName: item.PROVEEDOR,
          amount: item.COMPRAR,
          price: item.PUNIT,
        };
      });
    var laboratoryData = this.form.laboratory.value;
    this.laboratory = laboratoryData.number;
    var solicitud = {
      fecha: this.fecha,
      groupCode: laboratoryData.number + '',
      groupName: laboratoryData.groupName,
      articulos: articulosSolicitados,
    };
    Swal.fire({
      title: '',
      text: 'Guardando...',
      icon: 'info',
      heightAuto: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    this.comprasService.saveSolicitudDeCompra(solicitud).subscribe({
      next: (_) => {
        this.saving = false;
        this.saved = true;
        Swal.fire({
          title: 'Guardado',
          text: 'Se ha guardado correctamente...',
          icon: 'success',
          timer: 2000,
          heightAuto: false,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(
          () => {
            this._router.navigate(['/compras']);
          },
          (dismiss: any) => {
            this._router.navigate(['/compras']);
          }
        );
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
        this.saving = false;
        this.saved = false;
      },
    });

    console.log(solicitud);
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
}
