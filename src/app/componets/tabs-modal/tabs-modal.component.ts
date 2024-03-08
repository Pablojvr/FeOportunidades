import { Component, OnInit, Input, Inject } from '@angular/core';
import { DetallePago } from '../../interfaces/FacturaData';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacturasService } from '../../services/facturas.service'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

@Component({
  selector: 'app-tabs-modal',
  templateUrl: './tabs-modal.component.html',
  styleUrls: ['./tabs-modal.component.css'],
})
export class TabsModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private FacturasService: FacturasService) {}

  pago: DetallePago = new DetallePago(0, 0, 0, '', '', '', '', '', '', false);

  cuentas = this.data.cuentas;

  documento: string = this.data.documento;
  monto: string = this.data.monto;

  ngOnInit(): void {

    


    if (this.data.pago != null) {
      this.pago = this.data.pago;
    }
  }

  savePago() {
    return {
      index: this.data.index,
      pago: this.pago,
    };
  }

  onConfirm() {
    this.data.actionFunction();
  }
}
