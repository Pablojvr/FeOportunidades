import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Usuario, UsuariosDataSource } from '../usuarios/usuarios-datasource';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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
  dataSource: UsuariosDataSource;
  filter: string = '';
  sortOrder: string = 'asc';
  pageNumber: number = 1;
  pageSize: number = 10;
  displayedColumns = [
    'codigo',
    'descripcion',
    'mes1',
    'mes2',
    'mes3',
    'mes4',
    'mes5',
    'mes6',
    'vtaProm',
    'existencia',
    'sugerido',
    'comprado',
    'punit',
    'total',
  ];
  constructor(
    private _fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.comprasForm = this._fb.group({
      idProveedor: [null, [Validators.required]],
      nombreProveedor: [null, Validators.required],
    });
    this.dataSource = new UsuariosDataSource(this.userService);
    this.dataSource.getUsuarios('', 'asc', 0, 10);
  }

  ngOnInit(): void {}

  onSubmit() {}
}
