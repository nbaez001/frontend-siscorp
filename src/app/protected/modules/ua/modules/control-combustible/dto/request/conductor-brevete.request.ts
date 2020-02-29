import { BreveteRequest } from './brevete.request';

export class ConductorBreveteRequest {
    idVehiculo: number;
    idEmpleado: number;
    fidIdUsuarioReg: number;
    fecReg: Date;
    txtIpmaqReg: string;
    brevete: BreveteRequest;
}