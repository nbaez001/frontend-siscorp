import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { EjecucionProyectoService } from '../../services/ejecucion-proyecto.service';

import * as Highcharts from 'highcharts';
import * as sunburst from 'highcharts/modules/sunburst';

const Sunburst: any = sunburst;
Sunburst(Highcharts);

@Component({
  selector: 'ups-ejecucion-proyecto',
  templateUrl: './ejecucion-proyecto.component.html',
  styleUrls: ['./ejecucion-proyecto.component.scss'],
  providers: [
    EjecucionProyectoService
  ]
})
export class EjecucionProyectoComponent implements OnInit, AfterViewInit {

  departamentos = [0, 1, 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

  @ViewChildren('tagDepartamentos') tagDepartamentos: QueryList<any>;

  constructor(
    private ejecucionService: EjecucionProyectoService
  ) { }

  ngOnInit() {
    Highcharts.chart('general', this.ejecucionService.optionsChartGeneral);
    Highcharts.chart('info', this.ejecucionService.optionsChartInfo);
  }

  ngAfterViewInit() {
    this.departamentos.forEach(d => {

      this.ejecucionService.top = d % 2 === 0;
      this.ejecucionService.indexDepartamento = d;
      Highcharts.chart('detalle' + d, this.ejecucionService.optionsChartDetail);
    });
    /*this.tagDepartamentos.changes.subscribe(({length}) => {

      if (length > 0) {

        this.departamentos.forEach(d => {
          Highcharts.chart('detalle' + d, this.ejecucionService.optionsChartDetail);
        });
      }

    });*/
  }

}
