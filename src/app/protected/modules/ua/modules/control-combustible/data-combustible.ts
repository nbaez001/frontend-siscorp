import { Master } from './entities/master.model';
import { Perfil } from './entities/perfil.model';
import { Vehiculo } from './entities/vehiculo.model';
import { Kilometraje } from './entities/kilometraje.model';
import { Tambo } from './entities/tambo.model';
import { Unidad } from './entities/unidad.model';
import { AsignacionPresupuestal } from './entities/asignacion-presupuestal.model';
import { Adquisicion } from './entities/adquisicion.model';
import { Generador } from './entities/generador.model';
import { CuadroControl } from './entities/cuadro-control.model';
import { EjecucionPresupuestal } from './entities/ejecucion-presupuestal.model';
import { Deslizador } from './entities/deslizador.model';
import { HorasDeslizador } from './entities/horas-deslizador.model';
import { CuadroControlTambo } from './entities/cuadro-control-tambo.model';
import { ConsumoGenerador } from './entities/consumo-generador.model';
import { MantenimientoVehicular } from './entities/mantenimiento-vehiculo.model';
import { SolicitudMant } from './entities/solicitud-mant.model';
import { Banco } from './entities/config/banco.model';
import { Proveedor } from './entities/config/proveedor.model';
import { OrdenCompra } from './entities/config/orden-compra.model';
import { OrdenServicio } from './entities/config/orden-servicio.model';
import { FondoEncargo } from './entities/config/fondo-encargo.model';
import { RequerimientoBien } from './entities/requerimiento-bien.model';
import { DetalleSolicitudMant } from './entities/detalle-solicitud-mant.model';

export const _codGrupo =  '67';
export const _codClase =  '82';

export const UNIDADES: Unidad[] = [
    { id: 1, nombre: 'U.T. AYACUCHO NORTE' },
    { id: 2, nombre: 'U.T. CUSCO' },
    { id: 3, nombre: 'U.T. HUANCAVELICA' },
    { id: 20, nombre: 'U.T. LORETO' },
    { id: 21, nombre: 'U.T. UCAYALI' },
    { id: 22, nombre: 'U.T. SAN MARTIN' }
];

