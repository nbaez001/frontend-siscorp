import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'protected-alerta-error-carga',
  templateUrl: './alerta-error-carga.component.html',
  styleUrls: ['./alerta-error-carga.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertaErrorCargaComponent implements OnInit {

  tiempo = 5;

  constructor() { }

  ngOnInit() {

    setInterval(() => {
      this.tiempo--;
    }, 1000);

  }

}
