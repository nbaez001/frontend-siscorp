import { Component, OnInit, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MAT_DIALOG_DATA, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { ProyectoService } from '../../../../services/proyecto.service';
import { ExcelVisualizarResponse, FilePresupuestoDetalle } from '../../../../dto/response/ExcelVisualizarResponse';
import { ExcelPartidaVisualizarResponse, FilePrecioUnitarioCabecera, FilePrecioUnitarioDetalle } from '../../../../dto/response/ExcelPartidaVisualizarResponse';
import { MENSAJES } from 'app/common';
import { WsApiOutResponse } from '../../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';

@Component({
  selector: 'app-analisis-precio-unitario-temporal',
  templateUrl: './analisis-precio-unitario-temporal.component.html',
  styleUrls: ['./analisis-precio-unitario-temporal.component.scss']
})
export class AnalisisPrecioUnitarioTemporalComponent implements OnInit {
  
  idCodigo:number;
  codigoPresupuesto: string;
  nombrePresupuesto: string;
  subCodigoPresupuesto: string;
  nombreSubPresupuesto: string;
  fecha: string;

  isExtendedRow = (index, item) => item.extend;
  columnas: string[];

  dataSource:  MatTableDataSource<ExcelPartidaVisualizarResponse>;
  dataSourceDetalle: MatTableDataSource<FilePrecioUnitarioDetalle>;

  excelPartida : any[];
  mensaje: string;
  habilitarBtnConformidad: boolean;

  ngOnInit(){
    //this.columnas = ['Codigo','Descripcion','CategoriaInsumo','Unidad','Cuadrilla','Cantidad','Precio','Parcial']; 
  }
  
  constructor(public dialogRef: MatDialogRef<AnalisisPrecioUnitarioTemporalComponent>,
    private proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA)
    private datos: DatosArchivo,
    private dialog: MatDialog){
         
    if(typeof datos.archivoExcelPartida !== 'undefined' && datos.archivoExcelPartida.length > 0){
      console.log(datos.archivoExcelPartida);
      if(typeof datos.archivoExcelPartida[0].precioUnitarioCabecera !== 'undefined'){
        console.log(datos.archivoExcelPartida[0].precioUnitarioCabecera);
        console.log(datos.archivoExcelPartida[0].precioUnitarioCabecera[0].detallePrecioUnitario);
      }
     
      this.visualizarPartida(datos);
      if(datos.estadoCarga != "4"){
        this.habilitarBtnConformidad = true;
      }else{
        this.habilitarBtnConformidad = false;
      }
    }

  }


  visualizarPartida(datos: DatosArchivo): void{     
    this.dataSource = new MatTableDataSource(datos.archivoExcelPartida);
    this.excelPartida = datos.archivoExcelPartida;
  }


  darConformidadExcelPartida(): void{
    this.openDialogMensajeConfirm(MENSAJES.ARCHIVO_CONFIRMAR_CONFORMIDAD_EXCEL,null, false, true, null);
  }


  darConformidad() {
    this.proyectoService.aceptarConformidadArchivo(this.datos.idCodigoArchivo).subscribe(

      (wsApiOutResponse : WsApiOutResponse)=> {
           
        if(wsApiOutResponse.codResultado == 1){
          this.mensaje = MENSAJES.ARCHIVO_CONFORMIDAD_INFO_SUCCESS;
          this.openDialogMensaje("", this.mensaje ,true,false, null);
        }
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(this.mensaje);
      }
    ); 
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
        title: MENSAJES.ARCHIVO_TITLE,
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

interface DatosArchivo {
  fidProyecto: number;
  archivoExcel: ExcelVisualizarResponse;
  archivoExcelPartida: ExcelPartidaVisualizarResponse[];
  idCodigoArchivo: number;
  estadoCarga: string;
}

