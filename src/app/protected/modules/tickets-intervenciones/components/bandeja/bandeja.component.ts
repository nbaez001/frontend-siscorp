import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSnackBar, PageEvent, MatDialogRef } from '@angular/material';
import { DetalleComponent } from './detalle/detalle.component';
import { RegistroAtencionComponent } from '../registro-atencion/registro-atencion.component';
import { IntervencionService } from '../../services/intervencion.service';
import { TicketAtencion } from '../../entities/ticket-atencion';
import { PrefijoEstado } from '../../entities/prefijo-estado';
import { Animations } from '@shared/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Socket } from 'ng-socket-io';
import { Datos } from '../../entities/datos';
import { ModuloAtencion } from '../../entities/modulo-atencion';

@Component({
  selector: 'tickinterv-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
  animations: Animations
})
export class BandejaComponent implements OnInit {

  intervenciones: TicketAtencion[];
  pagina = 1;
  cantidad = 10;
  total = 0;

  intrvSelec: TicketAtencion;

  columnas: string[] = [
    'desde',
    'codigoAtencion',
    'modulos',
    'usuarioAtendido',
    'estado',
    'cantidadArchivos',
    'fechaRegistro',
    'acciones'
  ];

  moduloPertenece: ModuloAtencion;

  datos: Datos;

  filtrosForm: FormGroup;

  fechaActual = new Date();

  socketStart: Subscription;

  prefijoEstado = PrefijoEstado;

  constructor(
    private socket: Socket,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private formBuilder: FormBuilder,
    private intervService: IntervencionService
  ) { }

  ngOnInit() {
    this.crearFiltrosForm();
    this.cargarDatos();
    this.cargarIntervenciones();

    this.socketStart = this.socket.fromEvent(`reload-atenciones`)
      .subscribe(() => this.cargarIntervenciones());
  }

  crearFiltrosForm() {
    this.filtrosForm = this.formBuilder.group({
      idAtencion: '',
      idEstado: '',
      fecInicio: '',
      fecFin: ''
    });
  }

  reiniciar() {
    this.filtrosForm.reset('');
    this.cargarIntervenciones();
  }

  cargarDatos() {
    this.intervService.datosBandeja().subscribe(datos => {

      this.moduloPertenece = datos.modulos.find(m => m.pertenece);

      this.datos = Object.assign({
        modulos: datos.modulos.filter(m => !m.pertenece && !m.creaAtencion),
        estados: datos.estados
      });

    });
  }

  cargarIntervenciones() {
    const parseDate = (date: Date|any) => {
      return date.getFullYear() + '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
      date.getDate().toString().padStart(2, '0');
    };

    const filtros = this.filtrosForm.getRawValue();
    filtros.fecInicio = !!filtros.fecInicio && typeof filtros.fecInicio === 'object' ? parseDate(filtros.fecInicio) : '';
    filtros.fecFin = !!filtros.fecFin && typeof filtros.fecFin === 'object' ? parseDate(filtros.fecFin) : '';

    const parseFiltros = Object.entries(filtros).map(([i, v]) => i + '=' + (v || '')).join('&');

    this.intervService.obtenerIntervenciones(this.pagina, this.cantidad, parseFiltros)
      .subscribe(({intervenciones, total}) => {
        this.intervenciones = intervenciones;
        this.total = total;
      });
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarIntervenciones();
  }

  abrirDetalle(tipo: string) {
    this.bottomSheet.open(DetalleComponent, {
      data: tipo
    });
  }

  abrirFomulario(idPersona: number = null, idAtencionPadre: number = null): void {
    const dialogReg: MatDialogRef<RegistroAtencionComponent> = this.dialog.open(RegistroAtencionComponent, {
      panelClass: 'dialog-no-padding',
      width: '700px',
      data: {
        idPersona,
        idAtencionPadre,
        moduloPertenece: this.moduloPertenece,
        modulos: this.datos.modulos,
        estados: this.datos.estados
      }
    });

    /*dialogReg
      .afterClosed()
      .pipe(filter(guardado => !!guardado))
      .subscribe(() => this.cargarIntervenciones());*/
  }

  cambiarEstado(codigoEstado: PrefijoEstado) {
    this.intervService.cambiarEstado(
      this.intrvSelec.idAtencion,
      codigoEstado
    ).subscribe(() => {
      this.cargarIntervenciones();
      this.snackbar.open('ESTADO ACTUALIZADO');
    });
  }

}
