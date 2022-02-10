import { RolesService } from './../../services/roles.service';
import { catchError, finalize } from 'rxjs/operators';
import { UserService } from './../../services/user.service';
import { Page, Rol } from './../../pages/usuarios/usuarios-datasource';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';

@Component({
  selector: 'editar-usuario-modal',
  templateUrl: './editar-usuario-modal.component.html',
  styleUrls: ['./editar-usuario-modal.component.css'],
})
export class EditarUsuarioModalComponent implements OnInit {
  roles: Rol[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rolesService: RolesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.rolesService
      .getRoles()
      .pipe(catchError(() => of([])))
      .subscribe((roles: Rol[]) => {
        this.roles = roles;
      });
  }
  guardarUsuario() {
    console.log(this.data.editedUsuario);
    this.userService.saveUser(this.data.editedUsuario).subscribe({
      next: (_) => {
        console.log('Se guardo correctamente');
        this.data.then();
      },
      error: (_) => console.log('error'),
    });
  }
}
