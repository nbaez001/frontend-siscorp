// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
// import {map, startWith} from 'rxjs/operators';
// import {combineLatest, Observable, of} from 'rxjs';
// import { MatDialogRef, MatDialog } from '@angular/material';

// import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
// import { Personal } from '../../../entities/personal';
// import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';

import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSnackBar, PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';

import { map, startWith } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
//import { State , states} from '../../../entities/state';
import { Personal } from '../../../entities/personal';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { ItemComboService } from '../../../services/item-combo.service';
import { PersonalService } from '../../../services/personal.service';
import { WsResponsePersonal, PersonalResponse } from '../../../dto/response/PersonalResponse';
import { MENSAJES } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { ProyectoService } from '../../../services/proyecto.service';
import { ParametroCoordinadorAsignarRequest } from '../../../dto/request/ParametroCoordinadorAsignaRequest';
import { WsApiOutResponse } from '../../../dto/response/WsApiOutResponse';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-coordinador-asignar',
  templateUrl: './coordinador-asignar.component.html',
  styleUrls: ['./coordinador-asignar.component.scss']
})
export class CoordinadorAsignarComponent implements OnInit {

  @ViewChild('firstname', null) nameInput: MatInput;


  modalidadForm: FormGroup;
  atencionForm: FormGroup;
  seleccionModalidad = '001';
  title: String;
  names: any;
  nombre: string;
  dataItemEstado: any;
  dataItem: any;
  personalDisponible: PersonalResponse[];
  total: number;
  mensaje: any;



