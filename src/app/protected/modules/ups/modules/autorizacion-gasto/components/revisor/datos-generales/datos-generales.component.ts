import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DetalleDatosGeneralesTamboComponent } from './detalle-datos-generales-tambo/detalle-datos-generales-tambo.component';
import { ProyectoVisualizarComponent } from '../proyecto-visualizar/proyecto-visualizar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ModalRequerimientoComponent } from './../requerimiento/modal-requerimiento/modal-requerimiento.component';
import { TrabajadorComponent } from './../trabajador/trabajador.component';
import { ModalCronogramaValorizadoComponent } from './../cronograma-valorizado/modal-cronograma-valorizado/modal-cronograma-valorizado.component';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

  items: any;
  constructor(
    private spinner: NgxSpinnerService,
    public dialogDatosGenerales: MatDialogRef<DatosGeneralesComponent>,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
    this.items = [
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQU5TvFEJXZ_FGBpi__i7OEdeMZRRSV_AjGOx1h7UFSXIYZ46K3' },
      { url: 'https://cdn.www.gob.pe/uploads/document/file/199221/standard_IMGL3220.jpg' },
      { url: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2019/01/25/000559969W.jpg' },
      { url: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/08/17/000526059W.jpg' }
    ];
  }


  ngOnDestroy() {

  }

  detalleDatosGenerales() {
    const dialogReg: MatDialogRef<DetalleDatosGeneralesTamboComponent> = this.dialog.open(DetalleDatosGeneralesTamboComponent, {
      disableClose: true,
      width: '500px',
      autoFocus: false,
      data: {}
    });
  }

  verProyectoDesdeDatosGenerales(idProyecto: number): void {
    this.spinner.show();
    // this.dialogDatosGenerales.close();
    const dialogReg: MatDialogRef<ProyectoVisualizarComponent> = this.dialog.open(ProyectoVisualizarComponent, {
      width: '1000px',
      data: {
        idProyecto
      },
      disableClose: true
    });
    this.spinner.hide();
  }

  verCronogramaDesdeDatosGenerales(idProyecto: number): void {
    // this.dialogDatosGenerales.close();
    // let idProyectoEncriptado = btoa(idProyecto+""); 
    // this.router.navigate(['/ups/autorizacion/cronograma-valorizado', {idProy: idProyectoEncriptado}]);
    const dialogReg: MatDialogRef<ModalCronogramaValorizadoComponent> = this.dialog.open(ModalCronogramaValorizadoComponent, {
      width: '1800px',
      data: {
        nombreTambo: 'TAMBO QUILLE'
      },
      disableClose: true
    });
  }

  verCotizacionesDesdeDatosGenerales(idProyecto: number): void {
    // this.dialogDatosGenerales.close();
    // let idProyectoEncriptado = btoa(idProyecto+""); 
    // this.router.navigate(['/ups/autorizacion/requerimiento', {idProy: idProyectoEncriptado}]);
    const dialogReg: MatDialogRef<ModalRequerimientoComponent> = this.dialog.open(ModalRequerimientoComponent, {
      disableClose: true,
      width: '1800px',
      autoFocus: false,
      data: {
        nombreTambo: 'TAMBO QUILLE'
      },
    });


  }

  bandejaTrabajadorDesdeDatosGenerales(idProyecto: number): void {
    // this.dialogDatosGenerales.close();
    // let idProyectoEncriptado = btoa(idProyecto + "");
    // this.router.navigate(['/ups/autorizacion/bandeja-trabajador', { idProy: idProyectoEncriptado }]);
    const dialogReg: MatDialogRef<TrabajadorComponent> = this.dialog.open(TrabajadorComponent, {
      disableClose: true,
      width: '1800px',
      autoFocus: false,
      data: {}
    });
  }

}
