import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { GestServService } from '../../services/gest-serv.service';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Historial } from '../../entities/historial';
import { Servicios } from '../../entities/estado';

@Component({
  selector: 'app-historial-estados',
  templateUrl: './historial-estados.component.html',
  styleUrls: ['./historial-estados.component.scss']
})
export class HistorialEstadosComponent implements OnInit {

  columnas: string[] = ['estado', 'fecha', 'usuario', 'detalle'];
  historial: Historial[] = [];

  constructor(
    public bottomSheetRef: MatBottomSheetRef<HistorialEstadosComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public params: Parametros,
    private cd: ChangeDetectorRef,
    private gestServ: GestServService
  ) { }

  ngOnInit() {
    this.gestServ.historial(this.params.idPlat).subscribe(historial => {
      this.historial = historial;
      this.cd.markForCheck();
    });
  }

  get hasInt(): boolean {
    return Servicios.internet === this.params.tipo || !this.params.tipo;
  }

  get hasTel() {
    return Servicios.telefonia === this.params.tipo || !this.params.tipo;
  }

  get historialInternet() {
    return this.historial.filter(h => h.tipo === Servicios.internet);
  }

  get historialTelefonia() {
    return this.historial.filter(h => h.tipo === Servicios.telefonia);
  }

}

interface Parametros {
  idPlat: number;
  tipo: Servicios;
}
