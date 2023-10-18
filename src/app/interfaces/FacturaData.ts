export class FacturaData {
    constructor(
      public codigo: number,
      public fecha: string,
      public codCliente: string,
      public nomCliente: string,
      public numeroDocumento: string,
      public numRecibo: string,
      public condicionPago: string,
      public monto: number,
      public efectivoR: number,
      public chequesR: number,
      public transfR: number,
      public estadoDocumento: number,
      public pagos: DetallePago
    ) {}
  }

  export class CorteCaja {
    usuario: number;
    numeroDocumento: string;
    fecha: string;
    entrega: string;
    estadoDocumento: number;
    tipoDocumento: number;
    documentLines: FacturaData[];
    idCortedeCaja: number;
    b1: number;
    b5: number;
    b10: number;
    b20: number;
    b50: number;
    b100: number;
    mCentavo: number;
    milesimasCentavo: number;
    m5: number;
    m10: number;
    m25: number;
    m1: number;
  
    constructor(
      usuario: number = 0,
      numeroDocumento: string = "",
      fecha: string = "",
      entrega: string = "",
      estadoDocumento: number = 0,
      tipoDocumento: number = 0,
      documentLines: FacturaData[],
      idCortedeCaja = 0,
      b1: number = 0,
      b5: number = 0,
      b10: number = 0,
      b20: number = 0,
      b50: number = 0,
      b100: number = 0,
      milesimasCentavo = 0,
      mCentavo: number = 0,
      m5: number = 0,
      m10: number = 0,
      m25: number = 0,
      m1: number = 0
    ) {
      this.usuario = usuario;
      this.numeroDocumento = numeroDocumento;
      this.fecha = fecha;
      this.entrega = entrega;
      this.estadoDocumento = estadoDocumento;
      this.tipoDocumento = tipoDocumento;
      this.documentLines = documentLines;
      this.idCortedeCaja = idCortedeCaja;
      this.b1 = b1;
      this.b5 = b5;
      this.b10 = b10;
      this.b20 = b20;
      this.b50 = b50;
      this.b100 = b100;
      this.milesimasCentavo = milesimasCentavo;
      this.mCentavo = mCentavo;
      this.m5 = m5;
      this.m10 = m10;
      this.m25 = m25;
      this.m1 = m1;
    }
  }
  


  export class DetallePago {
    constructor(
      
      public montoEfectivo: number,
      public montoCheque: number,
      public montoTransfer: number,
      public cuentaTransfer: string,
      public referenciaTransfer: string,
      public fechaTransfer: string,
      public cuentaCheque: string,
      public ReferenciaCheque: string,
      public fechaCheque: string
      ) {}
    
  }