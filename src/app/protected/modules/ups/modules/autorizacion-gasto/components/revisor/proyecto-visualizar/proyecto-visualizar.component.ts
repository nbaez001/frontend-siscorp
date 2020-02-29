import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {  WsResponseArchivo } from '../../../../expediente/dto/response/ArchivoResponse';
import { MatTableDataSource, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ArchivoProyecto, WsResponseArchivoProyecto } from '../../../dto/response/ArchivoProyecto';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { ProyectoEjecucionService } from '../../../service/proyecto-ejecucion.service';
import { WsResponseProyecto, Proyecto } from '../../../dto/response/Proyecto';
import { MENSAJES } from 'app/common';

@Component({
  selector: 'app-proyecto-visualizar',
  templateUrl: './proyecto-visualizar.component.html',
  styleUrls: ['./proyecto-visualizar.component.scss']
})
export class ProyectoVisualizarComponent implements OnInit {


  proyectoForm: FormGroup;

  archivos: any[] = [];
  
  nombreArchivo : any[] = [];

  detalleProyectoResponse: Proyecto;
  archivoResponse : ArchivoProyecto[];

  // Tabla
  dataSource: MatTableDataSource<ArchivoProyecto>;

  total : number;
  mensaje: string;
  columnas: string[] = [];
  columnasArchivo: string[] = [];


  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<ProyectoVisualizarComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos:DatosGrillaProyecto,
    private dialog: MatDialog,
    private proyectoEjecucionService: ProyectoEjecucionService) { 
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

  this.proyectoEjecucionService.detalleProyecto(0,0,null)
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
      nroConvenio:''

    }); 
  }


  setearEleFormulario(objProyecto: Proyecto){
    this.proyectoForm.get('codigoObra').setValue(objProyecto.codigo);
    this.proyectoForm.get('descripcion').setValue(objProyecto.descripcion);
    this.proyectoForm.get('nroConvenio').setValue(objProyecto.nroConvenio);
  }


  
  subirArchivos(archivos: FileList): void {
    for (let i = 0; i < archivos.length; i++) {

      const formData: FormData = new FormData();
      formData.append('archivo', archivos.item(i));
      this.archivos.push({ruta:  archivos.item(i)});
      console.log(this.archivos[0].ruta.name);
    }
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
       // title: MENSAJES.PREFACTIBILIDAD.TITLE,
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

interface DatosGrillaProyecto {
  idMovimientoproyecto?: number;
  //proyectos: Proyecto;

}

