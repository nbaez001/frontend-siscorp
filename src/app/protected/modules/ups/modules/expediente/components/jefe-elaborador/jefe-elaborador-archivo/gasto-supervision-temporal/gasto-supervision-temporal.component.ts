import { Component, OnInit, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MAT_DIALOG_DATA, MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { ProyectoService } from '../../../../services/proyecto.service';
import { ExcelVisualizarResponse, FilePresupuestoDetalle } from '../../../../dto/response/ExcelVisualizarResponse';
import { ExcelPartidaVisualizarResponse } from '../../../../dto/response/ExcelPartidaVisualizarResponse';
import { ExcelGeneralVisualizarResponse } from '../../../../dto/response/ExcelGeneralVisualizarResponse';
import { ExcelSupervisionVisualizarResponse } from '../../../../dto/response/ExcelSupervisionVisualizarResponse';
import { MENSAJES } from 'app/common';
import { WsApiOutResponse } from '../../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';

@Component({
  selector: 'app-gasto-supervision-temporal',
  templateUrl: './gasto-supervision-temporal.component.html',
  styleUrls: ['./gasto-supervision-temporal.component.scss']
})
export class GastoSupervisionTemporalComponent implements OnInit {


  fecha: string;
  plazo_ejecucion: string;

  //dataSource = new MyDataSource(DATA);
  isExtendedRow = (index, item) => item.extend;
  columnas: string[];
  dataSource: MatTableDataSource<FilePresupuestoDetalle>;
  mensaje: string;
  habilitarBtnConformidad: boolean;

  ngOnInit(){
    this.columnas = ['nro','descripcion','und','cant', 'costoUnitario','coefPartial','parcial','subtotal','total']; 
  }

  constructor(public dialogRef: MatDialogRef<GastoSupervisionTemporalComponent>,
    private proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA)
    private datos: DatosExcelVisualizar,
    private dialog: MatDialog){


    if(typeof datos.archivoExcelSupervision !== 'undefined'){
       this.visualizarSupervision(datos);

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

  visualizarSupervision(datos: DatosExcelVisualizar): void{

    this.fecha = datos.archivoExcelSupervision.gastoSupervisionCabecera.fechaExcel;
    this.plazo_ejecucion= datos.archivoExcelSupervision.gastoSupervisionCabecera.plazoEjecucion;
    this.dataSource = new MatTableDataSource(datos.archivoExcelSupervision.gastoSupervisionDetalle);

  } 

  darConformidadExcelSupervision(): void{
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
        title: MENSAJES.ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_SUPERVISION,
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
          title: MENSAJES.ARCHIVO_CONFIRMAR_CONFORMIDAD_TITLE_SUPERVISION,
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




interface DatosExcelVisualizar {
fidProyecto: number;
archivoExcelSupervision: ExcelSupervisionVisualizarResponse;
idCodigoArchivo: number;
estadoCarga: string;

}