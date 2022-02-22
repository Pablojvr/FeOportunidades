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
import { ComprasDataSource } from './compras-datasource';
import * as moment from 'moment';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

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
  numMonths: number = 2;
  numMontsCob: number = 2;
  supplier: string = '327573';
  displayedColumns: any[] = [];
  initialColumns = ['codigo', 'descripcion'];
  middleColumns = ['M1', 'M2'];
  endColumns = [
    'vtaProm',
    'existencia',
    'sugerido',
    'comprado',
    'punit',
    'total',
  ];
  supplierControl = new FormControl();
  filteredMovies: any;
  isLoading = false;
  errorMsg!: string;

  constructor(
    private _fb: FormBuilder,
    private comprasService: ComprasService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.comprasForm = this._fb.group({
      numMonths: [2, [Validators.required]],
      nombreProveedor: [null],
      numMontsCob: [2, Validators.required],
      supplier: [null, Validators.required],
    });
    this.dataSource = new ComprasDataSource(this.comprasService);
    // this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.supplier);
    this.updateDisplayedColumns();

    this.comprasForm.controls.supplier.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.filteredMovies = [];
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
          this.filteredMovies = [];
        } else {
          this.errorMsg = '';
          this.filteredMovies = data.data.value;
        }
        console.log(data);
        console.log(this.filteredMovies);
      });
  }

  displayFn(data: any): string {
    console.log(data);
    return `${data.cardCode} : ${data.cardName}`;
  }

  ngOnInit(): void {}
  get form() {
    return this.comprasForm.controls;
  }
  onSubmit() {
    this.numMonths = this.form.numMonths.value;
    this.numMontsCob = this.form.numMontsCob.value;
    var supplierData = this.form.supplier.value.split('-');
    this.supplier = supplierData[1].trim() ?? '';
    this.updateDisplayedColumns();
    if (!this.numMonths || !this.numMontsCob || !this.supplier) {
      Swal.fire({
        title: '',
        text: 'Uno o mas campos estan vacios',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    console.log(this.numMonths, this.numMontsCob, this.supplier);
    this.dataSource.getReporte(this.numMonths, this.numMontsCob, this.supplier);
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
}