  personalAsignado: PersonalResponse[] = [];
  parametroCoordinadorAsignarRequest: ParametroCoordinadorAsignarRequest;
  asignarResponse: any;
  mensajeModalidad: string;
  mensajeEncargado: string;


  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CoordinadorAsignarComponent>, private dialog: MatDialog,
    private itemComboModalidad: ItemComboService,
    private personalService: PersonalService,
    private proyectoService: ProyectoService,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA)
    public datos: DatosEncargadoVerificar) {

    this.cargarDataModalidad();
  }


  ngOnInit() {
    this.crearFormulario();
    this.cargarDataModalidad();
    //this.dataPersonalDisponible();
    this.obtenerPersonalDisponible();
    // this.renderer.selectRootElement('#myInput').focus();

    this.modalidadForm = this.formBuilder.group({
      modalidad: ''
    });

  }

  /* ngAfterViewInit() {
    setTimeout(() => {

      var elem = this.renderer.selectRootElement('#myInput');

      this.renderer.listen(elem, "focus", () => { console.log('focus') });

      this.renderer.listen(elem, "blur", () => { console.log('blur') });
  
      elem.focus();

    }, 1000);
  }
 */

  cargarDataModalidad() {
    
    this.itemComboModalidad.ObtenerModalidadEjecucion().subscribe(dataItem => {
      this.dataItem = Object.assign({
        modalidadas: dataItem.response
       
      });
      this.modalidadForm.get('modalidad').setValue(this.dataItem.modalidadas[0]);
    });
  
  }

  get resModalidadFormFrmCtrl() { return this.modalidadForm.get('resLiderTumorFrmCtrl'); }


  crearFormulario(): void {
    this.atencionForm = this.formBuilder.group({
      seleccionModalidad: [0, [Validators.required]],
    });
  }


  public openDialogMensaje(
    title: string,
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
      
      if (valor === "OK") {
        this.dialogRef.close();

      }
    });
  }

  public openDialogMensajeAsignar(
    title: string,
    message: string,
    message2: string,
    alerta: boolean,
    confirmacion: boolean,
    valor: any
  ): void {
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '500px',
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
      
      if (valor === "OK") {
        this.dialogRef.close();

      }
    });
  }

  public obtenerPersonalDisponible(): void {

    this.personalDisponible = [];

    this.personalService.obtenerPersonal()
      .subscribe(
        (wsResponsePersonal: WsResponsePersonal) => {
          
          if (wsResponsePersonal.codResultado == 1) {
            this.personalDisponible = (wsResponsePersonal.response != null) ? wsResponsePersonal.response : [];
            //this.total = (wsResponsePersonal.total!=0)? wsResponsePersonal.total : 0;

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;

            this.openDialogMensaje(MENSAJES.PREFACTIBILIDAD.TITLE, wsResponsePersonal.msgResultado, null, true, false, null);

          }
          /*     this.isLoading = false;
              this.disableBuscar = false; */
        },
        error => {
          /*   this.isLoading = false;
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
            console.error(error);
            this.disableBuscar = false; */
        }

      );

  }


  search() {
    // 
    if (this.nombre != "") {
      this.personalDisponible = this.personalDisponible.filter(res => {
        return res.cidNombre.toLocaleLowerCase().match(this.nombre.toLocaleLowerCase());
      });
    } else if (this.nombre == "") {
      this.ngOnInit();
    }
  }


  agregar(index: number) {
    // 
    if (this.personalAsignado.length == 0) {
      this.personalAsignado.push(
        this.personalDisponible[index]
      );

      this.personalDisponible.splice(index, 1);

    } else {
      this.validarSoloUnPersonal();

    }

  }

  quitar(index: number) {
    // 

    this.personalDisponible.push(
      this.personalAsignado[index]
    );

    this.personalAsignado.splice(index, 1);


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
        title: MENSAJES.EXPEDIENTE_ASIGNAR.TITLE,
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

  validarSoloUnPersonal(): void {
    this.mensaje = MENSAJES.WARNING_ASIGNAR_ENCARGADO;
    this.openDialogMensaje(MENSAJES.EXPEDIENTE_ASIGNAR.TITLE, null, this.mensaje, true, false, null);
  }


  registrarAsignacionValidar($event): void {
    $event.preventDefault();
    
    if (this.personalAsignado.length == 0) {
      this.mensaje = MENSAJES.EXPEDIENTE_ASIGNAR.ENCARGADO_REQUERIDO;
      this.openDialogMensaje(MENSAJES.EXPEDIENTE_ASIGNAR.TITLE, null, this.mensaje, true, false, null);
      return;
    } else {
      this.registrarAsignacion();
    }
  }

  registrarAsignacion(): void {
    this.parametroCoordinadorAsignarRequest = new ParametroCoordinadorAsignarRequest();
    this.parametroCoordinadorAsignarRequest.idProyecto = this.datos.idProyecto;
    
    console.log(this.modalidadForm.value);
    console.log(this.modalidadForm.value.modalidad.cidCodigo);
    this.parametroCoordinadorAsignarRequest.idModalidad = this.modalidadForm.value.modalidad.cidCodigo;
    this.parametroCoordinadorAsignarRequest.idEncargado = this.personalAsignado[0].idCodigo.toString();

    this.proyectoService.asignarEncargadoDeBandejaCoordinador(this.parametroCoordinadorAsignarRequest)
      .subscribe(
        (wsApiOutResponse: WsApiOutResponse) => {
          
          if (wsApiOutResponse.codResultado == 1) {
            //this.asignarResponse = (wsApiOutResponse.response != null) ? wsApiOutResponse.response : [];
            //this.total = (wsApiOutResponse.total!=0)? wsApiOutResponse.total : 0;
            this.mensajeModalidad = MENSAJES.EXPEDIENTE_ASIGNAR.INFO_MODALIDAD + this.modalidadForm.value.modalidad.cidNombre;
            this.mensajeEncargado = MENSAJES.EXPEDIENTE_ASIGNAR.INFO_USUARIO + this.personalAsignado[0].cidNombre;
            this.mensaje = MENSAJES.EXPEDIENTE_ASIGNAR.INFO_SUCCESS;
            this.openDialogMensajeAsignar(MENSAJES.EXPEDIENTE_ASIGNAR.TITLE, null, this.mensajeModalidad +"\n"+  this.mensajeEncargado+"\n" +  this.mensaje, true, false, "OK");

          } else {
            this.mensaje = MENSAJES.ERROR_SERVICIO_ASIGNAR_ENCARGADO;
            this.openDialogMensaje(MENSAJES.EXPEDIENTE_ASIGNAR.TITLE, null, this.mensaje, true, false, null);
          }
         
        },
        error => {
          //  this.isLoading = false;
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          this.openDialogMensaje(MENSAJES.EXPEDIENTE_ASIGNAR.TITLE, this.mensaje, null, true, false, null);
          console.error(error);
          //this.disableBuscar = false; 
        }

      ); 
  }


}

interface DatosEncargadoVerificar {
  idProyecto?: number;
  cidEstado?: string;

}
