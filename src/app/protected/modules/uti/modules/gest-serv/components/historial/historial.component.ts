import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { GestServService } from '../../services/gest-serv.service';
import { EstadoActual, Parametros } from '../../entities/estado';

@Component({
  selector: 'gest-serv-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {

  estadoActual: EstadoActual = {
    usuario: ''
  } as EstadoActual;

  constructor(
    private gestServ: GestServService,
    private cd: ChangeDetectorRef,
    public bottomSheetRef: MatBottomSheetRef<HistorialComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private parametros: Parametros
  ) { }

  ngOnInit() {
    this.gestServ.estadoActual(
      this.parametros.tipo,
      this.parametros.idServ
    ).subscribe(estadoActual => {
      this.estadoActual = estadoActual;
      this.cd.markForCheck();
    });
  }

}
