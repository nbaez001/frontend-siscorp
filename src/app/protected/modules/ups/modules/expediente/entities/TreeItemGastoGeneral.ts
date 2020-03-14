export interface TreeItemGastoGeneral {
    id: number;
    numero: string;
    descripcion: string;
    unidad: string,
    cantidadUnidad: string,
    costoUnitario: string,
    coefPart: string,
    parcial: string,
    subTotal: string,
    total: string,
    idPadre: number,
    cantidadHijo: number,
    children?: TreeItemGastoGeneral[];


  }