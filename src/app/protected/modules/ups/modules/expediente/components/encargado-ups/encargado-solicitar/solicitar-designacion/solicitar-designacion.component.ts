import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatRadioGroup } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { PersonalService } from '../../../../services/personal.service';
import { WsResponsePersonal, PersonalResponse } from '../../../../dto/response/PersonalResponse';
import { MENSAJES } from 'app/common';
import { ProyectoService } from '../../../../services/proyecto.service';
import { ProfesionalRequest } from '../../../../dto/request/ProfesionalRequest';
import { WsApiOutResponse } from '../../../../dto/response/WsApiOutResponse';
import { MessageComponent } from '@shared/components/message/message.component';

@Component({
  selector: 'app-solicitar-designacion',
  templateUrl: './solicitar-designacion.component.html',
  styleUrls: ['./solicitar-designacion.component.scss']
})
export class SolicitarDesignacionComponent implements OnInit {

  filteredOptionsArquitecto: Observable<PersonalResponse[]>;
  filteredOptionsIngCivil: Observable<PersonalResponse[]>;
  filteredOptionslElectrico: Observable<PersonalResponse[]>;
  filteredOptionslSanitario: Observable<PersonalResponse[]>;
  filteredOptionslOtros: Observable<PersonalResponse[]>;

  proyectoForm: FormGroup;

  profesionalArquitecto: PersonalResponse[];
  profesionalCivil: PersonalResponse[];
  profesionalElectrico: PersonalResponse[];
  profesionalSanitario: PersonalResponse[];
  profesionalOtros: PersonalResponse[];
  mensaje: any;

  profesionalRequest :  ProfesionalRequest;

  personalArquitecto: PersonalResponse;
  personalCivil: PersonalResponse;
  personalElectrico: PersonalResponse;
  personalSanitario: PersonalResponse;
  personalOtros: PersonalResponse;
  idProyectoMovimiento: string;

  @ViewChild('radioButonSeleccionado', null) radioButonSeleccionado: MatRadioGroup;



  

  constructor(
    public dialogRef: MatDialogRef<SolicitarDesignacionComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public datos: DatosSolicitarEvaluacion,
    private personalService: PersonalService,
    private proyectoService: ProyectoService
  ) { 

    this.idProyectoMovimiento = this.datos.idProyecto.toString();
    this.obtenerArquitecto(this.idProyectoMovimiento);
    this.obtenerIngenieroCivil(this.idProyectoMovimiento);
    this.obtenerIngenieroElectrico(this.idProyectoMovimiento);
    this.obtenerIngenieroSanitario(this.idProyectoMovimiento);
    this.obtenerOtros(this.idProyectoMovimiento);
  }

  ngOnInit() {
    this.crearFormulario();
    this.autocompletar();
  }

  autocompletar() {
    this.filteredOptionsArquitecto = this.proyectoForm.controls['arquitecto'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_arquitecto(name) : [])
      );

