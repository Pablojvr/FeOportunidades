import { Component, OnInit, Input, Inject } from '@angular/core';
import { DetallePago } from '../../interfaces/FacturaData';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tabs-modal',
  templateUrl: './tabs-modal.component.html',
  styleUrls: ['./tabs-modal.component.css'],
})
export class TabsModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  pago: DetallePago = new DetallePago(0,0,0,"","","","","","");

  cuentas = [
    {
      value: '1',
      nombreCuenta: 'Agricola 123',
    },
    {
      value: '2',
      nombreCuenta: 'Promerica 123',
    },
  ];

  documento: string = this.data.NumDoc;

  ngOnInit(): void {

    if(this.data.pago != null){

      this.pago = this.data.pago

    }


  }

  savePago() {
    return {
      index : this.data.index,
      pago:  this.pago
    };
  }

  onConfirm() {
    this.data.actionFunction();
  }
}
