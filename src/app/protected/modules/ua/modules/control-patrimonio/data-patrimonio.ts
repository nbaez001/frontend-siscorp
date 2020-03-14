import { Denominacion } from './entities/denominacion.model';
import { Grupo } from './entities/grupo.model';
import { Clase } from './entities/clase.model';
import { Marca } from './entities/marca.model';
import { Modelo } from './entities/modelo.model';
import { Color } from './entities/color.model';
import { Adquisicion } from './entities/adquisicion.model';
import { BienSobrante } from './entities/bien-sobrante.model';
import { BienPatrimonio } from './entities/bien-patrimonio.model';
import { Baja } from './entities/baja.model';
import { FichaAsignacion } from './entities/ficha-asignacion.model';
import { FichaSldaRtno } from './entities/ficha-slda-rtno.model';
import { ActaEtrgRcpBienes } from './entities/acta-etrg-rcp-bienes.model';
import { FichaIngSldaBT } from './entities/ficha-ing-slda-bt';

export const _unidades: any[] = [
    { id: 1, nombre: 'U.T. AYACUCHO NORTE' },
    { id: 2, nombre: 'U.T. CUSCO' },
    { id: 3, nombre: 'U.T. HUANCAVELICA' },
    { id: 20, nombre: 'U.T. LORETO' },
    { id: 21, nombre: 'U.T. UCAYALI' },
    { id: 22, nombre: 'U.T. SAN MARTIN' }
];

export const _tambos: any[] = [
    { id: 1, nombre: 'ANCARPATA', idUnidad: 1 },
    { id: 2, nombre: 'BARRIO VISTA ALEGRE', idUnidad: 1 },
    { id: 3, nombre: 'CCERAOCRO', idUnidad: 1 },
    { id: 4, nombre: 'CHACHASPATA', idUnidad: 1 },
    { id: 5, nombre: 'CHURUNMARCA', idUnidad: 1 },
    { id: 6, nombre: 'COCHAPAMPA', idUnidad: 1 },
    { id: 7, nombre: 'CAYARPACHI', idUnidad: 1 },
    { id: 8, nombre: 'AUQUIRACCAY', idUnidad: 1 },
    { id: 9, nombre: 'CUNYA', idUnidad: 1 },
    { id: 10, nombre: 'CUSIBAMBA', idUnidad: 1 },
    { id: 11, nombre: 'HUANCA PAMPA', idUnidad: 1 },
    { id: 12, nombre: 'MARCCARACCAY', idUnidad: 1 },
    { id: 13, nombre: 'OCCO CHIRURA', idUnidad: 1 },
    { id: 14, nombre: 'OCCOLLO', idUnidad: 1 },
    { id: 15, nombre: 'PACCHA', idUnidad: 1 },
    { id: 17, nombre: 'PACCO LOMA - HUAYCHAO', idUnidad: 1 },
    { id: 18, nombre: 'PARAS', idUnidad: 1 },
    { id: 19, nombre: 'PATAHUASI', idUnidad: 1 },
    { id: 20, nombre: 'PAUCHO', idUnidad: 1 },
    { id: 21, nombre: 'POMAPUKIO', idUnidad: 1 },
    { id: 90, nombre: 'SAN ANTONIO DEL ESTRECHO', idUnidad: 20 },
    { id: 91, nombre: 'ESPERANZA', idUnidad: 20 },
    { id: 92, nombre: 'REMANZO', idUnidad: 20 },
    { id: 93, nombre: 'NUEVA ANGUSILLA', idUnidad: 20 },
    { id: 94, nombre: 'SOPLIN VARGAS', idUnidad: 20 },
    { id: 95, nombre: 'HUANTA', idUnidad: 20 },
    { id: 96, nombre: 'COCHIQUINAS', idUnidad: 20 },
    { id: 97, nombre: 'LEONCIO PRADO', idUnidad: 20 },
    { id: 98, nombre: 'INDUSTRIAL (PUERTO INDUSTRIAL)', idUnidad: 20 },
    { id: 99, nombre: 'TRES FRONTERAS', idUnidad: 20 },
    { id: 100, nombre: 'EL ALAMO', idUnidad: 20 },
    { id: 101, nombre: 'FLOR DE AGOSTO', idUnidad: 20 },
    { id: 102, nombre: 'COLONIA CACO', idUnidad: 21 },
    { id: 103, nombre: 'DOS DE MAYO', idUnidad: 22 },
    { id: 104, nombre: 'BRETAÑA', idUnidad: 20 },
    { id: 105, nombre: 'SANTA MERCEDES', idUnidad: 20 }
];

export const _cuentas: any[] = [
    { id: 1, codigo: '1503', nombre: 'VEHICULO, MAQUINARIAS Y OTROS' },
    { id: 2, codigo: '1503.01', nombre: 'VEHICULOS' },
    { id: 3, codigo: '1503.0101', nombre: 'PARA TRANSPORTE TERRESTRE' },
    { id: 4, codigo: '9105', nombre: 'BIENES EN PRESTAMO, CUSTODIA Y NO DEPRECIABLES' },
    { id: 5, codigo: '9105.01', nombre: 'BIENES EN PRESTAMO Y OTROS' },
    { id: 6, codigo: '9105.02', nombre: 'BIENES EN CUSTODIA' },
];

export const _formasAdquisicion: any[] = [
    { id: 1, nombre: 'C-COMPRA' }, //NO SE ENCUENTRA EN LA DIRECTIVA 02-2018
    { id: 2, nombre: 'NEA-NOTA DE ENTRADA A ALMACEN' }, //NO SE ENCUENTRA EN LA DIRECTIVA 02-2018
    // { id: 2, nombre: 'D-ACEPTACION DE DONACION DE BIENES' },
    // { id: 3, nombre: 'S-SANEAMIENTOS DE BIENES SOBRANTES' },
    // { id: 4, nombre: 'S-SANEAMIENTOS DE VEHICULOS' },
    // { id: 5, nombre: 'R-REPOSICION DE BIENES' },
    // { id: 6, nombre: 'P-PERMUTA DE BIENES' },
    // { id: 7, nombre: 'F-FABRICACION DE BIENES' },
    // { id: 8, nombre: 'L-DISPOSICION LEGAL' },
    // { id: 9, nombre: 'J-MANDATO JUDICIAL O ARBITRAL' },
];

export const _aniosAdquisicion: any[] = [
    { valor: 2020, nombre: '2020' },
    { valor: 2019, nombre: '2019' },
    { valor: 2018, nombre: '2018' },
    { valor: 2017, nombre: '2017' },
    { valor: 2016, nombre: '2016' },
];

