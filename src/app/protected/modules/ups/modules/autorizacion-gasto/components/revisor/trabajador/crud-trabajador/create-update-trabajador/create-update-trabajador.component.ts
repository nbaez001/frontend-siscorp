import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TrabajadorRequest } from '../../../../../dto/request/TrabajadorRequest';
import { TrabajadorService } from '../../../../../service/trabajador.service';
import { FileRequest } from '../../../../../dto/request/FileRequest';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { Reniec } from '../../../../../dto/response/Reniec';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';
import { ParametroBodyGeneralRequest } from '../../../../../dto/request/ParametroBodyGeneralRequest';
import { WsResponseTrabajador } from '../../../../../dto/response/TrabajadorResponse';
import { WsItemBeanResponse } from '../../../../../dto/response/ItemBean';

@Component({
  selector: 'app-create-update-trabajador',
  templateUrl: './create-update-trabajador.component.html',
  styleUrls: ['./create-update-trabajador.component.scss']
})
export class CreateUpdateTrabajadorComponent implements OnInit {

  fileupload: any;
  //calcular edad//////
  age;
  showAge;
  
  // ************* tabs
  laboral: boolean;
  selectedIndexTab: string;
  // ************* data
  proyectoForm: FormGroup;

  listTipoDocumento: any[];
  listGenero: any[];
  listTipo: any[];
  listDepartamento: any[];
  listProvincia: any[];
  listDistrito: any[];
  // listRubro: any[];
  // listCategoria: any[];
  // listTipoContrato: any[];
  
  parametroGeneralRequest: ParametroBodyGeneralRequest = new ParametroBodyGeneralRequest();

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  selectedFoto: boolean;
  fileUploadFoto: File;
  archivoFoto: string;
  fileUploadResFoto = { status: '', message: '', messageAux: '' };

  selectedContrato: boolean;
  fileUploadContrato: File;
  archivoContrato: string;
  fileUploadResContrato = { status: '', message: '', messageAux: '' };

  mensaje: any;
  trabajador: TrabajadorRequest = new TrabajadorRequest();

  enabledProvincia: boolean = true;
  enabledDistrito: boolean = true;
  existencia: boolean;

  dialogRefMessage: MatDialogRef<any>;
  titulo: string
  Form: number
  // public idForm: number
  constructor(
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<CreateUpdateTrabajadorComponent>,
    private formBuilder: FormBuilder,
    private trabajadorService: TrabajadorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public datos: DataTrabajador
  ) {
    this.formulario();
    // this.ageCalculator()
  }



