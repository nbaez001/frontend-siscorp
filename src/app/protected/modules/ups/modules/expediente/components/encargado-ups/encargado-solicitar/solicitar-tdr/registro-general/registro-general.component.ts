import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog, PageEvent, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {combineLatest, Observable, of, BehaviorSubject} from 'rxjs';
import {FormControl} from '@angular/forms';
import { Animations } from '@shared/animations';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { Observacion, WsResponseObservacion } from '../../../../../entities/observacion';
import { PrefijoEstado } from '../../../../../entities/prefijo-estado';
import { DataSource } from '@angular/cdk/collections';
import { ProyectoService } from '../../../../../services/proyecto.service';
import { ParametroRequest } from '../../../../../dto/request/ParametroRequest';
import { MENSAJES } from 'app/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Session } from '@shared/auth/Session';
import { WsApiOutResponse } from '../../../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';
import { TdrService } from '../../../../../services/tdr.service';
import { Tdr, WsResponseTdr } from '../../../../../entities/tdr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-registro-general',
  templateUrl: './registro-general.component.html',
  styleUrls: ['./registro-general.component.scss']
})
export class RegistroGeneralComponent implements OnInit {

  proyectoForm: FormGroup;
  pagina = 1;
  cantidad = 3;
  total = 0;

  parametroRequest : ParametroRequest;


  prefijoEstado = PrefijoEstado;
  observado: boolean;
  mensaje: any;
  tdrObject: any;
  contadorEntregable: number;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistroGeneralComponent>,
    private dialog: MatDialog,
    private tdrService: TdrService,
    @Inject(MAT_DIALOG_DATA)
    public dataFrmPrincipal: TdrPk
  ) { 
    
  
   
  }

  ngOnInit() {
    this.crearFormulario();
  }
 
  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      frmCondicionGeneral: [''],
    });
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
        title: MENSAJES.PREFACTIBILIDAD.TITLE,
        message: message,
        message2: message2,
        alerta: alerta,
        confirmacion: confirmacion,
        valor: valor
      }
    });
    dialogRef.afterClosed().subscribe((confirm: boolean) => {
  
      if (confirm) {        
      
      }
    });
  }



  validarRegistro($event){
    
    $event.preventDefault();
    if(this.proyectoForm.get('frmCondicionGeneral').value == '' || (this.proyectoForm.get('frmCondicionGeneral').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_CONDICION_GENERAL;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_CONDICION_GENERAL, true, false, null);
      return false;
    }else{
      this.registrar();
    }
  }



  registrar(): void{
    
    this.tdrObject = new Tdr();
    this.tdrObject.descripcionCondicionParticular = this.proyectoForm.get('frmCondicionGeneral').value;
    this.tdrObject.fidTdr  = this.dataFrmPrincipal.idTdr;
    
    this.tdrService.registrarCondicionGeneral(this.tdrObject)
    .subscribe(
      (wsResponseTdr : WsResponseTdr)=> {
        
        if(wsResponseTdr.codResultado == 1){ 
          this.mensaje = MENSAJES.TDR.INFO_SUCCESS_CONDICION_GENERAL;
          this.openDialogMensaje2(MENSAJES.TDR.TITLE_CONDICION_GENERAL, null, this.mensaje ,true, false, "OK");
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
     
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.log(this.mensaje);
      }
    );     
    
  }





  public openDialogMensaje2(
    title:string,
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
        title: title,
        message: message,
        message2: message2,
        alerta: alerta,
        confirmacion: confirmacion,
        valor: valor
      }
    });
    dialogRef.afterClosed().subscribe((ok: number) => {
     
      if (ok == 0) { 
      
        this.dialogRef.close();
      }

    
    });
  }

  public openDialogMensaje(
    title:string,
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
        title: title,
        message: message,
        message2: message2,
        alerta: alerta,
        confirmacion: confirmacion,
        valor: valor
      }
    });
    dialogRef.afterClosed().subscribe((ok: number) => {
    
    });
  }


}

interface TdrPk {
  idTdr?: number;
}
