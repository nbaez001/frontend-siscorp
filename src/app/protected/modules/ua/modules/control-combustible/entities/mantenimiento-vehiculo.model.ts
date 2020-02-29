export class MantenimientoVehicular {
    id: number;
    idUnidad: number;
    nomUnidad: string;
    asuntoRequerimiento: string;

    nroHojatramiteReq: string;
    nroInformeReq: string;
    fecha: Date;

    idTipoAsigPresupuesto: number;
    nomTipoAsigPresupuesto: string;
    codAsigPresupuesto: string;
    importeAsigPresupuesto: number;

    nroHojatramiteConf: string;
    nroInformeConf: string;
    nroActaConf: string;

    idEstadoMantenimiento: number;
    nomEstadoMantenimiento: string;

    asuntoSolicitud: string;
    detalleSolicitud: string;

    cotizacion: number;

    conBadge: boolean;
}