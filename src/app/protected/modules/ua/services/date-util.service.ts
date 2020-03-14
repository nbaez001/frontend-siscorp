import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateUtilService {

    constructor() { }

    calcularDias(fechaInicio: Date, fechaFin: Date): number {
        let contdias = Math.round((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
        return contdias;
    }

    calcularAnchoOpciones(cantidadBotones: number): string {
        return `mat-column-opt-${cantidadBotones}`;
    }

    evaluarAnchoOpciones(valorAnterior: number, valorNuevo: number): number {
        if (valorAnterior >= valorNuevo) {
            return valorAnterior;
        } else {
            return valorNuevo;
        }
    }
}