    this.filteredOptionsIngCivil = this.proyectoForm.controls['ingcivil'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_civil(name) : [])
      );

    this.filteredOptionslElectrico = this.proyectoForm.controls['ingelectrico'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_electrico(name) : [])
      );

    this.filteredOptionslSanitario = this.proyectoForm.controls['ingsanitario'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_sanitario(name) : [])
      );
      this.filteredOptionslOtros = this.proyectoForm.controls['otros'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.cidNombre),
        map(name => name ? this._filter_otros(name) : [])
      );
  }

  displayFn(user?: any): string | undefined {
    return user ? user.cidNombre : undefined;
  }

  private _filter_arquitecto(name: string): PersonalResponse[] {
    const filterValue = name.toLowerCase();
    return this.profesionalArquitecto.filter(option => option.cidNombre.toLowerCase().includes(filterValue));
  }

  private _filter_civil(name: string): PersonalResponse[] {
    const filterValue = name.toLowerCase();
    return this.profesionalCivil.filter(option => option.cidNombre.toLowerCase().includes(filterValue));
  }

  private _filter_electrico(name: string): PersonalResponse[] {
    const filterValue = name.toLowerCase();
    return this.profesionalElectrico.filter(option => option.cidNombre.toLowerCase().includes(filterValue));
  }

  private _filter_sanitario(name: string): PersonalResponse[] {
    const filterValue = name.toLowerCase();
    return this.profesionalSanitario.filter(option => option.cidNombre.toLowerCase().includes(filterValue));
  }
  private _filter_otros(name: string): PersonalResponse[] {
    const filterValue = name.toLowerCase();
    return this.profesionalOtros.filter(option => option.cidNombre.toLowerCase().includes(filterValue));
  }

  crearFormulario(): void {
    this.proyectoForm = this.formBuilder.group({
      arquitecto: [''],
      ingcivil: [''],
      ingelectrico: [''],
      ingsanitario: [''],
      otros: ['']
    });



    
  }

  grabar() {
    const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de grabar?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.dialogRef.close()
        //alert("Guardado");
      }
    });
  }


  guardarCampos(){

    this.personalArquitecto =  this.proyectoForm.get('arquitecto').value == "" ?null : this.proyectoForm.get('arquitecto').value;
    this.personalCivil =  this.proyectoForm.get('ingcivil').value == "" ?null : this.proyectoForm.get('ingcivil').value;
    this.personalElectrico =  this.proyectoForm.get('ingelectrico').value == "" ?null : this.proyectoForm.get('ingelectrico').value;
    this.personalSanitario =  this.proyectoForm.get('ingsanitario').value == "" ?null : this.proyectoForm.get('ingsanitario').value;
    this.personalOtros = this.proyectoForm.get('otros').value == "" ?null : this.proyectoForm.get('otros').value;
  }
  


  validarCantidadEquipoTotalSeleccionado($event){
   
    this.guardarCampos();
    
    if(this.personalArquitecto == null &&
      this.personalCivil == null &&
      this.personalElectrico == null &&
      this.personalSanitario == null){
      
      this.mensaje = null;
      this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD_ENCARGADO.WARNING_ARQUITECTO, true, false, null);
      return false;
    }

    else if(this.personalArquitecto!=null &&
      this.personalCivil == null &&
      this.personalElectrico == null &&
      this.personalSanitario == null){
      
      this.mensaje = null;
      this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD_ENCARGADO.WARNING_CIVIL, true, false, null);
      return false;
    }

    else if(this.personalArquitecto!=null &&
      this.personalCivil != null &&
      this.personalElectrico == null &&
      this.personalSanitario == null ){
      
      this.mensaje = null;
      this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD_ENCARGADO.WARNING_ELECTRICO, true, false, null);
      return false;
    }

    else if(this.personalArquitecto !=null &&
      this.personalCivil != null &&
      this.personalElectrico != null &&
      this.personalSanitario == null ){
      
      this.mensaje = null;
      this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD_ENCARGADO.WARNING_SANITARIO, true, false, null);
      return false;
    }
    //this.solicitar();
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


  solicitar($event) {

    let validacion = this.validarCantidadEquipoTotalSeleccionado($event);
    $event.preventDefault();
    if(validacion ==false){
      return 
    }


    const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de seleccionar a estos profesionales para elaborar el proyecto?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      
      if (confirm) {
        
        console.log( this.profesionalRequest );
        this.asignarEquipoRevisorJefeProyecto();

        let asignarProfesionalesDialog: Object = {
          valorDevolver: "PROFESIONAL_REVISOR",
          idProyecto: this.datos.idProyecto
          };

          this.dialogRef.close(asignarProfesionalesDialog);

     
      }
    });
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
     
 
    });
  }

  
  asignarEquipoRevisorJefeProyecto(): void{
    
    this.personalArquitecto =  this.proyectoForm.get('arquitecto').value;
    this.personalCivil =  this.proyectoForm.get('ingcivil').value;
    this.personalElectrico =  this.proyectoForm.get('ingelectrico').value;
    this.personalSanitario =  this.proyectoForm.get('ingsanitario').value;
    this.personalOtros = this.proyectoForm.get('otros').value;

    this.profesionalRequest = new ProfesionalRequest();
    this.profesionalRequest.idProyecto = this.datos.idProyecto;
    this.profesionalRequest.idJefeEncargado = (this.radioButonSeleccionado.value == 1) ?this.personalArquitecto.idCodigo : (this.radioButonSeleccionado.value == 2) ?  this.personalCivil.idCodigo: this.personalOtros.idCodigo;

    this.profesionalRequest.idArquitecto =  this.personalArquitecto.idCodigo;
    this.profesionalRequest.idCivil = this.personalCivil.idCodigo;
    this.profesionalRequest.idElectrico = this.personalElectrico.idCodigo;
    this.profesionalRequest.idSanitario = this.personalSanitario.idCodigo;


    this.proyectoService.asignarEquipoRevisorEncargado(this.profesionalRequest)
    .subscribe(
      (wsResponseProyecto : WsApiOutResponse)=> {
        
        if(wsResponseProyecto.codResultado == 1){
        
          this.mensaje = MENSAJES.PREFACTIBILIDAD_ENCARGADO.INFO_SUCCESS_EQUIPO_ELABORADOR;
          this.openDialogMensaje2(MENSAJES.PREFACTIBILIDAD_ENCARGADO.TITLE_PROFESIONALES, null, this.mensaje ,true, false, "OK"); 
           
        
         }else{
           this.mensaje = MENSAJES.PREFACTIBILIDAD_ENCARGADO.ERROR_REGISTRAR_EQUIPO_ELABORADOR;
          this.openDialogMensaje2(MENSAJES.PREFACTIBILIDAD_ENCARGADO.TITLE_PROFESIONALES,null,  this.mensaje,true, false, null); 
     
         }
      },
      error => {

        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje2(this.mensaje, null, MENSAJES.PREFACTIBILIDAD_ENCARGADO.TITLE_PROFESIONALES, true, false, null);
        console.error(error);

      }
    
    );    
    
  }



  public obtenerArquitecto(idProyectoMovimiento: string) : void{

    this.profesionalArquitecto = [];
    this.personalService.obtenerArquitectos(idProyectoMovimiento).subscribe(
      (wsResponsePersonal : WsResponsePersonal)=> {
        if(wsResponsePersonal.codResultado == 1){
          this.profesionalArquitecto = (wsResponsePersonal.response != null) ? wsResponsePersonal.response : []; 
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }


  public obtenerIngenieroCivil(idProyectoMovimiento: string) : void{

    this.profesionalCivil = [];
    this.personalService.obtenerCiviles(idProyectoMovimiento).subscribe(
      (wsResponsePersonal : WsResponsePersonal)=> {
        if(wsResponsePersonal.codResultado == 1){
          this.profesionalCivil = (wsResponsePersonal.response != null) ? wsResponsePersonal.response : []; 
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

  public obtenerIngenieroElectrico(idProyectoMovimiento: string) : void{

    this.profesionalElectrico = [];
    this.personalService.obtenerElectricos(idProyectoMovimiento).subscribe(
      (wsResponsePersonal : WsResponsePersonal)=> {
        if(wsResponsePersonal.codResultado == 1){
          this.profesionalElectrico = (wsResponsePersonal.response != null) ? wsResponsePersonal.response : []; 
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

  public obtenerIngenieroSanitario(idProyectoMovimiento: string) : void{

    this.profesionalSanitario= [];
    this.personalService.obtenerSanitarios(idProyectoMovimiento).subscribe(
      (wsResponsePersonal : WsResponsePersonal)=> {
        if(wsResponsePersonal.codResultado == 1){
          this.profesionalSanitario = (wsResponsePersonal.response != null) ? wsResponsePersonal.response : []; 
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }

  public obtenerOtros(idProyectoMovimiento: string) : void{

    this.profesionalOtros= [];
    this.personalService.obtenerOtros(idProyectoMovimiento).subscribe(
      (wsResponsePersonal : WsResponsePersonal)=> {
        if(wsResponsePersonal.codResultado == 1){
          this.profesionalOtros = (wsResponsePersonal.response != null) ? wsResponsePersonal.response : []; 
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.log(this.mensaje);
        }
      },
      error => {
        console.error(error);
      }
    ); 
  }
 
}

interface DatosSolicitarEvaluacion {
  idProyecto?: number
}