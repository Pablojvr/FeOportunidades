export class ResponseData {
    public data: Data[] = [];
    public status: number = 0;
    public error: string[] = [];
    public docEntry: number = 0;
    public docNum: number = 0;
}

export class CodeRequest {
    code: string = "";
  }

export class Data {
    public code: string = '';
    public name: string | null = null;
    public docEntry: number = 0;
    public canceled: string = '';
    public object: string = '';
    public logInst: null | unknown = null;
    public userSign: number = 0;
    public transfered: string = '';
    public createDate: string = '';
    public createTime: string = '';
    public updateDate: string = '';
    public updateTime: string = '';
    public dataSource: string = '';
    public u_FechaInicial: string = '';
    public u_FechaFinal: string = '';
    public u_Vendedor: number = 0;
    public u_Estado: string = '';
    public u_ZonaCobro: string = '';
    public u_NombreVendedor: string = '';
    public u_Observaciones: string = '';
    public ceM_DET_RUTACOBROCollection: CEM_DET_RUTACOBROCollection[] = [];
}

export class CEM_DET_RUTACOBROCollection {
    public code: string = '';
    public lineId: number = 0;
    public object: string = '';
    public logInst: null | unknown = null;
    public u_NumDoc: number = 0;
    public u_FechaDoc: string = '';
    public u_TipoDoc: string = '';
    public u_RC: string = '';
    public u_NomCliente: string = '';
    public u_Plazo: string = '';
    public u_Vendedor: string = '';
    public u_TotalDoc: number = 0;
    public u_SaldoDoc: number = 0;
}
