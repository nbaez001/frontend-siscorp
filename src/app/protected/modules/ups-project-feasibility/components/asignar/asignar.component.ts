import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ups-pr-fea-asignar',
  templateUrl: './asignar.component.html',
  styleUrls: ['./asignar.component.scss']
})
export class AsignarComponent implements OnInit {

  items: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
  ];

  seleccionados: number[] = [];

  constructor() { }

  ngOnInit() {
  }

  agregar(index: number) {
    this.seleccionados.push(
      this.items[index]
    );

    this.items.splice(index, 1);
  }

  quitar(index: number) {
    this.items.push(
      this.seleccionados[index]
    );

    this.seleccionados.splice(index, 1);
  }

}
