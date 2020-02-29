import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatRadioGroup } from '@angular/material';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { ActividadResponse } from '../../../../../dto/response/ActividadResponse';
import { AlcanceResponse, WsResponseAlcance } from '../../../../../dto/response/AlcanceResponse';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { RegistroAlcanceDescripcionComponent } from '.././registro-alcance-descripcion/registro-alcance-descripcion.component';
import { TdrService } from '../../../../../services/tdr.service';
import { WsResponseTdr, Tdr } from '../../../../../entities/tdr';
import { MENSAJES } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { Entregable } from '../../../../../entities/entregable';
import { RegistroEntregableComponent } from '.././registro-entregable/registro-entregable.component';
import { EntregableResponse, WsResponseEntregable } from '../../../../../dto/response/EntregableResponse';
import { RegistroActividadComponent } from '.././registro-entregable/registro-actividad/registro-actividad.component';
import { CondicionGeneralResponse, WsResponseCondicionGeneral } from '../../../../../dto/response/CondicionGeneralResponse';
import { CondicionParticularResponse, WsResponseCondicionParticular } from '../../../../../dto/response/CondicionParticularResponse';
import { RegistroGeneralComponent } from '../registro-general/registro-general.component';
import { RegistroParticularComponent } from '.././registro-particular/registro-particular.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RegistroFormaPagoComponent } from '../registro-forma-pago/registro-forma-pago.component';
import { WsResponseTdrEditar, DetalleTdr } from '../../../../../entities/detalleTdr';

@Component({
  selector: 'app-registro-tdr',
  templateUrl: './registro-tdr.component.html',
  styleUrls: ['./registro-tdr.component.scss']
})
export class RegistroTdrComponent implements OnInit {

  selectedIndexTab: string;
  selectedIndexTabChange: string;
  step = 0;
  dataItem: any;
  dataItemAprobado: any;
  dataItemRevisado: any;
  dataItemElaborado: any;

  seleccionPerfilContratacion: number;
  seleccionCodigoFormato: number;
  seleccionUnidadElaborado: number;
  seleccionUnidadRevisado: number;
  seleccionUnidadAprobado: number;

  @ViewChild('radioButonTipoPersona', null) radioButonTipoPersona: MatRadioGroup;

  // Tabla
  dataSource: MatTableDataSource<AlcanceResponse>;

  tdrObject: Tdr;
  idPrimarayKeyTdr: Tdr[];
  mensaje: any;

  entregableHtml: string;
  txtEntregableHtml: string;
  columnasEntregables: string[];
  myParam: any;
  myParamIdProyecto: any;
  selectedId: number;
  dialogRefVariable: MatDialogRef<ConfirmMessageComponent, any>;
  tdrCondicionGeneral: any;
  idGeneral: number;
  idParticular: any;
  tdrCondicionParticular: any;
  dataItemPerfil: any;
  wsResponseTdr: any;
  tdrObjectDet: DetalleTdr;
  wsResponseAlcance: any;

  checkPersonaNatural: boolean;
  checkPersonaJuridica: boolean;



  setStep(index: number) {
    this.step = index;
  }

  public EditorDenominacion = DecoupledEditor;
  public EditorFinalidadPublica = DecoupledEditor;
  public EditorAntecedente = DecoupledEditor;
  public EditorObjetivo = DecoupledEditor;
  public EditorLugar = DecoupledEditor;
  public EditorPlazo = DecoupledEditor;
  public EditorConformidad = DecoupledEditor;
  public EditorConfidencialidad = DecoupledEditor;
  public EditorPenalidad = DecoupledEditor;
  public EditorPropiedadIntelectual = DecoupledEditor;
  public EditorAnticorrupcion = DecoupledEditor;
  public EditorResponsabilidad = DecoupledEditor;
  public EditorOtraCondicion = DecoupledEditor;


