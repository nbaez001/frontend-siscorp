import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ValorizacionAvance, WsResponseValorizacionAvance } from '../../../dto/response/ValorizacionAvance';
import { GestionPreliquidacionService } from '../../../services/gestion-preliquidacion.services';
import { MatDialogRef, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';
import { WsResponseProyecto } from '../../../dto/response/Proyecto';
import { WsApiOutResponse } from '../../../../expediente/dto/response/WsApiOutResponse';

@Component({
  selector: 'app-valorizacion-avance',
  templateUrl: './valorizacion-avance.component.html',
  styleUrls: ['./valorizacion-avance.component.scss']
})
export class ValorizacionAvanceComponent implements OnInit {

  formValorizacionGrp:FormGroup;
  //dataSource:ValorizacionAvance[][];
  dataSource: MatTableDataSource<ValorizacionAvance>;
  proyectoResponse : ValorizacionAvance[];
  columnas: string[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;

  constructor(
    private authService: AuthService,
    private gestionPreliquidacionService:GestionPreliquidacionService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    this.authService.cabecera.next({ titulo: MENSAJES.PRE_LIQUIDACION.TITULO_BANDEJA_VAL_AVAN_OBRA });
    this.crearForm();
    this.cargarTabla();
  }

  crearForm() {
    this.formValorizacionGrp=new FormGroup({
      frmNumConvenio:new FormControl(null),
      frmCodSnip:new FormControl(null),
      frmMes:new FormControl(null),
      frmProyecto:new FormControl(null),
      frmFechaPresentacion:new FormControl(null),
      frmMontoFinanciado:new FormControl(null),
      frmFechaInicio:new FormControl(null),
      frmPlazo:new FormControl(null),
      frmFechaTermino:new FormControl(null)
    });
  }

  cargarTabla(){
    this.columnas = [ 'colPartida','colDescripcion','colUndPre','colMetPre','colPrecioUnitPre','colPresupuesto','colMetAnt','colValAnt','colMetAct','colValAct','colMetAcu','colValAcu','colPorcentajeAcu','colMetSaldo','colValSaldo','colPorcentajeSaldo']; 
    //const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');
   /* this.gestionPreliquidacionService.listarValorizacionAvance(
      this.pagina,
      this.cantidad
    ).subscribe(({response, total}) => {
      const filas = [];
      response.forEach(p => filas.push(  p    ));
    this.dataSource = filas;
      this.total = total;
    });*/


  
      //this.dataSource = null;
      this.gestionPreliquidacionService.listarValorizacionAvance(this.pagina,this.cantidad)
      .subscribe(
        (wsResponseValorizacionAvance : WsResponseValorizacionAvance)=> {
          if(wsResponseValorizacionAvance.codResultado == 1){
            this.proyectoResponse = (wsResponseValorizacionAvance.response != null) ? wsResponseValorizacionAvance.response : [];
            this.total = (wsResponseValorizacionAvance.total!=0)? wsResponseValorizacionAvance.total : 0;

            if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
              this.dataSource = new MatTableDataSource(this.proyectoResponse);
            }

          }
        },
        error => {
          console.error(error);
        }   
      ); 
    

  }

  reporteValorizacionAvance(){
   
     this.gestionPreliquidacionService.generarReporteValorizacionAvance().subscribe(response => {
       const dialogReg:MatDialogRef<PdfViewerComponent>=this.dialog.open(PdfViewerComponent,{
         disableClose:true,
         panelClass:'dialog-no-padding',
         width:'90%',
         data:{dataBlob:response}
       });
     });
  
  }

  generarReporteCronogramaAvance(){
   this.gestionPreliquidacionService.generarReporteCronogramaAvanceProyecto().subscribe(response => {
      const dialogReg:MatDialogRef<PdfViewerComponent>=this.dialog.open(PdfViewerComponent,{
        disableClose:true,
        panelClass:'dialog-no-padding',
        width:'90%',
        data:{dataBlob:response}
      });
    });
 }

  actualizarTabla(fila:any){
    console.log("data>>"+JSON.stringify(fila));
    this.gestionPreliquidacionService.grabarFilaValorizacion(fila).subscribe(
          (data: WsResponseValorizacionAvance) => {
            if (data.codResultado == 1) {
              this._snackBar.open(data.msgResultado, 'OK', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else {
              this._snackBar.open('Error al grabar datos', 'OK', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
            }
          }, error => {
            console.log(error);
          }
    )

    /*
    this.dataSource.data.forEach((data) => {
      cadena =  data.partida.toString() ;
      console.log("data>>"+JSON.stringify(data));
    });*/

  }


}
