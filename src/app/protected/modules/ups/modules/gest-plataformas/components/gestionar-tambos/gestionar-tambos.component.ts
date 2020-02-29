import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, PageEvent } from '@angular/material';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { filter } from 'rxjs/operators';
import { GestionTambosService } from '../../services/gestion-tambos.service';
import { PlataformaFormularioComponent } from './plataforma-formulario/plataforma-formulario.component';
import { Plataforma } from '../../entities/plataforma';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Recurso } from '../../entities/recurso';
import { Condicion } from '../../entities/condicion';
import { FormularioActivacionComponent } from './formulario-activacion/formulario-activacion.component';
import { PlataformaFormularioCondicionComponent } from './plataforma-formulario-condicion/plataforma-formulario-condicion.component';
import { JerarquiaCondicionComponent } from '../jerarquia-condicion/jerarquia-condicion.component';
import { Router } from '@angular/router';
import { Rol } from '../../entities/rol';

@Component({
  selector: 'ups-gestionar-tambos',
  templateUrl: './gestionar-tambos.component.html',
  styleUrls: ['./gestionar-tambos.component.scss']
})
export class GestionarTambosComponent implements OnInit, OnDestroy {

  columnas: string[] = columnasPorDefecto;

  plataformas: Plataforma[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;

  // FILTROS
  situaciones: Recurso[] = [];
  estados: Recurso[] = [];
  subEstados: Recurso[] = [];
  ssubEstados: Recurso[] = [];

  // ACTUALIZACION DE CONDICIONES
  aEstados: Recurso[] = [];
  aSubEstados: Recurso[] = [];
  aSsubEstados: Recurso[] = [];

  formulario: FormGroup;

  // PLATAFORMA EXPANDIDA
  idPlatExp: number;

  // TIPOS DE DESPLIEGUE
  verDetal = false;
  verHist = false;

  historial: Condicion[];

  dialogRef: MatDialogRef<any>;

  platCambCond: Plataforma = {} as Plataforma;

  roles: Rol[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private gestPlatServicio: GestionTambosService
  ) { }

  async ngOnInit() {
    this.crearForm();
    this.cargarTambos();

    this.onResize(window.innerWidth);

    this.situaciones = await this.gestPlatServicio.situaciones();
    this.roles = await this.gestPlatServicio.roles(this.router.url);
  }

  ngOnDestroy() {
    if (this.dialogRef !== undefined) {
      this.dialogRef.close();
    }
  }

  get noExisteEstado() {
    return this.aEstados.find((e) => e.id === this.platCambCond.idEstado) === undefined;
  }

  get noExisteSubEstado() {
    return this.aSubEstados.find((s) => s.id === this.platCambCond.idSubEstado) === undefined;
  }

  get noExisteSsubEstado() {
    return this.aSsubEstados.find((ss) => ss.id === this.platCambCond.idSSubEstado) === undefined;
  }

  get registrar(): boolean {
    return this.roles.map(r => r.cidCodigo).includes('RP');
  }

  get actualizar(): boolean {
    return this.roles.map(r => r.cidCodigo).includes('AP');
  }

  get actualizarCond(): boolean {
    return this.roles.map(r => r.cidCodigo).includes('ACP');
  }

  async cargarEstados(idSituacion: number) {
    this.estados = await this.gestPlatServicio.estados(idSituacion);
    this.formulario.get('estado').setValue('');
    this.formulario.get('subEstado').setValue('');
    this.formulario.get('ssubEstado').setValue('');
  }

  async cargarSubEstados(idEstado: number) {
    this.subEstados = await this.gestPlatServicio.subEstados(idEstado);
    this.formulario.get('subEstado').setValue('');
    this.formulario.get('ssubEstado').setValue('');
  }

  async cargarSSubEstados(idSsubEstados: number) {
    this.ssubEstados = await this.gestPlatServicio.ssubEstados(idSsubEstados);
    this.formulario.get('ssubEstado').setValue('');
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(innerWidth: number) {
    if (innerWidth <= 1200) {
      this.columnas = ['verTodo', 'snip', 'descripcion', 'prestServ', 'acciones'];
    } else {
      this.verDetal = false;
      this.columnas = columnasPorDefecto;
    }
  }

  crearForm() {
    this.estados = [];
    this.subEstados = [];
    this.ssubEstados = [];

    this.formulario = this.fb.group({
      nombre: '',
      snip: ['', Validators.pattern('^[0-9]+$')],
      codUnico: ['', Validators.pattern('^[0-9]+$')],
      prestServ: '',
      activo: '',
      situacion: '',
      estado: '',
      subEstado: '',
      ssubEstado: ''
    });
  }

  cargarTambos() {
    const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');

    this.gestPlatServicio.tambos(
      this.pagina,
      this.cantidad,
      filtros
    ).subscribe(({plataformas, total}) => {
      const filas = [];
      plataformas.forEach(p => filas.push(
        p,
        {
          idPlataforma: p.idPlataforma,
          situacion: p.situacion,
          estado: p.estado,
          fecEntrega: p.fecEntrega,
          fecPrestServ: p.fecPrestServ,
          subEstado: p.subEstado,
          ssubEstado: p.ssubEstado,
          colHistorial: true
        }
      ));
      this.plataformas = filas;
      this.total = total;
    });
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarTambos();
  }

  abrirFormulario(plataforma: Plataforma = null) {
    this.dialogRef = this.dialog.open(PlataformaFormularioComponent, {
      panelClass: 'dialog-no-padding',
      width: '750px',
      data: plataforma
    });

    this.dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(() => {
        this.cargarTambos();

        if (!!plataforma && plataforma.idPlataforma === this.idPlatExp) {
          this.cargarHistorial();
        }

      });
  }

  verHistorial(plt: Plataforma) {
    this.verHist = true;
    this.verDetal = false;
    this.idPlatExp = this.idPlatExp === plt.idPlataforma ? null : plt.idPlataforma;

    if (this.verHist && this.idPlatExp !== null) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    this.gestPlatServicio.historial(this.idPlatExp).subscribe(historial => this.historial = historial);
  }

  eliminar(plt: Plataforma) {
    this.dialogRef = this.dialog.open(ConfirmMessageComponent);
    this.dialogRef.componentInstance.message = `¿Seguro que desea eliminar la plataforma ${plt.plataforma}?`;

    this.dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(() => {
        this.snackBar.open('Plataforma eliminada');
        this.gestPlatServicio.eliminar(plt.idPlataforma)
          .subscribe(() => this.cargarTambos());
      });
  }

  observar(plt: Condicion) {

    if (plt.actual) {
      this.snackBar.open('No se puede desactivar el actual.');
      return;
    }

    if (plt.activo) {
      this.dialogRef = this.dialog.open(FormularioActivacionComponent, {
        panelClass: 'dialog-no-padding',
        width: '500px',
        data: plt.idHistorial
      });

      this.dialogRef.afterClosed()
        .pipe(filter(r => !!r))
        .subscribe(() => this.cargarHistorial());

    } else {
      this.gestPlatServicio
        .plataformaActividad({id: plt.idHistorial})
        .subscribe(() => this.cargarHistorial());
    }

  }

  verMasDetalles(plt: Plataforma) {
    this.verHist = false;
    this.verDetal = true;
    this.idPlatExp = this.idPlatExp === plt.idPlataforma ? null : plt.idPlataforma;
  }

  async actualizarCondiciones(plat: Plataforma) {

    if (!this.actualizar) {
      return;
    }

    this.platCambCond.idPlataforma = plat.idPlataforma;
    this.platCambCond.idSituacion = plat.idSituacion;
    this.platCambCond.situacion = plat.situacion;
    this.platCambCond.idEstado = plat.idEstado;
    this.platCambCond.estado = plat.estado;
    this.platCambCond.idSubEstado = plat.idSubEstado;
    this.platCambCond.subEstado = plat.subEstado;
    this.platCambCond.idSSubEstado = plat.idSSubEstado;
    this.platCambCond.ssubEstado = plat.ssubEstado;

    this.aEstados = await this.gestPlatServicio.estados(plat.idSituacion);
    this.aSubEstados = await this.gestPlatServicio.subEstados(plat.idEstado);
    this.aSsubEstados = await this.gestPlatServicio.ssubEstados(plat.idSubEstado);
  }

  async actualizarSituacion(s: Recurso) {
    this.platCambCond.idSituacion = s.id;
    this.platCambCond.situacion = s.nombre;
    this.aEstados = await this.gestPlatServicio.estados(s.id);
    this.aSubEstados = !this.noExisteEstado ? await this.gestPlatServicio.subEstados(this.platCambCond.idEstado) : [];
    this.aSsubEstados = !this.noExisteSubEstado ? await this.gestPlatServicio.ssubEstados(this.platCambCond.idSubEstado) : [];
  }

  async actualizarEstado(e: Recurso) {
    this.platCambCond.idEstado = e.id;
    this.platCambCond.estado = e.nombre;
    this.aSubEstados = await this.gestPlatServicio.subEstados(e.id);
    this.aSsubEstados = !this.noExisteSubEstado ? await this.gestPlatServicio.ssubEstados(this.platCambCond.idSubEstado) : [];
  }

  async actualizarSubEstado(s: Recurso) {
    this.platCambCond.idSubEstado = s.id;
    this.platCambCond.subEstado = s.nombre;
    this.aSsubEstados = await this.gestPlatServicio.ssubEstados(s.id);
  }

  actualizarSsubEstado(ss: Recurso) {
    this.platCambCond.idSSubEstado = ss.id;
    this.platCambCond.ssubEstado = ss.nombre;
  }

  guardarCondicion(plat: Plataforma) {

    let errorMensaje = null;

    if (this.noExisteEstado) {
      errorMensaje = 'Debe seleccionar un estado.';
    } else if (this.noExisteSubEstado) {
      errorMensaje = 'Debe seleccionar un sub estado.';
    } else if (this.noExisteSsubEstado) {
      errorMensaje = 'Debe seleccionar un detalle de sub estado.';
    } else if (plat.idSSubEstado === this.platCambCond.idSSubEstado) {
      errorMensaje = 'No se encontraron cambios.';
    }

    if (errorMensaje === null) {

      this.gestPlatServicio.actualizarCondiciones(this.platCambCond).subscribe(() => {
        this.platCambCond = {} as Plataforma;
        this.cargarTambos();

        if (plat.idPlataforma === this.idPlatExp) {
          this.cargarHistorial();
        }

        this.snackBar.open('Condición actualizada.', '', {panelClass: 'mat-primary-bg'});
      });

    } else {
      this.snackBar.open(errorMensaje, '', {panelClass: 'mat-red-bg'});
    }
  }

  actualizarCondicion(plat: Plataforma) {
    this.dialogRef = this.dialog.open(PlataformaFormularioCondicionComponent, {
      panelClass: 'dialog-no-padding',
      width: '500px',
      data: plat
    });

    this.dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(() => {
        this.cargarTambos();

        if (!!plat && plat.idPlataforma === this.idPlatExp) {
          this.cargarHistorial();
        }

      });
  }

  estaExpandido = (i: number, plat: any) => plat.hasOwnProperty('colHistorial');

  verJerarquia() {
    this.dialog.open(JerarquiaCondicionComponent, {
      width: '800px'
    });
  }

}

const columnasPorDefecto: string[] = [
  'snip',
  'descripcion',
  'situacion',
  'estado',
  'subestado',
  'ssubestado',
  'prestServ',
  'acciones'
];
