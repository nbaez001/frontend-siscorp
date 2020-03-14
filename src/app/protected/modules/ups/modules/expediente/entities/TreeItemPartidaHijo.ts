export interface TreeItemPartidaHijo{
    id: number,

    idCodigo: string,
    codigoPartida: string,
    nombrePartida: string,
    rendimiento: string,
    manoObra: string,
    equipo: string,
    costoUnitario: string,
    subTotalPartida: string,
    name: string;
    descripcion: string;
    unidad: string,
    metrado: string,
    precio: string,
    parcial: string,
    idPadre: number,
    cantidadHijo: number,
    nivel: string,
    idCategoria?: number;
    nombrecategoria?: string;
    idPartida?: number;
    codigoHeader?: string;
    descripcionHeader?: string;
    unidadHeader?: string;
    cuadrillaHeader?: string;
    cantidadHeader?: string;
    precioHeader?: string;
    parcialHeader?: string;


    codigoPartidaDet?: string;
    descripcionInsumoDet?: string;
    categoriaInsumoDet?: string;
    unidadDet?: string;
    cuadrillaDet?: string;
    cantidadDet?: string;
    precioDet?: string;
    parcialDet?: string;
    nombreSubPresupuestoLabel?: string;
    nombrePartidaLabel?: string;
    children: TreeItemPartidaHijo[]

}