  ngOnInit() {
    this.Form = this.datos.idForm;
    this.titulo = this.datos.showTitulo;
    this.cargarCombos();
    if (this.datos.dataTrabajador) {
      this.trabajador = this.datos.dataTrabajador[1];
      this.buscarProvincia(this.trabajador.idDepartamento);
      this.buscarDistrito(this.trabajador.idProvincia);
      this.buscarDistrito(this.trabajador.idDistrito);
      this.proyectoForm.get('fechaNacimiento').setValue(this.retornaFecha(this.trabajador.fechaNacimiento));
      this.proyectoForm.get('fechaInicioContrato').setValue(this.retornaFecha(this.trabajador.fechaInicioContrato));
      this.proyectoForm.get('fechaTerminoContrato').setValue(this.retornaFecha(this.trabajador.fechaTerminoContrato));
    } else {
      this.trabajador = new TrabajadorRequest();
    }
  }

  
  cargarCombos() {
    this.parametroGeneralRequest.opcion = "TIPO_DOCUMENTO"; 
    this.trabajadorService.listarCombos(this.parametroGeneralRequest).subscribe(
      (wsItemBeanResponse : WsItemBeanResponse)=> {
        if(wsItemBeanResponse.codResultado == 1){
          this.listTipoDocumento = wsItemBeanResponse.response;
          this.proyectoForm.get('tipoDocumento').setValue(this.listTipoDocumento[0].idCodigo);
        }
      });

      this.parametroGeneralRequest.opcion = "GENERO"; 
      this.trabajadorService.listarCombos(this.parametroGeneralRequest).subscribe(
        (wsItemBeanResponse : WsItemBeanResponse)=> {
          if(wsItemBeanResponse.codResultado == 1){
            this.listGenero = wsItemBeanResponse.response;
            this.proyectoForm.get('genero').setValue(this.listGenero[0].idCodigo);
          }
        });
  
      this.parametroGeneralRequest.opcion = "TIPO_TRABAJADOR"; 
      this.trabajadorService.listarCombos(this.parametroGeneralRequest).subscribe(
        (wsItemBeanResponse : WsItemBeanResponse)=> {
          if(wsItemBeanResponse.codResultado == 1){
            this.listTipo = wsItemBeanResponse.response;
            this.proyectoForm.get('tipo').setValue(this.listTipo[0].idCodigo);
          }
        });

        this.parametroGeneralRequest.opcion = "DEPARTAMENTO"; 
        this.trabajadorService.listarCombos(this.parametroGeneralRequest).subscribe(
          (wsItemBeanResponse : WsItemBeanResponse)=> {
            if(wsItemBeanResponse.codResultado == 1){
              this.listDepartamento = wsItemBeanResponse.response;
              this.proyectoForm.get('idDepartamento').setValue(this.listDepartamento[0].idCodigo);
            }
          });
  }
 
  
   buscarProvincia(idDepartamento: number) {
      this.parametroGeneralRequest.opcion = "PROVINCIA-"+idDepartamento; 
      this.trabajadorService.listarCombos(this.parametroGeneralRequest).subscribe(
      (wsItemBeanResponse : WsItemBeanResponse)=> {
        if(wsItemBeanResponse.codResultado == 1){
          this.listProvincia = wsItemBeanResponse.response;
          this.proyectoForm.get('idProvincia').setValue(this.listProvincia[0].idCodigo);
          this.enabledProvincia = false;
          this.enabledDistrito = true;
          this.listDistrito = null;
        }
      });
  }

  buscarDistrito(idProvincia: number) {    
    
      this.parametroGeneralRequest.opcion = "DISTRITO-"+idProvincia; 
      this.trabajadorService.listarCombos(this.parametroGeneralRequest).subscribe(
      (wsItemBeanResponse : WsItemBeanResponse)=> {
        if(wsItemBeanResponse.codResultado == 1){
          this.listDistrito = wsItemBeanResponse.response;
          this.proyectoForm.get('idDistrito').setValue(this.listDistrito[0].idCodigo);
          this.enabledDistrito = false;
        }
      });
  }




