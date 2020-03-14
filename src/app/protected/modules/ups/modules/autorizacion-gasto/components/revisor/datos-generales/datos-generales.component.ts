import { Component, OnInit, ɵConsole, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { DetalleDatosGeneralesTamboComponent } from './detalle-datos-generales-tambo/detalle-datos-generales-tambo.component';
import { ProyectoVisualizarComponent } from '../proyecto-visualizar/proyecto-visualizar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ModalRequerimientoComponent } from './../requerimiento/modal-requerimiento/modal-requerimiento.component';
import { TrabajadorComponent } from './../trabajador/trabajador.component';
import { ModalCronogramaValorizadoComponent } from './../cronograma-valorizado/modal-cronograma-valorizado/modal-cronograma-valorizado.component';
import { DatoProyecto, WsResponseDatoProyecto } from '../../../dto/response/DatoProyecto';
import { ProyectoEjecucionService } from '../../../service/proyecto-ejecucion.service';
import { MENSAJES } from 'app/common';
import { Proyecto } from '../../../dto/response/Proyecto';
import { WsResponseDatoProfesional, DatoProfesional } from '../../../dto/response/DatoProfesional';

import { ParametroBodyGeneralRequest } from '../../../dto/request/ParametroBodyGeneralRequest';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

  // datoProyecto: DatoProyecto=new DatoProyecto();
  datoProyecto: any;
  mensaje:string;    


  encargados: DatoProfesional[];
  datosEncargadosResponse : DatoProfesional[];
  ejecutores: DatoProfesional[];
  datosEjecutoresResponse : DatoProfesional[];

  parametrosBody: ParametroBodyGeneralRequest = new ParametroBodyGeneralRequest(); 

  items: any;
  cars: any[];
  responsiveOptions;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private datos: DataProyecto,
    private spinner: NgxSpinnerService,
    public dialogDatosGenerales: MatDialogRef<DatosGeneralesComponent>,
    private dialog: MatDialog,
    private router: Router,
   private proyectoEjecucionService: ProyectoEjecucionService
  ) { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  }

  ngOnInit() {
    this.datoProyecto=new DatoProyecto();
    this.cargarDatos(this.datos.idProyecto);
  }
  
  
  cargarDatos(idProyecto){
    this.parametrosBody.idProyecto=idProyecto;//seteamos el parametro idProyecto
    //DATOS PROYECTO
    this.proyectoEjecucionService.cargarDatosProyecto(this.parametrosBody).subscribe(
      (wsResponseDatoProyecto : WsResponseDatoProyecto)=> {
       
        if(wsResponseDatoProyecto.codResultado == 1){
          this.datoProyecto = (wsResponseDatoProyecto.response[0] != null) ? wsResponseDatoProyecto.response[0] : null;
        }else if(wsResponseDatoProyecto.codResultado == 2){
          this.datoProyecto=new DatoProyecto();//seteamos a null el objeto
        }
      },
      error => {  this.mensaje = MENSAJES.ERROR_SERVICIO;}
    ); 

    //LISTADO DE IMAGENES
    this.cars =  [
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQU5TvFEJXZ_FGBpi__i7OEdeMZRRSV_AjGOx1h7UFSXIYZ46K3' },
      { url: 'https://cdn.www.gob.pe/uploads/document/file/199221/standard_IMGL3220.jpg' },
      { url: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2019/01/25/000559969W.jpg' },
      { url: 'https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/08/17/000526059W.jpg' }
    ];

    //LISTAR CARRUSEL
    // this.proyectoEjecucionService.listarCarrusel(this.parametrosBody).subscribe(lista => {
       
    //     (wsResponseDatoProfesional : WsResponseDatoProfesional)=> {
    //       if(wsResponseDatoProfesional.codResultado == 1){
    //         debugger;
    //       this.datosEncargadosResponse = (wsResponseDatoProfesional.response != null) ? wsResponseDatoProfesional.response : [];
    //           if (this.datosEncargadosResponse != null && this.datosEncargadosResponse.length > 0) {
    //            // this.encargados = this.datosEncargadosResponse;
    //             this.imagenesCarrusel = this.datosEncargadosResponse;
    //             console.log("carrusel:"+this.imagenesCarrusel);
    //           }
    //       }
    //   }
    // });

     
    //LISTADO DE ENCARGADOS
    this.proyectoEjecucionService.cargarListaEncargados(this.parametrosBody).subscribe(
        (wsResponseDatoProfesional : WsResponseDatoProfesional)=> {
          if(wsResponseDatoProfesional.codResultado == 1){
          this.datosEncargadosResponse = (wsResponseDatoProfesional.response != null) ? wsResponseDatoProfesional.response : [];
              if (this.datosEncargadosResponse != null && this.datosEncargadosResponse.length > 0) {
                this.encargados = this.datosEncargadosResponse;               
              }
          }
      },
      error => {  this.mensaje = MENSAJES.ERROR_SERVICIO;}
    ); 
    //LISTADO DE NUCLEO EJECUTORES
    this.proyectoEjecucionService.cargarListaEjecutores(this.parametrosBody).subscribe(
      (wsResponseDatoProfesional : WsResponseDatoProfesional)=> {
        if(wsResponseDatoProfesional.codResultado == 1){
        this.datosEjecutoresResponse = (wsResponseDatoProfesional.response != null) ? wsResponseDatoProfesional.response : [];
            if (this.datosEjecutoresResponse != null && this.datosEjecutoresResponse.length > 0) {
              this.ejecutores = this.datosEjecutoresResponse;
            }
        }
      },
      error => {  this.mensaje = MENSAJES.ERROR_SERVICIO;}
    ); 
  }




  detalleDatosPersonales(datoPersonal) {
    debugger;
    const dialogReg: MatDialogRef<DetalleDatosGeneralesTamboComponent> = this.dialog.open(DetalleDatosGeneralesTamboComponent, {
      disableClose: true,
      width: '500px',
      autoFocus: false,
      data: {
        datoEnviado:datoPersonal
      }
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

interface DataProyecto {
  idProyecto?: number;
}