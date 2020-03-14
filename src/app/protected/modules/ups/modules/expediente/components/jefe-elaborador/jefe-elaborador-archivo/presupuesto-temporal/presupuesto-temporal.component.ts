import { Component, OnInit, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MAT_DIALOG_DATA, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { ProyectoService } from '../../../../services/proyecto.service';
import { ExcelVisualizarResponse, FilePresupuestoDetalle } from '../../../../dto/response/ExcelVisualizarResponse';
import { ExcelPartidaVisualizarResponse } from '../../../../dto/response/ExcelPartidaVisualizarResponse';

import { MENSAJES } from 'app/common';
import { WsApiOutResponse } from '../../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';


@Component({
  selector: 'app-presupuesto-temporal',
  templateUrl: './presupuesto-temporal.component.html',
  styleUrls: ['./presupuesto-temporal.component.scss']
})
export class PresupuestoTemporalComponent implements OnInit {

  codPresupuesto: string;
  descPresupuesto: string;
  cliente: string;
  fechaPresupuesto: string;
  lugar: string;

  habilitarBtnConformidad: boolean;

  columnas: string[];
  dataSource: MatTableDataSource<FilePresupuestoDetalle>;
  mensaje: string;
  disabledBotonConformidad: boolean;

  ngOnInit(){
    this.columnas = ['Item','Descripcion','Und','Metrado','Precio','Parcial']; 
  }

  constructor(public dialogRef: MatDialogRef<PresupuestoTemporalComponent>,
    private proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA)
    private datos: DatosArchivo,
    private dialog: MatDialog){

    if(typeof datos.archivoExcelPartida == 'undefined'){
    this.visualizarPresupuesto(datos);

      if(datos.estadoCarga != "4"){
        this.habilitarBtnConformidad = true;
      }else{
        this.habilitarBtnConformidad = false;
      }
    }

  }


  cerrar(){
    this.dialogRef.close();
  }

  visualizarPresupuesto(datos: DatosArchivo): void{

    this.codPresupuesto = datos.archivoExcel.presupuestoCabecera.codigoPresupuesto;
    this.descPresupuesto= datos.archivoExcel.presupuestoCabecera.nombreProyecto;
    this.cliente = datos.archivoExcel.presupuestoCabecera.cliente;
    this.fechaPresupuesto = datos.archivoExcel.presupuestoCabecera.costo;
    this.lugar= datos.archivoExcel.presupuestoCabecera.lugarProyecto;

    this.dataSource = new MatTableDataSource(datos.archivoExcel.presupuestoDetalle);

  }


  darConformidadExcelPresupuesto(): void{
    this.openDialogMensajeConfirm(MENSAJES.ARCHIVO_CONFIRMAR_CONFORMIDAD_EXCEL,null, false, true, null);
  }


  
  darConformidad() {

    this.proyectoService.aceptarConformidadArchivo(this.datos.idCodigoArchivo).subscribe(
 
      (wsApiOutResponse : WsApiOutResponse)=> {
        
        if(wsApiOutResponse.codResultado == 1){
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_CONFORMIDAD_INFO_SUCCESS;
          this.openDialogMensaje("", this.mensaje ,true,false, null);

        }
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(this.mensaje);
        
        //this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);   
      }
    
    ); 


    /*  this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
     this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar el archivo ${nombreArchivo}?`;
 
     this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {
 
       if (confirm) {        
         this.proyectoService.eliminarArchivo(idArchivo).subscribe(
 
           (wsResponseArchivo : WsResponseArchivo)=> {
             
             if(wsResponseArchivo.codResultado == 1){
               this.archivoResponse = (wsResponseArchivo.response != null) ? wsResponseArchivo.response : [];
               this.listadoArchivo();
             }
           },
           error => {
             this.mensaje = MENSAJES.ERROR_SERVICIO;
             //this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);   
           }
         
         ); 
       }
     }); */


 }


  public openDialogMensajeConfirm(
  
    message: string,
    message2: string,
    alerta: boolean,
    confirmacion: boolean,
    valor: any
  ): void {
    
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: MENSAJES.ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_PRESUPUESTO,
        message: message,
        message2: message2,
        alerta: alerta,
        confirmacion: confirmacion,
        valor: valor
      }
    });
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
  
      if (confirm) { 
       this.darConformidad();
      }
    });
  }


  public openDialogMensaje(
    message: string,
    message2: string,
    alerta: boolean,
    confirmacion: boolean,
    valor: any
  ): void {
    let conformidadRealizada: Object = {
      valorDevolver: "CONFORMIDAD_REALIZADA",
    };
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: MENSAJES.ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_PRESUPUESTO,
        message: message,
        message2: message2,
        alerta: alerta,
        confirmacion: confirmacion,
        valor: valor
      }
    });
    dialogRef.afterClosed().subscribe((ok: number) => {    
      this.dialogRef.close(conformidadRealizada);  
    });
  }

  


}