  url: string | ArrayBuffer = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQJR6BqqLi6y004j182y-DQqexGNssQn5AHlZ7DUBXpYQe3H7P&s";
  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      console.log("jlaaa")
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.fileupload = event.target.files[0];
    }
  }

  retornaFecha(fecha: string) {
    return new Date(`${fecha}T23:00`);
  }

  ageCalculator() {

    const convertAge = new Date(this.age);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    // this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    this.trabajador.edad = (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)).toString();
    console.log(convertAge);
    console.log(timeDiff);
    console.log(this.showAge);
   return (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)).toString();

  }

  // ************* TABS
  tab_click($event) {
    if ($event == 0) {
      this.selectedIndexTab = "0";
      this.laboral = true;
    } else if ($event == 1) {
      this.selectedIndexTab = "1";
    }
  }

  tabPersonalGuardar() {
    this.laboral = false;
    this.selectedIndexTab = "1";

  }

 

  formulario() {

    this.proyectoForm = this.formBuilder.group({
      tipoDocumento: [{ value: '' }],//[{ value: this.listTipoDocumento[0], disabled: false }, []],
      numeroDocumento: [{ value: '', disabled: false }, [Validators.required]], 
       //PROVISIONAL
       apellidoPaterno: [{ value: '', disabled: false }, [Validators.required]],
       apellidoMaterno: [{ value: '', disabled: false }, [Validators.required]],
       nombre: [{ value: '', disabled: false }, [Validators.required]],
       fechaNacimiento: [{ value: '', disabled: false }],
       edad: [{ value: '', disabled: true }, [Validators.required]],
       telefono: [{ value: '', disabled: false }],
       correoElectronico: [{ value: '', disabled: false }],
       idDepartamento: [{ value: '', disabled: false }, [Validators.required]],
       idProvincia: [{ value: '', disabled: false }, [Validators.required]],
       idDistrito: [{ value: '', disabled: false }, [Validators.required]],
       direccion: [{ value: '', disabled: false }, [Validators.required]],
       genero: [{ value: 'Seleccionar', disabled: false }, [Validators.required]],
       rubro: [{ value: '', disabled: false }],
       docFoto: [{ value: '', disabled: true }, [Validators.required]],
       docContrato: [{ value: '', disabled: true }, [Validators.required]],
       /* WHR ACTIVAR CUANDO ESTE ACTIVO WS RENIEC
       
      apellidoPaterno: [{ value: '', disabled: true }, [Validators.required]],
      apellidoMaterno: [{ value: '', disabled: true }, [Validators.required]],
      nombre: [{ value: '', disabled: true }, [Validators.required]],
      fechaNacimiento: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }, [Validators.required]],
      telefono: [{ value: '', disabled: false }],
      correoElectronico: [{ value: '', disabled: false }],
      idDepartamento: [{ value: '', disabled: true }, [Validators.required]],
      idProvincia: [{ value: '', disabled: true }, [Validators.required]],
      idDistrito: [{ value: '', disabled: true }, [Validators.required]],
      direccion: [{ value: '', disabled: true }, [Validators.required]],
      genero: [{ value: '', disabled: true }, [Validators.required]],
      rubro: [{ value: '', disabled: false }],
      docFoto: [{ value: '', disabled: true }, [Validators.required]],
      docContrato: [{ value: '', disabled: true }, [Validators.required]],*/
      categoria: [{ value: '', disabled: false }],
      tipo: [{ value: '', disabled: false }],
      monto: [{ value: '', disabled: false }],
      nroContrato: [{ value: '', disabled: false }],
      fechaInicioContrato: [{ value: '', disabled: false }],
      fechaTerminoContrato: [{ value: '', disabled: false }],
      tipoContrato: [{ value: '', disabled: false }]
    });

  }


  seleccionaFoto(event) {
    this.selectedFoto = true;
    this.fileUploadFoto = event.target.files[0];
    this.archivoFoto = event.target.files[0].name;
  }

  seleccionaContrato(event) {
    this.selectedContrato = true;
    this.fileUploadContrato = event.target.files[0];
    this.archivoContrato = event.target.files[0].name;
  }

  subirFoto() {
    const fotoFileRequest: FileRequest = new FileRequest();
    fotoFileRequest.nomArchivo = this.fileUploadFoto.name;
    fotoFileRequest.archivo = this.fileUploadFoto;

    this.trabajadorService.subirArchivo(fotoFileRequest).subscribe(
      (response: WsApiOutResponse) => {
        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, null, this.mensaje, false, false);
        }
      }, error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, this.mensaje, null, true, false);
        console.error(error);
      }
    );
  }

  subirContrato() {
    const contratoFileRequest: FileRequest = new FileRequest();
    contratoFileRequest.nomArchivo = this.fileUploadContrato.name;
    contratoFileRequest.archivo = this.fileUploadContrato;

    this.trabajadorService.subirArchivo(contratoFileRequest).subscribe(
      (response: WsApiOutResponse) => {
        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, null, this.mensaje, false, false);
        }
      }, error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, this.mensaje, null, true, false);
        console.error(error);
      }
    );
  }

  public openDialogMensaje(
    message: string,
    message2: string,
    alerta: boolean,
    confirmacion: boolean,
    valor: any
  ): void {
    const dialogRef = this.dialog.open(InfoMessageComponent, {
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
      if (ok == 0) {

      }
    });
  }

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  guardarTrabajador(): void {
    console.log(this.trabajador);
    if (this.proyectoForm.valid) {
      this.openDialogMensajeConfirm(MENSAJES.INSUMO.GUARDAR_INSUMO, true);
      this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
        this.dialogRef.close(true);
        if (this.trabajador.idCodigo) {
          // ACTUALIZAR
          console.log("xactualizzar traajador");
          this.registrarTrabajador("ACTUALIZAR");
        } else {
          // INSERTA
          console.log("xguardar traajador");
          this.registrarTrabajador("REGISTRAR");
       }
        this.snackBar.open("El insumo ha sido registrado correctamente");
      });
    }
  }

  registrarTrabajador(opcion){   
    debugger;
      this.parametroGeneralRequest.opcion = opcion;//"LISTAR_TRAB_MONC"; 
      this.trabajadorService.registrarTrabajadorAutorizacionGasto(this.parametroGeneralRequest,this.trabajador)
      
      .subscribe(
        (wsResponseTrabajador : WsResponseTrabajador)=> {
          debugger;
          if(wsResponseTrabajador.codResultado == 1){
          
            this.snackBar.open("Trabajador creado correctamete!!");
          }
        },
        error => {
          console.error(error);
        }   
      ); 
  }

  guardarTrabajadorx() {

    if (this.proyectoForm.valid) {
      const dataTrabajador = new TrabajadorRequest();
      dataTrabajador.tipoDocumento = this.proyectoForm.get('tipoDocumento').value;
      dataTrabajador.numeroDocumento = this.proyectoForm.get('numeroDocumento').value;
      dataTrabajador.apellidoPaterno = this.proyectoForm.get('apellidoPaterno').value;
      dataTrabajador.apellidoMaterno = this.proyectoForm.get('apellidoMaterno').value;
      dataTrabajador.nombre = this.proyectoForm.get('nombre').value;
      dataTrabajador.fechaNacimiento = this.proyectoForm.get('fechaNacimiento').value;
      dataTrabajador.edad = this.proyectoForm.get('edad').value;
      dataTrabajador.tipoGenero = this.proyectoForm.get('genero').value;
      dataTrabajador.telefono = this.proyectoForm.get('telefono').value;
      dataTrabajador.correoElectronico = this.proyectoForm.get('correoElectronico').value;
      dataTrabajador.idDepartamento = this.proyectoForm.get('idDepartamento').value;
      dataTrabajador.idProvincia = this.proyectoForm.get('idProvincia').value;
      dataTrabajador.idDistrito = this.proyectoForm.get('idDistrito').value;
      dataTrabajador.direccion = this.proyectoForm.get('direccion').value;
      dataTrabajador.tipoRubro = this.proyectoForm.get('rubro').value;
      dataTrabajador.tipoCategoria = this.proyectoForm.get('categoria').value;
      dataTrabajador.tipoTipo = this.proyectoForm.get('tipo').value;
      dataTrabajador.montoJornal = this.proyectoForm.get('monto').value;
      dataTrabajador.nroContrato = this.proyectoForm.get('nroContrato').value;
      dataTrabajador.fechaInicioContrato = this.proyectoForm.get('fechaInicioContrato').value;
      dataTrabajador.fechaTerminoContrato = this.proyectoForm.get('fechaTerminoContrato').value;
      this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.GUARDAR_TRABAJADOR_CONFIRM, true);
      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open("Trabajador guardado");

        });
    } else {
      const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
        width: '400px',
        disableClose: true,
        data: {
          message: MENSAJES.TRABAJADOR.GUARDAR_TRABAJADOR_FALTAN_DATOS,
          alerta: true,
          confirmacion: false
        }
      });
    }
    if (this.trabajador.idCodigo) {
      // ACTUALIZAR
      console.log("xactualizzar traajador");
    } else {
      // INSERTA
      console.log("xguardar traajador");
   }
 }

  /*
  registrarTrabajador(opcion){
   
    this.parametroGeneralRequest.opcion = opcion;//"LISTAR_TRAB_MONC"; 
    this.trabajadorService.registrarTrabajadorAutorizacionGasto(this.trabajadorRequest)
    .subscribe(
      (wsResponseTrabajador : WsResponseTrabajador)=> {
        if(wsResponseTrabajador.codResultado == 1){
         
          this.snackBar.open("Trabajador creado correctamete!!");
        }
      },
      error => {
        console.error(error);
      }   
    ); 
}
*/

  buscarFoto(evt): void {
    document.getElementById('fileFoto').click();
  }

  cargarFoto(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.proyectoForm.get('docFoto').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.proyectoForm.get('docFoto').setValue(nombreArchivo);
    }
  }

  buscarContrato(evt): void {
    document.getElementById('fileContrato').click();
  }

  cargarContrato(event) {// NO SIRVE POR QUE NO DEBE SUBIRSE EL ARCHIVO INMEDIATAMENTE
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.proyectoForm.get('docContrato').setValue(null);
    } else {
      const nombreArchivo = this.fileupload.name;
      this.proyectoForm.get('docContrato').setValue(nombreArchivo);
    }
  }

  maxNumero: number = 8;

  cambiarValidacion(): void {



    let numero = this.proyectoForm.get('numeroDocumento').value;
    let tipoDocumento = this.proyectoForm.get('tipoDocumento').value;
    console.log(numero)

    if (tipoDocumento == 1) {
      this.proyectoForm.get('numeroDocumento').setValidators(Validators.maxLength(8));
      this.proyectoForm.updateValueAndValidity();
      this.maxNumero = 8

      this.proyectoForm = this.formBuilder.group({
        tipoDocumento: 1,
        numeroDocumento: [{ value: '', disabled: false }, [Validators.required]],
        //PROVISIONAL
        apellidoPaterno: [{ value: '', disabled: false }, [Validators.required]],
        apellidoMaterno: [{ value: '', disabled: false }, [Validators.required]],
        nombre: [{ value: '', disabled: false }, [Validators.required]],
        fechaNacimiento: [{ value: '', disabled: false }],
        edad: [{ value: '', disabled: true }, [Validators.required]],
        telefono: [{ value: '', disabled: false }],
        correoElectronico: [{ value: '', disabled: false }],
        idDepartamento: [{ value: '', disabled: false }, [Validators.required]],
        idProvincia: [{ value: '', disabled: false }, [Validators.required]],
        idDistrito: [{ value: '', disabled: false }, [Validators.required]],
        direccion: [{ value: '', disabled: false }, [Validators.required]],
        genero: [{ value: 'Seleccionar', disabled: false }, [Validators.required]],
        rubro: [{ value: '', disabled: false }],
        docFoto: [{ value: '', disabled: true }, [Validators.required]],
        docContrato: [{ value: '', disabled: true }, [Validators.required]],
        /* WHR ACTIVAR CUANDO ESTE ACTIVO WS RENIEC
        apellidoPaterno: [{ value: '', disabled: true }, [Validators.required]],
        apellidoMaterno: [{ value: '', disabled: true }, [Validators.required]],
        nombre: [{ value: '', disabled: true }, [Validators.required]],
        fechaNacimiento: [{ value: '', disabled: true }],
        edad: [{ value: '', disabled: true }, [Validators.required]],
        telefono: [{ value: '', disabled: false }],
        correoElectronico: [{ value: '', disabled: false }],
        idDepartamento: [{ value: '', disabled: true }, [Validators.required]],
        idProvincia: [{ value: '', disabled: true }, [Validators.required]],
        idDistrito: [{ value: '', disabled: true }, [Validators.required]],
        direccion: [{ value: '', disabled: true }, [Validators.required]],
        genero: [{ value: '', disabled: true }, [Validators.required]],
        rubro: [{ value: '', disabled: false }],
        docFoto: [{ value: '', disabled: true }, [Validators.required]],
        docContrato: [{ value: '', disabled: true }, [Validators.required]],*/
        categoria: [{ value: '', disabled: false }],
        tipo: [{ value: '', disabled: false }],
        monto: [{ value: '', disabled: false }],
        nroContrato: [{ value: '', disabled: false }],
        fechaInicioContrato: [{ value: '', disabled: false }],
        fechaTerminoContrato: [{ value: '', disabled: false }],
        tipoContrato: [{ value: '', disabled: false }],
      });

    } else {
      if (tipoDocumento == 2) {

        this.proyectoForm = this.formBuilder.group({
          tipoDocumento: 2,
          numeroDocumento: [{ value: '', disabled: false }, [Validators.required]],
          apellidoPaterno: [{ value: '', disabled: false }, [Validators.required]],
          apellidoMaterno: [{ value: '', disabled: false }, [Validators.required]],
          nombre: [{ value: '', disabled: false }, [Validators.required]],
          fechaNacimiento: [{ value: '', disabled: false }],
          edad: [{ value: '', disabled: true }, [Validators.required]],
          telefono: [{ value: '', disabled: false }],
          correoElectronico: [{ value: '', disabled: false }],
          idDepartamento: [{ value: '', disabled: false }, [Validators.required]],
          idProvincia: [{ value: '', disabled: false }, [Validators.required]],
          idDistrito: [{ value: '', disabled: false }, [Validators.required]],
          direccion: [{ value: '', disabled: false }, [Validators.required]],
          genero: [{ value: 'Seleccionar', disabled: false }, [Validators.required]],
          rubro: [{ value: '', disabled: false }],
          docFoto: [{ value: '', disabled: true }, [Validators.required]],
          docContrato: [{ value: '', disabled: true }, [Validators.required]],
          categoria: [{ value: '', disabled: false }],
          tipo: [{ value: '', disabled: false }],
          monto: [{ value: '', disabled: false }],
          nroContrato: [{ value: '', disabled: false }],
          fechaInicioContrato: [{ value: '', disabled: false }],
          fechaTerminoContrato: [{ value: '', disabled: false }],
          tipoContrato: [{ value: '', disabled: false }],
        });

        this.proyectoForm.get('numeroDocumento').setValidators(Validators.maxLength(9));
        this.proyectoForm.updateValueAndValidity();

        this.maxNumero = 9
      }
      else {
        this.proyectoForm.get('numeroDocumento').setValidators(Validators.maxLength(11));
        this.proyectoForm.updateValueAndValidity();
        this.maxNumero = 11
        this.proyectoForm = this.formBuilder.group({
          tipoDocumento: 3,
          numeroDocumento: [{ value: '', disabled: false }, [Validators.required]],
          apellidoPaterno: [{ value: '', disabled: false }, [Validators.required]],
          apellidoMaterno: [{ value: '', disabled: false }, [Validators.required]],
          nombre: [{ value: '', disabled: false }, [Validators.required]],
          fechaNacimiento: [{ value: '', disabled: false }],
          edad: [{ value: '', disabled: true }, [Validators.required]],
          telefono: [{ value: '', disabled: false }],
          correoElectronico: [{ value: '', disabled: false }],
          idDepartamento: [{ value: '', disabled: false }, [Validators.required]],
          idProvincia: [{ value: '', disabled: false }, [Validators.required]],
          idDistrito: [{ value: '', disabled: false }, [Validators.required]],
          direccion: [{ value: '', disabled: false }, [Validators.required]],
          genero: [{ value: '', disabled: false }, [Validators.required]],
          rubro: [{ value: '', disabled: false }],
          docFoto: [{ value: '', disabled: true }, [Validators.required]],
          docContrato: [{ value: '', disabled: true }, [Validators.required]],
          categoria: [{ value: '', disabled: false }],
          tipo: [{ value: '', disabled: false }],
          monto: [{ value: '', disabled: false }],
          nroContrato: [{ value: '', disabled: false }],
          fechaInicioContrato: [{ value: '', disabled: false }],
          fechaTerminoContrato: [{ value: '', disabled: false }],
          tipoContrato: [{ value: '', disabled: false }],
        });

      }
    }

  }


  buscarPersona() {
    let numero = this.proyectoForm.get('numeroDocumento').value;
    let tipoDocumento = this.proyectoForm.get('tipoDocumento').value;
    console.log(numero)
    if (tipoDocumento == 1) {
      if (numero) {
         if (numero.length == 8) {
          this.trabajadorService.busquedaDataPersona(numero).subscribe(
            
            (wsResponseProyecto: any) => {
             
              if (wsResponseProyecto.codResultado == 1) {
                this.existencia = wsResponseProyecto.response[0].existencia;

                const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
                  width: '400px',
                  disableClose: true,
                  data: {
                    message: 'El número de documento no existe, se procederá a registrar a la persona',
                    alerta: true,
                    confirmacion: false
                  }
                });

                dialogRefMessage.afterClosed().subscribe(() => {
                  this.spinner.show();
                 
                  this.trabajadorService.obtenerDataWsReniec(numero).subscribe(
                    (wsResponseReniec: Reniec) => {
                     
                      if (wsResponseReniec.mensaje == 'OK') {
                        this.spinner.hide()
                        // this.trabajador.tipoGenero = +wsResponseReniec.reniec.sexo;
                        // this.trabajador.apellidoPaterno = wsResponseReniec.reniec.apellidoPaterno;
                        // this.trabajador.apellidoMaterno = wsResponseReniec.reniec.apellidoMaterno;
                        // this.trabajador.nombre = wsResponseReniec.reniec.nombres;
                        // this.trabajador.direccion = wsResponseReniec.reniec.direccionDomicilio;


                        this.proyectoForm.get('apellidoPaterno').setValue(wsResponseReniec.reniec.apellidoPaterno);
                        this.proyectoForm.get('apellidoMaterno').setValue(wsResponseReniec.reniec.apellidoMaterno);
                        this.proyectoForm.get('nombre').setValue(wsResponseReniec.reniec.nombres);
                        this.proyectoForm.get('direccion').setValue(wsResponseReniec.reniec.direccionDomicilio);
                        this.proyectoForm.get('genero').setValue(+wsResponseReniec.reniec.sexo);
                        this.proyectoForm.get('idDepartamento').setValue(wsResponseReniec.reniec.ubigeoDptoDomicilio);
                        this.proyectoForm.get('idProvincia').setValue(wsResponseReniec.reniec.ubigeoDistDomicilio);
                        this.proyectoForm.get('idDistrito').setValue(wsResponseReniec.reniec.ubigeoProvDomicilio);
                        this.proyectoForm.get('fechaNacimiento').setValue(this.retornaFecha((wsResponseReniec.reniec.fechaNacimiento).substr(0, 4) + "-" + (wsResponseReniec.reniec.fechaNacimiento).substr(4, 2) + "-" + (wsResponseReniec.reniec.fechaNacimiento).substr(6, 2)));
                        this.proyectoForm.get('edad').setValue(this.ageCalculator());
                        // this.proyectoForm.get('fechaNacimiento').disable();
                        // this.proyectoForm.get('edad').disable();
                        // this.proyectoForm.get('apellidoPaterno').disable();
                        // this.proyectoForm.get('apellidoMaterno').disable();
                        // this.proyectoForm.get('apellidoPaterno').disable();
                        // this.proyectoForm.get('nombre').disable();
                        // this.proyectoForm.get('genero').disable();
                        // this.proyectoForm.get('idDepartamento').disable();
                        // this.proyectoForm.get('idProvincia').disable();
                        // this.proyectoForm.get('idDistrito').disable();
                        // this.proyectoForm.get('direccion').disable();
                        console.log(this.trabajador);
                        console.log(wsResponseReniec);
                        console.log(this.proyectoForm);

                        console.log(this.proyectoForm.get('fechaNacimiento').value);
                      } else if (wsResponseReniec.retorno == '01') {
                        this.spinner.hide()
                        // const dialogMessage2: MatDialogRef<AlertMessageComponent> = this.dialog.open(AlertMessageComponent);
                        // dialogMessage2.componentInstance.message = 'NO SE HA ENCONTRADO INFORMACIÓN PARA EL NÚMERO DE RUC';
                        // dialogMessage2.afterClosed().subscribe((confirm: boolean) => {
                        //   if (confirm) {

                        //   }
                        // });
                      }
                    }



                  );
                });

              }
            }
          );

        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 8 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }
      }

    } else {
      if (tipoDocumento == 2) {
        if (numero.length == 9) {


        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 9 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }
      } else {
        if (numero.length == 11) {


        }
        else {
          const dialogRefMessage = this.dialog.open(InfoMessageComponent, {
            width: '400px',
            disableClose: true,
            data: {
              message: 'Ingrese 11 digitos',
              alerta: true,
              confirmacion: false
            }
          });
        }

      }
    }





  };





}





interface DataTrabajador {
  dataTrabajador?: any
  showTitulo?: any
  showAge?: any
  idForm?: any
}


