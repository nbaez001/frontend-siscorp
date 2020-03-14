import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntervencionService } from '../../services/intervencion.service';
import { PantallaModuloAtencion, PantallaAtenciones } from '../../entities/pantalla-atenciones';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tickinterv-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.scss']
})
export class PantallaComponent implements OnInit, OnDestroy {

  pantalla: PantallaAtenciones = {
    ultimoModulo: 0,
    total: 0,
    modulos: []
  };

  pantallaModulos: PantallaModuloAtencion[] = [];
  total: number;

  segundos = 10;

  intervalCarga: any;
  intervalTiempo: any;

  socketStart: Subscription;

  constructor(
    private socket: Socket,
    private intrvService: IntervencionService
  ) { }

  ngOnInit() {

    this.cargarDatos();

    this.intervalTiempo = setInterval(() => {
      if (this.segundos > 0) {
        this.segundos -= 1;
      } else {
        this.segundos = null;
      }
    }, 1000);

    this.intervalCarga = setInterval(() => {
      this.cargarDatos();
    }, 10000);

    this.socketStart = this.socket.fromEvent(`reload-atenciones`)
      .subscribe(() => this.cargarDatos());
  }

  ngOnDestroy() {
    clearInterval(this.intervalCarga);
    clearInterval(this.intervalTiempo);
    this.socketStart.unsubscribe();
  }

  cargarDatos() {
    this.intrvService.pantallaAtenciones(this.pantalla.ultimoModulo)
      .subscribe(pm => {
        this.pantalla = pm;
        this.segundos = 10;
      });
  }

  get tiempo(): any[] {
    return Array.from(Array(this.segundos).keys());
  }

}
