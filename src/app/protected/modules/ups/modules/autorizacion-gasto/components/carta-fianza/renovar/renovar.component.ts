import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {  WsResponseArchivo } from '../../../../expediente/dto/response/ArchivoResponse';
import { MatTableDataSource, MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ArchivoProyecto, WsResponseArchivoProyecto } from '../../../dto/response/ArchivoProyecto';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { ProyectoEjecucionService } from '../../../service/proyecto-ejecucion.service';
import { WsResponseProyecto, Proyecto } from '../../../dto/response/Proyecto';
import { MENSAJES } from 'app/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-renovar',
  templateUrl: './renovar.component.html',
  styleUrls: ['./renovar.component.scss']
})
export class RenovarComponent implements OnInit {


  proyectoForm: FormGroup;

  archivos: any[] = [];
  
  nombreArchivo : any[] = [];

  detalleProyectoResponse: any;
  archivoResponse : ArchivoProyecto[];

  // Tabla
  dataSource: MatTableDataSource<ArchivoProyecto>;

  total : number;
  mensaje: string;
  columnas: string[] = [];
  columnasArchivo: string[] = [];
  dialogRefMessage: any;


  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<RenovarComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos:DatosGrillaProyecto,
    private dialog: MatDialog,
    private proyectoEjecucionService: ProyectoEjecucionService,
    private snackBar: MatSnackBar) { 
    this.crearEleFormulario();
    this.visualizarDatosProyecto();
    this.listadoArchivo();


  }

  ngOnInit() {
   this.columnasArchivo = ['Nro','Archivo','Descargar']; 
  }


  public listadoArchivo(): void{
    this.dataSource = null;
    this.archivoResponse = [];
    

    this.proyectoEjecucionService.listarArchivoProyecto(0,0,null)
    .subscribe(
      (wsResponseArchivoProyecto : WsResponseArchivoProyecto)=> {
        
        if(wsResponseArchivoProyecto.codResultado == 1){
          this.archivoResponse = (wsResponseArchivoProyecto.response != null) ? wsResponseArchivoProyecto.response : [];
          this.total = (wsResponseArchivoProyecto.total!=0)? wsResponseArchivoProyecto.total : 0;
          this.cargarTablaArchivoProyecto();
        }
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);

      }
    
    ); 

  }

  
  descargarArchivo(idCodigoArchivo: number, fileName: string) {
    
    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
    let data: any;
    /* this.proyectoService.downloadFile(idCodigoArchivo,fileName)
    .subscribe(data => { */
      //Guarda en la pc del cliente.
      saveAs(new Blob([data], {type: MimeType[EXT]}), fileName);
    /*})*/
  }



public visualizarDatosProyecto(): void{
  this.dataSource = null;
  this.archivoResponse = [];
  

  this.proyectoEjecucionService.cartaFianzaDetalle(0,0,null)
  .subscribe(
    (wsResponseProyecto : WsResponseProyecto)=> {
      
      if(wsResponseProyecto.codResultado == 1){
        this.detalleProyectoResponse = (wsResponseProyecto.response[0] != null) ? wsResponseProyecto.response[0] : null;
        this.setearEleFormulario( this.detalleProyectoResponse);
      }
    },
    error => {
      this.mensaje = MENSAJES.ERROR_SERVICIO;
      console.error(this.mensaje);

    }
  
  ); 

}

  public cargarTablaArchivoProyecto(): void {
    if (this.archivoResponse != null && this.archivoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.archivoResponse);
    }
  }

  crearEleFormulario() {
    this.proyectoForm = this.formBuilder.group({
      codigoObra: '',
      descripcion:'',
      nroContrato:'',
      fecInicioEmision: '',
      fecFinEmision:'',
      contratista:'',
      estado:''

    }); 
  }





  setearEleFormulario(objProyecto: any){
    
    this.proyectoForm.get('codigoObra').setValue(objProyecto.codigo);
    this.proyectoForm.get('descripcion').setValue(objProyecto.descripcion);
    this.proyectoForm.get('nroContrato').setValue(objProyecto.nroContrato);
    this.proyectoForm.get('fecInicioEmision').setValue(objProyecto.fecInicioEmision);
    this.proyectoForm.get('fecFinEmision').setValue(objProyecto.fecFinEmision);
    this.proyectoForm.get('contratista').setValue(objProyecto.contratista);
    this.proyectoForm.get('estado').setValue(objProyecto.estado);
  }


  
  subirArchivos(archivos: FileList): void {
    
    for (let i = 0; i < archivos.length; i++) {

      const formData: FormData = new FormData();
      formData.append('archivo', archivos.item(i));
      this.archivos.push({ruta:  archivos.item(i)});
      console.log(this.archivos[0].ruta.name);
    }
  }


/* 
  datosNullSetearValorDefecto(){
    if(this.datos.proyectos.nombreCoordinador == null){
      this.datos.proyectos.nombreCoordinador = 'POR ASIGNAR';
    }if(this.datos.proyectos.fecAsignacion == null){
      this.datos.proyectos.fecAsignacion = 'POR ASIGNAR';
    }
  } */


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
       // title: MENSAJES.PREFACTIBILIDAD.TITLE,
        message: message,
        message2: message2,
        alerta: alerta,
        confirmacion: confirmacion,
        valor: valor
      }
    });
    dialogRef.afterClosed().subscribe((ok: number) => {
      

    
      if (ok == 0) { 
        if(valor == "1"){
         /*  this.reiniciar();
          this.filtrosProyectoRequest = null;
          this.filtrosProyectoRequest = new ProyectoRequest();
          this.cargarPerfilPrefactibilidad(); */
        }else{
         /*  this.reiniciar();
          this.filtrosProyectoRequest = null;
          this.filtrosProyectoRequest = new ProyectoRequest(); */
        }
      }
    });
  }

  renovarCarta(){
    this.openDialogMensajeConfirm(MENSAJES.CARTAFIANZA.RENOVAR_CARTA, true);

    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open(MENSAJES.CARTAFIANZA.INFO_SUCCESS_CARTA_RENOVAR);
        this.dialogRef.close();
      });
  }

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

}

interface DatosGrillaProyecto {
  idMovimientoproyecto?: number;
  //proyectos: Proyecto;

}


