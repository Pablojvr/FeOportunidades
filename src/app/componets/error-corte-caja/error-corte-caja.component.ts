import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-error-corte-caja',
  templateUrl: './error-corte-caja.component.html',
  styleUrls: ['./error-corte-caja.component.css']
  
})
export class ErrorCorteCajaComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  cuentas = [

    {
      value : "1",
      nombreCuenta: "Agricola 123"

    },
    {
      value : "2",
      nombreCuenta: "Promerica 123"

    },

  ]

  

  ngOnInit(): void {



  }

  onConfirm() {
    this.data.actionFunction();
  }
}
