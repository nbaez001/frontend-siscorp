import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatDialog } from '@angular/material';
import { Proyecto } from '../../../entities/proyecto';
import { ProyectoService } from '../../../services/proyecto.service';
import { ParametroRequest } from '../../../dto/request/ParametroRequest';
import { ArchivoResponse, WsResponseArchivo } from '../../../dto/response/ArchivoResponse';
import { MENSAJES } from 'app/common';
import { WsResponseProyecto, ProyectoResponse } from '../../../dto/response/ProyectoResponse';
import { MessageComponent } from '@shared/components/message/message.component';
import { saveAs } from 'file-saver';
import { EquipoResponse, WsResponseEquipo } from '../../../dto/response/EquipoResponse';
import { PersonalService } from '../../../services/personal.service';

@Component({
  selector: 'app-coordinador-detalle',
  templateUrl: './coordinador-detalle.component.html',
  styleUrls: ['./coordinador-detalle.component.scss']
})
export class CoordinadorDetalleComponent implements OnInit {

  proyectoForm: FormGroup;

  archivos: any[] = [];
  
  nombreArchivo : any[] = [];


  parametroRequest: ParametroRequest;

  archivoResponse : ArchivoResponse[];

      // Tabla
  dataSource: MatTableDataSource<ArchivoResponse>;

  dataSourceEquipoElaborador: MatTableDataSource<EquipoResponse>;
  dataSourceEquipoRevisor: MatTableDataSource<EquipoResponse>;

 
  total : number;
  mensaje: string;
  columnas: string[] = [];
  columnasArchivo: string[] = [];


  equipoElaborador: EquipoResponse[];
  equipoRevisor: EquipoResponse[];

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

  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<CoordinadorDetalleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos:DatosGrillaProyecto,
    private proyectoService: ProyectoService,
    private personalService: PersonalService,
    private dialog: MatDialog) { 
    this.crearFiltrosForm();
    
    this.listadoArchivo();
    this.obtenerElaboradores(this.datos.codigo);
    this.obtenerRevisores(this.datos.codigo);
    
    this.datosNullSetearValorDefecto();

    

  }

  ngOnInit() {
    this.columnasArchivo = ['Nro','Archivo','Tipo Documento', 'Descargar']; 
    this.columnas = ['Nro','Profesional','Puesto','Tipo']; 
  }


  datosNullSetearValorDefecto(){
    if(this.datos.proyectos.encargadoAsignado == ""){
      this.datos.proyectos.encargadoAsignado = "SIN ASIGNAR";
     }if(this.datos.proyectos.fecAsignacionEncargado == ""){
      this.datos.proyectos.fecAsignacionEncargado = "SIN ASIGNAR";
     }if(this.datos.proyectos.modalidad == ""){
      this.datos.proyectos.modalidad = "POR SELECCIONAR";
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

  public obtenerElaboradores(idProyectoMovimiento: number) : void{
    
    this.equipoElaborador = [];
    this.personalService.listarElaboradores(idProyectoMovimiento).subscribe(
      (wsResponseEquipo : WsResponseEquipo)=> {
        if(wsResponseEquipo.codResultado  == 1){
          this.equipoElaborador = (wsResponseEquipo.response != null) ?wsResponseEquipo.response : []; 
          this.cargarTablaEquipoElaborador();
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

    
  public obtenerRevisores(idProyectoMovimiento: number) : void{

    this.equipoRevisor = [];
    this.personalService.listarRevisores(idProyectoMovimiento).subscribe(
      (wsResponseEquipo : WsResponseEquipo)=> {
        if(wsResponseEquipo.codResultado == 1){
          this.equipoRevisor = (wsResponseEquipo.response != null) ? wsResponseEquipo.response : []; 
          this.cargarTablaEquipoRevisor();
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

  public cargarTablaEquipoElaborador(): void {
    if (this.equipoElaborador != null && this.equipoElaborador.length > 0) {
      this.dataSourceEquipoElaborador = new MatTableDataSource(this.equipoElaborador);
    }
  }

  public cargarTablaEquipoRevisor(): void {
    if (this.equipoRevisor != null && this.equipoRevisor.length > 0) {
      this.dataSourceEquipoRevisor = new MatTableDataSource(this.equipoRevisor);
    }
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

  descargarArchivo(idCodigoArchivo: number, fileName: string) {

    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
    this.proyectoService.downloadFile(idCodigoArchivo,fileName)
    .subscribe(data => {
      //Guarda en la pc del cliente.
      saveAs(new Blob([data], {type: MimeType[EXT]}), fileName);
    })
  }




}

interface DatosGrillaProyecto {
  codigo?: number;
  proyectos: ProyectoResponse;

}
