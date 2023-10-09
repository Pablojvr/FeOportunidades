import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tabs-modal',
  templateUrl: './tabs-modal.component.html',
  styleUrls: ['./tabs-modal.component.css']
  
})
export class TabsModalComponent implements OnInit {
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

  ngOnInit(): void {}

  onConfirm() {
    this.data.actionFunction();
  }
}
