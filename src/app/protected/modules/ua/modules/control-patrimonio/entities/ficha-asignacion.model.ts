export class FichaAsignacion {
    id: number;
    cidCodigo: string;
    fecInicio: Date;

    fidEmpleado: number;
    nomEmpleado: string;
    apeEmpleado: string;
    cargoEmpleado: string;
    dniEmpleado: string;
    modContratoEmpleado: string;

    local: string;
    idDependencia: number;
    nomDependencia: string;
    idArea: number;
    nomArea: string;

    idEstadoFicha: number;
    nomEstadoFicha: string;

    cantBienes: number;
    listaBienes: any[];

    flgConfCoordPatrimonio: boolean;
    flgConfJefeUnidad: boolean;
    flgConfUsuario: boolean;
    flgConfAsistPatrimonio: boolean;
    flgFinalizado: boolean;

    
}