  public ckeditorDenominacion: string = "";
  public ckeditorFinalidadPublica: string  = "";
  public ckeditorAntecedente: string = "";
  public ckeditorObjetivo: string = "";
  public ckeditorLugar: string = "";
  public ckeditorPlazo: string = "";
  public ckeditorConformidad: string = "";
  public ckeditorConfidencialidad: string = "";
  public ckeditorPenalidad: string = "";
  public ckeditorPropiedadIntelectual: string = "";
  public ckeditorAnticorrupcion: string = "";
  public ckeditorResponsabilidad: string = "";
  public ckeditorOtraCondicion: string = "";



  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }


  proyectoForm: FormGroup;
  columnas: string[] = [];
  columnasActividades: string[] = [];
  columnasGenerales: string[] = [];
  columnasParticulares: string[] = [];


  dataSourceActividad: MatTableDataSource<ActividadResponse>;
  dataSourceAlcance: MatTableDataSource<AlcanceResponse>;
  dataSourceEntregable: MatTableDataSource<EntregableResponse>;
  dataSourceGeneral: MatTableDataSource<CondicionGeneralResponse>;
  dataSourceParticular: MatTableDataSource<CondicionParticularResponse>;


  actividadResponse: ActividadResponse[];
  alcanceResponse: AlcanceResponse[];
  entregableResponse: EntregableResponse[];
  condicionGeneralResponse: CondicionGeneralResponse[];
  condicionParticularResponse: CondicionParticularResponse[];


  alcanceTexto: string;

  tabGenerales: boolean;
  tabObjetivoAlcance: boolean;
  tabEntregable: boolean;
  tabProveedorFormaPago: boolean;
  tabOtrosDatos: boolean;

  listaAuxiliar: object[] = [];
  objectoEntregable: Entregable;

  contadorEntregable = 1;
  formatoCodigoTdr: string;

  idProyectoDesencriptado: number;

  constructor(

    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private tdrService: TdrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

   
    /*
    let myItem = localStorage.getItem('id');
    localStorage.removeItem('id');
    localStorage.clear();*/
    this.checkPersonaNatural = true;

    this.route.params.subscribe((params: Params) => this.myParam = params['id']);
    let idCodigoDesencriptado;
    if(typeof this.myParam !== 'undefined'){
      idCodigoDesencriptado = atob(this.myParam);
    }


    this.route.params.subscribe((params: Params) => this.myParamIdProyecto = params['idProy']);
    if(typeof this.myParamIdProyecto !== 'undefined'){
      this.idProyectoDesencriptado = Number(atob(this.myParamIdProyecto));
    }
    
  
    console.log(idCodigoDesencriptado); 

    if(typeof idCodigoDesencriptado !== 'undefined'){
      this.tabObjetivoAlcance = false;
      this.tabEntregable = false;//true;
      this.tabProveedorFormaPago = false;//true;
      this.tabOtrosDatos = false;//true;
      this.editarTdr(idCodigoDesencriptado);
      

    }else{
      this.tabObjetivoAlcance = true;
      this.tabEntregable = true;//true;
      this.tabProveedorFormaPago = true;//true;
      this.tabOtrosDatos = true;//true;
    
    }

    this.selectedIndexTab = "0";
    this.crearFormulario();
    this.entregableResponse = [];
    this.columnas = ['Nro', 'Descripcion', 'accion'];
    this.columnasEntregables = ['Nro', 'Descripcion', 'Plazo', 'accion'];
    this.columnasGenerales = ['Nro', 'Descripcion', 'accion'];
    this.columnasParticulares = ['Nro', 'tipoPerfil','Descripcion', 'accion'];

    this.listaAuxiliar = [];

    this.cargarCodigoFormato();
    this.cargarUnidadElaborado();
    this.cargarUnidadRevisado();
    this.cargarUnidadAprobado();
    this.cargarPerfilContratacion();
    //this.listaAlcance();


  }


  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      unidad: [''],
      denominacionContrato: [''],
      finalidad: [''],
      antecedentes: [''],
      objetivo: [''],
      alcances: [''],
      lugar: [''],
      plazo: [''],
      entregables: [''],
      requisitos: [''],
      formapago: [''],
      conformidad: [''],
      confidencialidad: [''],
      penalidades: [''],
      propiedad: [''],
      anticorrupcion: [''],
      responsabilidad: [''],
      condiciones: [''],
      frmEditor: [''],
      frmEntregable: [''],
      entrega1: [''],
      entrega2: [''],
      entrega3: [''],
      entrega4: [''],
      frmCondicionGeneral:[''] ,
      frmCondicionParticular:[''],
      frmDescripcionGeneral: ['']
    });
  }



  public openDialogRegistrarGeneral(
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
      }

    
    });
  }

  public openDialogRegistrarTdr(
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
        //this.router.navigate(['/ups/expediente/solicitar-tdr']);
        this.router.navigate(['/ups/expediente/bandeja-encargado']);
      }
    });
  }


  regresarBandejaTdr(){
    //this.router.navigate(['/ups/expediente/solicitar-tdr']);
    this.router.navigate(['/ups/expediente/bandeja-encargado']);
  }
  



  cargarPerfilContratacion() {
    this.tdrService.comboPerfilContratacion().subscribe(dataItemPerfil => {
      this.dataItemPerfil = Object.assign({
        perfilContratacion: dataItemPerfil.response
      });
    });
  }



  cargarCodigoFormato() {
    this.tdrService.listarCodigoFormato().subscribe(dataItem => {
      this.dataItem = Object.assign({
        codigo: dataItem.response
      });
    });
  }



  

  cargarUnidadElaborado() {
    this.tdrService.listarUnidad().subscribe(dataItemElaborado => {
      this.dataItemElaborado = Object.assign({
        unidadElaborado: dataItemElaborado.response
      });
    });
  }

  cargarUnidadRevisado() {
    this.tdrService.listarUnidad().subscribe(dataItemRevisado => {
      this.dataItemRevisado = Object.assign({
        unidadRevisado: dataItemRevisado.response
      });
    });
  }

  cargarUnidadAprobado() {
    this.tdrService.listarUnidad().subscribe(dataItemAprobado => {
      this.dataItemAprobado = Object.assign({
        unidadAprobado: dataItemAprobado.response
      });
    });
  }

  public openDialogMensaje2(
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
        
        if (ok == 0) {
          dialogRef.close()
        }

      });
  }

  registrarTab_1($event){
    
    $event.preventDefault();
    if(typeof this.seleccionCodigoFormato === 'undefined'
      && this.ckeditorDenominacion == ""
      && this.ckeditorFinalidadPublica == ""
      && this.ckeditorAntecedente == ""){
     
        this.openDialogMensaje(MENSAJES.TDR.TITLE_TDR, null, MENSAJES.TDR.WARNING_CAMPO_OBLIGATORIO_CODIGO_FORMATO, true, false, null);
        return false;
    }
 
    else if(typeof this.seleccionCodigoFormato === 'undefined'
      && this.ckeditorDenominacion != ""
      && this.ckeditorFinalidadPublica != ""
      && this.ckeditorAntecedente != ""){
     
        this.openDialogMensaje(MENSAJES.TDR.TITLE_TDR, null, MENSAJES.TDR.WARNING_CAMPO_OBLIGATORIO_CODIGO_FORMATO, true, false, null);
        return false;
    }
    else if(typeof this.seleccionCodigoFormato !== 'undefined'
    && this.ckeditorDenominacion == ""
    && this.ckeditorFinalidadPublica == ""
    && this.ckeditorAntecedente == ""){
   
      this.openDialogMensaje(MENSAJES.TDR.TITLE_TDR, null, MENSAJES.TDR.WARNING_CAMPO_OBLIGATORIO_DENOMICACION, true, false, null);
      return false;
    }
    else if(typeof this.seleccionCodigoFormato !== 'undefined'
    && this.ckeditorDenominacion != ""
    && this.ckeditorFinalidadPublica == ""
    && this.ckeditorAntecedente == ""){
   
      this.openDialogMensaje(MENSAJES.TDR.TITLE_TDR, null, MENSAJES.TDR.WARNING_CAMPO_OBLIGATORIO_FINALIDAD, true, false, null);
      return false;
    }
    else if(typeof this.seleccionCodigoFormato !== 'undefined'
    && this.ckeditorDenominacion == ""
    && this.ckeditorFinalidadPublica != ""
    && this.ckeditorAntecedente != ""){
   
      this.openDialogMensaje(MENSAJES.TDR.TITLE_TDR, null, MENSAJES.TDR.WARNING_CAMPO_OBLIGATORIO_DENOMICACION, true, false, null);
      return false;
    }
    else if(typeof this.seleccionCodigoFormato !== 'undefined'
    && this.ckeditorDenominacion != ""
    && this.ckeditorFinalidadPublica == ""
    && this.ckeditorAntecedente != ""){
   
      this.openDialogMensaje(MENSAJES.TDR.TITLE_TDR, null, MENSAJES.TDR.WARNING_CAMPO_OBLIGATORIO_FINALIDAD, true, false, null);
      return false;
    }
    else if(typeof this.seleccionCodigoFormato !== 'undefined'
    && this.ckeditorDenominacion != ""
    && this.ckeditorFinalidadPublica != ""
    && this.ckeditorAntecedente == ""){
   
      this.openDialogMensaje(MENSAJES.TDR.TITLE_TDR, null, MENSAJES.TDR.WARNING_CAMPO_OBLIGATORIO_ANTECENDENTE, true, false, null);
      return false;
    }

    this.guardarTab_1();
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
  
    if (ok == 0) { 
      dialogRef.close();
    }
  });
}

