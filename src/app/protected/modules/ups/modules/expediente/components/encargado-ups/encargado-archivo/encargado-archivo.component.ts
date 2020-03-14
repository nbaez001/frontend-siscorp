import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource} from '@angular/material';
import { ArchivoRequest } from '../../../dto/request/ArchivoRequest';
import { ProyectoService } from '../../../services/proyecto.service';
import { WsApiOutResponse } from '../../../dto/response/WsApiOutResponse';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ItemComboService } from '../../../services/item-combo.service';
import { MENSAJES } from 'app/common';
import { MessageComponent } from '@shared/components/message/message.component';
import { ArchivoResponse, WsResponseArchivo } from '../../../dto/response/ArchivoResponse';
import { ParametroRequest } from '../../../dto/request/ParametroRequest';
import { ItemBean, WsResponseItem } from '../../../dto/response/ItemBean';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';

@Component({
  selector: 'app-encargado-archivo',
  templateUrl: './encargado-archivo.component.html',
  styleUrls: ['./encargado-archivo.component.scss']
})
export class EncargadoArchivoComponent implements OnInit {

  selectedFiles: boolean;
  btnEliminar: boolean;
  examinarFiles: boolean;
  archivo: string;
  fileUpload: File;
  archivoForm:  FormGroup;
  dataItem: any;
  selectedDefault: string ='2';
  
  fileUploadRes = {status: '', message: '', messageAux: ''};
  error: string;
  //seleccionTipoDoc= '001';
  mensaje: any;
  // Tabla
  dataSource: MatTableDataSource<ArchivoResponse>;
  parametroRequest: ParametroRequest;
  archivoResponse : ArchivoResponse[];
  total: number;

  archivoResponse01 : ArchivoResponse;
  archivoResponse02 : ArchivoResponse;
  columnas: string[];

  tipoDocArchivo:  ItemBean[];

  dialogRefVariable: MatDialogRef<any>;

  constructor(public dialogRef: MatDialogRef<EncargadoArchivoComponent>,
    private proyectoService: ProyectoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    private datos: DatosProyecto,
    private formBuilder: FormBuilder,
    private itemComboTpoDocumentoArchivo : ItemComboService,){   }

  ngOnInit() {
    

    this.columnas = ['nro','archivo','tipoDoc','descripcion','accion']; 
    this.cargarTablaPrefactibilidad();
    this.crearFormulario();
    this.cargarTipoDocArchivo();
    this.listadoArchivo();
    this.fileUploadRes.message = '20';
    this.archivo = ''
  }

  crearFormulario(): void {
    this.archivoForm = this.formBuilder.group({
      descArchivoFrmCtrl: [''],
      tipoDocArchivoFrmCtrl: ['']
    });
  }


  reiniciar() {
    this.archivoForm.reset('');
    this.archivo = '';
    //this.filtrosForm.get(tipo).setValue(null);
    // this.filtrosProyectoRequest = new ProyectoRequest();

  }

  selectFile(event){
    console.log(event);
    this.selectedFiles = true;
    this.fileUpload = event.target.files[0];
    this.archivo = event.target.files[0].name;
  }



  public cargarTipoDocArchivo(): void {
    
    this.itemComboTpoDocumentoArchivo
      .obtenerTipoDocumentoArchivo()
      .subscribe(
        (data: WsResponseItem) => {
          if (data.codResultado == 1) {
            this.tipoDocArchivo = data.response;
          } else {
            console.error(data);
            // TO-DO
            // CUANDO NO TRAE DATA
          }
        },
        error => {
          console.error('Error al cargar tipo de documento del archivo');
        }
      );
  }


public openDialogMensajeConfirm(message: string,message2: string, alerta: boolean, confirmacion: boolean, valor: any): void {
  
  const dialogRef = this.dialog.open(MessageComponent, {width: '400px',disableClose: true,
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



validarSubidaArchivo($event){
  $event.preventDefault();
  if(this.archivoForm.get('tipoDocArchivoFrmCtrl').value == '' || (this.archivoForm.get('tipoDocArchivoFrmCtrl').value == null)){
    this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, null, MENSAJES.ARCHIVO_TIPO_DOC_REQUERIDO, true, false, null);
    return false;
  }else{
    this.upload();
  }


  }

  upload() {
    const archivoRequest: ArchivoRequest = new ArchivoRequest();
    archivoRequest.nomArchivo = this.fileUpload.name;
    archivoRequest.archivo = this.fileUpload;
    archivoRequest.idProyecto = this.datos.idProyecto.toString();
    archivoRequest.descripcion = this.archivoForm.get('descArchivoFrmCtrl').value;
    archivoRequest.tipoDoc = this.archivoForm.get('tipoDocArchivoFrmCtrl').value;


    this.selectedFiles = false;
    this.btnEliminar = true;
    this.examinarFiles = true;

   
   this.proyectoService.subirArchivo(archivoRequest).subscribe(
      (response: WsApiOutResponse) => {
        console.log(response);
        this.fileUploadRes = response;
        
        if(typeof this.fileUploadRes.message  !== 'undefined'){
          this.fileUploadRes.messageAux = (Number(this.fileUploadRes.message) * 2).toString();
        }
      
        console.log( ' this.fileUploadRes => ' + this.fileUploadRes);
        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, null, this.mensaje ,true, false, "OK");
          this.listadoArchivo();
          this.reiniciar();
          this.selectedFiles = false;   
          this.btnEliminar = false;  
          this.examinarFiles = false;
        }/* else {
          this.mensaje = MENSAJES.ARCHIVO_ERROR_CARGA;
          this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE,null,  this.mensaje,true, false, null);
          this.selectedFiles = true;    
          this.btnEliminar = true;  
        }
      
      }, error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE,  this.mensaje, null,true, false, null);
        console.error(error);
        this.selectedFiles = true;    
        this.btnEliminar = true;  
      } */
      });
  }



  public listadoArchivo(): void{
    this.dataSource = null;
    this.archivoResponse = [];
    this.proyectoService.listarArchivo(this.datos.idProyecto)
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
        //this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);

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

  eliminarArchivo(idArchivo: number, nombreArchivo: string) {
    this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar el archivo ${nombreArchivo}?`;

    this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {

      if (confirm) {        
        this.proyectoService.eliminarArchivo(idArchivo).subscribe(

          (wsResponseArchivo : WsResponseArchivo)=> {
            
            if(wsResponseArchivo.codResultado == 1){
              this.archivoResponse = (wsResponseArchivo.response != null) ? wsResponseArchivo.response : [];
              this.listadoArchivo();
            }
          },
          error => {
            this.mensaje = MENSAJES.ERROR_SERVICIO;
            //this.openDialogMensaje(this.mensaje, MENSAJES.PREFACTIBILIDAD.TITLE, true, false, null);
    
          }
        
        ); 
      }
    });
  }


  public cargarTablaPrefactibilidad(): void {
   if (this.archivoResponse != null && this.archivoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.archivoResponse);
    }
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

interface DatosProyecto {
  idProyecto?: number
}

