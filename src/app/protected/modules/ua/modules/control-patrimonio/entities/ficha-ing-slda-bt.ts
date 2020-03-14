export class FichaIngSldaBT {
    id: number;
    cidCodigo: string;
    fecha: Date;

    fidDependencia: number;
    nomDependencia: string;
    idPersona: number;
    nomPersona: string;
    idTipoDocumento: number;
    nomTipoDocumento: string;
    nroDocumento: string;
    telPersona: string;
    //SI LA PERSONA AUTORIZADA PERTENECE A UN AREA
    idDependenciaPert: number;
    nomDependenciaPert: string;
    idAreaPert: number;
    nomAreaPert: string;

    fididMotivoIngBT: number;
    nomMotivoIngBT: string;

    fidUsuario: number;
    nomUsuario: string;
    idDependenciaIng: number;
    nomDependenciaIng: string;
    idAreaIng: number;
    nomAreaIng: string;

    docReferencia: string;

    cantBienes: number;
}