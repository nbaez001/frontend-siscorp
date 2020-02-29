export interface TreeItemPartidaHijoAux{

    id: number,
    idCodigo: string,
    codigoPartida: string,
    nombrePartida: string,
    rendimiento: string,
    manoObra: string,
    equipo: string,
    costoUnitario: string,
    subTotalPartida: string,
   
    children: TreeItemPartidaHijoAux[]
}