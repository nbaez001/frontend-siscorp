export class TrabajadorRequest {
    idCodigo?: number;
    tipoDocumento?: number;
    numeroDocumento?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    nombre?: string;
    fechaNacimiento?: string;
    edad?: string;
    tipoGenero?: number;
    telefono?: string;
    correoElectronico?: string;
    idDepartamento?: number;
    idProvincia?: number;
    idDistrito?: number;
    direccion?: string;
    tipoRubro: number;
    tipoCategoria: number;
    tipoTipo: number;
    montoJornal: string;
    idCodigoArchivo?: string;
    nombreArchivo?: string;
    nroContrato?: string;
    fechaInicioContrato?: string;
    fechaTerminoContrato?: string;
    tipoContrato?: number;
    //bandeja
    docFoto?: string;
    apellidoNombre?: string;
    genero?: number;
    categoria?: number;
    tipo?: number;
    fechaInicio?: string;
    fechaFin?: string;
    semana?: string;
}
