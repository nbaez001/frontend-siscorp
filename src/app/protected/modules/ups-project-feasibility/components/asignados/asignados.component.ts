import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ups-pr-fea-asignados',
  templateUrl: './asignados.component.html',
  styleUrls: ['./asignados.component.scss']
})
export class AsignadosComponent implements OnInit {

  displayedColumns = ['nro', 'fecha', 'usuario', 'fechaDestino', 'usuarioDestino'];

  asignados: any[] = [
    {
      nro: 1,
      fecha: '2019-05-05',
      usuario: 'Cesar Mamani',
      fechaDestino: '2019-05-06',
      usuarioDestino: 'Jose Villareal'
    },
    {
      nro: 2,
      fecha: '2019-05-05',
      usuario: 'Cesar Mamani',
      fechaDestino: '2019-05-06',
      usuarioDestino: 'Jose Villareal'
    },
    {
      nro: 3,
      fecha: '2019-05-05',
      usuario: 'Cesar Mamani',
      fechaDestino: '2019-05-06',
      usuarioDestino: 'Jose Villareal'
    },
    {
      nro: 4,
      fecha: '2019-05-05',
      usuario: 'Cesar Mamani',
      fechaDestino: '2019-05-06',
      usuarioDestino: 'Jose Villareal'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
