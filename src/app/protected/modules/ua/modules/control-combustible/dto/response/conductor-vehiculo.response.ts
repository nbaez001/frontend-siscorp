export class ConductorVehiculoResponse {
    idConductor: number;
    idPersona: number;
    nombre1: string;
    nombre2: string;
    apPat: string;
    apMat: string;
    idEmpleado: number;
    idVehiculo: number;
    fecConductorIni: Date;
    fecConcductorFin: Date;
    flgConductorActual: number;
    flgActualBrevete: number;
    idBrevete: number;
    numBrevete: string;
    vigenBreveteIni: Date;
    vigenBreveteFin: Date;
    fecRegBrevete: Date;

    //ADICIONALES
    modificable: boolean;
    renovable: boolean;
}