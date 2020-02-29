import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EjecucionProyectoService {

  private optionsChart: any = {
    chart: {
      // type: 'variablepie',
      // borderRadius: '40px'
      backgroundColor: 'transparent'
    },
    credits: {
      enabled: false
    },
    /*tooltip: {
      headerFormat: '',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        'Cantidad: <b>{point.y}</b><br/>' +
        'Porcentaje: <b>{point.percentage:.0f}</b><br/>'
    },*/
    /*plotOptions: {
      variablepie: {
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
    },*/
    series: [{
      minPointSize: 10,
      innerSize: '50%',
      borderWidth: 5,
      size: '100%',
      data: []
    }]
  };

  top = true;

  indexDepartamento: number;

  constructor() { }

  get optionsChartGeneral(): any {

    const opciones = Object.assign({}, this.optionsChart);

    // opciones.chart.height = '300';
    // opciones.chart.width = '300';
    /*opciones.title.text = '';
    opciones.plotOptions.variablepie.dataLabels.format = '<div style="font-size: 20px;">{point.porcentaje:.1f}%</div>';
    opciones.tooltip.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        'Cantidad: <b>{point.cantidad}</b><br/>' +
        'Porcentaje: <b>{point.porcentaje:.1f}</b><br/>';*/

    opciones.chart.type = 'sunburst';
    opciones.title = {
      text: `<div style="width: 100px;word-wrap: break-word;height: auto;">SEGUIMIENTO <br> Y CONTROL</div>`,
      align: 'center',
      useHTML: true,
      verticalAlign: 'middle',
      style: {
        fontSize: '15px',
        fontFamily: 'calibri',
        color: '#5b5959',
        fontWeight: '700',
        textAlign: 'center'
      }
    };
    opciones.series[0].data = [
      /*{
        id: '0.0',
        parent: '',
        color: '#fff',
        name: 'SEGUIMIENTO Y CONTROL'
      },*/
      {
        id: '1.0',
        name: 'OBRAS',
        color: '#95bc11',
        parent: '0.0',
        value: 500
      },
      {
        id: '2.0',
        name: 'PRESUPUESTO',
        color: '#64d1da',
        parent: '0.0',
        value: 500
      },
      {
        id: '3.0',
        name: 'ETAPAS DEL PROYECTO',
        color: '#34b2e4',
        parent: '0.0',
        value: 500
      },
      {
        id: '4.0',
        name: 'EQUIPAMIENTO',
        color: '#065381',
        parent: '0.0',
        value: 500
      }
    ];

    return opciones;
  }

  get optionsChartDetail(): any {

    let color = '#1c98bc';

    switch (this.indexDepartamento) {
      case 0: color = '#cea100'; break;
      case 1: color = '#e68922'; break;
      case 2: color = '#d22c42'; break;
      case 3: color = '#a70656'; break;
      case 4: color = '#085889'; break;
    }

    const opciones = Object.assign({}, this.optionsChart);
    // opciones.chart.height = '300';
    opciones.chart.width = '200';
    opciones.chart.plotBackgroundColor = 'transparent';
    opciones.chart.animation = false;
    // opciones.pane.background.backgroundColor = 'transparent';
    // opciones.chart.margin = 0;
    /*opciones.title.text = '';
    opciones.plotOptions.variablepie.dataLabels.format = '<div style="font-size: 20px;">{point.porcentaje:.1f}%</div>';
    opciones.tooltip.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        'Cantidad: <b>{point.cantidad}</b><br/>' +
        'Porcentaje: <b>{point.porcentaje:.1f}</b><br/>';*/

    opciones.chart.type = 'variablepie';
    opciones.series[0].innerSize = '60%';
    opciones.series[0].borderWidth = 1;
    opciones.plotOptions = {
      variablepie: {
        center: ['50%', (this.top ? '20%' : '40%')],
      },
      series: {
        dataLabels: {
          enabled: false
        }
      }
    };
    opciones.title = {
      text: '',
      // text: `<div style="width: 100px;word-wrap: break-word;height: auto;">SEGUIMIENTO <br> Y CONTROL</div>`,
      /*align: 'center',
      useHTML: true,
      verticalAlign: 'middle',
      style: {
        fontSize: '15px',
        fontFamily: 'calibri',
        color: '#5b5959',
        fontWeight: '700',
        textAlign: 'center'
      }*/
    };
    opciones.series[0].zMin = 0;
    opciones.series[0].data = [
      {
        name: 'OBRAS',
        color,
        y: 100,
        z: 100
      }
    ];

    return opciones;
  }

  get optionsChartInfo(): any {
    const opciones = Object.assign({}, this.optionsChart);
    // opciones.chart.height = '300';
    // opciones.chart.width = '200';
    opciones.chart.plotBackgroundColor = 'transparent';
    opciones.chart.animation = false;
    opciones.pane = {
      background: {
        backgroundColor: 'transparent'
      }
    };
    opciones.chart.margin = 20;
    /*opciones.title.text = '';
    opciones.plotOptions.variablepie.dataLabels.format = '<div style="font-size: 20px;">{point.porcentaje:.1f}%</div>';
    opciones.tooltip.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        'Cantidad: <b>{point.cantidad}</b><br/>' +
        'Porcentaje: <b>{point.porcentaje:.1f}</b><br/>';*/

    opciones.chart.type = 'variablepie';
    opciones.series[0].innerSize = '60%';
    opciones.series[0].borderWidth = 1;
    opciones.plotOptions = {
      variablepie: {
        center: ['50%', '50%'],
      },
      series: {
        dataLabels: {
          format: '{point.y}',
          style: {
            fontSize: '30px',
            color: '#5f5f5e',
            textDecoration: 'underline'
          }
        }
      }
    };
    opciones.title = {
      text: '<div>TOTAL <br> <span style="color: #696969">500,000</span></div>',
      verticalAlign: 'middle',
      useHTML: true,
      style: {
        fontSize: '30px',
        fontFamily: 'calibri',
        color: '#141414',
        fontWeight: '700',
        textAlign: 'center'
      }
      // text: `<div style="width: 100px;word-wrap: break-word;height: auto;">SEGUIMIENTO <br> Y CONTROL</div>`,
      /*align: 'center',
      useHTML: true,
      verticalAlign: 'middle',
      style: {
        fontSize: '15px',
        fontFamily: 'calibri',
        color: '#5b5959',
        fontWeight: '700',
        textAlign: 'center'
      }*/
    };
    opciones.series[0].zMin = 0;
    opciones.series[0].borderWidth = '8px';
    opciones.series[0].data = [
      {
        name: 'OBRAS',
        color: '#ca6468',
        y: 25,
        z: 100
      },
      {
        name: 'OBRAS',
        color: '#530f5a',
        y: 25,
        z: 100
      },
      {
        name: 'OBRAS',
        color: '#6da1b6',
        y: 40,
        z: 100
      },
      {
        name: 'OBRAS',
        color: '#82b566',
        y: 10,
        z: 100
      }
    ];

    return opciones;
  }
}
