import { Injectable } from '@angular/core';
import { environment as env } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncargadoService {

  constructor() { }

  generarExcel() {
    return `${env.backendUrlProj}/reportes/download/encargado/proyecto.xlsx`;
  }

  generarExcel2() {
    return `${env.backendUrlProj}/reportes/download/encargado/proyecto.xlsx`;
  }

  generarExcel3() {
    return `${env.backendUrlProj}/reportes/download/jefe/proyecto.xlsx`;
  }


}
