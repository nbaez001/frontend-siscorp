import { DetalleSolicitudMant } from './detalle-solicitud-mant.model';

export class SolicitudMant {
    id: number;

    idUnidad: number;
    nomUnidad: string;
    idTambo: number;
    nomTambo: string;

    idTipoMantenimiento: number;
    nomTipoMantenimiento: string;

    idVehiculo: number;
    idTipoVehiculo: number;
    nomTipoVehiculo: string;
    marcaVehiculo: string;
    placaVehiculo: string;

    idProveedor: number;
    nomProveedor: string;
    idTipoDocumento: number;
    nomTipoDocumento: string;
    nroDocumento: string;

    fecha: Date;
    monto: number;
    proforma: any;
    observacion: string;

    idEstado: number;
    nomEstado: string;//REGISTRADO,PENDIENTE ASIGNACION,ATENDIDO, CONFORME


    fechaMant: Date;
    kilometrajeInicio: number;

    detalleSolicitudMant: DetalleSolicitudMant[];
}