tab_click($event){
  this.selectedIndexTab = $event;
}
  guardarTab_1(): void {
    this.tdrObject = new Tdr();
    this.tdrObject.fidFormato = this.seleccionCodigoFormato;
    this.tdrObject.fidUnidadElabora = this.seleccionUnidadElaborado;
    this.tdrObject.fidUnidadRevisa = this.seleccionUnidadRevisado;
    this.tdrObject.fidUnidadAPrueba = this.seleccionUnidadAprobado;
    this.tdrObject.denominacion = this.ckeditorDenominacion;
    this.tdrObject.finalidadPublica = this.ckeditorFinalidadPublica;
    this.tdrObject.antecedente = this.ckeditorAntecedente;
    this.tdrObject.personaTipo = this.radioButonTipoPersona.value == 1?this.radioButonTipoPersona.value:2;
    this.tdrObject.fidProyecto = this.idProyectoDesencriptado;

    this.idProyectoDesencriptado
    if(typeof this.idPrimarayKeyTdr !== 'undefined'){
      console.log(Number(this.idPrimarayKeyTdr));
      this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr);
    }
   
    this.tdrService.registrarTdrtab1(this.tdrObject)
      .subscribe(
        (wsResponseTdr: WsResponseTdr) => {
          
          if (wsResponseTdr.codResultado == 1) {
            this.idPrimarayKeyTdr = wsResponseTdr.response;   
            this.selectedIndexTab = "1";
            
            this.tabObjetivoAlcance = false;

            //this.listaAlcance();

          } else {
             this.mensaje = MENSAJES.ERROR_NOFUNCION;
             console.log(this.mensaje);
          }
        },
        error => {
        
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.error(error);
           
        }
      );
  }

  registrarTab_2() {
    this.tdrObject = new Tdr();
    this.tdrObject.objetivo = this.ckeditorObjetivo;
    this.tdrObject.lugarPrestacion = this.ckeditorLugar;
    this.tdrObject.plazoEjecucion = this.ckeditorPlazo;
    this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr + "");
    this.tdrObject.fidProyecto = this.idProyectoDesencriptado;

    this.tdrService.registrarTdrtab2(this.tdrObject)
      .subscribe(
        (wsResponseTdr: WsResponseTdr) => {
          
          if (wsResponseTdr.codResultado == 1) {
            this.selectedIndexTab = "2";
            this.tabEntregable = false;

          } else {
             this.mensaje = MENSAJES.ERROR_NOFUNCION;
             console.log(this.mensaje);
          }

        },
        error => {      
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.error(error);

        }
      );
  }



  registrarTab_4(){
    
    this.tdrObject = new Tdr();
    this.tdrObject.conformidadPrestacion = this.ckeditorConformidad;
    this.tdrObject.confidencialidad = this.ckeditorConfidencialidad;
    this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr + "");
    this.tdrObject.fidProyecto = this.idProyectoDesencriptado;

    this.tdrService.registroTdrtab4(this.tdrObject)
      .subscribe(
        (wsResponseTdr: WsResponseTdr) => {
          
          if (wsResponseTdr.codResultado == 1) {
            this.selectedIndexTab = "4";
            this.tabOtrosDatos = false;


          } else {
             this.mensaje = MENSAJES.ERROR_NOFUNCION;
             console.log(this.mensaje);
          }

        },
        error => {      
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.error(error);

        }
      );
  }


  registrarTab_5() {
    this.tdrObject = new Tdr();

    this.tdrObject.penalidad = this.ckeditorPenalidad;
    this.tdrObject.propiedadIntelectual = this.ckeditorPropiedadIntelectual;
    this.tdrObject.contenidoAnticorrupcion = this.ckeditorAnticorrupcion;
    this.tdrObject.responsabilidadVicioOculto = this.ckeditorResponsabilidad;
    this.tdrObject.otrasCondiciones = this.ckeditorOtraCondicion;
    this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr + "");
    this.tdrObject.fidProyecto = this.idProyectoDesencriptado;

    this.tdrService.registrarTdrtab5(this.tdrObject)
      .subscribe(
        (wsResponseTdr: WsResponseTdr) => {
          
          if (wsResponseTdr.codResultado == 1) {
            this.tabOtrosDatos = false;
            this.mensaje = MENSAJES.TDR.INFO_SUCCESS_TDR;
            this.openDialogRegistrarTdr(MENSAJES.TDR.TITLE_TDR, null, this.mensaje ,true, false, "OK");
           
          } else {
             this.mensaje = MENSAJES.ERROR_NOFUNCION;
             console.log(this.mensaje);
          }

        },
        error => {      
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.error(error);

        }
      );
  }

  generarCantidadEntregable(): void {
    const dialogReg: MatDialogRef<RegistroEntregableComponent> = this.dialog.open(RegistroEntregableComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px',
      data: {
        idTdr: this.idPrimarayKeyTdr,
        cantEntregable: this.entregableResponse.length + 1

      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaEntregable();
    });
  }


  abrirFomularioAlcance() {
    const dialogReg: MatDialogRef<RegistroAlcanceDescripcionComponent> = this.dialog.open(RegistroAlcanceDescripcionComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px', height: '300px',
      data: {
        idTdr: this.idPrimarayKeyTdr
      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaAlcance();
    });
  }

  abrirFormularioGenerales() {
    const dialogReg: MatDialogRef<RegistroGeneralComponent> = this.dialog.open(RegistroGeneralComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px', height: '300px',
      data: {
        idTdr: this.idPrimarayKeyTdr
      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaCondicionGeneral();    
    });
  }


  abrirFormularioParticulares() {
    const dialogReg: MatDialogRef<RegistroParticularComponent> = this.dialog.open(RegistroParticularComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px', height: '300px',
      data: {
        idTdr: this.idPrimarayKeyTdr
      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaCondicionPaticular();    
    });
  }


  abrirFormularioFormaPago(){

    const dialogReg: MatDialogRef<RegistroFormaPagoComponent> = this.dialog.open(RegistroFormaPagoComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px',
      data: {
        idTdr: this.idPrimarayKeyTdr
      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      //this.listaFormaPago();
    });

  }

  registrarActividades(idCodigo: number) {
    const dialogReg: MatDialogRef<RegistroActividadComponent> = this.dialog.open(RegistroActividadComponent, {
      panelClass: 'dialog-no-padding',
      width: '700px',
      data: {
        idTdr: this.idPrimarayKeyTdr,
        idCodigo: idCodigo
      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaAlcance();

    });

  }

  listaAlcance(): void {
    this.tdrObject = new Tdr();
    if (typeof this.idPrimarayKeyTdr !== "undefined") {
      this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr + "");
      this.tdrService.listaAlcance(this.tdrObject)
        .subscribe(
          (wsResponseAlcance: WsResponseAlcance) => {
            
            if (wsResponseAlcance.codResultado == 1) {
              this.alcanceResponse = (wsResponseAlcance.response != null) ? wsResponseAlcance.response : [];
              this.cargarTablaAlcance();
            } else {
              this.alcanceResponse = [];
              this.cargarTablaAlcance();
            }
          },
          error => {
             this.mensaje = MENSAJES.ERROR_SERVICIO;
             console.error(this.mensaje);
          }

        );
    }

  }

  listaEntregable(): void {
    this.tdrObject = new Tdr();
    if (typeof this.idPrimarayKeyTdr !== "undefined") {
      this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr + "");
      this.tdrService.listaEntregable(this.tdrObject)
        .subscribe(
          (wsResponseEntregable: WsResponseEntregable) => {
            
            if (wsResponseEntregable.codResultado == 1) {

              this.entregableResponse = (wsResponseEntregable.response != null) ? wsResponseEntregable.response : [];
              this.cargarTablaEntregable();

            } else {
              this.entregableResponse = [];
              this.cargarTablaEntregable();
            }
          },
          error => {
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.error(this.mensaje);
          }
        );
    }
  }




