export interface Observacion {

  idObservacion: number;
  observacion: string;
  fechaRegistro: string;
  nombreObservo: string;

  } 
  

  export interface WsResponseObservacion {
    response: Observacion[];
    total: number;
    codResultado: number;
    msgResultado: string;
  }