export interface Proyecto {

    idProyecto?: number;
    codigoProyecto?: string;
    fechaRecepcionProyecto?: string;
    fechaAsignacion?: string;
    plazo?: number;
    coordinador?: string;
    cidEstado?: string;
    modalidad?: string;

    nro?: number,
    fechaAsignada?: string,
    coordinadorPlataformaFija?: string,
    fechaRecepcionRecepcion?: string,
    codigo?: string,
    modalidadEjecucion?: string,
    cmodalidadEjecucion?: string,
    profesionalElaboracion?: string,
    profesionalRevision?: string,
    encargadoAsignado?: string,
    fechaAsignadaEncargado?: string,


    cidCodigo?: string;
    fecRecepcion?: string;
    nombreCoordinador?: string;
    fecAsignacion?: string;
    fecAsignacionEncargado?: string;
    encargadoAsigando?: string;
    estado?: string;
    numPlazo?: number;
    cidModalidad?: string;
    flgElaboracion?: string;
    flgRevision?: string;
    fechaInicio?: string;
    fechaFin?: string;
    idAlerta?: string;
    idEstado?: string;
  }



  export interface ResultadoProyectos {
    intervenciones: Proyecto[];
    total: number;
  }



  