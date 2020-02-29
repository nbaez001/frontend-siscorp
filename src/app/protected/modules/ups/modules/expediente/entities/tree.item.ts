export interface TreeItem {
    id: number;
    name: string;
    descripcion: string;
    unidad: string,
    metrado: string,
    precio: string,
    parcial: string,
    idPadre: number,
    cantidadHijo: number,
    nivel: string,
    children?: TreeItem[];
  }