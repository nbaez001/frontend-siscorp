import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { Proyecto } from '../../../entities/proyecto';
import { ProyectoService } from '../../../services/proyecto.service';
import { ParametroRequest } from '../../../dto/request/ParametroRequest';
import { ArchivoResponse, WsResponseArchivo } from '../../../dto/response/ArchivoResponse';
import { MENSAJES } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss']
})
export class VisualizarComponent implements OnInit {


  proyectoForm: FormGroup;

  archivos: any[] = [];
  
  nombreArchivo : any[] = [];


  parametroRequest: ParametroRequest;

  archivoResponse : ArchivoResponse[];

  // Tabla
  dataSource: MatTableDataSource<ArchivoResponse>;
 
  total : number;
  mensaje: string;
  columnas: string[] = [];
  columnasArchivo: string[] = [];

  crearFiltrosForm() {
    this.proyectoForm = this.formBuilder.group({
      codigo: '',
      modalidad:'',
      encargado:'',
      coordinadorAsignado:'',
      fechaAsignacionCoordinador:'',
      fechaAsignacionEncargado:'',
      fechaAsignacionProyecto:'',
      fechaRecepcionProyecto:'',
      estadoProyecto : '',
      encargadoAsignado: '',
      profesionalElaboracion:'',
      profesionalRevision: ''

    });
  }

  subirArchivos(archivos: FileList): void {
    
    
    for (let i = 0; i < archivos.length; i++) {

      const formData: FormData = new FormData();
      formData.append('archivo', archivos.item(i));

    
        this.archivos.push({ruta:  archivos.item(i)});

      
      console.log(this.archivos[0].ruta.name);
    }
  }

  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<VisualizarComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos:DatosGrillaProyecto,
    private proyectoService: ProyectoService,
    private dialog: MatDialog) { 
    this.crearFiltrosForm();
    
    this.listadoArchivo();

    this.datosNullSetearValorDefecto();

     if(this.datos.proyectos.nombreCoordinador == ""){
      this.datos.proyectos.nombreCoordinador = "SIN ASIGNAR";
     }if(this.datos.proyectos.fecAsignacion == ""){
      this.datos.proyectos.fecAsignacion = "SIN ASIGNAR";
     }

  }

  ngOnInit() {
   this.columnasArchivo = ['Nro','Archivo','Tipo Documento', 'Descargar']; 
   //this.columnas = ['Nro','Profesional','Puesto','Tipo']; 
  }

  datosNullSetearValorDefecto(){
    if(this.datos.proyectos.nombreCoordinador == null){
      this.datos.proyectos.nombreCoordinador = 'POR ASIGNAR';
    }if(this.datos.proyectos.fecAsignacion == null){
      this.datos.proyectos.fecAsignacion = 'POR ASIGNAR';
    }
  }




  public cargarTablaPrefactibilidad(): void {
    if (this.archivoResponse != null && this.archivoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.archivoResponse);
    }
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


  descargarArchivo(idCodigoArchivo: number, fileName: string) {

    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
    this.proyectoService.downloadFile(idCodigoArchivo,fileName)
    .subscribe(data => {
      //Guarda en la pc del cliente.
      saveAs(new Blob([data], {type: MimeType[EXT]}), fileName);
    })
  }

    public listadoArchivo(): void{
      this.dataSource = null;
      this.archivoResponse = [];
      

      this.parametroRequest = new ParametroRequest();
      this.parametroRequest.idProyecto = this.datos.codigo;

      this.proyectoService.listarArchivoUpp()
      .subscribe(
        (wsResponseArchivo : WsResponseArchivo)=> {
          
          if(wsResponseArchivo.codResultado == 1){
            this.archivoResponse = (wsResponseArchivo.response != null) ? wsResponseArchivo.response : [];
            this.total = (wsResponseArchivo.total!=0)? wsResponseArchivo.total : 0;
            this.cargarTablaPrefactibilidad();
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);

        }
      
      ); 

    }

}

interface DatosGrillaProyecto {
  codigo?: number;
  proyectos: Proyecto;

}
