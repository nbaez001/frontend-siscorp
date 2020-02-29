import { Component, OnInit } from '@angular/core';
import { ModuloAtencion } from '../../entities/modulo-atencion';
import { GestionModulosService } from '../../services/gestion-modulos.service';
import { PageEvent, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { filter } from 'rxjs/operators';
import { ModuloRegistrarComponent } from './modulo-registrar/modulo-registrar.component';

@Component({
  selector: 'tickinterv-gestion-modulos',
  templateUrl: './gestion-modulos.component.html',
  styleUrls: ['./gestion-modulos.component.scss']
})
export class GestionModulosComponent implements OnInit {

  modulos: ModuloAtencion[];
  pagina = 1;
  cantidad = 10;
  total = 0;

  columnas: string[] = ['idModulo', 'entidad', 'encargado', 'activo', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private gestModulosService: GestionModulosService
  ) { }

  ngOnInit() {
    this.cargarModulos();
  }

  cargarModulos() {
    this.gestModulosService.listar(
      this.pagina,
      this.cantidad
    ).subscribe(({modulos, total}) => {
      this.modulos = modulos;
      this.total = total;
    });
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarModulos();
  }

  actualizar(modulo: ModuloAtencion) {
    const modDialog: MatDialogRef<ModuloRegistrarComponent> = this.dialog.open(ModuloRegistrarComponent, {
      panelClass: 'dialog-no-padding',
      width: '700px',
      data: modulo
    });

    modDialog.afterClosed().pipe(filter(r => !!r)).subscribe(() => this.cargarModulos());
  }

  registrar() {
    const modDialog: MatDialogRef<ModuloRegistrarComponent> = this.dialog.open(ModuloRegistrarComponent, {
      panelClass: 'dialog-no-padding',
      width: '700px',
      data: {}
    });

    modDialog.afterClosed().pipe(filter(r => !!r)).subscribe(() => this.cargarModulos());
  }

  eliminar(idModulo: number) {
    const elimDialog: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    elimDialog.componentInstance.message = '¿Seguro que desea eliminar este modulo?';

    elimDialog.afterClosed().pipe(filter(r => !!r)).subscribe(() => {
      this.gestModulosService.eliminar(idModulo).subscribe((result) => {

        const mensaje = result === 0
          ? 'Registro eliminado exitosamente.'
          : 'El módulo no pudo ser eliminado ya que existen atenciones realizadas en él.';

        this.snackBar.open(mensaje);

        if (result === 0) {
          this.cargarModulos();
        }
      });
    });
  }

}
