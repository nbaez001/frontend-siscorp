export class ComboRequest {
   
    opcion?:string;


  }
 

  export interface WsItemComboRequest{
    response: ComboRequest[];
    codResultado: number;
    msgResultado: string;
    total: number;
  }