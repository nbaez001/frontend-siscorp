export class Alcance{
    idCodigo: number;
    nombre: string;
    
}

export class WsResponseAlcance{
    response: Alcance[];
    total: number;
    codResultado: number;
    msgResultado: string;
}