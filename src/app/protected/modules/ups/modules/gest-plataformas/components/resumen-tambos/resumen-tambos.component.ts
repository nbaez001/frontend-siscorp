import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Prefactibilidad } from '../../entities/prefactibilidad';
import { ReporteService } from './../../services/reporte.service';
import { environment as env } from 'environments/environment';
import * as Highcharts from 'highcharts';
import * as variablepie from 'highcharts/modules/variable-pie';
import { MatDialog } from '@angular/material';
import { SubestadoPlataformasComponent } from '../subestado-plataformas/subestado-plataformas.component';

const VariablePie: any = variablepie;
VariablePie(Highcharts);

@Component({
  selector: 'ups-resumen-tambos',
  templateUrl: './resumen-tambos.component.html',
  styleUrls: ['./resumen-tambos.component.scss']
})
export class ResumenTambosComponent implements OnInit {

  @ViewChildren('arregloEstados') arregloEstados: QueryList<any>;

  // SITUACIONES
  get situaciones(): Prefactibilidad[] {
    return this.reporteService.situaciones;
  }

  situacionSeleccinado: Prefactibilidad = {} as Prefactibilidad;

  // ESTADOS
  estados: Prefactibilidad[] = [];

  // SSUBESTADOS
  get ssubestados(): Prefactibilidad[] {

    let opacity = 1;

    return this.reporteService.ssubEstados.map(sse => {
      sse.opacity = opacity;

      opacity -= 0.2;

      return sse;
    });
  }

  get subestadoSeleccionado(): Prefactibilidad {
    return this.reporteService.subestadoSeleccionado;
  }

  ultimaFechaActualizacion: string;

  constructor(
    private dialog: MatDialog,
    private reporteService: ReporteService
  ) { }

  async ngOnInit() {
    this.obtenerSituaciones();

    this.ultimaFechaActualizacion = await this.reporteService.ultimaFechaActualizacion();
  }

  async seleccionarSituacion(s: Prefactibilidad) {

    if (s.idCodigo === this.situacionSeleccinado.idCodigo) {
      this.obtenerSituaciones();
      return;
    }

    this.situacionSeleccinado = s;
    Highcharts.chart('estados', await this.reporteService.optionsVariablePieChartEstado(s.idCodigo));

    this.estados = this.reporteService.estados;

    this.reporteService.subestadoSeleccionado = null;

    this.reporteService.ssubEstados = [];

    this.obtenerSubEstadosChart();
  }

  obtenerSubEstadosChart() {
    this.estados.forEach(async (e, i) => {
      Highcharts.chart('estado-detalle' + e.idCodigo, await this.reporteService.optionsVariablePieChartSubEstado(e));
    });
  }

  async obtenerSituaciones() {
    Highcharts.chart('estados', await this.reporteService.optionsVariablePieCharSituacion());
    this.situacionSeleccinado = {} as Prefactibilidad;
    this.reporteService.subestadoSeleccionado = null;
    this.estados = [];
    this.reporteService.ssubEstados = [];
  }

  exportar() {
    window.open(`${env.backendUrlPref}/reportes/exportar-prefactibilidad`, '_blank');
  }

  verPlataformas(detalleSubEstado: Prefactibilidad) {
    this.dialog.open(SubestadoPlataformasComponent, {
      panelClass: 'dialog-no-padding',
      width: '600px',
      data: detalleSubEstado
    });
  }

}
