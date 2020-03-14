import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { PerfilUsuariosComponent } from '../perfil-usuarios/perfil-usuarios.component';
import { PerfilMenusComponent } from '../perfil-menus/perfil-menus.component';
import { Aplicacion } from '../../entities/aplicacion';
import { AplicacionService } from '../../services/aplicacion.service';
import { AplicacionFormComponent } from './aplicacion-form/aplicacion-form.component';
import { ModuloService } from '../../services/modulo.service';
import { Modulo } from '../../entities/modulo';
import { ModuloFormComponent } from './modulo-form/modulo-form.component';
import { PerfilModulo } from '../../entities/perfil-modulo';
import { PerfilModuloService } from '../../services/perfil-modulo.service';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { PerfilModuloFormComponent } from './perfil-modulo-form/perfil-modulo-form.component';
import { Subscription } from 'rxjs';
import { UsuarioPerfilModuloService } from '../../services/usuario-perfil-modulo.service';

@Component({
  selector: 'security-aplicaciones',
  templateUrl: './aplicaciones.component.html',
  styleUrls: ['./aplicaciones.component.scss']
})
export class AplicacionesComponent implements OnInit, OnDestroy {

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  aplicaciones: Aplicacion[] = [];

  aplicacionSeleccionado: Aplicacion = null;

  modulos: Modulo[] = [];

  moduloSeleccionado: Modulo = null;

  perfiles: PerfilModulo[] = [];

  usuarioAgregado: Subscription;

  constructor(
    private dialog: MatDialog,
    private aplicacionService: AplicacionService,
    private moduloService: ModuloService,
    private perfilModuloService: PerfilModuloService,
    private usuarioPerfilModuloService: UsuarioPerfilModuloService
  ) { }

  ngOnInit() {
    this.cargarAplicaciones();

    this.usuarioAgregado = this.usuarioPerfilModuloService
      .usuarioAgregado
      .subscribe(() => this.cargarPerfilesModulos());
  }

  ngOnDestroy() {
    this.usuarioAgregado.unsubscribe();
  }

  cargarAplicaciones() {
    this.aplicacionService.lista().subscribe((aplicaciones) => {
      this.aplicaciones = aplicaciones;
      setTimeout(() => this.tabGroup.selectedIndex = 0, 0);
    });
  }

  cargarModulos() {
    this.moduloService.lista(this.aplicacionSeleccionado.codigoAplicacion).subscribe((modulos) => {
      this.modulos = modulos;
    });
  }

  cargarPerfilesModulos() {
    this.perfilModuloService.lista(this.moduloSeleccionado.codigoModulo).subscribe((perfiles) => {
      this.perfiles = perfiles;
    });
  }

  configurarAplicacion(event: MouseEvent, aplicacion: Aplicacion = null) {
    event.stopPropagation();

    const dialogConfigurar: MatDialogRef<AplicacionFormComponent> = this.dialog.open(AplicacionFormComponent, {
      panelClass: ['dialog-no-padding', 'aplicacion-form'],
      width: '400px',
      data: aplicacion
    });

    dialogConfigurar.afterClosed().subscribe((huboTransaccion) => {
      if (!!huboTransaccion) {
        this.cargarAplicaciones();
      }
    });

  }

  configurarModulo(event: MouseEvent, modulo: Modulo = null) {
    event.stopPropagation();

    const dialogConfigurar: MatDialogRef<ModuloFormComponent> = this.dialog.open(ModuloFormComponent, {
      panelClass: ['dialog-no-padding', 'modulo-form'],
      width: '400px',
      data: modulo || { codigoAplicacion: this.aplicacionSeleccionado.codigoAplicacion }
    });

    dialogConfigurar.afterClosed().subscribe((huboTransaccion) => {
      if (!!huboTransaccion) {
        this.cargarModulos();
      }
    });

  }

  seleccionarAplicacion(event: MatTabChangeEvent) {
    this.aplicacionSeleccionado = this.aplicaciones[event.index];
    this.cargarModulos();

    this.moduloSeleccionado = null;
    this.perfiles = [];
  }

  seleccionarModulo(modulo: Modulo) {

    if (this.moduloSeleccionado === modulo) {
      this.moduloSeleccionado = null;
      return;
    }

    this.moduloSeleccionado = modulo;

    this.cargarPerfilesModulos();
  }

  agregarPerfil() {
    const dialogConfigurar: MatDialogRef<PerfilModuloFormComponent> = this.dialog.open(PerfilModuloFormComponent, {
      panelClass: ['dialog-no-padding', 'perfil-modulo-form'],
      width: '400px',
      data: this.moduloSeleccionado.codigoModulo
    });

    dialogConfigurar.afterClosed().subscribe((huboTransaccion) => {
      if (!!huboTransaccion) {
        this.cargarModulos();
        this.cargarPerfilesModulos();
      }
    });
  }

  quitarPerfil(codigoPerfilModulo: number) {

    const eliminar: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    eliminar.componentInstance.message = '¿Seguro que desea quitar el perfil?';

    eliminar.afterClosed().subscribe((elimino) => {
      if (!!elimino) {
        this.perfilModuloService.quitar(codigoPerfilModulo).subscribe(() => this.cargarPerfilesModulos());
      }
    });

  }

  verUsuarios(codigoPerfilModulo: number) {
    this.dialog.open<PerfilUsuariosComponent>(PerfilUsuariosComponent, {
      panelClass: ['dialog-no-padding', 'perfil-usuarios'],
      width: '500px',
      data: codigoPerfilModulo
    });
  }

  verMenus() {
    this.dialog.open(PerfilMenusComponent, {
      panelClass: ['dialog-no-padding', 'perfil-menus'],
      width: '500px'
    });
  }

}
