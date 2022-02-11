import { RolesService } from 'src/app/services/roles.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-rol-modal',
  templateUrl: './editar-rol-modal.component.html',
  styleUrls: ['./editar-rol-modal.component.css'],
})
export class EditarRolModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rolService: RolesService
  ) {}

  ngOnInit(): void {}
  guardarRol() {
    console.log(this.data.editedRol);
    this.rolService.saveRol(this.data.editedRol).subscribe({
      next: (_) => {
        console.log('Se guardo correctamente');
        this.data.then();
      },
      error: (_) => console.log('error'),
    });
  }
}