export const TAMBOS: Tambo[] = [
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

export const TIPOSVEHICULO: any[] = [
    { id: 1, codigo: '67825000', nombre: 'CAMIONETA' },
    { id: 2, codigo: '67826800', nombre: 'MOTOCICLETA' }
];

export const ESTADOVEHICULO: Master[] = [
    { id: 1, nombre: 'OPERATIVO' },
    { id: 2, nombre: 'NO OPERATIVO' },
    { id: 3, nombre: 'CON LIMITACIONES' }
];

export const TIPOSCOMBUSTIBLE: Master[] = [
    { id: 1, nombre: 'DIESEL B-5' },
    { id: 2, nombre: 'GASOHOL' }
];

export const PERFILES: Perfil[] = [
    { id: 1, nombre: "GESTOR INSTITUCIONAL", abreviacion: 'GP' },
    { id: 2, nombre: "JEFE UNIDAD TERRITORIAL", abreviacion: 'JUT' },
    { id: 3, nombre: "ENCARGADO DE TRANSPORTES", abreviacion: 'ET' }
];

export const VEHICULOS: Vehiculo[] = [
    { id: 1, codPatrimonio: '678250000001', idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 0, tambo: 'OFICINA DE UNIDAD TERRITORIAL', denominacion: 'CAMIONETA', marca: 'NISSAN', modelo: '', tipo: '', serie: '', placa: 'EGT-079', color: 'NEGRO', estado: 'R', idTipocombustible: 1, nomTipocombustible: 'DIESEL B-5', idEstado: 1, nomEstado: 'OPERATIVO', fechaMantenimiento: new Date('2019-10-10'), nombre: 'CAMIONETA NISSAN EGT-079' },
    { id: 2, codPatrimonio: '678268000001', idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 1, tambo: 'ANCARPATA', denominacion: 'MOTOCICLETA', marca: 'ZONGSHEN', modelo: 'XR150L', tipo: 'S/T', serie: 'LWBPCK101H1001038', placa: 'EA-9256', color: 'NEGRO', estado: 'R', idTipocombustible: 2, nomTipocombustible: 'GASOHOL', idEstado: 1, nomEstado: 'OPERATIVO', fechaMantenimiento: new Date('2019-10-10'), nombre: 'MOTOCICLETA ZONGSHEN EA-9256' },
    { id: 3, codPatrimonio: '678268000002', idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 2, tambo: 'BARRIO VISTA ALEGRE', denominacion: 'MOTOCICLETA', marca: 'ZONGSHEN', modelo: 'GL-125', tipo: 'LINEAL', serie: 'LALIA2593H3101468', placa: 'EA-9263', color: 'NEGRO', estado: 'R', idTipocombustible: 2, nomTipocombustible: 'GASOHOL', idEstado: 1, nomEstado: 'OPERATIVO', fechaMantenimiento: new Date('2019-10-10'), nombre: 'MOTOCICLETA ZONGSHEN EA-9263' },
    { id: 4, codPatrimonio: '678268000003', idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 3, tambo: 'CCERAOCRO', denominacion: 'MOTOCICLETA', marca: 'HONDA', modelo: 'XR150L', tipo: 'S/T', serie: 'LALJA2592J3100609', placa: 'EW-0715', color: 'NEGRO', estado: 'B', idTipocombustible: 2, nomTipocombustible: 'GASOHOL', idEstado: 1, nomEstado: 'OPERATIVO', fechaMantenimiento: new Date('2019-10-10'), nombre: 'MOTOCICLETA HONDA EW-0715' },
    { id: 5, codPatrimonio: '678268000004', idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 4, tambo: 'CHACHASPATA', denominacion: 'MOTOCICLETA', marca: 'HONDA', modelo: 'XR150L', tipo: 'S/T', serie: 'KD07E3002862', placa: 'EB-7316', color: 'NEGRO', estado: 'B', idTipocombustible: 2, nomTipocombustible: 'GASOHOL', idEstado: 1, nomEstado: 'OPERATIVO', fechaMantenimiento: new Date('2019-10-10'), nombre: 'MOTOCICLETA HONDA EB-7316' },
    { id: 6, codPatrimonio: '678268000005', idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 5, tambo: 'CHURUNMARCA', denominacion: 'MOTOCICLETA', marca: 'HONDA', modelo: 'XR150L', tipo: 'S/T', serie: 'S/S', placa: 'EW-0724', color: 'NEGRO', estado: 'R', idTipocombustible: 2, nomTipocombustible: 'GASOHOL', idEstado: 1, nomEstado: 'OPERATIVO', fechaMantenimiento: new Date('2019-10-10'), nombre: 'MOTOCICLETA HONDA EW-0724' },
    { id: 7, codPatrimonio: '678268000006', idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 6, tambo: 'COCHAPAMPA', denominacion: 'MOTOCICLETA', marca: 'ZONGSHEN', modelo: 'GL-125', tipo: 'LINEAL', serie: 'LTMKD0798H5200516', placa: 'EA-9316', color: 'NEGRO', estado: 'B', idTipocombustible: 2, nomTipocombustible: 'GASOHOL', idEstado: 1, nomEstado: 'OPERATIVO', fechaMantenimiento: new Date('2019-10-10'), nombre: 'MOTOCICLETA ZONGSHEN EA-9316' },
];

export const generadores: Generador[] = [
    { id: 1, codPatrimonio: '462265071183', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OFICINA DE UNIDAD TERRITORIAL', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: '3100/2800', tipo: 'S/T', serie: '1406X07868', color: 'AMARILLO', estado: 'R', observacion: '' },
    { id: 2, codPatrimonio: '462265071184', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OFICINA DE UNIDAD TERRITORIAL', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: '3100/2801', tipo: 'S/T', serie: '1406X07815', color: 'AMARILLO', estado: 'R', observacion: '' },
    { id: 3, codPatrimonio: '462265071185', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OFICINA DE UNIDAD TERRITORIAL', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: '3100/2802', tipo: 'S/T', serie: '1406X07814', color: 'AMARILLO', estado: 'R', observacion: '' },
    { id: 4, codPatrimonio: '462265071247', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 1, nomTambo: 'ANCARPATA', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'ST168F-213009X00587', color: 'AMARILLO', estado: 'B', observacion: '43227' },
    { id: 5, codPatrimonio: '462265071533', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 2, nomTambo: 'BARRIO VISTA ALEGRE', denominacion: 'GRUPO ELECTROGENO', marca: 'HYUNDAI', modelo: 'HY9000LEK', tipo: 'MONOFASICO', serie: '17040010S', color: 'NEGRO', estado: 'B', observacion: '' },
    { id: 6, codPatrimonio: '462265071720', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 3, nomTambo: 'CCERAOCRO', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'S/S', color: 'AMARILLO', estado: 'B', observacion: '' },
    { id: 7, codPatrimonio: '462265071913', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 4, nomTambo: 'CHACHASPATA', denominacion: 'GRUPO ELECTROGENO', marca: 'YAMAHA', modelo: 'EF5200DFW', tipo: 'MONOFASICO', serie: '200589', color: 'AZUL', estado: 'B', observacion: '' },
    { id: 10, codPatrimonio: '462265072542', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 5, nomTambo: 'CHURUNMARCA', denominacion: 'GRUPO ELECTROGENO', marca: 'BRIGGS STRATTON', modelo: 'GS6500', tipo: 'S/T', serie: '1705231600749', color: 'NEGRO', estado: 'B', observacion: '' },
    { id: 11, codPatrimonio: '462265072590', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 6, nomTambo: 'COCHAPAMPA', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'PREMIUM', color: 'AMARILLO', estado: 'B', observacion: '' },
    { id: 8, codPatrimonio: '462265072129', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 7, nomTambo: 'CAYARPACHI', denominacion: 'GRUPO ELECTROGENO', marca: 'KOHLER', modelo: 'PRO75E-3001', tipo: 'S/T', serie: '4710837075', color: 'AZUL', estado: 'B', observacion: '' },
    { id: 9, codPatrimonio: '462265072183', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 8, nomTambo: 'AUQUIRACCAY', denominacion: 'GRUPO ELECTROGENO', marca: 'HONDA', modelo: 'PANTER', tipo: 'S/T', serie: 'GCAFH-0623048', color: 'ROJO', estado: 'B', observacion: '' },
    { id: 12, codPatrimonio: '462265072774', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 9, nomTambo: 'CUNYA', denominacion: 'GRUPO ELECTROGENO', marca: 'HYUNDAI', modelo: 'HY9000LE', tipo: 'S/T', serie: '15100129S', color: 'NEGRO', estado: 'B', observacion: '' },
    { id: 13, codPatrimonio: '462265073091', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 10, nomTambo: 'CUSIBAMBA', denominacion: 'GRUPO ELECTROGENO', marca: 'DAEWOO', modelo: 'POWER', tipo: 'MONOFASICO', serie: 'GDA6800E ', color: 'ROJO', estado: 'B', observacion: 'NINGUNA' },
    { id: 14, codPatrimonio: '462265073275', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 11, nomTambo: 'HUANCA PAMPA', denominacion: 'GRUPO ELECTROGENO', marca: 'KOHLER', modelo: 'PRO75E-2001', tipo: 'S/T', serie: '4416631185', color: 'AZUL', estado: 'B', observacion: '' },
    { id: 15, codPatrimonio: '462265073308', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 12, nomTambo: 'MARCCARACCAY', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'ST168F-21309X00753', color: 'AMARILLO', estado: 'B', observacion: '' },
    { id: 16, codPatrimonio: '462265073456', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 13, nomTambo: 'OCCO CHIRURA', denominacion: 'GRUPO ELECTROGENO', marca: 'HYUNDAI', modelo: 'HY9000LE', tipo: 'ELECTRICO', serie: '161204685S', color: 'NEGRO', estado: 'B', observacion: '' },
    { id: 17, codPatrimonio: '462265073802', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 14, nomTambo: 'OCCOLLO', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'S/S', color: 'NEGRO', estado: 'R', observacion: '' },
    { id: 18, codPatrimonio: '462265073922', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 15, nomTambo: 'PACCHA', denominacion: 'GRUPO ELECTROGENO', marca: 'PHANTER', modelo: 'ME-28000CK', tipo: 'ELECTRICO', serie: 'CT168F-2', color: 'NEGRO', estado: 'R', observacion: '' },
    { id: 19, codPatrimonio: '', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 15, nomTambo: 'PACCHA', denominacion: 'GRUPO ELECTROGENO', marca: 'PHANTER', modelo: 'MF2800CX', tipo: 'ELECTRICO', serie: 'S/S', color: 'NEGRO', estado: 'R', observacion: '' },
    { id: 20, codPatrimonio: '462265073991', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 17, nomTambo: 'PACCO LOMA - HUAYCHAO', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'S/S', color: 'AMARILLO', estado: 'M', observacion: 'MALOGRADO' },
    { id: 21, codPatrimonio: '462265075381', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 18, nomTambo: 'PARAS', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'S/S', color: 'AMARILLO', estado: 'B', observacion: '' },
    { id: 22, codPatrimonio: '462265074255', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 19, nomTambo: 'PATAHUASI', denominacion: 'GRUPO ELECTROGENO', marca: 'DAEWOO', modelo: '7500W', tipo: 'MONOFASICO', serie: 'GDA8000E', color: 'ANARANJADO', estado: 'B', observacion: '' },
    { id: 23, codPatrimonio: '462265074347', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 20, nomTambo: 'PAUCHO', denominacion: 'GRUPO ELECTROGENO', marca: 'YAMAHA', modelo: 'EF7200DE', tipo: 'ELECTRICO', serie: '4002392', color: 'AZUL', estado: 'B', observacion: '' },
    { id: 24, codPatrimonio: '462265074534', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 21, nomTambo: 'POMAPUKIO', denominacion: 'GRUPO ELECTROGENO', marca: 'PANTHER', modelo: 'MF2800CX', tipo: 'MONOFASICO', serie: 'S/S', color: 'AMARILLO', estado: 'B', observacion: '' }
];

export const deslizadores: Deslizador[] = [
    { id: 1, codPatrimonio: '677128501183', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 90, nomTambo: 'SAN ANTONIO DEL ESTRECHO', denominacion: 'DESLIZADOR', marca: 'SUZUKI 70 HP', modelo: 'DF 70', tipo: '', serie: '07003F610848', color: '', estado: 'R', observacion: '', potencia: 70 },
    { id: 2, codPatrimonio: '677128501184', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 91, nomTambo: 'ESPERANZA', denominacion: 'DESLIZADOR', marca: 'SUZUKI 70 HP', modelo: 'DF 70', tipo: '', serie: '07003F610850', color: '', estado: 'R', observacion: '', potencia: 70 },
    { id: 3, codPatrimonio: '677128501185', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 92, nomTambo: 'REMANZO', denominacion: 'DESLIZADOR', marca: 'SUZUKI 60 HP', modelo: 'DF 60A', tipo: '', serie: '06002F-611580', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 4, codPatrimonio: '677128501186', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 93, nomTambo: 'NUEVA ANGUSILLA', denominacion: 'DESLIZADOR', marca: 'SUZUKI 70 HP', modelo: 'DF 70', tipo: '', serie: '07003F610851', color: '', estado: 'R', observacion: '', potencia: 70 },
    { id: 5, codPatrimonio: '677128501187', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 94, nomTambo: 'SOPLIN VARGAS', denominacion: 'DESLIZADOR', marca: 'SUZUKI 60 HP', modelo: 'DF 60', tipo: '', serie: '06002F611579', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 6, codPatrimonio: '677128501188', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 95, nomTambo: 'HUANTA', denominacion: 'DESLIZADOR', marca: 'YAMAHA', modelo: 'MODELOE60HWL', tipo: '', serie: '07003F610848', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 7, codPatrimonio: '677128501189', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 96, nomTambo: 'COCHIQUINAS', denominacion: 'DESLIZADOR', marca: 'YAMAHA', modelo: 'MODELOE60HWL', tipo: '', serie: '07003F610848', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 8, codPatrimonio: '677128501190', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 97, nomTambo: 'LEONCIO PRADO', denominacion: 'DESLIZADOR', marca: 'YAMAHA', modelo: 'MODELOE60HWL', tipo: '', serie: '07003F610848', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 9, codPatrimonio: '677128501191', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 98, nomTambo: 'INDUSTRIAL (PUERTO INDUSTRIAL)', denominacion: 'DESLIZADOR', marca: 'YAMAHA 60HP 2T', modelo: 'E60HWDL', tipo: '', serie: '', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 10, codPatrimonio: '677128501192', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 99, nomTambo: 'TRES FRONTERAS', denominacion: 'DESLIZADOR', marca: 'YAMAHA MOTOR 115 HP', modelo: 'E115AETL', tipo: '', serie: '1037259', color: '', estado: 'R', observacion: '', potencia: 115 },
    { id: 11, codPatrimonio: '677128501193', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 100, nomTambo: 'EL ALAMO', denominacion: 'DESLIZADOR', marca: 'SUZUKI 140 HP', modelo: 'MODELO DF 140', tipo: '', serie: '14001F516391', color: '', estado: 'R', observacion: '', potencia: 140 },
    { id: 12, codPatrimonio: '677128501194', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 101, nomTambo: 'FLOR DE AGOSTO', denominacion: 'DESLIZADOR', marca: 'SUZUKI 60 HP', modelo: 'DF 60A', tipo: '', serie: '06002F-611577', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 13, codPatrimonio: '677128501195', idUnidad: 21, nomUnidad: 'U.T. UCAYALI', idTambo: 102, nomTambo: 'COLONIA CACO', denominacion: 'DESLIZADOR', marca: 'YAMAHA', modelo: 'E60HWDL', tipo: '', serie: '6K5K1058509', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 14, codPatrimonio: '677128501196', idUnidad: 22, nomUnidad: 'U.T. SAN MARTIN', idTambo: 103, nomTambo: 'DOS DE MAYO', denominacion: 'DESLIZADOR', marca: 'YAMAHA', modelo: 'E60HMHDL', tipo: '', serie: '1053432', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 15, codPatrimonio: '677128501197', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 104, nomTambo: 'BRETAÑA', denominacion: 'DESLIZADOR', marca: 'SUZUKI', modelo: 'DF60A', tipo: '', serie: '', color: '', estado: 'R', observacion: '', potencia: 60 },
    { id: 16, codPatrimonio: '677128501198', idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 105, nomTambo: 'SANTA MERCEDES', denominacion: 'DESLIZADOR', marca: 'SUZUKI 60 HP', modelo: 'DF 60', tipo: '', serie: '06002F611581', color: '', estado: 'R', observacion: '', potencia: 60 },
];

export const KILOMETRAJES: Kilometraje[] = [
    { id: 1, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 0, tambo: 'OFICINA DE UNIDAD TERRITORIAL', idVehiculo: 1, tipo: 'CAMIONETA', marca: 'NISSAN', placa: 'EGT-079', horaSalida: '9:00 AM', horaLlegada: '10:00 AM', kilometrajeSalida: '5100', kilometrajeLlegada: '5110', kilometrosRecorrido: 10, lugarDestino: 'CP QUIÑASI', observaciones: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '0243', fechaComision: '01/10/2019' },
    { id: 2, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 0, tambo: 'OFICINA DE UNIDAD TERRITORIAL', idVehiculo: 1, tipo: 'CAMIONETA', marca: 'NISSAN', placa: 'EGT-079', horaSalida: '9:00 AM', horaLlegada: '9:10 AM', kilometrajeSalida: '5110', kilometrajeLlegada: '5130', kilometrosRecorrido: 20, lugarDestino: 'CP QUIÑASI', observaciones: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '0434', fechaComision: '02/10/2019' },
    { id: 3, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 0, tambo: 'OFICINA DE UNIDAD TERRITORIAL', idVehiculo: 1, tipo: 'CAMIONETA', marca: 'NISSAN', placa: 'EGT-079', horaSalida: '11:00 AM', horaLlegada: '12:00 AM', kilometrajeSalida: '5130', kilometrajeLlegada: '5145', kilometrosRecorrido: 15, lugarDestino: 'CP TOTOS', observaciones: 'COORIDNACION CON LA MUNICIPALIDAD DISTRITAL DE TOTOS', codComisionSISMONITOR: '0444', fechaComision: '01/10/2019' },
    { id: 4, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 0, tambo: 'OFICINA DE UNIDAD TERRITORIAL', idVehiculo: 1, tipo: 'CAMIONETA', marca: 'NISSAN', placa: 'EGT-079', horaSalida: '9:30 AM', horaLlegada: '9:40 AM', kilometrajeSalida: '5145', kilometrajeLlegada: '5157', kilometrosRecorrido: 12, lugarDestino: 'CP QUIÑASI', observaciones: 'VERIFICACION DE CHACRAS AFECTADAS POR LA SEQUIA', codComisionSISMONITOR: '0545', fechaComision: '01/10/2019' },
    { id: 5, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 1, tambo: 'ANCARPATA', idVehiculo: 2, tipo: 'MOTOCICLETA', marca: 'ZONGSHEN', placa: 'EA-9256', horaSalida: '9:00 AM', horaLlegada: '10:00 AM', kilometrajeSalida: '5150', kilometrajeLlegada: '5155', kilometrosRecorrido: 5, lugarDestino: 'CP QUIÑASI', observaciones: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '034', fechaComision: '05/10/2019' },
    { id: 6, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 1, tambo: 'ANCARPATA', idVehiculo: 2, tipo: 'MOTOCICLETA', marca: 'ZONGSHEN', placa: 'EA-9256', horaSalida: '9:00 AM', horaLlegada: '9:10 AM', kilometrajeSalida: '5155', kilometrajeLlegada: '5159.5', kilometrosRecorrido: 4.5, lugarDestino: 'CP QUIÑASI', observaciones: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '012', fechaComision: '10/10/2019' },
    { id: 7, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 1, tambo: 'ANCARPATA', idVehiculo: 2, tipo: 'MOTOCICLETA', marca: 'ZONGSHEN', placa: 'EA-9256', horaSalida: '11:00 AM', horaLlegada: '12:00 AM', kilometrajeSalida: '5164', kilometrajeLlegada: '5180.5', kilometrosRecorrido: 16.5, lugarDestino: 'TOTOS', observaciones: 'COORIDNACION CON LA MUNICIPALIDAD DISTRITAL DE TOTOS', codComisionSISMONITOR: '016', fechaComision: '20/10/2019' },
    { id: 8, idUnidad: 1, unidad: 'U.T. AYACUCHO NORTE', idTambo: 1, tambo: 'ANCARPATA', idVehiculo: 2, tipo: 'MOTOCICLETA', marca: 'ZONGSHEN', placa: 'EA-9256', horaSalida: '9:30 AM', horaLlegada: '9:40 AM', kilometrajeSalida: '5197', kilometrajeLlegada: '5199', kilometrosRecorrido: 2, lugarDestino: 'CP QUIÑASI', observaciones: 'VERIFICACION DE CHACRAS AFECTADAS POR LA SEQUIA', codComisionSISMONITOR: '051', fechaComision: '30/10/2019' }
];

export const CONSUMOSGENERADOR: ConsumoGenerador[] = [
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OFICINA DE UNIDAD TERRITORIAL', descripcionBien: 'GRUPO ELECTROGENO', marca: 'PANTHER', serie: 'S/S', horaInicio: '9:00 AM', horaFin: '2:30 PM', horas: 5.5, fecha: new Date('2019-09-20'), observacion: 'SE USO GENERADOR PARA DESARROLLO DE ACTIVIDADES E ILUMINACION EN LA PLATAFORMA' },
    { id: 2, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 1, nomTambo: 'ANCARPATA', descripcionBien: 'GRUPO ELECTROGENO', marca: 'PANTHER', serie: 'ST168F-213009X00587', horaInicio: '9:00 AM', horaFin: '2:30 PM', horas: 5.5, fecha: new Date('2019-09-20'), observacion: 'SE USO GENERADOR PARA DESARROLLO DE ACTIVIDADES E ILUMINACION EN LA PLATAFORMA' },
    { id: 3, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 1, nomTambo: 'ANCARPATA', descripcionBien: 'GRUPO ELECTROGENO', marca: 'PANTHER', serie: 'ST168F-213009X00587', horaInicio: '9:30 AM', horaFin: '2:30 PM', horas: 5.0, fecha: new Date('2019-10-05'), observacion: 'SE USO GENERADOR PARA LA TENCION INTEGRAL EN SALUD' },
    { id: 4, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 1, nomTambo: 'ANCARPATA', descripcionBien: 'GRUPO ELECTROGENO', marca: 'PANTHER', serie: 'ST168F-213009X00587', horaInicio: '10:00 AM', horaFin: '6:00 PM', horas: 8.0, fecha: new Date('2019-10-30'), observacion: 'SE USO GENERADOR EN EL TAMBO POR CAUSA DE CORTE DE ENERGIA ELECTRICA' },
    { id: 5, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 2, nomTambo: 'BARRIO VISTA ALEGRE', descripcionBien: 'GRUPO ELECTROGENO', marca: 'HYUNDAI', serie: '17040010S', horaInicio: '9:00 AM', horaFin: '9:30 AM', horas: 0.5, fecha: new Date('2019-10-10'), observacion: 'SE USO GENERADOR EN EL TAMBO POR CAUSA DE CORTE DE ENERGIA ELECTRICA' },
    { id: 6, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 3, nomTambo: 'CCERAOCRO', descripcionBien: 'GRUPO ELECTROGENO', marca: 'PANTHER', serie: 'S/S', horaInicio: '10:00 AM', horaFin: '11:00 AM', horas: 1.0, fecha: new Date('2019-10-15'), observacion: 'SE USO GENERADOR PARA LA TENCION INTEGRAL EN SALUD' },
    { id: 7, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 4, nomTambo: 'CHACHASPATA', descripcionBien: 'GRUPO ELECTROGENO', marca: 'YAMAHA', serie: '200589', horaInicio: '11:00 AM', horaFin: '12:00 AM', horas: 1.0, fecha: new Date('2019-10-20'), observacion: 'SE USO GENERADOR PARA DESARROLLO DE ACTIVIDADES E ILUMINACION EN LA PLATAFORMA' },
    { id: 8, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 5, nomTambo: 'CHURUNMARCA', descripcionBien: 'GRUPO ELECTROGENO', marca: 'BRIGGS STRATTON', serie: '1705231600749', horaInicio: '3:00 PM', horaFin: '4:00 PM', horas: 1.0, fecha: new Date('2019-10-25'), observacion: '' },
    { id: 9, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 6, nomTambo: 'COCHAPAMPA', descripcionBien: 'GRUPO ELECTROGENO', marca: 'PANTHER', serie: 'PREMIUM', horaInicio: '9:30 AM', horaFin: '2:30 PM', horas: 5.0, fecha: new Date('2019-10-30'), observacion: '' }
];

export const CONSUMOSDESLIZADOR: HorasDeslizador[] = [
    { id: 1, idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 0, nomTambo: 'OFICINA DE UNIDAD TERRITORIAL', descripcionBien: 'DESLIZADOR', marca: 'YAMAHA', serie: '6K5K1058509', potencia: 60, horaInicio: '6:00 AM', horaFin: '4:30 AM', horas: 10.5, fechaComision: new Date('2019-10-10'), lugarDestino: 'CP QUIÑASI', observacion: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '0243' },
    { id: 2, idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 90, nomTambo: 'SAN ANTONIO DEL ESTRECHO', descripcionBien: 'DESLIZADOR', marca: 'SUZUKI 70 HP', serie: '07003F610848', potencia: 70, horaInicio: '12:00 AM', horaFin: '04:00 PM', horas: 4.0, fechaComision: new Date('2019-10-15'), lugarDestino: 'CP QUIÑASI', observacion: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '0243' },
    { id: 3, idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 90, nomTambo: 'SAN ANTONIO DEL ESTRECHO', descripcionBien: 'DESLIZADOR', marca: 'SUZUKI 70 HP', serie: '07003F610848', potencia: 70, horaInicio: '10:00 AM', horaFin: '03:00 PM', horas: 5.0, fechaComision: new Date('2019-10-20'), lugarDestino: 'CP QUIÑASI', observacion: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '0243' },
    { id: 4, idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 90, nomTambo: 'SAN ANTONIO DEL ESTRECHO', descripcionBien: 'DESLIZADOR', marca: 'SUZUKI 70 HP', serie: '07003F610848', potencia: 70, horaInicio: '3:00 PM', horaFin: '4:00 PM', horas: 1.0, fechaComision: new Date('2019-10-25'), lugarDestino: 'CP QUIÑASI', observacion: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '0243' },
    { id: 5, idUnidad: 20, nomUnidad: 'U.T. LORETO', idTambo: 91, nomTambo: 'ESPERANZA', descripcionBien: 'DESLIZADOR', marca: 'SUZUKI 70 HP', serie: '07003F610850', potencia: 70, horaInicio: '9:30 AM', horaFin: '2:30 AM', horas: 5.0, fechaComision: new Date('2019-10-30'), lugarDestino: 'CP QUIÑASI', observacion: 'COORIDNACION CON AUTORIDADES DEL C.P. QUIÑASI', codComisionSISMONITOR: '0243' }
];

export const PARTIDAS: Object[] = [
    { id: 1, nombre: '2.3.13.11', descripcion: 'COMBUSTIBLE Y CARBURANTES' },
    { id: 2, nombre: '2.3.13.12', descripcion: 'GASES' },
    { id: 3, nombre: '2.3.13.13', descripcion: 'LUBRICANTES, GRASAS Y AFINES' }
];

export const EJECUCIONPRESUPUESTAL: EjecucionPresupuestal[] = [
    { id: 1, idTipoejecucion: 3, nomTipoejecucion: 'FONDO POR ENCARGO (F/E)', idUnidad: 20, nomUnidad: 'U.T. AYACUCHO SUR', idOrdencompra: 0, nroOrdencompra: '', nroResAdministracion: '165-2018', monto: 10290.00, fecha: new Date('2018-07-20'), observacion: '' },
    { id: 2, idTipoejecucion: 3, nomTipoejecucion: 'FONDO POR ENCARGO (F/E)', idUnidad: 20, nomUnidad: 'U.T. AYACUCHO SUR', idOrdencompra: 0, nroOrdencompra: '', nroResAdministracion: '102-2018', monto: 6945.00, fecha: new Date('2018-01-01'), observacion: '' },
    { id: 3, idTipoejecucion: 2, nomTipoejecucion: 'ORDEN DE COMPRA (OC)', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idOrdencompra: 1, nroOrdencompra: '0000060-2019', nroResAdministracion: '', monto: 10188.08, fecha: new Date('2019-06-15'), observacion: '' },
    { id: 4, idTipoejecucion: 3, nomTipoejecucion: 'ORDEN DE COMPRA (OC)', idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idOrdencompra: 1, nroOrdencompra: '0000019-2019', nroResAdministracion: '', monto: 7245.00, fecha: new Date('2019-01-01'), observacion: '' }
];

export const ADQUISICION: Adquisicion[] = [
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: '', idTipoCombustible: 1, nomTipoCombustible: 'DIESEL B-5', cantidad: 70, costoGalon: 13.5, costoTotal: 945, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 2, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 1, nomTambo: 'ANCARPATA', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 3, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 2, nomTambo: 'BARRIO VISTA ALEGRE', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 4, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 3, nomTambo: 'CCERAOCRO', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 5, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 4, nomTambo: 'CHACHASPATA', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 6, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 5, nomTambo: 'AUQUIRACCAY', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 7, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 6, nomTambo: 'CCAYARPACHI', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 8, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 7, nomTambo: 'CHURUNMARCA', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 9, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 8, nomTambo: 'COCHAPAMPA', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
    { id: 10, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 9, nomTambo: 'CUNYA', idTipoCombustible: 2, nomTipoCombustible: 'GASOLINA', cantidad: 15, costoGalon: 12.5, costoTotal: 187.50, ciudadPuntoAbastecimiento: 'HUAMANGA', distPuntoAbastecimiento: 0, proveedor: 'COORPORACION SANTA BERTHA', rucProveedor: '20452631858', observacion: 'RETIRO DIRECTOR POR GESTOR' },
];

export const CUADROCONTROL: CuadroControl[] = [
    { secFun: 22, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 65889.00, totalConsumo: 63107.00, totalEjecucionPresupuestal: 64000.00 },
    { secFun: 22, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 2700.00, totalConsumo: 2700.00, totalEjecucionPresupuestal: 2700.00 },
    { secFun: 22, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 80000.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 24000.00 },
    { secFun: 26, idUnidad: 4, nomUnidad: 'U.T. HUANUCO', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 39000.00, totalConsumo: 33211.20, totalEjecucionPresupuestal: 35000.00 },
    { secFun: 26, idUnidad: 4, nomUnidad: 'U.T. HUANUCO', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 3000.00, totalConsumo: 2800.00, totalEjecucionPresupuestal: 2800.00 },
    { secFun: 26, idUnidad: 4, nomUnidad: 'U.T. HUANUCO', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 67000.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 27000.00 },
    { secFun: 39, idUnidad: 3, nomUnidad: 'U.T. UCAYALI', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 5390.00, totalConsumo: 5390.00, totalEjecucionPresupuestal: 5390.00 },
    { secFun: 39, idUnidad: 3, nomUnidad: 'U.T. UCAYALI', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 200.00, totalConsumo: 200.00, totalEjecucionPresupuestal: 200.00 },
    { secFun: 39, idUnidad: 3, nomUnidad: 'U.T. UCAYALI', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 23400.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 22000.00 },
    { secFun: 24, idUnidad: 2, nomUnidad: 'U.T. CUSCO', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 80000.00, totalConsumo: 75307.10, totalEjecucionPresupuestal: 78000.00 },
    { secFun: 24, idUnidad: 2, nomUnidad: 'U.T. CUSCO', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 3000.00, totalConsumo: 2700.00, totalEjecucionPresupuestal: 3000.00 },
    { secFun: 24, idUnidad: 2, nomUnidad: 'U.T. CUSCO', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 36000.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 24000.00 },
    { secFun: 32, idUnidad: 5, nomUnidad: 'U.T. MADRE DE DIOS', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 3520.07, totalConsumo: 3520.00, totalEjecucionPresupuestal: 3520.00 },
    { secFun: 32, idUnidad: 5, nomUnidad: 'U.T. MADRE DE DIOS', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 160.00, totalConsumo: 160.00, totalEjecucionPresupuestal: 160.00 },
    { secFun: 32, idUnidad: 5, nomUnidad: 'U.T. MADRE DE DIOS', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 66000.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 45000.00 },
    { secFun: 36, idUnidad: 6, nomUnidad: 'U.T. PUNO', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 70000.00, totalConsumo: 67320.00, totalEjecucionPresupuestal: 68000.00 },
    { secFun: 36, idUnidad: 6, nomUnidad: 'U.T. PUNO', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 2016.00, totalConsumo: 1516.00, totalEjecucionPresupuestal: 2000.00 },
    { secFun: 36, idUnidad: 6, nomUnidad: 'U.T. PUNO', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 20016.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 10000.00 },
    { secFun: 27, idUnidad: 7, nomUnidad: 'U.T. JUNIN', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 40000.00, totalConsumo: 35024.00, totalEjecucionPresupuestal: 38000.00 },
    { secFun: 27, idUnidad: 7, nomUnidad: 'U.T. JUNIN', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 1900.00, totalConsumo: 1720.00, totalEjecucionPresupuestal: 1800.00 },
    { secFun: 27, idUnidad: 7, nomUnidad: 'U.T. JUNIN', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 45000.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 42000.00 },
    { secFun: 21, idUnidad: 8, nomUnidad: 'U.T. AYACUCHO SUR', idPartida: 1, nomPartida: '2.3.13.11', totalAsignacionPresupuestal: 35000.00, totalConsumo: 33759.00, totalEjecucionPresupuestal: 35000.00 },
    { secFun: 21, idUnidad: 8, nomUnidad: 'U.T. AYACUCHO SUR', idPartida: 2, nomPartida: '2.3.13.13', totalAsignacionPresupuestal: 4000.00, totalConsumo: 2016.00, totalEjecucionPresupuestal: 2016.00 },
    { secFun: 21, idUnidad: 8, nomUnidad: 'U.T. AYACUCHO SUR', idPartida: 3, nomPartida: '2.3.24.13', totalAsignacionPresupuestal: 86000.00, totalConsumo: 0.00, totalEjecucionPresupuestal: 45000.00 },
    // { secFun: 22, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 65889.00, combCamionetas: 10395.00, combMotocicletas: 52272.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 2500.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 22, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 2700.00, combCamionetas: 10395.00, combMotocicletas: 52272.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 2500.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 26, idUnidad: 4, nomUnidad: 'U.T. HUANUCO', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 34000.00, combCamionetas: 0.00, combMotocicletas: 32771.20, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 0, lubMotocicletas: 2800.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 26, idUnidad: 4, nomUnidad: 'U.T. HUANUCO', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 2800.00, combCamionetas: 0.00, combMotocicletas: 32771.20, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 0, lubMotocicletas: 2800.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 39, idUnidad: 3, nomUnidad: 'U.T. UCAYALI', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 5390.00, combCamionetas: 0.00, combMotocicletas: 4950.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 0, lubMotocicletas: 200.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 39, idUnidad: 3, nomUnidad: 'U.T. UCAYALI', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 200.00, combCamionetas: 0.00, combMotocicletas: 4950.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 0, lubMotocicletas: 200.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 24, idUnidad: 2, nomUnidad: 'U.T. CUSCO', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 80000.00, combCamionetas: 8339.10, combMotocicletas: 66528.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 2500.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 24, idUnidad: 2, nomUnidad: 'U.T. CUSCO', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 3000.00, combCamionetas: 8339.10, combMotocicletas: 66528.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 2500.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 32, idUnidad: 5, nomUnidad: 'U.T. MADRE DE DIOS', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 3520.07, combCamionetas: 0.00, combMotocicletas: 3080.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 160.00, lubMotocicletas: 160.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 32, idUnidad: 5, nomUnidad: 'U.T. MADRE DE DIOS', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 160.00, combCamionetas: 0.00, combMotocicletas: 3080.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 160.00, lubMotocicletas: 160.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 36, idUnidad: 6, nomUnidad: 'U.T. PUNO', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 70000.00, combCamionetas: 11440.00, combMotocicletas: 55440.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 1816.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 36, idUnidad: 6, nomUnidad: 'U.T. PUNO', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 2016.00, combCamionetas: 11440.00, combMotocicletas: 55440.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 1816.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 27, idUnidad: 7, nomUnidad: 'U.T. JUNIN', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 40000.00, combCamionetas: 11176.00, combMotocicletas: 23408.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 1320.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 27, idUnidad: 7, nomUnidad: 'U.T. JUNIN', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 1600.00, combCamionetas: 11176.00, combMotocicletas: 23408.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 1520.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 21, idUnidad: 8, nomUnidad: 'U.T. AYACUCHO SUR', idPartida: 1, nomPartida: '2.3.13.11', totalAvancePresupuestal: 35000.00, combCamionetas: 7480.00, combMotocicletas: 25839.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 1816.00, lubGeneradores: 0, lubDeslizadores: 0 },
    // { secFun: 21, idUnidad: 8, nomUnidad: 'U.T. AYACUCHO SUR', idPartida: 2, nomPartida: '2.3.13.13', totalAvancePresupuestal: 2016.00, combCamionetas: 7480.00, combMotocicletas: 25839.00, combGeneradores: 220.00, combDeslizadores: 220.00, lubCamionetas: 200.00, lubMotocicletas: 1816.00, lubGeneradores: 0, lubDeslizadores: 0 },
];

export const ASIGNACIONPRESUPUESTAL: AsignacionPresupuestal[] = [
    { id: 1, codigoMeta: '0007', nomMeta: 'AMAZONAS', partida: '2.3.13.11', descripcion: 'COMBUSTIBLES Y CARBURANTES', pim: 15540.00, certificado: 100.00, saldo: 15440.00, fecha: new Date('2019-01-15') },
    { id: 2, codigoMeta: '0007', nomMeta: 'AMAZONAS', partida: '2.3.13.12', descripcion: 'GASES', pim: 8100.00, certificado: 0.00, saldo: 8100.00, fecha: new Date('2019-01-15') },
    { id: 3, codigoMeta: '0007', nomMeta: 'AMAZONAS', partida: '2.3.13.13', descripcion: 'LUBRICANTES, GRASAS Y AFINES', pim: 3500.00, certificado: 0.00, saldo: 3500.00, fecha: new Date('2019-01-15') },
    { id: 4, codigoMeta: '0008', nomMeta: 'ANCASH', partida: '2.3.13.11', descripcion: 'COMBUSTIBLES Y CARBURANTES', pim: 18498.00, certificado: 100.00, saldo: 18398.00, fecha: new Date('2019-01-15') },
    { id: 5, codigoMeta: '0008', nomMeta: 'ANCASH', partida: '2.3.13.12', descripcion: 'GASES', pim: 9180.00, certificado: 0.00, saldo: 9180.00, fecha: new Date('2019-01-15') },
    { id: 6, codigoMeta: '0008', nomMeta: 'ANCASH', partida: '2.3.13.13', descripcion: 'LUBRICANTES, GRASAS Y AFINES', pim: 5300.00, certificado: 0.00, saldo: 5300.00, fecha: new Date('2019-01-15') },
    { id: 7, codigoMeta: '0009', nomMeta: 'APURIMAC', partida: '2.3.13.11', descripcion: 'COMBUSTIBLES Y CARBURANTES', pim: 23587.00, certificado: 100.00, saldo: 23487.00, fecha: new Date('2019-01-15') },
    { id: 8, codigoMeta: '0009', nomMeta: 'APURIMAC', partida: '2.3.13.12', descripcion: 'GASES', pim: 3600.00, certificado: 0.00, saldo: 3600.00, fecha: new Date('2019-01-15') },
    { id: 9, codigoMeta: '0009', nomMeta: 'APURIMAC', partida: '2.3.13.13', descripcion: 'LUBRICANTES, GRASAS Y AFINES', pim: 4810.00, certificado: 0.00, saldo: 4810.00, fecha: new Date('2019-01-15') },
    { id: 10, codigoMeta: '0010', nomMeta: 'AREQUIPA', partida: '2.3.13.11', descripcion: 'COMBUSTIBLES Y CARBURANTES', pim: 16848.00, certificado: 100.00, saldo: 16748.00, fecha: new Date('2019-01-15') },
    { id: 12, codigoMeta: '0010', nomMeta: 'AREQUIPA', partida: '2.3.13.12', descripcion: 'GASES', pim: 1800.00, certificado: 0.00, saldo: 1800.00, fecha: new Date('2019-01-15') },
    { id: 13, codigoMeta: '0010', nomMeta: 'AREQUIPA', partida: '2.3.13.13', descripcion: 'LUBRICANTES, GRASAS Y AFINES', pim: 821.00, certificado: 0.00, saldo: 821.00, fecha: new Date('2019-01-15') },
    { id: 14, codigoMeta: '0011', nomMeta: 'AYACUCHO', partida: '2.3.13.11', descripcion: 'COMBUSTIBLES Y CARBURANTES', pim: 50294.00, certificado: 200.00, saldo: 50094.00, fecha: new Date('2019-01-15') },
    { id: 14, codigoMeta: '0011', nomMeta: 'AYACUCHO', partida: '2.3.13.12', descripcion: 'GASES', pim: 5200.00, certificado: 0.00, saldo: 5200.00, fecha: new Date('2019-01-15') },
    { id: 14, codigoMeta: '0011', nomMeta: 'AYACUCHO', partida: '2.3.13.13', descripcion: 'LUBRICANTES, GRASAS Y AFINES', pim: 2496.00, certificado: 0.00, saldo: 2496.00, fecha: new Date('2019-01-15') },
];

export const METAS: Object[] = [
    { id: 1, codigo: '0007', nombre: 'AMAZONAS', descripcion: '0007 - AMAZONAS' },
    { id: 2, codigo: '0008', nombre: 'ANCASH', descripcion: '0008 - ANCASH' },
    { id: 3, codigo: '0009', nombre: 'APURIMAC', descripcion: '0009 - APURIMAC' },
    { id: 4, codigo: '0010', nombre: 'AREQUIPA', descripcion: '0010 - AREQUIPA' },
    { id: 5, codigo: '0011', nombre: 'AYACUCHO', descripcion: '0011 - AYACUCHO' },
    { id: 6, codigo: '0012', nombre: 'CAJAMARCA', descripcion: '0012 - CAJAMARCA' },
    { id: 7, codigo: '0013', nombre: 'CUSCO', descripcion: '0013 - CUSCO' },
];

export const ANIOPRESUPUESTAL: Master[] = [
    { id: 1, nombre: '2019' },
    { id: 2, nombre: '2018' },
    { id: 3, nombre: '2017' }
];

export const CUADROCONTROLTAMBO: CuadroControlTambo[] = [
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OFICINA UNIDAD TERRITORIAL', dieselConsumo: 229, dieselPromCosto: 12.9, dieselTotal: 2954.1, gasConsMotocicletas: 0, gasPromCosto: 0, gasMotocicletasTotal: 0, gasConsGeneradores: 0, gasGeneradoresTotal: 0, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 60, lubricantesTotal: 60, idPartida: 1, nomPartida: '2.3.13.11', total: 2954.1, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 60 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'ANCARPATA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 13.4, gasMotocicletasTotal: 402, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 469, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'AUQUIRACCAY', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 27, gasPromCosto: 14.8, gasMotocicletasTotal: 399.6, gasConsGeneradores: 5, gasGeneradoresTotal: 74, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 473.6, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'BARRIO VISTA ALEGRE', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 13.4, gasMotocicletasTotal: 402, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 469, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'CC SANTIAGO DE LUCANAMARCA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 22, gasPromCosto: 13.4, gasMotocicletasTotal: 294.8, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 361.8, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'CCAYARPACHI', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 18, gasPromCosto: 15, gasMotocicletasTotal: 270, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 25, lubricantesTotal: 25, idPartida: 1, nomPartida: '2.3.13.11', total: 345, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 25 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'CCERAOCRO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15, gasMotocicletasTotal: 450, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 525, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'CHACHASPATA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 14, gasPromCosto: 13.4, gasMotocicletasTotal: 187.6, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 254.6, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'CHURUNMARCA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 39, gasPromCosto: 13.4, gasMotocicletasTotal: 522.6, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 589.6, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'COCHAPAMPA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15, gasMotocicletasTotal: 450, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 525, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'CUNYA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15.5, gasMotocicletasTotal: 465, gasConsGeneradores: 5, gasGeneradoresTotal: 77.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 25, lubricantesTotal: 25, idPartida: 1, nomPartida: '2.3.13.11', total: 542.5, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 25 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'CUSIBAMBA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 13.4, gasMotocicletasTotal: 335, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 402, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'HUANCA PAMPA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15, gasMotocicletasTotal: 450, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 525, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'MARCCARACCAY', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 13.4, gasMotocicletasTotal: 402, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 469, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OCCO CHIRURA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15, gasMotocicletasTotal: 450, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 525, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OCCOLLO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15, gasMotocicletasTotal: 450, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 25, lubricantesTotal: 25, idPartida: 1, nomPartida: '2.3.13.11', total: 525, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 25 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'PACCHA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 10, gasPromCosto: 14, gasMotocicletasTotal: 140, gasConsGeneradores: 5, gasGeneradoresTotal: 70, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 210, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'PACCO LOMA -HUAYCHAO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 14.7, gasMotocicletasTotal: 441, gasConsGeneradores: 5, gasGeneradoresTotal: 73.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 514.5, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'PARAS', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 15.5, gasMotocicletasTotal: 387.5, gasConsGeneradores: 5, gasGeneradoresTotal: 77.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 465, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'PATAHUASI', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 38, gasPromCosto: 15.5, gasMotocicletasTotal: 589, gasConsGeneradores: 5, gasGeneradoresTotal: 77.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 666.5, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'PAUCHO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15.5, gasMotocicletasTotal: 465, gasConsGeneradores: 5, gasGeneradoresTotal: 77.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 25, lubricantesTotal: 25, idPartida: 1, nomPartida: '2.3.13.11', total: 542.5, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 25 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'POMAPUKIO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 12.9, gasMotocicletasTotal: 387, gasConsGeneradores: 5, gasGeneradoresTotal: 64.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 451.5, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'PUNTURCO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 14, gasMotocicletasTotal: 350, gasConsGeneradores: 5, gasGeneradoresTotal: 70, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 420, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'QUISPILLACTA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 28, gasPromCosto: 14, gasMotocicletasTotal: 392, gasConsGeneradores: 5, gasGeneradoresTotal: 70, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 462, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'SACHABAMBA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 28, gasPromCosto: 14, gasMotocicletasTotal: 392, gasConsGeneradores: 5, gasGeneradoresTotal: 70, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 462, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'SAN CRISTOBAL DE MORCCO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15.5, gasMotocicletasTotal: 465, gasConsGeneradores: 5, gasGeneradoresTotal: 77.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 25, lubricantesTotal: 25, idPartida: 1, nomPartida: '2.3.13.11', total: 542.5, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 25 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'SANABAMBA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 24, gasPromCosto: 13.5, gasMotocicletasTotal: 324, gasConsGeneradores: 5, gasGeneradoresTotal: 67.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 391.5, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'SANTA CRUZ DE HOSPICIO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 14.5, gasMotocicletasTotal: 362.5, gasConsGeneradores: 5, gasGeneradoresTotal: 72.5, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 435, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'SANTA LUCIA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 13.4, gasMotocicletasTotal: 335, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 402, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'TIOPAMPA', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 14.8, gasMotocicletasTotal: 370, gasConsGeneradores: 5, gasGeneradoresTotal: 74, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 444, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'URAS', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 15, gasMotocicletasTotal: 375, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 25, lubricantesTotal: 25, idPartida: 1, nomPartida: '2.3.13.11', total: 450, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 25 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'VISTA ALEGRE DE CCARHUACCOCCO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 25, gasPromCosto: 13.4, gasMotocicletasTotal: 335, gasConsGeneradores: 5, gasGeneradoresTotal: 67, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 30, lubricantesTotal: 30, idPartida: 1, nomPartida: '2.3.13.11', total: 402, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 30 },
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'YURAQ PUNKO', dieselConsumo: 0, dieselPromCosto: 0, dieselTotal: 0, gasConsMotocicletas: 30, gasPromCosto: 15, gasMotocicletasTotal: 450, gasConsGeneradores: 5, gasGeneradoresTotal: 75, gasConsDeslizadores: 0, gasDeslizadoresTotal: 0, lubricConsumo: 1, lubricPromCosto: 35, lubricantesTotal: 35, idPartida: 1, nomPartida: '2.3.13.11', total: 525, idPartida2: 3, nomPartida2: '2.3.13.13', total2: 35 },
];

export const PRODUCTOSLUBRICANTE: Object[] = [
    { id: 1, nombre: 'LUBRICANTE' },
    { id: 2, nombre: 'ACEITE' },
];

export const TIPOSMANTENIMIENTO: Object[] = [
    { id: 1, nombre: 'PREVENTIVO' },
    { id: 2, nombre: 'CORRECTIVO' },
];

export const ESTADOSOLICITUD = [
    { id: 1, nombre: 'REGISTRADO' },
    { id: 2, nombre: 'ATENDIDO' },
];

export const _estadosRequerimiento = [
    { id: 1, nombre: 'SOLICITADO' },
    { id: 2, nombre: 'PEND. AUTORIZACION' },
    // { id: 3, nombre: 'PEND. ASIGNACION' },
    { id: 3, nombre: 'PEND. CONF. SERVICIO' },
    { id: 4, nombre: 'FINALIZADO' },
];

export const TIPOSPRESUPUESTO: Master[] = [
    { id: 1, nombre: 'ORDEN DE SERVICIO (OS)' },
    { id: 2, nombre: 'ORDEN DE COMPRA (OC)' },
    { id: 3, nombre: 'FONDO POR ENCARGO (F/E)' },
    { id: 4, nombre: 'CAJA CHICA (CC)' }
];

export const TIPOSDOCSANEXO: Master[] = [
    { id: 0, nombre: 'NINGUNO' },
    { id: 1, nombre: 'TERMINOS DE REFERENCIA' },
    { id: 2, nombre: 'ESPECIFICACIONES TECNICAS' },
    { id: 3, nombre: 'SOLICITUD FONDO POR ENCARGO' },
];

export const MANTENIMIENTOS: MantenimientoVehicular[] = [
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', asuntoRequerimiento: 'REQUERIMIENTO DE MANTENIMIENTO DE UNIDADES VEHICULARES (MOTOCILETAS) MEDIANTE ORDEN DE SERVICIO U.T. AYACUCHO NORTE', nroHojatramiteReq: '24721-2019', nroInformeReq: '211-2019', fecha: new Date('2019-12-12'), idTipoAsigPresupuesto: 1, nomTipoAsigPresupuesto: 'ORDEN DE SERVICIO (OS)', codAsigPresupuesto: '1576-2019', importeAsigPresupuesto: 6086.00, nroHojatramiteConf: '24721-2019', nroInformeConf: '', nroActaConf: '124-2018', idEstadoMantenimiento: 2, nomEstadoMantenimiento: 'PEND. AUTORIZACION', cotizacion: 2000, asuntoSolicitud: 'SOLICITUD MANTENIMIENTO PREVENTIVO', detalleSolicitud: 'Estimado Sr. Angel:\n Mediante el presente;  solicito a Usted autorización para proceder el cambio de aceite por los 5,000 km de recorrido de la camioneta EGA-125; el mismo que asciende a un monto de S/. 313.00 el cual se estaría cubriendo con fondos de caja chica.\nAgradezco su atención.', conBadge: false },
    { id: 2, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', asuntoRequerimiento: 'REQUERIMIENTO DE MANTENIMIENTO DE UNIDADES VEHICULARES (MOTOCILETAS) MEDIANTE FONDO POR ENCARGO U.T. AYACUCHO NORTE', nroHojatramiteReq: '24734-2019', nroInformeReq: '456-2019', fecha: new Date('2019-10-01'), idTipoAsigPresupuesto: 3, nomTipoAsigPresupuesto: 'FONDO POR ENCARGO (F/E)', codAsigPresupuesto: '448-2019', importeAsigPresupuesto: 1600.00, nroHojatramiteConf: '29187-2019', nroInformeConf: '', nroActaConf: '124-2018', idEstadoMantenimiento: 2, nomEstadoMantenimiento: 'PEND. AUTORIZACION', cotizacion: 2000, asuntoSolicitud: 'SOLICITUD MANTENIMIENTO PREVENTIVO', detalleSolicitud: 'Estimado Sr. Angel:\nMediante el presente;  solicito a Usted autorización para proceder el cambio de aceite por los 5,000 km de recorrido de la camioneta EGA-125; el mismo que asciende a un monto de S/. 313.00 el cual se estaría cubriendo con fondos de caja chica.\n\nAgradezco su atención.', conBadge: false },
    { id: 3, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', asuntoRequerimiento: 'REQUERIMIENTO DE MANTENIMIENTO DE UNIDADES VEHICULARES MEDIANTE ORDEN DE SERVICIO U.T. AYACUCHO NORTE', nroHojatramiteReq: '24755-2019', nroInformeReq: '234-2019', fecha: new Date('2019-09-10'), idTipoAsigPresupuesto: 0, nomTipoAsigPresupuesto: '', codAsigPresupuesto: '', importeAsigPresupuesto: 0, nroHojatramiteConf: '', nroInformeConf: '', nroActaConf: '124-2018', idEstadoMantenimiento: 1, nomEstadoMantenimiento: 'SOLICITADO', cotizacion: 2000, asuntoSolicitud: 'SOLICITUD MANTENIMIENTO PREVENTIVO', detalleSolicitud: 'Estimado Sr. Angel:\n Mediante el presente;  solicito a Usted autorización para proceder el cambio de aceite por los 5,000 km de recorrido de la camioneta EGA-125; el mismo que asciende a un monto de S/. 313.00 el cual se estaría cubriendo con fondos de caja chica.\nAgradezco su atención.', conBadge: false },
    { id: 4, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', asuntoRequerimiento: 'REQUERIMIENTO DE MANTENIMIENTO DE UNIDADES VEHICULARES (MOTOCILETAS) MEDIANTE FONDO POR ENCARGO U.T. AYACUCHO NORTE', nroHojatramiteReq: '24767-2019', nroInformeReq: '543-2019', fecha: new Date('2019-06-02'), idTipoAsigPresupuesto: 3, nomTipoAsigPresupuesto: 'FONDO POR ENCARGO (F/E)', codAsigPresupuesto: '052-2019', importeAsigPresupuesto: 3741.00, nroHojatramiteConf: '', nroInformeConf: '04-2019', nroActaConf: '124-2018', idEstadoMantenimiento: 3, nomEstadoMantenimiento: 'PEND. CONF. SERVICIO', cotizacion: 2000, asuntoSolicitud: 'SOLICITUD MANTENIMIENTO PREVENTIVO', detalleSolicitud: 'Estimado Sr. Angel:\n Mediante el presente;  solicito a Usted autorización para proceder el cambio de aceite por los 5,000 km de recorrido de la camioneta EGA-125; el mismo que asciende a un monto de S/. 313.00 el cual se estaría cubriendo con fondos de caja chica.\nAgradezco su atención.', conBadge: false },
    { id: 5, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', asuntoRequerimiento: 'REQUERIMIENTO DE MANTENIMIENTO DE MOTOCICLETA MEDIANTE CAJA CHICA U.T. AYACUCHO NORTE', nroHojatramiteReq: '24791-2019', nroInformeReq: '765-2019', fecha: new Date('2019-04-14'), idTipoAsigPresupuesto: 4, nomTipoAsigPresupuesto: 'CAJA CHICA (CC)', codAsigPresupuesto: '', importeAsigPresupuesto: 50.00, nroHojatramiteConf: '', nroInformeConf: '03-2019', nroActaConf: '124-2018', idEstadoMantenimiento: 3, nomEstadoMantenimiento: 'PEND. CONF. SERVICIO', cotizacion: 2000, asuntoSolicitud: 'SOLICITUD MANTENIMIENTO PREVENTIVO', detalleSolicitud: 'Estimado Sr. Angel:\n Mediante el presente;  solicito a Usted autorización para proceder el cambio de aceite por los 5,000 km de recorrido de la camioneta EGA-125; el mismo que asciende a un monto de S/. 313.00 el cual se estaría cubriendo con fondos de caja chica.\nAgradezco su atención.', conBadge: false }
];

export const _estadosSolicitudMant = [
    { id: 1, nombre: 'REGISTRADO' },
    { id: 2, nombre: 'PEND. ASIGNACION' },
];

export const _tiposProducto = [
    { id: 1, nombre: 'REPUESTO' },
    { id: 2, nombre: 'SERVICIO' },
];

export const _tiposDocumento = [
    { id: 1, nombre: 'RUC' },
    { id: 2, nombre: 'DNI' },
];

export const _solicitudesMant: SolicitudMant[] = [
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 0, nomTambo: 'OFICINA DE UNIDAD TERRITORIAL', idTipoMantenimiento: 2, nomTipoMantenimiento: 'CORRECTIVO', idVehiculo: 1, idTipoVehiculo: 1, nomTipoVehiculo: 'CAMIONETA', marcaVehiculo: 'NISSAN', placaVehiculo: 'EGT-079', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-12-09'), monto: 1200.00, proforma: null, observacion: '', idEstado: 1, nomEstado: 'REGISTRADO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
    { id: 2, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 1, nomTambo: 'ANCARPATA', idTipoMantenimiento: 2, nomTipoMantenimiento: 'CORRECTIVO', idVehiculo: 2, idTipoVehiculo: 2, nomTipoVehiculo: 'MOTOCICLETA', marcaVehiculo: 'ZONGSHEN', placaVehiculo: 'EA-9256', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-12-09'), monto: 634.00, proforma: null, observacion: '', idEstado: 1, nomEstado: 'REGISTRADO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
    { id: 3, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 2, nomTambo: 'BARRIO VISTA ALEGRE', idTipoMantenimiento: 2, nomTipoMantenimiento: 'CORRECTIVO', idVehiculo: 3, idTipoVehiculo: 2, nomTipoVehiculo: 'MOTOCICLETA', marcaVehiculo: 'ZONGSHEN', placaVehiculo: 'EA-9263', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-12-09'), monto: 984.00, proforma: null, observacion: '', idEstado: 1, nomEstado: 'REGISTRADO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
    { id: 4, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 3, nomTambo: 'CCERAOCRO', idTipoMantenimiento: 2, nomTipoMantenimiento: 'CORRECTIVO', idVehiculo: 3, idTipoVehiculo: 2, nomTipoVehiculo: 'MOTOCICLETA', marcaVehiculo: 'HONDA', placaVehiculo: 'EW-0715', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-12-09'), monto: 348.00, proforma: null, observacion: '', idEstado: 1, nomEstado: 'REGISTRADO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
    { id: 5, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 4, nomTambo: 'CHACHASPATA', idTipoMantenimiento: 2, nomTipoMantenimiento: 'CORRECTIVO', idVehiculo: 3, idTipoVehiculo: 2, nomTipoVehiculo: 'MOTOCICLETA', marcaVehiculo: 'HONDA', placaVehiculo: 'EB-7316', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-12-09'), monto: 418.80, proforma: null, observacion: '', idEstado: 1, nomEstado: 'REGISTRADO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
    { id: 6, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 5, nomTambo: 'CHURUNMARCA', idTipoMantenimiento: 2, nomTipoMantenimiento: 'CORRECTIVO', idVehiculo: 3, idTipoVehiculo: 2, nomTipoVehiculo: 'MOTOCICLETA', marcaVehiculo: 'HONDA', placaVehiculo: 'EW-0724', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-12-09'), monto: 457.00, proforma: null, observacion: '', idEstado: 1, nomEstado: 'REGISTRADO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
    { id: 7, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 6, nomTambo: 'COCHAPAMPA', idTipoMantenimiento: 2, nomTipoMantenimiento: 'CORRECTIVO', idVehiculo: 3, idTipoVehiculo: 2, nomTipoVehiculo: 'MOTOCICLETA', marcaVehiculo: 'ZONGSHEN', placaVehiculo: 'EA-9316', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-12-09'), monto: 488.00, proforma: null, observacion: '', idEstado: 1, nomEstado: 'REGISTRADO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
    { id: 8, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', idTambo: 7, nomTambo: 'CAYARPACHI', idTipoMantenimiento: 1, nomTipoMantenimiento: 'PREVENTIVO', idVehiculo: 3, idTipoVehiculo: 2, nomTipoVehiculo: 'MOTOCICLETA', marcaVehiculo: 'ZONGSHEN', placaVehiculo: 'EA-9546', idProveedor: 0, nomProveedor: 'ZEA SILVA VLADIMIR', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10411143932', fecha: new Date('2019-10-09'), monto: 445.00, proforma: null, observacion: '', idEstado: 2, nomEstado: 'ATENDIDO', detalleSolicitudMant: null, fechaMant: null, kilometrajeInicio: null },
];


export const _listaDetalleSolicitud: DetalleSolicitudMant[] = [
    { id: 1, idTipoProducto: 1, nomTipoProducto: 'REPUESTO', producto: 'BATERIA N°01', cantidad: 1, unidadMedida: '', monto: 135.00, idSolicitudMant: 1 },
    { id: 2, idTipoProducto: 1, nomTipoProducto: 'REPUESTO', producto: 'PROTECTOR DE BATERIA', cantidad: 1, unidadMedida: '', monto: 18.00, idSolicitudMant: 1 },
    { id: 3, idTipoProducto: 1, nomTipoProducto: 'REPUESTO', producto: 'CAMARA N° 18', cantidad: 1, unidadMedida: '', monto: 36.00, idSolicitudMant: 1 },
    { id: 4, idTipoProducto: 2, nomTipoProducto: 'SERVICIO', producto: 'MANTENIMIENTO GENERAL (reparacion de motor, cambio de aceite, limpieza cambio de bujia, limpieza de filtro de aire y revision de luces)', cantidad: 1, unidadMedida: '', monto: 48.00, idSolicitudMant: 1 },
    { id: 5, idTipoProducto: 2, nomTipoProducto: 'SERVICIO', producto: 'REPARACION DE MOTOR', cantidad: 1, unidadMedida: '', monto: 90.00, idSolicitudMant: 1 },
];

//CONFIGURACION
export const _estadosBanco = [
    { id: 1, nombre: 'ACTIVO' },
    { id: 2, nombre: 'INACTIVO' }
];
export const _bancos: Banco[] = [
    { id: 1, nombre: 'INTERBANK', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '20478876653', fecha: new Date('2019-12-09'), idEstado: 1, nomEstado: 'ACTIVO' },
    { id: 2, nombre: 'SCOTIABANK', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '20244433435', fecha: new Date('2019-12-09'), idEstado: 1, nomEstado: 'ACTIVO' },
    { id: 3, nombre: 'BANCO DE LA NACION', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '20354422242', fecha: new Date('2019-12-09'), idEstado: 2, nomEstado: 'INACTIVO' },
];

export const _departamentos = [
    { id: 1, nombre: 'AYACUCHO' },
    { id: 2, nombre: 'LIMA' }
];

export const _provincias = [
    { id: 1, nombre: 'HUAMANGA', idDepartamento: 1 },
    { id: 2, nombre: 'LIMA', idDepartamento: 2 }
];

export const _distritos = [
    { id: 1, nombre: 'JESUS NAZARENO', idProvincia: 1 },
    { id: 2, nombre: 'LIMA', idProvincia: 2 }
];

export const _proveedores: Proveedor[] = [
    { id: 1, nombre: 'SERVICENTRO MODA S.A.C', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '20452629284', idDepartamento: 1, nomDepartamento: 'AYACUCHO', idProvincia: 1, nomProvincia: 'HUAMANGA', idDistrito: 1, nomDistrito: 'JESUS NAZARENO', direccion: 'PROLONGACION KENNDY NRO. SN (SALIDA HACIA CUSCO)', telefono: '', fecha: new Date('2019-12-09'), idBanco: 0, nomBanco: '', nroCuenta: '', cciCuenta: '' },
    { id: 2, nombre: 'ESCOBAL JULCAMORO ROSA ELVIRA', idTipoDocumento: 1, nomTipoDocumento: 'RUC', nroDocumento: '10419147601', idDepartamento: 2, nomDepartamento: 'LIMA', idProvincia: 2, nomProvincia: 'LIMA', idDistrito: 2, nomDistrito: 'LIMA', direccion: 'AVENIDA MARTINES DE UCHURACAY 250 BR SAN MARTIN', telefono: '', fecha: new Date('2019-12-09'), idBanco: 0, nomBanco: '', nroCuenta: '', cciCuenta: '' },
];

export const _estadosCuentaBanco = [
    { id: 1, nombre: 'PRINCIPAL' },
    { id: 2, nombre: 'SECUNDARIO' },
];

export const _tiposOrden: any[] = [
    { id: 1, nombre: '' },
    { id: 2, nombre: 'ORDEN DE COMPRA (OC)' },
];

export const _estadosOrden: any[] = [
    { id: 1, nombre: 'IMPORTADO' },
    { id: 2, nombre: 'ACTIVO' },
    { id: 3, nombre: 'DESESTIMADO' },
];

export const _ordenesCompra: OrdenCompra[] = [
    { id: 1, nroOrdenCompra: '0000060', nroExpSIAF: '0000002811', fecha: new Date('12/06/2019'), idTipoDocumento: 0, nomTipoDocumento: '', nroDocumento: '', idProveedor: 0, nomProveedor: '', monto: 10188.08, idEstado: 1, nomEstado: 'IMPORTADO', nroCuadroAdquisicion: '', tipoProceso: '', nroContrato: '', idMoneda: 1, nomMoneda: 'S/', tc: 0, concepto: 'ADQUISICION DE COMBUSTIBLE PARA LA U.T. AYACUCHO SUR' },
    { id: 2, nroOrdenCompra: '0000045', nroExpSIAF: '0000002412', fecha: new Date('12/06/2019'), idTipoDocumento: 2, nomTipoDocumento: 'RUC', nroDocumento: '20452631858', idProveedor: 2, nomProveedor: 'COORPORACION SANTA BERTHA S.A.C', monto: 6945.00, idEstado: 2, nomEstado: 'ACTIVO', nroCuadroAdquisicion: '', tipoProceso: '', nroContrato: '', idMoneda: 1, nomMoneda: 'S/', tc: 0, concepto: 'ADQUISICION DE COMBUSTIBLE PARA LA U.T. AYACUCHO SUR' },
    { id: 3, nroOrdenCompra: '0000036', nroExpSIAF: '0000002345', fecha: new Date('12/06/2019'), idTipoDocumento: 2, nomTipoDocumento: 'RUC', nroDocumento: '20452629284', idProveedor: 1, nomProveedor: 'SERVICENTRO MODA S.A.C', monto: 9188.00, idEstado: 3, nomEstado: 'DESESTIMADO', nroCuadroAdquisicion: '', tipoProceso: '', nroContrato: '', idMoneda: 1, nomMoneda: 'S/', tc: 0, concepto: 'ADQUISICION DE COMBUSTIBLE PARA LA U.T. AYACUCHO SUR' }
];

export const _ordenesServicio: OrdenServicio[] = [
    { id: 1, nroOrdenServicio: '0000060', nroExpSIAF: '0000002811', fecha: new Date('12/06/2019'), idTipoDocumento: 0, nomTipoDocumento: '', nroDocumento: '', idProveedor: 0, nomProveedor: '', monto: 10188.08, idEstado: 1, nomEstado: 'IMPORTADO', nroCuadroAdquisicion: '', tipoProceso: '', nroContrato: '', idMoneda: 1, nomMoneda: 'S/', tc: 0, concepto: 'ADQUISICION DE COMBUSTIBLE PARA LA U.T. AYACUCHO SUR' },
    { id: 2, nroOrdenServicio: '0000045', nroExpSIAF: '0000002412', fecha: new Date('12/06/2019'), idTipoDocumento: 2, nomTipoDocumento: 'RUC', nroDocumento: '20452631858', idProveedor: 2, nomProveedor: 'COORPORACION SANTA BERTHA S.A.C', monto: 6945.00, idEstado: 2, nomEstado: 'ACTIVO', nroCuadroAdquisicion: '', tipoProceso: '', nroContrato: '', idMoneda: 1, nomMoneda: 'S/', tc: 0, concepto: 'ADQUISICION DE COMBUSTIBLE PARA LA U.T. AYACUCHO SUR' },
    { id: 3, nroOrdenServicio: '0000036', nroExpSIAF: '0000002345', fecha: new Date('12/06/2019'), idTipoDocumento: 2, nomTipoDocumento: 'RUC', nroDocumento: '20452629284', idProveedor: 1, nomProveedor: 'SERVICENTRO MODA S.A.C', monto: 9188.00, idEstado: 3, nomEstado: 'DESESTIMADO', nroCuadroAdquisicion: '', tipoProceso: '', nroContrato: '', idMoneda: 1, nomMoneda: 'S/', tc: 0, concepto: 'ADQUISICION DE COMBUSTIBLE PARA LA U.T. AYACUCHO SUR' }
];

export const _fondosEncargo: FondoEncargo[] = [
    { id: 1, nroResAdministracion: '165', fecha: new Date('2018-07-20'), concepto: 'ADQUISICION DE BIENES A FIN DE GARANTIZAR LA OPERATIVIDAD DE LOS VEHICULOS', monto: 10290.00, observacion: '' },
    { id: 2, nroResAdministracion: '19', fecha: new Date('2019-06-12'), concepto: 'ADQUISICION DE COMBUSTIBLE PARA EL TAMBO SANABAMBA Y LUBRICANTES - UT AYACUCHO NORTE', monto: 3685.50, observacion: '' },
];


export const _requerimientosBien: RequerimientoBien[] = [
    { id: 1, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', nroHojatramiteReq: '24721-2019', nroInformeReq: '211-2019', idTipoAsigPresupuesto: 1, nomTipoAsigPresupuesto: 'ORDEN DE SERVICIO (OS)', codAsigPresupuesto: '1576-2019', importeAsigPresupuesto: 6086.00, idEstadoRequerimiento: 2, nomEstadoRequerimiento: 'PEND. AUTORIZACION', cotizacion: 2000, asuntoRequerimiento: 'SOLICITUD COMBUSTIBLE Y LUBRICANTES', fecha: new Date('08/01/2020'), conBadge: false },
    { id: 2, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', nroHojatramiteReq: '24734-2019', nroInformeReq: '456-2019', idTipoAsigPresupuesto: 3, nomTipoAsigPresupuesto: 'FONDO POR ENCARGO (F/E)', codAsigPresupuesto: '448-2019', importeAsigPresupuesto: 1600.00, idEstadoRequerimiento: 2, nomEstadoRequerimiento: 'PEND. AUTORIZACION', cotizacion: 2000, asuntoRequerimiento: 'SOLICITUD DE ENCARGO INTERNO PARA ADQUISICION DE COMBUSTIBLE PARA EL TAMBO SANABAMBA Y LUBRICANTES PARA MOTOCILCETAS, GENERADORES Y CAMIONETA EGT 079 DE LA UT AYACUCHO NORTE', fecha: new Date('08/01/2020'), conBadge: false },
    { id: 3, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', nroHojatramiteReq: '24755-2019', nroInformeReq: '234-2019', idTipoAsigPresupuesto: 0, nomTipoAsigPresupuesto: '', codAsigPresupuesto: '', importeAsigPresupuesto: 0, idEstadoRequerimiento: 1, nomEstadoRequerimiento: 'SOLICITADO', cotizacion: 2000, asuntoRequerimiento: 'SOLICITUD COMBUSTIBLE Y LUBRICANTES', fecha: new Date('08/01/2020'), conBadge: false },
    { id: 4, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', nroHojatramiteReq: '24767-2019', nroInformeReq: '543-2019', idTipoAsigPresupuesto: 3, nomTipoAsigPresupuesto: 'FONDO POR ENCARGO (F/E)', codAsigPresupuesto: '052-2019', importeAsigPresupuesto: 3741.00, idEstadoRequerimiento: 2, nomEstadoRequerimiento: 'PEND. AUTORIZACION', cotizacion: 2000, asuntoRequerimiento: 'SOLICITUD DE ENCARGO INTERNO PARA ADQUISICION DE COMBUSTIBLE PARA LOS TAMBOS DE CUNYA, CHURUNMARCA, CHACHASPATA Y MARCCARACCAY DE LA UT AYACUCHO NORTE', fecha: new Date('08/01/2020'), conBadge: false },
    { id: 5, idUnidad: 1, nomUnidad: 'U.T. AYACUCHO NORTE', nroHojatramiteReq: '24791-2019', nroInformeReq: '765-2019', idTipoAsigPresupuesto: 4, nomTipoAsigPresupuesto: 'CAJA CHICA (CC)', codAsigPresupuesto: '', importeAsigPresupuesto: 50.00, idEstadoRequerimiento: 2, nomEstadoRequerimiento: 'PEND. AUTORIZACION', cotizacion: 2000, asuntoRequerimiento: 'SOLICITUD COMBUSTIBLE Y LUBRICANTES', fecha: new Date('08/01/2020'), conBadge: false }
];

export const _monedas: any = [
    { id: 1, nombre: 'S/.' },
    { id: 2, nombre: '$.' },
];

export const _mNemonico: any[] = [
    { id: 22, nombre: '22' }
];