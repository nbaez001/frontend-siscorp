import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageComponent } from '@shared/components/message/message.component';
import { MENSAJES } from 'app/common';
import { MatDialog } from '@angular/material';
import { ProyectoService } from '../../../services/proyecto.service';
import { AusenciaJefeRequest } from '../../../dto/request/AusenciaJefeRequest';
import * as _moment from 'moment';
import { WsApiOutResponse } from '../../../dto/response/WsApiOutResponse';


@Component({
    selector: 'app-ausencia-jefe',
    templateUrl: './ausencia-jefe.component.html',
    styleUrls: ['./ausencia-jefe.component.scss']
  })


 export class AusenciaJefeComponent implements OnInit {

    ausenciaForm: FormGroup;
    selectedInicio = 'am';
    selectedFin= 'am';
    checked = false;
    disabledControl = false;
    minDate = new Date();

    ausenciaJefeRequest: AusenciaJefeRequest;
    ausenciaResponse: any;



     ngOnInit(): void {
        console.log("entro");
     }

     constructor(private formBuilder: FormBuilder,
                 private dialog: MatDialog,
                 private proyectoService: ProyectoService){
         this.crearAusemciaForm();
     }

     crearAusemciaForm() {
        this.ausenciaForm = this.formBuilder.group({
          codigo: '',
          modalidad:'',
          encargado:'',
          estadoFrmCtrl:'',
          fechaRegDesdeFrmCtrl:'',
          fechaRegHastaFrmCtrl:'',
          horaInicioFrmCtrl:'',
          horaFinFrmCtrl:'',
          observacionFrmCtrl : ''
        });
      }

      validarCamposRequeridos() : boolean{
      
       
        this.ausenciaJefeRequest = new AusenciaJefeRequest();
        this.ausenciaJefeRequest.idMovimientoProyecto = 1;
        this.ausenciaJefeRequest.fechaInicio = this.ausenciaForm.get('fechaRegDesdeFrmCtrl').value!== "" ? _moment(this.ausenciaForm.get('fechaRegDesdeFrmCtrl').value).format('DD-MM-YYYY'): null;
        this.ausenciaJefeRequest.fechaFin = this.ausenciaForm.get('fechaRegHastaFrmCtrl').value!== "" ? _moment(this.ausenciaForm.get('fechaRegHastaFrmCtrl').value).format('DD-MM-YYYY'): null;
        this.ausenciaJefeRequest.observacion = this.ausenciaForm.get('observacionFrmCtrl').value !==""? this.ausenciaForm.get('observacionFrmCtrl').value: null;
       

        if(this.ausenciaJefeRequest.fechaInicio==null ||
          this.ausenciaJefeRequest.fechaFin == null ||
          this.ausenciaJefeRequest.observacion == null){
          this.openDialogMensaje(null, MENSAJES.PREFACTIBILIDAD.WARNING_CAMPOS_OBLIGATORIOS, true, false, null);
         
          return false;
        }
        return true;

      }

      registrarAusencia($event: any){
        $event.preventDefault();
        if(this.validarCamposRequeridos() == false){
          return false;
        }

        this.openDialogMensajeConfirmAusencia(MENSAJES.PREFACTIBILIDAD.WARNING_AUSENCIA,null, false, true, null);


      }

      registrarRetorno(){
        this.openDialogMensajeConfirmRetorno(MENSAJES.PREFACTIBILIDAD.WARNING_RETORNO,null, false, true, null);
      }

      seleccionaCheked(){
        alert(this.checked);
      }


     registrarAusenciaJefe(){
        
         this.proyectoService.registrarAusenciaJefe(this.ausenciaJefeRequest)
         .subscribe(
           (wsApiOutResponse : WsApiOutResponse)=> {
             if(wsApiOutResponse.codResultado == 1){
               this.ausenciaResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
               this.openDialogMensaje(null,  "REGISTRO DE AUSENCIA REALIZADO CORRECTAMENTE", true, false, null);
             }else{

               this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);
         
             }

           },
           error => {

             this.openDialogMensaje(null, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
             console.error(error);

           }
         
         ); 
       }


      retornarJefe(){
        
         this.proyectoService.retornarAusenciaJefe()
         .subscribe(
           (wsApiOutResponse : WsApiOutResponse)=> {
             if(wsApiOutResponse.codResultado == 1){
               this.ausenciaResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
               this.openDialogMensaje(null,  "RETORNO REALIZADO CORRECTAMENTE", true, false, null);
             }else{

               this.openDialogMensaje(null,  wsApiOutResponse.msgResultado, true, false, null);
         
             }

           },
           error => {

             this.openDialogMensaje(null, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
             console.error(error);

           }
         
         ); 
       }
    
        
       


      
    public openDialogMensajeConfirmAusencia(
    
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
          this.registrarAusenciaJefe();
        }
      });
    }

    public openDialogMensajeConfirmRetorno(
    
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
          this.retornarJefe();
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
      dialogRef.afterClosed().subscribe((ok: number) => {
   


      });
    }

    public validarFechaInicio() {
      
      const dateInicio = this.ausenciaForm.get('fechaRegDesdeFrmCtrl').value;
      const dateFin = this.ausenciaForm.get('fechaRegHastaFrmCtrl').value;
      const dateActual = new Date();

      let dateActualOk =  dateActual.setDate(dateActual.getDate() - 1);

      if (this.ausenciaForm.get('fechaRegHastaFrmCtrl').value !== "" ) {
        if (dateInicio > dateFin) {
          this.openDialogMensajeFecha(MENSAJES.PREFACTIBILIDAD.TITLE,'Fecha inicial debe ser menor que la fecha final', null, true, false, null);
          this.ausenciaForm.get('fechaRegDesdeFrmCtrl').setValue("");
        } else if (dateInicio === dateFin) {
          this.openDialogMensajeFecha(MENSAJES.PREFACTIBILIDAD.TITLE,'Fecha inicial debe ser distinta a la fecha final', null, true, false, null);
          this.ausenciaForm.get('fechaRegDesdeFrmCtrl').setValue("");
        } else if (dateInicio < dateActualOk) {
          this.openDialogMensajeFecha(MENSAJES.PREFACTIBILIDAD.TITLE,'Fecha no debe de ser mayor xxxx al actual', null, true, false, null);
          this.ausenciaForm.get('fechaRegDesdeFrmCtrl').setValue("");
        }
      }
    }
  
    public validarFechaFin() {
      
      const dateInicio = this.ausenciaForm.get('fechaRegDesdeFrmCtrl').value;
      const dateFin = this.ausenciaForm.get('fechaRegHastaFrmCtrl').value;
      const dateActual = new Date();
      let dateActualOk =  dateActual.setDate(dateActual.getDate() - 1);
      if (this.ausenciaForm.get('fechaRegDesdeFrmCtrl').value !== ""  ) {
        if (dateInicio > dateFin) {
          this.openDialogMensajeFecha(MENSAJES.PREFACTIBILIDAD.TITLE,'Fecha final debe ser mayor a la fecha inicial', null, true, false, null);
          this.ausenciaForm.get('fechaRegHastaFrmCtrl').setValue("");
        } else if (dateInicio === dateFin) {
          this.openDialogMensajeFecha(MENSAJES.PREFACTIBILIDAD.TITLE,'Fecha final debe ser distinta a la fecha inicial', null, true, false, null);
          this.ausenciaForm.get('fechaRegHastaFrmCtrl').setValue("");
        } else if (dateFin < dateActualOk) {
          this.openDialogMensajeFecha(MENSAJES.PREFACTIBILIDAD.TITLE,'Fecha no debe de ser mayor yyyy al actual', null, true, false, null);
          this.ausenciaForm.get('fechaRegHastaFrmCtrl').setValue("");
        }
      }
    }

    public openDialogMensajeFecha(
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