export const _mesesAdquisicion: any[] = [
    { valor: 0, nombre: 'ENERO' },
    { valor: 1, nombre: 'FEBRERO' },
    { valor: 2, nombre: 'MARZO' },
    { valor: 3, nombre: 'ABRIL' },
    { valor: 4, nombre: 'MAYO' },
    { valor: 5, nombre: 'JUNIO' },
    { valor: 6, nombre: 'JULIO' },
    { valor: 7, nombre: 'AGOSTO' },
    { valor: 8, nombre: 'SETIEMBRE' },
    { valor: 9, nombre: 'OCTUBRE' },
    { valor: 10, nombre: 'NOVIEMBRE' },
    { valor: 11, nombre: 'DICIEMBRE' },
];

export const _adquisiciones: Adquisicion[] = [
    { id: 1, adquisicion: { id: 1, nombre: 'C-COMPRA' }, nroDocSustentatorio: 'O.C. 0223-2019', fecha: new Date('2019-12-02'), totalBienes: 10 },
    { id: 1, adquisicion: { id: 2, nombre: 'C-COMPRA' }, nroDocSustentatorio: 'O.C. 0325-2020', fecha: new Date('2020-01-03'), totalBienes: 23 },
    { id: 1, adquisicion: { id: 3, nombre: 'NEA - NOTA DE ENTRADA A ALMACEN' }, nroDocSustentatorio: 'R.D. 0456-2020', fecha: new Date('2020-01-04'), totalBienes: 16 },
    { id: 1, adquisicion: { id: 4, nombre: 'NEA - NOTA DE ENTRADA A ALMACEN' }, nroDocSustentatorio: 'R.D. 0543-2020', fecha: new Date('2020-01-05'), totalBienes: 13 },
    { id: 1, adquisicion: { id: 5, nombre: 'C-COMPRA' }, nroDocSustentatorio: 'O.C. 0678-2020', fecha: new Date('2020-01-25'), totalBienes: 40 },
    { id: 1, adquisicion: { id: 6, nombre: 'NEA - NOTA DE ENTRADA A ALMACEN' }, nroDocSustentatorio: 'R.D. 0699-2020', fecha: new Date('2020-01-02'), totalBienes: 11 },
    { id: 1, adquisicion: { id: 7, nombre: 'NEA - NOTA DE ENTRADA A ALMACEN' }, nroDocSustentatorio: 'R.D. 0793-2020', fecha: new Date('2020-01-04'), totalBienes: 13 },
    { id: 1, adquisicion: { id: 9, nombre: 'NEA - NOTA DE ENTRADA A ALMACEN' }, nroDocSustentatorio: 'R.D. 1223-2020', fecha: new Date('2020-01-12'), totalBienes: 17 },
];

export const _listaGrupo: Grupo[] = [
    { idCodigo: 1, cidCodigo: '74', cidNombre: 'OFICINA' },
    { idCodigo: 2, cidCodigo: '81', cidNombre: 'RECREACION Y DEPORTE' },
    { idCodigo: 3, cidCodigo: '88', cidNombre: 'SEGURIDAD INDUSTRIAL' },
    { idCodigo: 4, cidCodigo: '95', cidNombre: 'TELECOMUNICACIONES' },
];

export const _listaClase: Clase[] = [
    { idCodigo: 1, cidCodigo: '08', cidNombre: 'COMPUTO' },
    { idCodigo: 2, cidCodigo: '22', cidNombre: 'EQUIPO' },
    { idCodigo: 3, cidCodigo: '29', cidNombre: 'FERROCARRIL' },
    { idCodigo: 4, cidCodigo: '36', cidNombre: 'MAQUINARIA PESADA' },
    { idCodigo: 5, cidCodigo: '50', cidNombre: 'MAQUINA' },
    { idCodigo: 6, cidCodigo: '64', cidNombre: 'MOBILIARIO' },
];

export const _listaDenominacion: Denominacion[] = [
    { idCodigo: 1, cidCodigoGrupo: '74', cidNombreGrupo: 'OFICINA', cidCodigoClase: '08', cidNombreClase: 'COMPUTO', cidCodigo: '74089992', cidNombre: 'VIDEO CAMARA PARA COMPUTADORA' },
    { idCodigo: 2, cidCodigoGrupo: '74', cidNombreGrupo: 'OFICINA', cidCodigoClase: '08', cidNombreClase: 'COMPUTO', cidCodigo: '74086800', cidNombre: 'LECTORA DE DISCO COMPACTO EXTERNO COMPUTO - CD ROM' },
    { idCodigo: 3, cidCodigoGrupo: '74', cidNombreGrupo: 'OFICINA', cidCodigoClase: '08', cidNombreClase: 'COMPUTO', cidCodigo: '74080950', cidNombre: 'COMPUTADORA SERVIDOR - MAIN FRAME' },
    { idCodigo: 4, cidCodigoGrupo: '74', cidNombreGrupo: 'OFICINA', cidCodigoClase: '08', cidNombreClase: 'COMPUTO', cidCodigo: '74080500', cidNombre: 'COMPUTADORA PERSONAL PORTATIL' },
    { idCodigo: 5, cidCodigoGrupo: '74', cidNombreGrupo: 'OFICINA', cidCodigoClase: '08', cidNombreClase: 'COMPUTO', cidCodigo: '74080275', cidNombre: 'COMPUTADORA DE MANO - WORKPAD' },
];

export const _listaMarca: Marca[] = [
    { idCodigo: 1, cidCodigo: '', cidNombre: 'HP' },
    { idCodigo: 2, cidCodigo: '', cidNombre: 'SAMSUNG' },
    { idCodigo: 3, cidCodigo: '', cidNombre: 'ASUS' },
    { idCodigo: 4, cidCodigo: '', cidNombre: 'LENOVO' },
    { idCodigo: 5, cidCodigo: '', cidNombre: 'DELL' },
    { idCodigo: 6, cidCodigo: '', cidNombre: 'TOSHIBA' },
    { idCodigo: 7, cidCodigo: '', cidNombre: 'HAUWEI' },
];

export const _listaColor: Color[] = [
    { idCodigo: 1, cidNombre: 'ROJO' },
    { idCodigo: 2, cidNombre: 'AZUL' },
    { idCodigo: 3, cidNombre: 'MORADO' },
    { idCodigo: 4, cidNombre: 'CELESTE' },
    { idCodigo: 5, cidNombre: 'VERDE' },
    { idCodigo: 6, cidNombre: 'AMARILLO' },
    { idCodigo: 7, cidNombre: 'NEGRO' },
    { idCodigo: 8, cidNombre: 'MARRON' },
    { idCodigo: 9, cidNombre: 'NARANJA' },
];

export const _listaModelo: Modelo[] = [
    { idCodigo: 1, cidCodigo: '', cidNombre: 'RC420' },
    { idCodigo: 2, cidCodigo: '', cidNombre: 'AC245' },
    { idCodigo: 3, cidCodigo: '', cidNombre: 'L234' },
    { idCodigo: 4, cidCodigo: '', cidNombre: 'L4634' },
    { idCodigo: 5, cidCodigo: '', cidNombre: 'B122' },
    { idCodigo: 6, cidCodigo: '', cidNombre: 'T545' },
    { idCodigo: 7, cidCodigo: '', cidNombre: 'H7643' },
];

