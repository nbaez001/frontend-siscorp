import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'app/protected/services/auth.service';
import {
  MatButtonToggleGroup,
  MatDialogRef,
  MatDialog,
  MatBottomSheet,
  PageEvent,
  MatBottomSheetRef,
  MatSnackBar
} from '@angular/material';
import { ConfigurarDatosComponent } from '../configurar-datos/configurar-datos.component';
import { HistorialComponent } from '../historial/historial.component';
import { GestServService } from '../../services/gest-serv.service';
import { PlataformaItem } from '../../entities/plataforma-item';
import { Estado, Servicios } from '../../entities/estado';
import { HistorialEstadosComponent } from '../historial-estados/historial-estados.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Socket } from 'ng-socket-io';

import { trigger, state, style, transition, query, stagger, animateChild, useAnimation, animation, animate } from '@angular/animations';

const columnasBase = ['numero', 'plataforma', 'certificados', 'internet', 'telefonia', 'acciones'];

@Component({
  selector: 'uti-bandeja-principal',
  templateUrl: './bandeja-principal.component.html',
  styleUrls: ['./bandeja-principal.component.scss'],
  animations: [
    trigger('animate', [transition('void => *', [useAnimation(animation([
      style({
          opacity  : '{{opacity}}',
          transform: 'scale({{scale}}) translate3d({{x}}, {{y}}, {{z}})'
      }),
      animate('{{duration}} {{delay}} cubic-bezier(0.0, 0.0, 0.2, 1)', style('*'))
    ], {
      params: {
          duration: '200ms',
          delay   : '0ms',
          opacity : '0',
          scale   : '1',
          x       : '0',
          y       : '0',
          z       : '0'
      }
  }))])]),

    trigger('animateStagger', [
      state('50', style('*')),
      state('100', style('*')),
      state('200', style('*')),

      transition('void => 50',
        query('@*',
          [
            stagger('50ms', [
              animateChild()
            ])
          ], { optional: true })),
      transition('void => 100',
        query('@*',
          [
            stagger('100ms', [
              animateChild()
            ])
          ], { optional: true })),
      transition('void => 200',
        query('@*',
          [
            stagger('200ms', [
              animateChild()
            ])
          ], { optional: true }))
  ]),
  ]
})
export class BandejaPrincipalComponent implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<any> = null;
  bottonShetRef: MatBottomSheetRef<any> = null;

  servicioActual: Servicios = null;
  idPlatAlterado: number;

  formFiltrosGeneral: FormGroup;
  formFiltrosInternet: FormGroup;
  formFiltrosTelefonia: FormGroup;
  filtroEstado: FormControl;

  pagina: number = 1;
  cantidad: number = 10;
  total: number = 0;

  plataformas: PlataformaItem[] = [];
  estados: Estado[] = [];

  @ViewChild('servicio') servicio: MatButtonToggleGroup;

  columnas: string[] = columnasBase;

  socketSubscription: Subscription;

  constructor(
    private matDialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private socket: Socket,
    private authService: AuthService,
    private gestServ: GestServService
  ) { }

  ngOnInit() {
    this.authService.cabecera.next({ titulo: 'SERVICIO TÉCNICO DE PLATAFORMAS' });

    this.cargarPlataformas();
    this.cargarEstados();
    this.crearForm();

    this.socketSubscription = this.socket.fromEvent('gest-serv').subscribe((idPlat: number) => {
      console.log('socket' + idPlat);
      const plataforma: PlataformaItem = this.plataformas.find(p => p.idPlataforma === +idPlat);

      if (plataforma !== undefined) {
        this.animacionAlterado(+idPlat);
        this.cargarPlataformas();
      }
    });
  }

  ngOnDestroy() {
    this.authService.cabecera.next({ titulo: '' });

    this.socketSubscription.unsubscribe();

    if (this.dialogRef !== null) {
      this.dialogRef.close();
    }

    if (this.bottonShetRef !== null) {
      this.bottonShetRef.dismiss();
    }

  }

  cargarPlataformas() {
    this.gestServ.plataformas(this.pagina, this.cantidad, this.filtros).subscribe(({total, registros}) => {
      this.total = total;
      this.plataformas = registros;
    });
  }

  estaExpandido = (i: number, plat: any) => plat.hasOwnProperty('colHistorial');

  seleccionarServicio(serv: Servicios) {
    this.servicioActual = this.servicioActual === serv ? null : serv;

    this.filtroEstado.setValue('');

    if (this.servicioActual === null) {
      this.servicio.writeValue(null);
      this.columnas = columnasBase;
      return;
    }

    const columnas = ['numero', 'plataforma', 'certificados'];

    switch (serv) {
      case Servicios.internet:
        columnas.push('tipoContrato', 'circuitoI', 'porcentaje', 'velocidades', 'fechaInst', 'internet', 'operadorMovil', 'priorUAGS');
        break;
      case Servicios.telefonia:
        columnas.push('circuitoT', 'numeros', 'telefonia');
        break;
    }

    columnas.push('acciones');

    this.columnas = columnas;
  }

  certificados(json: string): string {
    if (json === '') {
      return;
    }

    let result: string;
    const jsonParse: any = JSON.parse(json);

    if (json[0] === '[') {
      result = jsonParse.map(i => i.cid_nombre).join(',');
    } else {
      result = jsonParse.cid_nombre;
    }

    return result;
  }

  verEstadoActual(idServ: number, tipo: Servicios) {

    if (idServ === 0) {
      return false;
    }

    this.bottonShetRef = this.bottomSheet.open(HistorialComponent, {
      data: {
        idServ,
        tipo
      }
    });

    return false;
  }

  verHistorial(idPlat: number) {
    this.bottonShetRef = this.bottomSheet.open(HistorialEstadosComponent, {
      data: {
        idPlat,
        tipo: this.servicioActual
      }
    });
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarPlataformas();
  }

  cargarEstados() {
    this.gestServ.estados().subscribe(estados => this.estados = estados);
  }

  configurar(plat: PlataformaItem) {
    this.dialogRef = this.matDialog.open(ConfigurarDatosComponent, {
      panelClass: 'dialog-no-padding',
      width: '750px',
      data: {
        plat,
        serv: this.servicioActual
      }
    });

    this.dialogRef.afterClosed().subscribe(r => {
      if (!!r) {
        this.cargarPlataformas();
      }
    });
  }

  crearForm() {
    this.formFiltrosGeneral = this.fb.group({
      snip: '',
      plataforma: '',
      certificados: ''
    });

    this.formFiltrosInternet = this.fb.group({
      tipoContrato: '',
      circuito: '',
      fechaInst: ''
    });

    this.formFiltrosTelefonia = this.fb.group({
      circuito: '',
      numero: '',
      anexo: ''
    });

    this.filtroEstado = new FormControl('');
  }

  animacionAlterado(idPlat: number) {
    this.idPlatAlterado = idPlat;

    setTimeout(() => {
      this.idPlatAlterado = null;
    }, 2000);
  }

  get filtros(): string {

    const formGeneral = this.formFiltrosGeneral;

    if (formGeneral === undefined) {
      return '';
    }

    const parametros: string[] = Object.entries(formGeneral.value).filter(([_, v]) => !!v).map(([i, v]) => `${i}=${v}`);

    if (this.servicioActual === 'internet') {

      const valorFiltrosInternet = this.formFiltrosInternet.value;

      if (typeof valorFiltrosInternet.fechaInst === 'object') {
        valorFiltrosInternet.fechaInst = moment(valorFiltrosInternet.fechaInst).format('YYYY-MM-DD');
      }

      parametros.push(...Object.entries(valorFiltrosInternet).filter(([_, v]) => !!v).map(([i, v]) => `${i}=${v}`));
    } else if (this.servicioActual === 'telefonia') {
      parametros.push(...Object.entries(this.formFiltrosTelefonia.value).filter(([_, v]) => !!v).map(([i, v]) => `${i}=${v}`));
    }

    if (this.servicioActual !== null) {
      parametros.push('tipo=' + this.servicioActual);
    }

    const valorEstado = this.filtroEstado.value;

    if (!!valorEstado) {
      parametros.push('estado=' + valorEstado);
    }

    return parametros.join('&');
  }

  get colorServ(): string {
    return this.gestServ.colorServ(this.servicioActual);
  }

}
