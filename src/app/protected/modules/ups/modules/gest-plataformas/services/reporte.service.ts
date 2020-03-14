import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prefactibilidad } from '../entities/prefactibilidad';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'environments/environment';

enum TIPOS {
  SITUACIONES = 'SITUACIONES',
  ESTADOS = 'ESTADOS',
  SUBESTADOS = 'SUBESTADOS',
  SSUBESTADOS = 'SSUBESTADOS'
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private optionsVariablePieChart: any = {
    chart: {
      type: 'variablepie',
      borderRadius: '40px'
    },
    title: {
      text: '',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '20px',
        fontFamily: 'calibri',
        color: '#5b5959'
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        'Cantidad: <b>{point.y}</b><br/>' +
        'Porcentaje: <b>{point.porcentaje}</b><br/>'
    },
    plotOptions: {
      variablepie: {
        size: '80%',
        events: {},
        dataLabels: {
          distance: -60,
          format: '',
          style: {
            fontWeight: 'bold',
            fontFamily: 'calibri',
            color: 'white',
            fontSize: '15px',
            textOutline: '0.4px #828179'
          }
        },
      }
    },
    series: [{
      allowPointSelect: true,
      minPointSize: 10,
      innerSize: '30%',
      zMin: 0,
      borderWidth: 5,
      data: []
    }]
  };

  situaciones: Prefactibilidad[] = [];

  estados: Prefactibilidad[] = [];

  subestadoSeleccionado: Prefactibilidad;

  ssubEstados: Prefactibilidad[] = [];

  constructor(
    private http: HttpClient
  ) { }

  async optionsVariablePieCharSituacion(): Promise<any> {
    this.situaciones = await this.getSituaciones();

    const total = this.situaciones.map(s => s.cantidadTambos).reduce((a, b) => a + b);

    const opciones = Object.assign({}, this.optionsVariablePieChart);

    opciones.chart.borderRadius = '40px';
    opciones.chart.height = undefined;
    opciones.chart.width = undefined;
    opciones.title.useHTML = true;
    opciones.title.align = 'center';
    opciones.title.style = {
      textAlign: 'center',
      fontWeight: '700',
      fontFamily: 'Calibri-Bold, Calibri',
      color: '#676565',
      fontSize: '20px'
    };
    opciones.title.text = '<div>TOTAL <br> <span style="font-size: 30px">' + total + '</span></div>';
    opciones.plotOptions.variablepie.dataLabels.format =
      '<div style="font-size: 20px;">{point.porcentaje}%</div>';
    opciones.tooltip.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
      'Cantidad: <b>{point.y}</b><br/> Porcentaje: <b>{point.porcentaje}%</b><br/>';
    opciones.plotOptions.variablepie.events = {};

    let descontar = 0;

    opciones.series[0].data = this.situaciones
    .map(d => {

      const z: number = 100 - descontar;
      descontar += 20;

      return {
        name: d.estado,
        color: d.estilo,
        porcentaje: d.porcentaje,
        y: d.cantidadTambos,
        z
      };
    });

    return opciones;
  }

  async optionsVariablePieChartEstado(id: number): Promise<any> {
    this.estados = await this.getEstados(id);

    const total = this.estados.map(d => d.cantidadTambos).reduce((a, b) => a + b);

    const opciones = Object.assign({}, this.optionsVariablePieChart);

    opciones.chart.borderRadius = '40px';
    opciones.chart.height = undefined;
    opciones.chart.width = undefined;
    opciones.title.useHTML = true;
    opciones.title.align = 'center';
    opciones.title.style = {
      textAlign: 'center',
      fontWeight: '700',
      fontFamily: 'Calibri-Bold, Calibri',
      color: '#676565',
      fontSize: '20px'
    };
    opciones.title.text = '<div>TOTAL <br> <span style="font-size: 30px">' + total + '</span></div>';
    opciones.plotOptions.variablepie.dataLabels.format =
      '<div style="font-size: 20px;">{point.porcentaje}%</div>';
    opciones.tooltip.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
      'Cantidad: <b>{point.y}</b><br/> Porcentaje: <b>{point.porcentaje}%</b><br/>';
    opciones.plotOptions.variablepie.events = {};

    let descontar = 0;

    opciones.series[0].data = this.estados
    .map(d => {
      const z: number = 100 - descontar;

      descontar += 20;

      return {
        name: d.estado,
        color: d.estilo,
        y: d.cantidadTambos,
        z,
        porcentaje: d.porcentaje
      };
    });

    return opciones;
  }

  async optionsVariablePieChartSubEstado(e: Prefactibilidad): Promise<any> {
    const subEstados: Prefactibilidad[] = await this.getSubestados(e.idCodigo);

    const opciones = Object.assign({}, this.optionsVariablePieChart);

    opciones.chart.backgroundColor = 'transparent';
    opciones.chart.height = '300';
    opciones.chart.width = '300';
    opciones.title.text = '';
    opciones.plotOptions.variablepie.dataLabels.format = '<div style="font-size: 20px;">{point.porcentaje}%</div>';
    opciones.tooltip.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        'Cantidad: <b>{point.cantidad}</b><br/> Porcentaje: <b>{point.porcentaje}%</b><br/>';
    opciones.plotOptions.variablepie.events.click = ({point}) => this.seleccionarSubEstado(point);

    let opacidad = 1;

    opciones.series[0].data = subEstados
    .map(d => {

      const color = e.estilo.replace(', 1)', ', ' + opacidad + ')');

      opacidad -= 0.2;

      return {
        name: d.estado,
        color,
        y: 25,
        z: 100,
        cantidad: d.cantidadTambos,
        idCodigo: d.idCodigo,
        porcentaje: d.porcentaje
      };
    })
    .reverse();

    return opciones;
  }

  async seleccionarSubEstado(point: any) {

    this.ssubEstados = [];

    this.subestadoSeleccionado = {
      cantidadTambos: point.cantidad,
      estado: point.name,
      estilo: point.color,
      idCodigo: point.idCodigo,
      porcentaje: point.porcentaje
    };
    this.ssubEstados = await this.getSsubestados(point.idCodigo);
  }

  getSituaciones(): Promise<Prefactibilidad[]> {
    return this.prefactibilidad(TIPOS.SITUACIONES, 0).toPromise();
  }

  getEstados(id: number): Promise<Prefactibilidad[]> {
    return this.prefactibilidad(TIPOS.ESTADOS, id).toPromise();
  }

  getSubestados(id: number): Promise<Prefactibilidad[]> {
    return this.prefactibilidad(TIPOS.SUBESTADOS, id).toPromise();
  }

  getSsubestados(id: number): Promise<Prefactibilidad[]> {
    return this.prefactibilidad(TIPOS.SSUBESTADOS, id).toPromise();
  }

  private prefactibilidad(tipo: TIPOS, id: number): Observable<Prefactibilidad[]> {
    return this.http.get<Prefactibilidad[]>(`${env.backendUrlPref}/reportes/prefactibilidad/${tipo}/${id}`, { reportProgress: true });
  }

  async ultimaFechaActualizacion(): Promise<string> {
    return this.http.get(`${env.backendUrlPref}/reportes/ultima-fecha-actualizacion`, { responseType: 'text' }).toPromise();
  }
}