export const _departamentos: any[] = [
    { id: 5, nombre: 'AYACUCHO' },
    { id: 15, nombre: 'LIMA' },
];
export const _provincias: any[] = [
    { id: 43, nombre: 'HUAMANGA', idDepartamento: 5 },
    { id: 46, nombre: 'HUANTA', idDepartamento: 5 },
    { id: 128, nombre: 'LIMA', idDepartamento: 15 },
    { id: 129, nombre: 'BARRANCA', idDepartamento: 15 },
];
export const _distritos: any[] = [
    { id: 441, nombre: 'ACOCRO', numUbigeo: '050102', idProvincia: 43 },
    { id: 442, nombre: 'ACOS VINCHOS', numUbigeo: '050103', idProvincia: 43 },
    { id: 467, nombre: 'HUAMANGUILLA', numUbigeo: '050403', idProvincia: 46 },
    { id: 472, nombre: 'LLOCHEGUA', numUbigeo: '050408', idProvincia: 46 },

    { id: 1251, nombre: 'LIMA', numUbigeo: '150101', idProvincia: 128 },
    { id: 1252, nombre: 'ANCON', numUbigeo: '150102', idProvincia: 128 },
    { id: 1293, nombre: 'BARRANCA', numUbigeo: '150201', idProvincia: 129 },
    { id: 1294, nombre: 'PARAMONGA', numUbigeo: '150202', idProvincia: 129 },
];
export const _centrosPoblado: any[] = [
    { id: 1639, nombre: 'CARHUASCHOQUE', idDistrito: 441 },
    { id: 1573, nombre: 'CAPILLAPATA', idDistrito: 442 },
    { id: 8, nombre: '24 DE JUNIO', idDistrito: 467 },
];

export const _estadosBien: any[] = [
    { id: 1, nombre: 'BUENO' },
    { id: 2, nombre: 'REGULAR' },
    { id: 3, nombre: 'MALO' },
];

