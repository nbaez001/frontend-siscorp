export class ProveedorRequest {
    idCodigo?: number;
    nro?: number;
    nombreRazonSocial: string;
    nombreRazonSocial2: string;
    nombreRazonSocial3: string;
    idTipoDocumento?: number;
    nombreTipoDocumento: string;
    numeroDocumento: string;
    idTipoRubro?: number;
    nombreTipoRubro: string;
    //**
    idTipoProveedor?: number;
    telefono?: string;
    correoElectronico?: string;
    idDepartamento?: number;
    idProvincia?: number;
    idDistrito?: number;
    direccion?: string;
    idEstado?: number;
    //**
    nombreComercial?: string;
    domicilioFiscal?: string;
    estado?: string; //activo
    condicion?: string;// habido
    actividadEconomica?: string;
    comprobantePago?: string;
}