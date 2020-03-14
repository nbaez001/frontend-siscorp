export class OrdenCompra {
    id: number;
    nroOrdenCompra: string;
    nroExpSIAF: string;
    fecha: Date;
    concepto: string;
    monto: number;

    idTipoDocumento: number;
    nomTipoDocumento: string;
    nroDocumento: string;
    idProveedor: number;
    nomProveedor: string;

    nroCuadroAdquisicion: string;
    tipoProceso: string;
    nroContrato: string;
    idMoneda: number;
    nomMoneda: string;
    tc: number;

    idEstado: number;
    nomEstado: string;
}