//******************************************************************** CONDICION GENERAL INICIO ***************************************************************** */
  listaCondicionGeneral(): void {
    
    this.tdrObject = new Tdr();
    if (typeof this.idPrimarayKeyTdr !== "undefined") {
      this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr + "");
      this.tdrService.listaCondicionGeneral(this.tdrObject)
        .subscribe(
          (wsResponseCondicionGeneral: WsResponseCondicionGeneral) => {
            
            if (wsResponseCondicionGeneral.codResultado == 1) {

              this.condicionGeneralResponse = (wsResponseCondicionGeneral.response != null) ? wsResponseCondicionGeneral.response : [];
              this.cargarTablaCondicionGeneral();

            } else {
              this.entregableResponse = [];
              this.cargarTablaCondicionGeneral();
            }
          },
          error => {
             this.mensaje = MENSAJES.ERROR_SERVICIO;
             console.error(this.mensaje);
          }
        );
    }
  }

  validarRegistroCondicionGeneral($event){
    $event.preventDefault();
    if(this.proyectoForm.get('frmCondicionGeneral').value == '' || (this.proyectoForm.get('frmCondicionGeneral').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_CONDICION_GENERAL;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_CONDICION_GENERAL, true, false, null);
      return false;
    }else{
      this.registrarCondicionGeneral();
    }
  }



  registrarCondicionGeneral(): void{  
    if(typeof this.idGeneral !== 'undefined' && this.idGeneral != -1 ){
      console.log(Number(this.idPrimarayKeyTdr));
      let idCondicionGeneral = Number(this.idPrimarayKeyTdr);
      this.tdrObject = new Tdr();
      this.tdrObject.descripcionCondicionGeneral = this.proyectoForm.get('frmCondicionGeneral').value;
      this.tdrObject.fidTdr  = Number(this.idPrimarayKeyTdr+"");
      
      this.tdrService.editarCondicionGeneral(this.idGeneral, this.tdrObject)
      .subscribe(
        (wsResponseTdr : WsResponseTdr)=> {
          
          if(wsResponseTdr.codResultado == 1){ 
            this.mensaje = MENSAJES.TDR.INFO_SUCCESS_CONDICION_GENERAL_MODIFICADO;
            this.openDialogRegistrarGeneral(MENSAJES.TDR.TITLE_CONDICION_GENERAL, null, this.mensaje ,true, false, "OK");
            this.proyectoForm.get('frmCondicionGeneral').setValue('');
            this.idGeneral = -1;
            this.listaCondicionGeneral();    
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
    }else if(typeof  this.idGeneral === 'undefined' || this.idGeneral == -1 ){
      console.log(Number(this.idPrimarayKeyTdr));
      this.tdrObject = new Tdr();
      this.tdrObject.descripcionCondicionGeneral = this.proyectoForm.get('frmCondicionGeneral').value;
      this.tdrObject.fidTdr  = Number(this.idPrimarayKeyTdr+"");
      
      this.tdrService.registrarCondicionGeneral(this.tdrObject)
      .subscribe(
        (wsResponseTdr : WsResponseTdr)=> {
          
          if(wsResponseTdr.codResultado == 1){ 
            this.mensaje = MENSAJES.TDR.INFO_SUCCESS_CONDICION_GENERAL;
            this.openDialogRegistrarGeneral(MENSAJES.TDR.TITLE_CONDICION_GENERAL, null, this.mensaje ,true, false, "OK");
            this.proyectoForm.get('frmCondicionGeneral').setValue('');
            this.listaCondicionGeneral();    
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
  }

  editarGeneral(idCodigo: number): void {
    
    this.tdrService.obtenerCondicionGeneral(idCodigo)
      .subscribe(
        (wsResponseCondicionGeneral: WsResponseCondicionGeneral) => {
          
          if (wsResponseCondicionGeneral.codResultado == 1) {
            this.tdrCondicionGeneral = wsResponseCondicionGeneral.response;
            this.proyectoForm.get('frmCondicionGeneral').setValue(this.tdrCondicionGeneral.nombreCondicionGeneral);
            this.idGeneral = this.tdrCondicionGeneral.idCodigoCondicionGeneral;
            this.listaCondicionGeneral();
           } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            console.log(this.mensaje);
          } 
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(this.mensaje);

        }
      );
  }

  
  eliminarGeneral(idCodigo: number): void {
    this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar la condicion general?`;

    this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {

      if (confirm) {        
        this.tdrService.eliminarCondicionGeneral(idCodigo).subscribe(

          (wsResponseTdr : WsResponseTdr)=> {
            
            if(wsResponseTdr.codResultado == 1){            
              this.listaCondicionGeneral();
            }
          },
          error => {
            this.mensaje = MENSAJES.ERROR_SERVICIO;
             console.error(this.mensaje);
          }
        ); 
      }
    });
  }

//******************************************************************* CONDICION GENERAL FINAL ************************************************************** */


//****************************************************************** CONDICION PARTICULAR INICIO ************************************************************* */
  validarRegistroCondicionParticular($event){
    
    $event.preventDefault();
    if(typeof this.seleccionPerfilContratacion === 'undefined'){
      this.mensaje = MENSAJES.TDR.TITLE_CONDICION_PARTICULAR;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_CONDICION_PARTICULAR_PERFIL, true, false, null);
      return false;
    }
    else if(this.proyectoForm.get('frmCondicionParticular').value == '' || (this.proyectoForm.get('frmCondicionParticular').value == null)){
      this.mensaje = MENSAJES.TDR.TITLE_CONDICION_PARTICULAR;
      this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_CONDICION_PARTICULAR, true, false, null);
      return false;
    } 
    else{
      this.registrarCondicionParticular();
    }
  }

  registrarCondicionParticular(): void{
    
    
    if(typeof this.idParticular !== 'undefined' && this.idParticular != -1 ){
      console.log(Number(this.idPrimarayKeyTdr));
      let idCondicionParticular = Number(this.idPrimarayKeyTdr);
      this.tdrObject = new Tdr();
      this.tdrObject.fidPerfilContratacion = this.seleccionPerfilContratacion;
      this.tdrObject.descripcionCondicionParticular = this.proyectoForm.get('frmCondicionParticular').value;
      this.tdrObject.fidTdr  = Number(this.idPrimarayKeyTdr+"");
      
      this.tdrService.editarCondicionParticular(this.idParticular, this.tdrObject)
      .subscribe(
        (wsResponseTdr : WsResponseTdr)=> {
          
          if(wsResponseTdr.codResultado == 1){ 
            this.mensaje = MENSAJES.TDR.INFO_SUCCESS_CONDICION_PARTICULAR;
            this.openDialogRegistrarGeneral(MENSAJES.TDR.TITLE_CONDICION_PARTICULAR, null, this.mensaje ,true, false, "OK");
            this.proyectoForm.get('frmCondicionParticular').setValue('');
            this.idParticular = -1;
            this.listaCondicionPaticular();    
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
    }else if(typeof  this.idParticular === 'undefined' || this.idParticular == -1 ){
      console.log(Number(this.idPrimarayKeyTdr));
      this.tdrObject = new Tdr();
      this.tdrObject.fidPerfilContratacion = this.seleccionPerfilContratacion;
      this.tdrObject.descripcionCondicionParticular= this.proyectoForm.get('frmCondicionParticular').value;
      this.tdrObject.fidTdr  = Number(this.idPrimarayKeyTdr+"");
      
      this.tdrService.registrarCondicionParticular(this.tdrObject)
      .subscribe(
        (wsResponseTdr : WsResponseTdr)=> {
          
          if(wsResponseTdr.codResultado == 1){ 
            this.mensaje = MENSAJES.TDR.INFO_SUCCESS_CONDICION_PARTICULAR;
            this.openDialogRegistrarGeneral(MENSAJES.TDR.TITLE_CONDICION_PARTICULAR, null, this.mensaje ,true, false, "OK");
            this.proyectoForm.get('frmCondicionParticular').setValue('');
            this.listaCondicionPaticular();    
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
  }


  editarParticular(idCodigo: number): void {
    
    this.tdrService.obtenerCondicionParticular(idCodigo)
      .subscribe(
        (wsResponseCondicionParticular: WsResponseCondicionParticular) => {
          
          if (wsResponseCondicionParticular.codResultado == 1) {
            this.tdrCondicionParticular = wsResponseCondicionParticular.response;
            this.proyectoForm.get('frmCondicionParticular').setValue(this.tdrCondicionParticular.descripcionCondicionParticular);
            this.seleccionPerfilContratacion = this.tdrCondicionParticular.idCodigoPerfil;
            this.idParticular = this.tdrCondicionParticular.idCodigoCondicionParticular;
            this.listaCondicionGeneral();
           } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            console.log(this.mensaje);
          } 
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(this.mensaje);

        }
      );
}

  eliminarParticular(idCodigo: number): void {
    this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar la condicion particular?`;

    this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {

      if (confirm) {        
        this.tdrService.eliminarCondicionParticular(idCodigo).subscribe(

          (wsResponseTdr : WsResponseTdr)=> {
            
            if(wsResponseTdr.codResultado == 1){            
              this.listaCondicionPaticular();
            }
          },
          error => {
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.error(this.mensaje);
          }
        ); 
      }
    });
  }


  listaCondicionPaticular(): void {
    this.tdrObject = new Tdr();
    
    if (typeof this.idPrimarayKeyTdr !== "undefined") {
      this.tdrObject.fidTdr = Number(this.idPrimarayKeyTdr + "");
      this.tdrService.listaCondicionParticular(this.tdrObject)
        .subscribe(
          (wsResponseCondicionParticular: WsResponseCondicionParticular) => {
            
            if (wsResponseCondicionParticular.codResultado == 1) {

              this.condicionParticularResponse = (wsResponseCondicionParticular.response != null) ? wsResponseCondicionParticular.response : [];
              this.cargarTablaCondicionParticular();

            } else {
              this.condicionParticularResponse = [];
              this.cargarTablaCondicionParticular();
            }
          },
          error => {
             this.mensaje = MENSAJES.ERROR_SERVICIO;
             console.error(this.mensaje);
          }
        );
    }
  }

//****************************************************************** CONDICION PARTICULAR FINAL ************************************************************** */



//***************************************************************** REGISTRAR DESCRIPCION GENERAL ************************************************************ */

registrarTab_3($event){
  $event.preventDefault();
  if(this.proyectoForm.get('frmDescripcionGeneral').value == '' || (this.proyectoForm.get('frmDescripcionGeneral').value == null)){
    this.mensaje = MENSAJES.TDR.TITLE_ENTREGABLE;
    this.openDialogMensaje(this.mensaje, null, MENSAJES.TDR.WARNING_DESCRIPCION_GENERAL_ENTREGABLE, true, false, null);
    return false;
  }else{
    this.registrarDescripcionGeneralEntregable();
  }
}



registrarDescripcionGeneralEntregable(): void{  

    this.tdrObject = new Tdr();
    this.tdrObject.contenidoEntregable = this.proyectoForm.get('frmDescripcionGeneral').value;
    this.tdrObject.fidTdr  = Number(this.idPrimarayKeyTdr+"");
    
    this.tdrService.registrarDescripcionGeneralEntregable(this.tdrObject)
    .subscribe(
      (wsResponseTdr : WsResponseTdr)=> {
        
        if(wsResponseTdr.codResultado == 1){ 
          this.selectedIndexTab = "3";
          this.tabProveedorFormaPago = false;
          this.mensaje = MENSAJES.TDR.INFO_SUCCESS_DESCRIPCION_GENERAL_ENTREGABLE;
          console.log(this.mensaje);
         // this.openDialogRegistrarGeneral(MENSAJES.TDR.TITLE_ENTREGABLE, null, this.mensaje ,true, false, "OK"); */
         //this.proyectoForm.get('frmCondicionGeneral').setValue('');
          
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
  
  eliminarAlcance(idCodigo: number): void {
    this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar el alcance?`;

    this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {

      if (confirm) {        
        this.tdrService.eliminarAlcance(idCodigo).subscribe(

          (wsResponseTdr : WsResponseTdr)=> {
            
            if(wsResponseTdr.codResultado == 1){            
              this.listaAlcance();
            }
          },
          error => {
            this.mensaje = MENSAJES.ERROR_SERVICIO;
             console.error(this.mensaje);
          }
        
        ); 
      }
    });
  }


  eliminarEntregable(idCodigo: number): void {
    this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar el entregable?`;

    this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {

      if (confirm) {        
        this.tdrService.eliminarEntregable(idCodigo).subscribe(

          (wsResponseTdr : WsResponseTdr)=> {
            
            if(wsResponseTdr.codResultado == 1){            
              this.listaEntregable();
            }
          },
          error => {
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            console.error(this.mensaje);
          
          }
        
        ); 
      }
    });
  }

  editarFormaPago(idCodigo: number): void {

    const dialogReg: MatDialogRef<RegistroFormaPagoComponent> = this.dialog.open(RegistroFormaPagoComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px',
      data: {
        idTdr: this.idPrimarayKeyTdr,
        idFormaPago: idCodigo

      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaEntregable();
    });

  }

  editarEntregable(idCodigo: number): void {

    const dialogReg: MatDialogRef<RegistroEntregableComponent> = this.dialog.open(RegistroEntregableComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px',
      data: {
        idTdr: this.idPrimarayKeyTdr,
        cantEntregable: this.entregableResponse.length + 1,
        idEntregable: idCodigo

      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaEntregable();
    });

  }

  editarAlcance(idCodigo: number): void {

    const dialogReg: MatDialogRef<RegistroAlcanceDescripcionComponent> = this.dialog.open(RegistroAlcanceDescripcionComponent, {
      panelClass: 'dialog-no-padding',
      width: '800px', height: '300px',
      data: {
        idTdr: this.idPrimarayKeyTdr,
        idAlcance: idCodigo
      }
    });
    dialogReg.afterClosed().subscribe((enviarDataAlPrincipal: any) => {
      this.listaAlcance();
    });

  }

  public cargarTablaAlcance(): void {

    if (this.alcanceResponse != null) {
      this.dataSourceAlcance = new MatTableDataSource(this.alcanceResponse);
    }

  }

  public cargarTablaEntregable(): void {

    if (this.entregableResponse != null) {
      this.dataSourceEntregable = new MatTableDataSource(this.entregableResponse);
    }
  }

  public cargarTablaCondicionGeneral(): void {
    
    if (this.condicionGeneralResponse != null) {
      this.dataSourceGeneral = new MatTableDataSource(this.condicionGeneralResponse);
    }
  }

  public cargarTablaCondicionParticular(): void {
    
    if (this.condicionParticularResponse != null) {
      this.dataSourceParticular = new MatTableDataSource(this.condicionParticularResponse);
    }
  }



  public editarTdr(idCodigo: number): void{

    this.tdrService.cagarTdr(idCodigo)
    .subscribe(
      (wsResponseTdrEditar: WsResponseTdrEditar) => {
     
        if (wsResponseTdrEditar.codResultado == 1) {
          this.wsResponseTdr = wsResponseTdrEditar.response;
          this.seleccionCodigoFormato = this.wsResponseTdr.detalleTdr[0].idCodigoFormato;
          this.proyectoForm.get('frmDescripcionGeneral').setValue(this.wsResponseTdr.detalleTdr[0].contenidoEntregable);
          this.formatoCodigoTdr = MENSAJES.TDR.TITLE_FORMATO_CODIGO + this.wsResponseTdr.detalleTdr[0].codigoFormato;
          this.wsResponseTdr.detalleTdr[0].personaTipo == 1?this.checkPersonaNatural = true:this.checkPersonaJuridica = true;
          this.ckeditorDenominacion = this.wsResponseTdr.detalleTdr[0].denominacion;
          this.ckeditorFinalidadPublica = this.wsResponseTdr.detalleTdr[0].finalidadPublica;
          this.ckeditorAntecedente  = this.wsResponseTdr.detalleTdr[0].contenidoAntecedente;
          this.ckeditorObjetivo = this.wsResponseTdr.detalleTdr[0].objetivo;
          this.ckeditorLugar = this.wsResponseTdr.detalleTdr[0].lugar;
          this.ckeditorPlazo = this.wsResponseTdr.detalleTdr[0].plazoEjecucion;
          this.ckeditorConformidad = this.wsResponseTdr.detalleTdr[0].conformidadPrestacion;
          this.ckeditorConfidencialidad = this.wsResponseTdr.detalleTdr[0].confidencialidad;
          this.ckeditorPenalidad = this.wsResponseTdr.detalleTdr[0].penalidad;
          this.ckeditorPropiedadIntelectual = this.wsResponseTdr.detalleTdr[0].propiedadIntelectual;
          this.ckeditorAnticorrupcion = this.wsResponseTdr.detalleTdr[0].contenidoAnticorrupcion;
          this.ckeditorResponsabilidad = this.wsResponseTdr.detalleTdr[0].responsabilidadVicioOculto;
          this.ckeditorOtraCondicion = this.wsResponseTdr.detalleTdr[0].otraCondicion;
          this.idPrimarayKeyTdr =  this.wsResponseTdr.detalleTdr[0].idCodigoTdr;   
          this.alcanceResponse = this.wsResponseTdr.alcance;        
          this.cargarTablaAlcance();
          this.condicionGeneralResponse = this.wsResponseTdr.condicionGeneral;
          this.cargarTablaCondicionGeneral();
          this.condicionParticularResponse = this.wsResponseTdr.condicionParticular;
          this.cargarTablaCondicionParticular();
          this.entregableResponse = this.wsResponseTdr.entregable;
          this.cargarTablaEntregable();    
         } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        } 
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(this.mensaje);

      }
    );
  }
}


/*
interface DatosSolicitarTdr {
  idProyecto?: number
}  */