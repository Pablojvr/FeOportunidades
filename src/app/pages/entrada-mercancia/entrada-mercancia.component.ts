import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ComprasService } from 'src/app/services/compras.service';
import Swal from 'sweetalert2';
import { ComprasDataSource } from '../compras/compras-datasource';
import { Usuario } from '../usuarios/usuarios-datasource';

@Component({
  selector: 'app-entrada-mercancia',
  templateUrl: './entrada-mercancia.component.html',
  styleUrls: ['./entrada-mercancia.component.css'],
})
export class EntradaMercanciaComponent implements OnInit {
  comprasForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('input') input!: ElementRef;
  dataSource: ComprasDataSource;
  monthNames: any = [];
  numFactura: number = 0;
  numOrdenCompra: number = 0;
  laboratory: string = '327573';
  fecha: string = '';
  displayedColumns: any[] = [];
  initialColumns = [
    'codigo',
    'descripcion',
    'lote',
    'vencimiento',
    'ugravadas',
    'punit',
    'vgrav',
    'ubonificadas',
    'descuento',
    'vbonif',
    'vdesc',
    'tgravado',
    'tunidades',
    'costoreal',
    'preciopublico',
  ];
  middleColumns = ['M1', 'M2'];
  onlyNewColums = [];
  endColumns = [];
  filteredLabs: any;
  isLoading = false;
  errorMsg!: string;
  solicitud: any = { documentLines: [] };
  saving: any = false;
  saved: any = false;
  expandedElement: any | null;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.comprasForm = this._fb.group({
      numFactura: [2, [Validators.required]],
      proveedor: [null],
      numOrdenCompra: [null, Validators.required],
      laboratory: [null, Validators.required],
      fecha: [new Date(), Validators.required],
    });
    this.dataSource = new ComprasDataSource(this.comprasService);
    // this.dataSource.getReporte(this.numFactura, this.numOrdenCompra, this.laboratory);
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
    let supplier = item.suppliers.find(
      (element: any) => element.CardCode == event.value
    );
    console.log('proveedor', supplier);
    item.CARDCODE = supplier.CardCode;
    item.VATCODE = supplier.VatGroupLatinAmerica;
    item.PROVEEDOR = supplier.CardName;
  }

  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.comprasService.getPurchaseOrdersByDocNum(id).subscribe((data) => {
        if (data.data == undefined) {
          this.errorMsg = data['Error'];
          this.solicitud = null;
        } else {
          this.errorMsg = '';
          this.solicitud = data.data.value[0];
          // this.updateDisplayedColumns();
          this.comprasForm.setValue({
            numOrdenCompra: this.solicitud.docNum,
            proveedor: this.solicitud.cardName,
            numFactura: '',
            laboratory: '',
            fecha: new Date(),
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
    this.numFactura = this.form.numFactura.value;
    this.numOrdenCompra = this.form.numOrdenCompra.value;
    var laboratoryData = this.form.laboratory.value;
    this.laboratory = laboratoryData.number;
    this.fecha = this.form.fecha.value;
    this.updateDisplayedColumns();
    if (!this.numFactura || !this.numOrdenCompra || !this.laboratory) {
      Swal.fire({
        title: '',
        text: 'Uno o mas campos estan vacios',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    console.log(this.numFactura, this.numOrdenCompra, this.laboratory);
    this.dataSource.getReporte(
      this.numFactura,
      this.numOrdenCompra,
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
    this.middleColumns = [...Array(this.numFactura).keys()].map((value, i) => {
      this.monthNames.push(
        moment().add(-i, 'M').locale('es').format('MMMM - YY')
      );
      return `M${i + 1}`;
    });
    this.monthNames = this.monthNames.reverse();
    var endArray =
      this.solicitud == null
        ? [...this.onlyNewColums, ...this.endColumns]
        : this.endColumns;
    this.displayedColumns = [
      ...this.initialColumns,
      ...this.middleColumns,
      ...endArray,
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
          PROVEEDOR: item.cardName,
          CARDCODE: item.cardCode,
          VATCODE: item.vatCode,
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

  guardarSolicitud(aprobar: any = 1) {
    var articulosSolicitados = this.dataSource.usuarioSubject
      .getValue()
      .filter((item: any) => item.COMPRAR > 0)
      .map((item: any, index: number) => {
        return {
          itemCode: item.ITEMCODE,
          itemName: item.NOMBRE,
          cardCode: item.CARDCODE,
          cardName: item.PROVEEDOR,
          vatCode: item.VATGROUP,
          amount: item.COMPRAR,
          price: item.PUNIT,
          line: index,
        };
      });
    var solicitud = null;
    if (this.solicitud != null) {
      solicitud = Object.assign(this.solicitud, {
        articulos: articulosSolicitados,
      });
    } else {
      var laboratoryData = this.form.laboratory.value;
      this.laboratory = laboratoryData.number;
      solicitud = {
        fecha: this.fecha,
        groupCode: laboratoryData.number + '',
        groupName: laboratoryData.groupName,
        articulos: articulosSolicitados,
      };
    }

    solicitud.estadoSolicitudFK = aprobar;

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

  updateItemCalculatedValues(item: any) {
    console.log("HA CAMBIADO UN VALOR")
    item.VGRAVADO =
      item.UGRAVADAS && item.PUNIT ? item.UGRAVADAS * item.PUNIT : 0;
    item.VBONIF =
      item.UBONIFICADAS && item.PUNIT ? item.UBONIFICADAS * item.PUNIT : 0;
    item.VDESC =
      item.UGRAVADAS && item.PUNIT && item.DESCUENTO
        ? item.UGRAVADAS * item.PUNIT * (item.DESCUENTO / 100)
        : 0;
    item.TGRAV =
      item.UGRAVADAS && item.PUNIT && item.UBONIFICADAS
        ? item.UGRAVADAS * item.PUNIT - item.UBONIFICADAS * item.PUNIT
        : 0;
    item.TUNIDADES =
      item.UGRAVADAS && item.UBONIFICADAS
        ? item.UGRAVADAS + item.UBONIFICADAS
        : 0;
    item.COSTOREAL =
      item.UGRAVADAS && item.PUNIT && item.UBONIFICADAS
        ? ((item.UGRAVADAS - item.UBONIFICADAS) * item.PUNIT) /
          (item.UGRAVADAS + item.UBONIFICADAS)
        : 0;
  }
  duplicateItem(item: any) {
    var index = this.solicitud.documentLines.indexOf(item);

    var { itemCode, itemDescription, baseLine, baseEntry, baseType, taxCode } =
      item;
    var newObj = Object.assign(
      {},
      { itemCode, itemDescription, baseLine, baseEntry, baseType, taxCode }
    );
    console.log(newObj);
    this.solicitud.documentLines.splice(index+1, 0, newObj);
    this.table.renderRows();
  }
  private getServerErrorMessage(error: HttpErrorResponse): string {
    console.log(error);
    switch (error.status) {
      case 400: {
        return `${error.error}`;
      }
      case 404: {
        return `Not Found: ${error.error}`;
      }
      case 403: {
        return `Access Denied: ${error.error}`;
      }
      case 500: {
        return `Internal Server Error: ${error.error}`;
      }
      case 0: {
        return `client-side or network error occurred: ${error.error}`;
      }
      default: {
        return `Unknown Server Error`;
      }
    }
  }
}