export const _bienesSobrantes: BienSobrante[] = [
    { id: 0, estado: { id: 1, nombre: 'BUENO' }, unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' }, tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 }, codigo: '00001', denominacion: { idCodigo: null, cidCodigo: null, cidNombre: 'LAPTOP', cidCodigoGrupo: null, cidNombreGrupo: null, cidCodigoClase: null, cidNombreClase: null }, marca: { idCodigo: null, cidCodigo: null, cidNombre: 'HP' }, modelo: { idCodigo: null, cidCodigo: null, cidNombre: '' }, color: [{ idCodigo: 0, cidNombre: '' }], cidSerie: '5CG3290XQ1', txtMedida: '', anio: '', placa: '', chasis: '', motor: '', txtCaracteristica: 'PROCESADOR INTEL CORE I5, PNTALLA 14, 4GB MEMORIA RAM, DISCO DURO DE 640GB CON SOFTWARE', fechaRegistro: new Date('2015-10-17'), txtObservacion: '', coloresTabla: [], unidadesTabla: [], tambosTabla: [] },
    { id: 1, estado: { id: 1, nombre: 'BUENO' }, unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' }, tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 }, codigo: '00002', denominacion: { idCodigo: null, cidCodigo: null, cidNombre: 'LAPTOP', cidCodigoGrupo: null, cidNombreGrupo: null, cidCodigoClase: null, cidNombreClase: null }, marca: { idCodigo: null, cidCodigo: null, cidNombre: 'HP' }, modelo: { idCodigo: null, cidCodigo: null, cidNombre: '' }, color: [{ idCodigo: 0, cidNombre: '' }], cidSerie: '5G32910KM', txtMedida: '', anio: '', placa: '', chasis: '', motor: '', txtCaracteristica: 'PROCESADOR INTEL CORE I5, PNTALLA 14, 4GB MEMORIA RAM, DISCO DURO DE 640GB CON SOFTWARE', fechaRegistro: new Date('2015-10-17'), txtObservacion: '', coloresTabla: [], unidadesTabla: [], tambosTabla: [] },
    { id: 2, estado: { id: 1, nombre: 'BUENO' }, unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' }, tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 }, codigo: '00003', denominacion: { idCodigo: null, cidCodigo: null, cidNombre: 'IMPRESORA WIFI', cidCodigoGrupo: null, cidNombreGrupo: null, cidCodigoClase: null, cidNombreClase: null }, marca: { idCodigo: null, cidCodigo: null, cidNombre: 'SAMSUNG' }, modelo: { idCodigo: null, cidCodigo: null, cidNombre: '' }, color: [{ idCodigo: 0, cidNombre: '' }], cidSerie: '0739B8GFCC001F', txtMedida: '', anio: '', placa: '', chasis: '', motor: '', txtCaracteristica: 'LASER MONOCROMATICA, MEMORIA 128MB', fechaRegistro: new Date('2015-10-17'), txtObservacion: '', coloresTabla: [], unidadesTabla: [], tambosTabla: [] },
    { id: 3, estado: { id: 1, nombre: 'BUENO' }, unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' }, tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 }, codigo: '00004', denominacion: { idCodigo: null, cidCodigo: null, cidNombre: 'CAMARA WEB', cidCodigoGrupo: null, cidNombreGrupo: null, cidCodigoClase: null, cidNombreClase: null }, marca: { idCodigo: null, cidCodigo: null, cidNombre: 'HALION' }, modelo: { idCodigo: null, cidCodigo: null, cidNombre: 'HA391' }, color: [{ idCodigo: 0, cidNombre: '' }], cidSerie: '', txtMedida: '', anio: '', placa: '', chasis: '', motor: '', txtCaracteristica: '30FPS VELOCIDAD DE CAPTURA MICROFONO INCORPORADO', fechaRegistro: new Date('2015-10-17'), txtObservacion: '', coloresTabla: [], unidadesTabla: [], tambosTabla: [] },
];
export const _estadoBienPatrimonio: any[] = [
    { id: 1, nombre: 'ACTIVOS' },
    { id: 2, nombre: 'BAJADOS' }
];

export const _bienesPatrimoniales: BienPatrimonio[] = [
    {
        id: 0,
        estado: { id: 1, nombre: 'BUENO' },
        cuenta: { id: 1, codigo: '1503', nombre: 'VEHICULO, MAQUINARIAS Y OTROS' },
        fechaContabilidad: new Date('2020-01-24'),
        centroPoblado: { id: 1, nombre: 'ARWIMAYO' },
        distrito: { id: 1, nombre: 'ANCO' },
        provincia: { id: 1, nombre: 'LA MAR' },
        departamento: { id: 1, nombre: 'AYACUCHO' },
        unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' },
        tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 },
        codPatrimonio: '740805000483',
        denominacion: _listaDenominacion[0],
        marca: { id: 1, nombre: 'HP' },
        modelo: { id: 1, nombre: 'NO DEFINIDO' },
        color: [],
        cidSerie: '5CG3290XQ1',
        txtMedida: '',
        anio: '',
        placa: '',
        chasis: '',
        motor: '',
        txtCaracteristica: 'PROCESADOR INTEL CORE I5, PNTALLA 14, 4GB MEMORIA RAM, DISCO DURO DE 640GB CON SOFTWARE',
        fechaRegistro: new Date('2015-10-17'),
        nroDocAdquisicion: '',
        valorAdquisicion: 0.00,
        txtObservacion: '',
        coloresTabla: [],
        tambosTabla: [],
        unidadesTabla: [],
        cuentasTabla: [],
    },
    {
        id: 1,
        estado: { id: 1, nombre: 'BUENO' },
        cuenta: { id: 1, codigo: '1503.01', nombre: 'VEHICULOS' },
        fechaContabilidad: new Date('2020-01-24'),
        centroPoblado: { id: 1, nombre: 'ARWIMAYO' },
        distrito: { id: 1, nombre: 'ANCO' },
        provincia: { id: 1, nombre: 'LA MAR' },
        departamento: { id: 1, nombre: 'AYACUCHO' },
        unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' },
        tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 },
        codPatrimonio: '740805000484',
        denominacion: _listaDenominacion[1],
        marca: { id: 1, nombre: 'HP' },
        modelo: { id: 1, nombre: 'NO DEFINIDO' },
        color: [],
        cidSerie: '5G32910KM',
        txtMedida: '',
        anio: '',
        placa: '',
        chasis: '',
        motor: '',
        txtCaracteristica: 'PROCESADOR INTEL CORE I5, PNTALLA 14, 4GB MEMORIA RAM, DISCO DURO DE 640GB CON SOFTWARE',
        fechaRegistro: new Date('2015-10-17'),
        nroDocAdquisicion: '',
        valorAdquisicion: 0.00,
        txtObservacion: '',
        coloresTabla: [],
        tambosTabla: [],
        unidadesTabla: [],
        cuentasTabla: [],
    },
    {
        id: 2,
        estado: { id: 1, nombre: 'BUENO' },
        cuenta: { id: 2, codigo: '1503.0101', nombre: 'PARA TRANSPORTE TERRESTRE' },
        fechaContabilidad: new Date('2020-01-24'),
        centroPoblado: { id: 1, nombre: 'ARWIMAYO' },
        distrito: { id: 1, nombre: 'ANCO' },
        provincia: { id: 1, nombre: 'LA MAR' },
        departamento: { id: 1, nombre: 'AYACUCHO' },
        unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' },
        tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 },
        codPatrimonio: '746461240263',
        denominacion: _listaDenominacion[2],
        marca: { id: 2, nombre: 'SAMSUNG' },
        modelo: { id: 1, nombre: 'NO DEFINIDO' },
        color: [],
        cidSerie: '0739B8GFCC001F',
        txtMedida: '',
        anio: '',
        placa: '',
        chasis: '',
        motor: '',
        txtCaracteristica: 'LASER MONOCROMATICA, MEMORIA 128MB',
        fechaRegistro: new Date('2015-10-17'),
        nroDocAdquisicion: '',
        valorAdquisicion: 0.00,
        txtObservacion: '',
        coloresTabla: [],
        tambosTabla: [],
        unidadesTabla: [],
        cuentasTabla: [],
    },
    {
        id: 3,
        estado: { id: 1, nombre: 'BUENO' },
        cuenta: { id: 2, codigo: '9105', nombre: 'BIENES EN PRESTAMO, CUSTODIA Y NO DEPRECIABLES' },
        fechaContabilidad: new Date('2020-01-24'),
        centroPoblado: { id: 1, nombre: 'ARWIMAYO' },
        distrito: { id: 1, nombre: 'ANCO' },
        provincia: { id: 1, nombre: 'LA MAR' },
        departamento: { id: 1, nombre: 'AYACUCHO' },
        unidad: { id: 1, nombre: 'U.T. AYACUCHO NORTE' },
        tambo: { id: 1, nombre: 'ANCARPATA', idUnidad: 1 },
        codPatrimonio: '746461240264',
        denominacion: _listaDenominacion[4],
        marca: { id: 3, nombre: 'HALION' },
        modelo: { id: 2, nombre: 'HA391' },
        color: [],
        cidSerie: '',
        txtMedida: '',
        anio: '',
        placa: '',
        chasis: '',
        motor: '',
        txtCaracteristica: '30FPS VELOCIDAD DE CAPTURA MICROFONO INCORPORADO',
        fechaRegistro: new Date('2015-10-17'),
        nroDocAdquisicion: '',
        valorAdquisicion: 0.00,
        txtObservacion: '',
        coloresTabla: [],
        tambosTabla: [],
        unidadesTabla: [],
        cuentasTabla: [],
    },
];

export const _estadosBaja: any[] = [
    { id: 1, nombre: 'REGISTRADO' },
    { id: 2, nombre: 'CON DISPOSICION FINAL' },
];

export const _fomarDisposicionFinal: any[] = [
    { id: 1, nombre: 'VENTA POR SUBASTA PUBLICA' },
    { id: 2, nombre: 'DESTRUCCION' },
    { id: 3, nombre: 'DONACION' },
    { id: 4, nombre: 'DONACION DE BIENES CALIFICADOS COMO RAEE' },
    { id: 5, nombre: 'TRANSFERENCIA EN RETRIBUCION DE SERVICIOS' },
    { id: 6, nombre: 'TRANSFERENCIA POR DACION DE PAGO' },
];

export const _listaBajas: Baja[] = [
    { id: 1, disposicionFinal: { id: 1, nombre: 'VENTA POR SUBASTA PUBLICA' }, nroDocSustentatorio: '0223-2020', fecha: new Date('2020-12-02'), totalBienes: 10, estado: { id: 1, nombre: 'REGISTRADO' } },
    { id: 1, disposicionFinal: { id: 2, nombre: 'DESTRUCCION' }, nroDocSustentatorio: '0325-2020', fecha: new Date('2020-01-03'), totalBienes: 23, estado: { id: 2, nombre: 'CON DISPOSICION FINAL' } },
    { id: 1, disposicionFinal: { id: 3, nombre: 'DONACION' }, nroDocSustentatorio: '0456-2020', fecha: new Date('2020-01-04'), totalBienes: 16, estado: { id: 2, nombre: 'CON DISPOSICION FINAL' } },
    { id: 1, disposicionFinal: { id: 4, nombre: 'DONACION DE BIENES CALIFICADOS COMO RAEE' }, nroDocSustentatorio: '0543-2020', fecha: new Date('2020-01-05'), totalBienes: 13, estado: { id: 2, nombre: 'CON DISPOSICION FINAL' } },
    { id: 1, disposicionFinal: { id: 5, nombre: 'TRANSFERENCIA EN RETRIBUCION DE SERVICIOS' }, nroDocSustentatorio: '0678-2020', fecha: new Date('2020-01-25'), totalBienes: 40, estado: { id: 2, nombre: 'CON DISPOSICION FINAL' } },
    { id: 1, disposicionFinal: { id: 6, nombre: 'TRANSFERENCIA POR DACION DE PAGO' }, nroDocSustentatorio: '0699-2019', fecha: new Date('2019-01-02'), totalBienes: 11, estado: { id: 2, nombre: 'CON DISPOSICION FINAL' } },
];

export const _estadosFichaAsignacion: any[] = [
    { idCodigo: 1, cidNombre: 'CONF. COORD. PATRIMONIO' },
    { idCodigo: 2, cidNombre: 'CONF. JEFE UNIDAD' },
    { idCodigo: 3, cidNombre: 'CONF. USUARIO' },
    { idCodigo: 4, cidNombre: 'CONF. ASIST. PATRIMONIO' },
    { idCodigo: 5, cidNombre: 'FINALIZADO' },
];

export const _fichasAsignacion: FichaAsignacion[] = [
    { id: 1, cidCodigo: '0007', fecInicio: new Date('2020/02/12'), fidEmpleado: 1, nomEmpleado: 'NESTOR FRANCISCO', apeEmpleado: 'ARELLANO UBILLUS', cargoEmpleado: 'JEFE', dniEmpleado: '02816792', modContratoEmpleado: 'CAS', local: 'UNIDAD TERRITORIAL JUNIN', idDependencia: 4, nomDependencia: 'UNIDAD TERRITORIAL JUNIN', idArea: 0, nomArea: 'ADMINISTRATIVA', cantBienes: 8, idEstadoFicha: 1, nomEstadoFicha: 'CONF. COORD. PATRIMONIO', listaBienes: _bienesPatrimoniales, flgConfCoordPatrimonio: false, flgConfJefeUnidad: false, flgConfUsuario: false, flgConfAsistPatrimonio: false, flgFinalizado: false },
    { id: 2, cidCodigo: '0008', fecInicio: new Date('2020/01/10'), fidEmpleado: 2, nomEmpleado: 'ANGELA', apeEmpleado: 'SOLIS LLALLICO', cargoEmpleado: 'COMUNICADORA', dniEmpleado: '28355433', modContratoEmpleado: 'CAS', local: 'SEDE CENTRAL', idDependencia: 3, nomDependencia: 'UNIDAD DE COMUNICACION E IMAGEN', idArea: 0, nomArea: 'ADMINISTRATIVA', cantBienes: 9, idEstadoFicha: 2, nomEstadoFicha: 'CONF. JEFE UNIDAD', listaBienes: _bienesPatrimoniales, flgConfCoordPatrimonio: false, flgConfJefeUnidad: false, flgConfUsuario: false, flgConfAsistPatrimonio: false, flgFinalizado: false },
    { id: 3, cidCodigo: '0027', fecInicio: new Date('2019/12/07'), fidEmpleado: 3, nomEmpleado: 'YSSAC LEONARDO', apeEmpleado: 'SONCCO SILVA', cargoEmpleado: 'JEFE', dniEmpleado: '80072946', modContratoEmpleado: 'CAS', local: 'UNIDAD TERRITORIAL PUNO', idDependencia: 6, nomDependencia: 'UNIDAD TERRITORIAL PUNO', idArea: 0, nomArea: 'ADMINISTRATIVA', cantBienes: 1, idEstadoFicha: 3, nomEstadoFicha: 'CONF. USUARIO', listaBienes: _bienesPatrimoniales, flgConfCoordPatrimonio: false, flgConfJefeUnidad: false, flgConfUsuario: false, flgConfAsistPatrimonio: false, flgFinalizado: false },
    { id: 4, cidCodigo: '0035', fecInicio: new Date('2019/11/15'), fidEmpleado: 4, nomEmpleado: 'NICOLAS', apeEmpleado: 'MOLINA MADUEÑO', cargoEmpleado: 'GESTOR INSTITUCIONAL', dniEmpleado: '24579041', modContratoEmpleado: 'CAS', local: 'TAMBO QONCQONAN', idDependencia: 7, nomDependencia: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idArea: 9, nomArea: 'TAMBO QONCQONAN', cantBienes: 5, idEstadoFicha: 4, nomEstadoFicha: 'CONF. ASIST. PATRIMONIO', listaBienes: _bienesPatrimoniales, flgConfCoordPatrimonio: false, flgConfJefeUnidad: false, flgConfUsuario: false, flgConfAsistPatrimonio: false, flgFinalizado: false },
    { id: 5, cidCodigo: '0047', fecInicio: new Date('2019/10/12'), fidEmpleado: 5, nomEmpleado: 'HERIBERTO DIMAS', apeEmpleado: 'QUISPE MEDRANO', cargoEmpleado: 'JEFE', dniEmpleado: '07386971', modContratoEmpleado: 'CAS', local: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idDependencia: 7, nomDependencia: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIO', idArea: 0, nomArea: 'ADMINISTRATIVA', cantBienes: 4, idEstadoFicha: 5, nomEstadoFicha: 'FINALIZADO', listaBienes: _bienesPatrimoniales, flgConfCoordPatrimonio: false, flgConfJefeUnidad: false, flgConfUsuario: false, flgConfAsistPatrimonio: false, flgFinalizado: false },
    { id: 6, cidCodigo: '0347', fecInicio: new Date('2019/09/09'), fidEmpleado: 6, nomEmpleado: 'ANGEL', apeEmpleado: 'COLLANTES CAPCHA', cargoEmpleado: 'ENCARGADO DE TRANSPORTES', dniEmpleado: '08343117', modContratoEmpleado: 'LS', local: 'SEDE CENTRAL', idDependencia: 1, nomDependencia: 'UNIDAD DE ADMINISTRACION', idArea: 2, nomArea: 'COORD. DE ABASTECIMIENTO', cantBienes: 2, idEstadoFicha: 5, nomEstadoFicha: 'FINALIZADO', listaBienes: _bienesPatrimoniales, flgConfCoordPatrimonio: false, flgConfJefeUnidad: false, flgConfUsuario: false, flgConfAsistPatrimonio: false, flgFinalizado: false },
    { id: 7, cidCodigo: '0022', fecInicio: new Date('2019/08/13'), fidEmpleado: 7, nomEmpleado: 'NERIO', apeEmpleado: 'BAEZ DELGADO', cargoEmpleado: 'ANALISTA PROGRAMADOR', dniEmpleado: '47887880', modContratoEmpleado: 'LS', local: 'SEDE CENTRAL', idDependencia: 2, nomDependencia: 'UNIDAD DE TECNOLOGIAS DE INFORMACION', idArea: 0, nomArea: 'ADMINISTRATIVA', cantBienes: 2, idEstadoFicha: 5, nomEstadoFicha: 'FINALIZADO', listaBienes: _bienesPatrimoniales, flgConfCoordPatrimonio: false, flgConfJefeUnidad: false, flgConfUsuario: false, flgConfAsistPatrimonio: false, flgFinalizado: false },
];

export const _fichasSldaRtno: FichaSldaRtno[] = [
    { id: 1, cidCodigo: '0007', fecha: new Date('2020/02/12'), fidUsuarioRpble: 1, nomUsuarioRpble: 'NESTOR FRANCISCO ARELLANO UBILLUS', cargoUsuarioRpble: 'JEFE', fidDependencia: 4, nomDependencia: 'UNIDAD TERRITORIAL JUNIN', idDependenciaSol: 4, nomDependenciaSol: 'UNIDAD TERRITORIAL DE JUNIN', idAreaSol: 0, nomAreaSol: 'ADMINISTRATIVA', dirDependencia: '', telDependencia: '', nomRespTraslado: '', idMotivoSalida: 1, nomMotivoSalida: 'MANTENIMIENTO/ EVALUACION', docReferencia: '', cantBienes: 8 },
    { id: 2, cidCodigo: '0008', fecha: new Date('2020/01/10'), fidUsuarioRpble: 2, nomUsuarioRpble: 'ANGELA SOLIS LLALLICO', cargoUsuarioRpble: 'COMUNICADORA', fidDependencia: 2, nomDependencia: 'UNIDAD DE COMUNICACION EN IMAGEN', idDependenciaSol: 3, nomDependenciaSol: 'UNIDAD DE COMUNICACION E IMAGEN', idAreaSol: 0, nomAreaSol: 'ADMINISTRATIVA', dirDependencia: 'Jr. CUSCO 177', telDependencia: '', nomRespTraslado: '', idMotivoSalida: 2, nomMotivoSalida: 'COMISION DE SERVICIO', docReferencia: '', cantBienes: 3 },
    { id: 3, cidCodigo: '0027', fecha: new Date('2019/12/07'), fidUsuarioRpble: 3, nomUsuarioRpble: 'YSSAC LEONARDO SONCCO SILVA', cargoUsuarioRpble: 'JEFE', fidDependencia: 6, nomDependencia: 'UNIDAD TERRITORIAL DE PUNO', idDependenciaSol: 6, nomDependenciaSol: 'UNIDAD TERRITORIAL DE PUNO', idAreaSol: 8, nomAreaSol: 'TAMBO AYMAÑA', dirDependencia: '', telDependencia: '', nomRespTraslado: '', idMotivoSalida: 3, nomMotivoSalida: 'REPARACION EN GARANTIA', docReferencia: '', cantBienes: 1 },
    { id: 4, cidCodigo: '0035', fecha: new Date('2019/11/15'), fidUsuarioRpble: 4, nomUsuarioRpble: 'NICOLAS MOLINA MADUEÑO', cargoUsuarioRpble: 'GESTOR INSTITUCIONAL', fidDependencia: 7, nomDependencia: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idDependenciaSol: 7, nomDependenciaSol: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idAreaSol: 0, nomAreaSol: 'ADMINISTRATIVA', dirDependencia: '', telDependencia: '', nomRespTraslado: '', idMotivoSalida: 4, nomMotivoSalida: 'REASIGNACION', docReferencia: '', cantBienes: 5 },
    { id: 5, cidCodigo: '0047', fecha: new Date('2019/10/12'), fidUsuarioRpble: 5, nomUsuarioRpble: 'HERIBERTO DIMAS QUISPE MEDRANO', cargoUsuarioRpble: 'JEFE', fidDependencia: 5, nomDependencia: 'UNIDAD TERRITORIAL DE AYACUCHO NORTE', idDependenciaSol: 5, nomDependenciaSol: 'UNIDAD TERRITORIAL DE AYACUCHO NORTE', idAreaSol: 5, nomAreaSol: 'TAMBO ANCARPATA', dirDependencia: '', telDependencia: '', nomRespTraslado: '', idMotivoSalida: 5, nomMotivoSalida: 'TRANSFERENCIA', docReferencia: '', cantBienes: 4 },
    { id: 6, cidCodigo: '0347', fecha: new Date('2019/09/09'), fidUsuarioRpble: 6, nomUsuarioRpble: 'ANGEL COLLANTES CAPCHA', cargoUsuarioRpble: 'ENCARGADO DE TRANSPORTES', fidDependencia: 0, nomDependencia: 'MULTISERVICIOS M&C EIRL', idDependenciaSol: 1, nomDependenciaSol: 'UNIDAD DE ADMINISTRACION', idAreaSol: 2, nomAreaSol: 'COORDINACION DE ABASTECIMIENTO', dirDependencia: 'AV. CANADA 1220', telDependencia: '', nomRespTraslado: '', idMotivoSalida: 6, nomMotivoSalida: 'PRESTAMO', docReferencia: '', cantBienes: 2 },
    { id: 7, cidCodigo: '0022', fecha: new Date('2019/08/13'), fidUsuarioRpble: 7, nomUsuarioRpble: 'NERIO BAEZ DELGADO', cargoUsuarioRpble: 'ANALISTA PROGRAMADOR', fidDependencia: 0, nomDependencia: 'MULTISERVICIOS COMPUTRONIC SAC', idDependenciaSol: 2, nomDependenciaSol: 'UNIDAD DE TECNOLOGIAS DE INFORMACION', idAreaSol: 0, nomAreaSol: 'ADMINISTRATIVA', dirDependencia: 'Jr. CUSCO 177', telDependencia: '', nomRespTraslado: '', idMotivoSalida: 7, nomMotivoSalida: 'OTROS', docReferencia: '', cantBienes: 2 },
];

export const _fichasIngSldaBT: FichaIngSldaBT[] = [
    { id: 1, cidCodigo: '0007', fecha: new Date('2020/02/12'), fidUsuario: 1, nomUsuario: 'NESTOR FRANCISCO ARELLANO UBILLUS', idDependenciaIng: 4, nomDependenciaIng: 'UNIDAD TERRITORIAL DE JUNIN', idAreaIng: 0, nomAreaIng: 'ADMINISTRATIVA', fidDependencia: 4, nomDependencia: 'UNIDAD TERRITORIAL JUNIN', idPersona: 1, nomPersona: 'NESTOR FRANCISCO ARELLANO UBILLUS', idTipoDocumento: 1, nomTipoDocumento: 'DNI', nroDocumento: '02816792', telPersona: '929171654', idDependenciaPert: 4, nomDependenciaPert: 'UNIDAD TERRITORIAL DE JUNIN', idAreaPert: 0, nomAreaPert: 'ADMINISTRATIVA', fididMotivoIngBT: 1, nomMotivoIngBT: 'PRESTAMO', docReferencia: '', cantBienes: 8 },
    { id: 2, cidCodigo: '0008', fecha: new Date('2020/01/10'), fidUsuario: 2, nomUsuario: 'ANGELA SOLIS LLALLICO', idDependenciaIng: 3, nomDependenciaIng: 'UNIDAD DE COMUNICACION E IMAGEN', idAreaIng: 0, nomAreaIng: 'ADMINISTRATIVA', fidDependencia: 2, nomDependencia: 'UNIDAD DE COMUNICACION EN IMAGEN', idPersona: 2, nomPersona: 'ANGELA SOLIS LLALLICO', idTipoDocumento: 1, nomTipoDocumento: 'DNI', nroDocumento: '28355433', telPersona: '956565845', idDependenciaPert: 3, nomDependenciaPert: 'UNIDAD DE COMUNICACION E IMAGEN', idAreaPert: 0, nomAreaPert: 'ADMINISTRATIVA', fididMotivoIngBT: 2, nomMotivoIngBT: 'ALQUILER', docReferencia: '', cantBienes: 3 },
    { id: 3, cidCodigo: '0027', fecha: new Date('2019/12/07'), fidUsuario: 3, nomUsuario: 'YSSAC LEONARDO SONCCO SILVA', idDependenciaIng: 6, nomDependenciaIng: 'UNIDAD TERRITORIAL DE PUNO', idAreaIng: 8, nomAreaIng: 'TAMBO AYMAÑA', fidDependencia: 6, nomDependencia: 'UNIDAD TERRITORIAL DE PUNO', idPersona: 3, nomPersona: 'YSSAC LEONARDO SONCCO SILVA', idTipoDocumento: 1, nomTipoDocumento: 'DNI', nroDocumento: '80072946', telPersona: '987855225', idDependenciaPert: 6, nomDependenciaPert: 'UNIDAD TERRITORIAL DE PUNO', idAreaPert: 8, nomAreaPert: 'TAMBO AYMAÑA', fididMotivoIngBT: 3, nomMotivoIngBT: 'DEMOSTRACION', docReferencia: '', cantBienes: 1 },
    { id: 4, cidCodigo: '0035', fecha: new Date('2019/11/15'), fidUsuario: 4, nomUsuario: 'NICOLAS MOLINA MADUEÑO', idDependenciaIng: 7, nomDependenciaIng: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idAreaIng: 0, nomAreaIng: 'ADMINISTRATIVA', fidDependencia: 7, nomDependencia: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idPersona: 4, nomPersona: 'NICOLAS MOLINA MADUEÑO', idTipoDocumento: 1, nomTipoDocumento: 'DNI', nroDocumento: '24579041', telPersona: '966565658', idDependenciaPert: 7, nomDependenciaPert: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idAreaPert: 0, nomAreaPert: 'ADMINISTRATIVA', fididMotivoIngBT: 4, nomMotivoIngBT: 'OTROS', docReferencia: '', cantBienes: 5 },
    { id: 5, cidCodigo: '0047', fecha: new Date('2019/10/12'), fidUsuario: 5, nomUsuario: 'HERIBERTO DIMAS QUISPE MEDRANO', idDependenciaIng: 5, nomDependenciaIng: 'UNIDAD TERRITORIAL DE AYACUCHO NORTE', idAreaIng: 5, nomAreaIng: 'TAMBO ANCARPATA', fidDependencia: 5, nomDependencia: 'UNIDAD TERRITORIAL DE AYACUCHO NORTE', idPersona: 5, nomPersona: 'HERIBERTO DIMAS QUISPE MEDRANO', idTipoDocumento: 1, nomTipoDocumento: 'DNI', nroDocumento: '07386971', telPersona: '966565458', idDependenciaPert: 5, nomDependenciaPert: 'UNIDAD TERRITORIAL DE AYACUCHO NORTE', idAreaPert: 5, nomAreaPert: 'TAMBO ANCARPATA', fididMotivoIngBT: 1, nomMotivoIngBT: 'PRESTAMO', docReferencia: '', cantBienes: 4 },
    { id: 6, cidCodigo: '0347', fecha: new Date('2019/09/09'), fidUsuario: 6, nomUsuario: 'ANGEL COLLANTES CAPCHA', idDependenciaIng: 1, nomDependenciaIng: 'UNIDAD DE ADMINISTRACION', idAreaIng: 2, nomAreaIng: 'COORDINACION DE ABASTECIMIENTO', fidDependencia: 0, nomDependencia: 'MULTISERVICIOS M&C EIRL', idPersona: 0, nomPersona: 'DANTE ALIGHIERI DEGLI', idTipoDocumento: 1, nomTipoDocumento: 'DNI', nroDocumento: '00000001', telPersona: '959595452', idDependenciaPert: 0, nomDependenciaPert: '', idAreaPert: 0, nomAreaPert: '', fididMotivoIngBT: 2, nomMotivoIngBT: 'ALQUILER', docReferencia: '', cantBienes: 2 },
    { id: 7, cidCodigo: '0022', fecha: new Date('2019/08/13'), fidUsuario: 7, nomUsuario: 'NERIO BAEZ DELGADO', idDependenciaIng: 2, nomDependenciaIng: 'UNIDAD DE TECNOLOGIAS DE INFORMACION', idAreaIng: 0, nomAreaIng: 'ADMINISTRATIVA', fidDependencia: 0, nomDependencia: 'MULTISERVICIOS COMPUTRONIC SAC', idPersona: 0, nomPersona: 'NERIO BAEZ DELGADO', idTipoDocumento: 1, nomTipoDocumento: 'DNI', nroDocumento: '47887880', telPersona: '989858582', idDependenciaPert: 0, nomDependenciaPert: '', idAreaPert: 0, nomAreaPert: '', fididMotivoIngBT: 3, nomMotivoIngBT: 'DEMOSTRACION', docReferencia: '', cantBienes: 2 },
];


export const _motivoIngBT: any[] = [
    { idCodigo: 1, cidNombre: 'PRESTAMO' },
    { idCodigo: 2, cidNombre: 'ALQUILER' },
    { idCodigo: 3, cidNombre: 'DEMOSTRACION' },
    { idCodigo: 4, cidNombre: 'OTROS' },
];

export const _actaEtrgRcpBienes: ActaEtrgRcpBienes[] = [
    { id: 1, cidCodigo: '0006', fecha: new Date('2020/02/12'), fidUsuarioEtg: 1, nomUsuarioEtg: 'YSSAC LEONARDO SONCCO SILVA', dniUsuarioEtg: '80072946', idDependenciaUsuarioEtg: 6, dependenciaUsuarioEtg: 'UNIDAD TERRITORIAL PUNO', idOficinaUsuarioEtg: 0, oficinaUsuarioEtg: 'OFICINA ADMINISTRATIVA', fidUsuarioRccion: 2, nomUsuarioRccion: 'NERIO BAEZ DELGADO', dniUsuarioRccion: '47887880', idDependenciaUsuarioRccion: 7, dependenciaUsuarioRccion: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idOficinaUsuarioRccion: 9, oficinaUsuarioRccion: 'TAMBO QONCQONAN', motivo: 'ASIGNACION DE MOTOCICLETA AL TAMBO QONCQONAN - DEBIDO A QUE NO CUENTA CON MOTOCICLETA YA QUE EN EL EXPEDIENTE TECNICO NO FUE CONSIDERADA LA ADQUISICION DE ESTA', cantBienes: 1 },
    { id: 2, cidCodigo: '0007', fecha: new Date('2020/02/12'), fidUsuarioEtg: 1, nomUsuarioEtg: 'NESTOR FRANCISCO ARELLANO UBILLUS', dniUsuarioEtg: '02816792', idDependenciaUsuarioEtg: 4, dependenciaUsuarioEtg: 'UNIDAD TERRITORIAL DE JUNIN', idOficinaUsuarioEtg: 0, oficinaUsuarioEtg: 'OFICINA ADMINISTRATIVA', fidUsuarioRccion: 2, nomUsuarioRccion: 'ANGELA SOLIS LLALLICO', dniUsuarioRccion: '28355433', idDependenciaUsuarioRccion: 3, dependenciaUsuarioRccion: 'UNIDAD DE COMUNICACION EN IMAGEN', idOficinaUsuarioRccion: 13, oficinaUsuarioRccion: 'OFICINA ADMINISTRATIVVA', motivo: 'REASIGNACION DE BIENES', cantBienes: 2 },
    { id: 3, cidCodigo: '0007', fecha: new Date('2020/02/12'), fidUsuarioEtg: 1, nomUsuarioEtg: 'NICOLAS MOLINA MADUEÑO', dniUsuarioEtg: '24579041', idDependenciaUsuarioEtg: 7, dependenciaUsuarioEtg: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idOficinaUsuarioEtg: 10, oficinaUsuarioEtg: 'TAMBO QUILLAHUATA', fidUsuarioRccion: 2, nomUsuarioRccion: 'HERIBERTO DIMAS QUISPE MEDRANO', dniUsuarioRccion: '07386971', idDependenciaUsuarioRccion: 7, dependenciaUsuarioRccion: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS', idOficinaUsuarioRccion: 0, oficinaUsuarioRccion: 'OFICINA ADMINISTRATIVVA', motivo: 'ENTREGA Y RECEPCCION DE BIENES PATRIMONIALES', cantBienes: 2 },
    { id: 4, cidCodigo: '0007', fecha: new Date('2020/02/12'), fidUsuarioEtg: 1, nomUsuarioEtg: 'ANGEL COLLANTES CAPCHA', dniUsuarioEtg: '08343117', idDependenciaUsuarioEtg: 1, dependenciaUsuarioEtg: 'UNIDAD DE ADMINISTRACION', idOficinaUsuarioEtg: 2, oficinaUsuarioEtg: 'COORDINACION DE ABASTECIMIENTO', fidUsuarioRccion: 2, nomUsuarioRccion: 'ANGELA SOLIS LLALLICO', dniUsuarioRccion: '28355433', idDependenciaUsuarioRccion: 3, dependenciaUsuarioRccion: 'UNIDAD DE COMUNICACION E IMAGEN', idOficinaUsuarioRccion: 13, oficinaUsuarioRccion: 'OFICINA ADMINISTRATIVVA', motivo: 'REASIGNACION DE BIENES', cantBienes: 1 },
];

export const _dependencias: any[] = [
    { idCodigo: 1, cidNombre: 'UNIDAD DE ADMINISTRACION' },
    { idCodigo: 2, cidNombre: 'UNIDAD DE TECNOLOGIAS DE LA INFORMACION' },
    { idCodigo: 3, cidNombre: 'UNIDAD DE COMUNICACION E IMAGEN' },
    { idCodigo: 4, cidNombre: 'UNIDAD TERRITORIAL DE JUNIN' },
    { idCodigo: 5, cidNombre: 'UNIDAD TERRITORIAL DE AYACUCHO NORTE' },
    { idCodigo: 6, cidNombre: 'UNIDAD TERRITORIAL PUNO' },
    { idCodigo: 7, cidNombre: 'UNIDAD TERRITORIAL CUSCO - MADRE DE DIOS' },
];

export const _areas: any[] = [
    { idCodigo: 1, cidNombre: 'COORD. DE CONTROL PATRIMONIAL', fidDependencia: 1, nomLocal: 'SEDE CENTRAL' },
    { idCodigo: 2, cidNombre: 'COORD. DE ABASTECIMIENTO', fidDependencia: 1, nomLocal: 'SEDE CENTRAL' },
    { idCodigo: 11, cidNombre: 'OFICINA ADMINISTRATIVA', fidDependencia: 2, nomLocal: 'SEDE CENTRAL' },
    { idCodigo: 13, cidNombre: 'OFICINA ADMINISTRATIVA', fidDependencia: 3, nomLocal: 'SEDE CENTRAL' },
    { idCodigo: 3, cidNombre: 'TAMBO POTACA', fidDependencia: 4, nomLocal: 'TAMBO POTACA' },
    { idCodigo: 4, cidNombre: 'TAMBO LAYAN PATA', fidDependencia: 4, nomLocal: 'TAMBO LAYAN PATA' },
    { idCodigo: 12, cidNombre: 'OFICINA ADMINISTRATIVA', fidDependencia: 4, nomLocal: 'OFICINA UNIDAD TERRITORIAL JUNIN' },
    { idCodigo: 5, cidNombre: 'TAMBO ANCARPATA', fidDependencia: 5, nomLocal: 'TAMBO ANCARPATA' },
    { idCodigo: 6, cidNombre: 'TAMBO POMAPUKIO', fidDependencia: 5, nomLocal: 'TAMBO POMAPUKIO' },
    { idCodigo: 7, cidNombre: 'TAMBO PEDRO VILCAPAZA MORORCO', fidDependencia: 6, nomLocal: 'TAMBO PEDRO VILCAPAZA MORORCO' },
    { idCodigo: 8, cidNombre: 'TAMBO AYMAÑA', fidDependencia: 6, nomLocal: 'TAMBO AYMAÑA' },
    { idCodigo: 9, cidNombre: 'TAMBO QONCQONAN', fidDependencia: 7, nomLocal: 'TAMBO QONCQONAN' },
    { idCodigo: 10, cidNombre: 'TAMBO QUILLAHUATA', fidDependencia: 7, nomLocal: 'TAMBO QUILLAHUATA' },
];