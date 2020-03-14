import { Component, OnInit } from '@angular/core';
import { GestionTambosService } from '../../services/gestion-tambos.service';
import { CondicionesTambos } from '../../entities/recurso';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'ups-jerarquia-condicion',
  templateUrl: './jerarquia-condicion.component.html',
  styleUrls: ['./jerarquia-condicion.component.scss']
})
export class JerarquiaCondicionComponent implements OnInit {

  datos: CondicionesTambos[] = [];
  tDatos: any[] = [];

  colores: string[] = [
    'green',
    'orange',
    'purple'
  ];

  constructor(
    public matDialogRef: MatDialogRef<JerarquiaCondicionComponent>,
    private gestTamb: GestionTambosService
  ) { }

  ngOnInit() {
    this.gestTamb.jerarquiaCondiciones().subscribe(datos => {
      this.datos = datos;

      let iSituacion = null;
      let iEstado = null;
      let iSubEstado = null;

      this.datos.forEach((d, i, self) => {

        // SITUACIONES
        iSituacion = this.tDatos.map(si => si.idSituacion).indexOf(d.idSituacion);

        if (iSituacion === -1) {

          this.tDatos.push({
            idSituacion: d.idSituacion,
            situacion: d.situacion,
            estados: [],
            cantDetSubEstados: 0
          });

          iSituacion = this.tDatos.map(si => si.idSituacion).indexOf(d.idSituacion);
        }

        // ESTADOS
        iEstado = this.tDatos[iSituacion].estados.map(es => es.idEstado).indexOf(d.idEstado);

        if (iEstado === -1) {
          this.tDatos[iSituacion].estados.push({
            idEstado: d.idEstado,
            estado: d.estado,
            subEstados: [],
            cantDetSubEstados: 0
          });

          iEstado = this.tDatos[iSituacion].estados.map(es => es.idEstado).indexOf(d.idEstado);
        }

        // SUB ESTADOS
        iSubEstado = this.tDatos[iSituacion].estados[iEstado].subEstados.map(se => se.idSubEstado).indexOf(d.idSubEstado);

        if (iSubEstado === -1) {
          this.tDatos[iSituacion].estados[iEstado].subEstados.push({
            idSubEstado: d.idSubEstado,
            subEstado: d.subEstado,
            detSubEstados: [],
            cantDetSubEstados: 0
          });

          iSubEstado = this.tDatos[iSituacion].estados[iEstado].subEstados.map(se => se.idSubEstado).indexOf(d.idSubEstado);
        }

        this.tDatos[iSituacion].estados[iEstado].subEstados[iSubEstado].detSubEstados.push({
          idDetSubEstado: d.idDetSubEstado,
          detSubEstado: d.detSubEstado
        });

        this.tDatos[iSituacion].cantDetSubEstados += 1;
        this.tDatos[iSituacion].estados[iEstado].cantDetSubEstados += 1;
        this.tDatos[iSituacion].estados[iEstado].subEstados[iSubEstado].cantDetSubEstados += 1;

      });
    });
  }

}