//const DATA = [this.datos.archivoExcel.presupuestoDetalle]
/*   const DATA = [
  { id: '01', data: 'OBRAS PROVISIONALES, TRABAJOS PRELIMINARES, SEGURIDAD Y SALUD', und:'', metrado :'', precio:'', parcial:'89,844.67', extend: true},
  { id: '01.01', data: 'OBRAS PROVISIONALES Y TRABAJOS PRELIMINARES', und:'', metrado :'', precio:'', parcial:'76,145.30', extend: true },
  { id: '01.01.01', data: 'CONSTRUCCIONES PROVISIONALES', und:'', metrado :'', precio:'', parcial:'9,868.60', extend: true},
  { id: '01.01.01.01', data: 'ALQUILER CAMPAMENTO PROVISIONAL (ALMACEN, OFICINA, DORMITORIO Y COMEDOR DE OBRA)', und:'mes', metrado :'4.00', precio:'1,921.28', parcial:'7605.12'},
  { id: '01.01.01.02', data: 'SERVICIOS HIGIENICOS P/TRABAJADORES (1 LETRINAS)',und:'und', metrado :'1.00', precio:'705.45', parcial:'705.45'},
  { id: '01.01.01.03', data: 'CARTEL DE OBRA 5.00X3.00M',und:'und', metrado :'1.00', precio:'705.45', parcial:'705.45'},
  { id: '01.01.02', data: 'INSTALACIONES PROVISIONALES',extend: true},
  { id: '01.01.02.01', data: 'AGUA PARA LA CONSTRUCCION',und:'glb', metrado :'1.00', precio:'1506.37', parcial:'1506.37'},
  { id: '01.01.03', data: ' TRABAJOS PRELIMINARES',und:'', metrado :'', precio:'', parcial:'912.00',extend: true},
  { id: '01.01.03.01', data: ' LIMPIEZA Y DESBROCE MANUAL DEL TERRENO',und:'m2', metrado :'1,200.00', precio:'0.76', parcial:'912.00'},
  { id: '01.01.04', data: 'MOVILIZACION DE MATERIALES, EQUIPOS Y HERRAMIENTAS',und:'', metrado :'', precio:'', parcial:'61,122.33', extend: true},
  { id: '01.01.04.01', data: 'FLETE TERRESTRE',und:'glb', metrado :'1.00', precio:'61122.33', parcial:'61,122.33'},
  { id: '01.01.05', data: ' TRAZOS, NIVELES Y REPLANTEO',und:'', metrado :'', precio:'', parcial:'2,736.00',extend: true},
  { id: '01.01.05.01', data: 'TRAZO, NIVELES Y REPLANTEO PRELIMINAR',und:'m2', metrado :'1,200.00', precio:'1.14', parcial:'1,368.00'},
  { id: '01.01.05.02', data: 'REPLANTEO DURANTE EL PROCESO',und:'m2', metrado :'1,200.00', precio:'1.14', parcial:'1,368.00'}
] */



interface DatosArchivo {
fidProyecto: number;
archivoExcel: ExcelVisualizarResponse;
archivoExcelPartida: ExcelPartidaVisualizarResponse;
idCodigoArchivo: number;
estadoCarga: string;
}