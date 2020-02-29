import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource } from '@angular/material';
import { ArchivoRequest } from '../../../dto/request/ArchivoRequest';
import { ProyectoService } from '../../../services/proyecto.service';
import { WsApiOutResponse } from '../../../dto/response/WsApiOutResponse';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ItemComboService } from '../../../services/item-combo.service';
import { MENSAJES } from 'app/common';
import { ArchivoResponse, WsResponseArchivo } from '../../../dto/response/ArchivoResponse';
import { ParametroRequest } from '../../../dto/request/ParametroRequest';
import { ItemBean, WsResponseItem } from '../../../dto/response/ItemBean';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { WsResponseExcelVisualizarResponse, ExcelVisualizarResponse } from '../../../dto/response/ExcelVisualizarResponse';
import { WsResponseExcelPartidaVisualizarResponse, ExcelPartidaVisualizarResponse } from '../../../dto/response/ExcelPartidaVisualizarResponse';
import { WsResponseExcelGeneralVisualizarResponse, ExcelGeneralVisualizarResponse } from '../../../dto/response/ExcelGeneralVisualizarResponse';
import { ExcelSupervisionVisualizarResponse, WsResponseExcelSupervisionVisualizarResponse } from '../../../dto/response/ExcelSupervisionVisualizarResponse';
import { ViewChild } from '@angular/core';
import { PresupuestoFinalComponent } from '../jefe-elaborador-archivo-presupuesto/presupuesto-final/presupuesto-final.component';
import { AnalisisPrecioUnitarioFinalComponent } from '../jefe-elaborador-archivo-presupuesto/analisis-precio-unitario-final/analisis-precio-unitario-final.component';
import { GastoGeneralFinalComponent } from '../jefe-elaborador-archivo-presupuesto/gasto-general-final/gasto-general-final.component';
import { GastoSupervisionFinalComponent } from '../jefe-elaborador-archivo-presupuesto/gasto-supervision-final/gasto-supervision-final.component';
import { PresupuestoTemporalComponent } from './presupuesto-temporal/presupuesto-temporal.component';
import { AnalisisPrecioUnitarioTemporalComponent } from './analisis-precio-unitario-temporal/analisis-precio-unitario-temporal.component';
import { GastoGeneralTemporalComponent } from './gasto-general-temporal/gasto-general-temporal.component';
import { GastoSupervisionTemporalComponent } from './gasto-supervision-temporal/gasto-supervision-temporal.component';
import { NgxSpinnerService } from "ngx-spinner";
import { CustomIconService } from '../../../services/custom-icon.service';
import { MessageComponent } from '@shared/components/message/message.component';

@Component({
  selector: 'app-jefe-elaborador-archivo',
  templateUrl: './jefe-elaborador-archivo.component.html',
  styleUrls: ['./jefe-elaborador-archivo.component.scss']
})
export class JefeElaboradorArchivoComponent implements OnInit {

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  //isLoading: boolean;

  selectedFiles: boolean;
  btnEliminar: boolean;
  examinarFiles: boolean;
  archivo: string;
  fileUpload: File;
  archivoForm: FormGroup;
  dataItem: any;
  selectedDefault: string = '2';

  fileUploadRes = { status: '', message: '', messageAux: '' };
  error: string;
  //seleccionTipoDoc= '001';
  mensaje: any;
  // Tabla
  dataSource: MatTableDataSource<ArchivoResponse>;
  parametroRequest: ParametroRequest;
  archivoResponse: ArchivoResponse[];
  total: number;

  archivoResponse01: ArchivoResponse;
  archivoResponse02: ArchivoResponse;
  columnas: string[];

  tipoDocArchivo: ItemBean[];
  tipoDocArchivoAux: ItemBean;

  excelVisualizarResponse: ExcelVisualizarResponse[];
  excelPartidaVisualizarResponse: ExcelPartidaVisualizarResponse[];
  excelGeneralVisualizarResponse: ExcelGeneralVisualizarResponse[];
  excelSupervisionResponse: ExcelSupervisionVisualizarResponse[];

  dialogRefVariable: MatDialogRef<any>;
  srcResult: any;

  constructor(public dialogRef: MatDialogRef<JefeElaboradorArchivoComponent>,
    private proyectoService: ProyectoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    private datos: DatosExcelVisualizar,
    private formBuilder: FormBuilder,
    private itemComboTpoDocumentoArchivo: ItemComboService,
    private spinner: NgxSpinnerService,
    private customIconService: CustomIconService) {}

  ngOnInit() {
    this.customIconService.cargaIcono();

    this.columnas = ['nro', 'archivo', 'tipoDoc', 'descripcion', 'estado', 'accion'];
    this.cargarTablaPrefactibilidad();
    this.crearFormulario();
    this.cargarTipoDocArchivo();
    this.listadoArchivo();
    this.fileUploadRes.message = '20';
    this.archivo = ''
    this.examinarFiles = false;
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

  eventAux: any;

  selectFile(event) {

    console.log(event);
    this.selectedFiles = true;
    this.fileUpload = event.target.files[0];
    this.archivo = event.target.files[0].name;
  }

  reset() {

    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }

  onFileSelected() {

    const inputNode: any = document.querySelector('#idFile');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }
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
          }
        },
        error => {
          console.error('Error al cargar tipo de documento del archivo');
        }
      );
  }


  public openDialogMensajeConfirm(message: string, message2: string, alerta: boolean, confirmacion: boolean, valor: any): void {

    const dialogRef = this.dialog.open(MessageComponent, {
      width: '400px', disableClose: true,
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


  validarSubidaArchivo($event) {
    $event.preventDefault();
    if (this.archivoForm.get('tipoDocArchivoFrmCtrl').value == '' || (this.archivoForm.get('tipoDocArchivoFrmCtrl').value == null)) {
      this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, MENSAJES.ARCHIVO_TIPO_DOC_REQUERIDO, true, false, false);
      return false;
    } else {
      this.upload();
    }
  }


  visualizarArchivoExcel(fidProyecto: number, cidTipoArchivo: string, idCodigoArchivo: number, estadoCarga: string) {

    this.spinner.show();

    if (cidTipoArchivo == "007") {
      this.visualizarArchivoExcelPresupuesto(fidProyecto, idCodigoArchivo, estadoCarga);
    } else if (cidTipoArchivo == "008") {
      this.visualizarArchivoExcelPartida(fidProyecto, idCodigoArchivo, estadoCarga);
    } else if (cidTipoArchivo == "009") {
      this.visualizarArchivoExcelGeneral(fidProyecto, idCodigoArchivo, estadoCarga);
    } else if (cidTipoArchivo == "010") {
      this.visualizarArchivoExcelSupervision(fidProyecto, idCodigoArchivo, estadoCarga);
    }

  }

  visualizarArchivoExcelPresupuesto(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    this.proyectoService.visualizarArchivoExcelPresupuesto(fidProyecto)
      .subscribe(
        (wsResponseExcelVisualizarResponse: WsResponseExcelVisualizarResponse) => {

          if (wsResponseExcelVisualizarResponse.codResultado == 1) {

            const dialogReg: MatDialogRef<PresupuestoTemporalComponent> = this.dialog.open(PresupuestoTemporalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              //height: '0%',
              data: {
                fidProyecto,
                archivoExcel: (wsResponseExcelVisualizarResponse.response != null) ? wsResponseExcelVisualizarResponse.response : [],
                idCodigoArchivo,
                estadoCarga
              }
            });

            dialogReg.afterOpen().subscribe(() => { this.spinner.hide() });

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelVisualizarResponse.msgResultado, true, false, wsResponseExcelVisualizarResponse.codResultado);

          }

        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(this.mensaje);

        }
      );
  }

  visualizarArchivoExcelPartida(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    console.log('EMPIEZA');
    this.proyectoService.visualizarArchivoExcelPartida(fidProyecto)
      .subscribe(
        (wsResponseExcelPartidaVisualizarResponse: WsResponseExcelPartidaVisualizarResponse) => {
          console.log('TERMINA');

          if (wsResponseExcelPartidaVisualizarResponse.codResultado == 1) {

            const dialogReg: MatDialogRef<AnalisisPrecioUnitarioTemporalComponent> = this.dialog.open(AnalisisPrecioUnitarioTemporalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              height: '80%',
              data: {
                fidProyecto,
                archivoExcelPartida: (wsResponseExcelPartidaVisualizarResponse.response != null) ? wsResponseExcelPartidaVisualizarResponse.response : [],
                idCodigoArchivo,
                estadoCarga
              }
            });

            dialogReg.afterOpen().subscribe(() => { this.spinner.hide() });

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelPartidaVisualizarResponse.msgResultado, true, false, wsResponseExcelPartidaVisualizarResponse.codResultado);
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(error);

        }
      );
  }

  visualizarArchivoExcelGeneral(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    this.proyectoService.visualizarArchivoExcelGeneral(fidProyecto)
      .subscribe(
        (wsResponseExcelGeneralVisualizarResponse: WsResponseExcelGeneralVisualizarResponse) => {

          if (wsResponseExcelGeneralVisualizarResponse.codResultado == 1) {

            const dialogReg: MatDialogRef<GastoGeneralTemporalComponent> = this.dialog.open(GastoGeneralTemporalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              height: '80%',
              data: {
                fidProyecto,
                archivoExcelGeneral: (wsResponseExcelGeneralVisualizarResponse.response != null) ? wsResponseExcelGeneralVisualizarResponse.response : [],
                idCodigoArchivo,
                estadoCarga
              }
            });

            dialogReg.afterOpen().subscribe(() => { this.spinner.hide() });

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelGeneralVisualizarResponse.msgResultado, true, false, wsResponseExcelGeneralVisualizarResponse.codResultado);
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(error);
        }
      );
  }

  visualizarArchivoExcelSupervision(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    this.proyectoService.visualizarArchivoExcelSupervision(fidProyecto)
      .subscribe(
        (wsResponseExcelSupervisionVisualizarResponse: WsResponseExcelSupervisionVisualizarResponse) => {

          if (wsResponseExcelSupervisionVisualizarResponse.codResultado == 1) {

            const dialogReg: MatDialogRef<GastoSupervisionTemporalComponent> = this.dialog.open(GastoSupervisionTemporalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              height: '80%',
              data: {
                fidProyecto,
                archivoExcelSupervision: (wsResponseExcelSupervisionVisualizarResponse.response != null) ? wsResponseExcelSupervisionVisualizarResponse.response : [],
                idCodigoArchivo,
                estadoCarga
              }
            });

            dialogReg.afterOpen().subscribe(() => { this.spinner.hide() });

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelSupervisionVisualizarResponse.msgResultado, true, false, wsResponseExcelSupervisionVisualizarResponse.codResultado);
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
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
    const dialogRef = this.dialog.open(MessageComponent, {
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




  // carga de archivo original
  subirArchivo() {
    const archivoRequest: ArchivoRequest = new ArchivoRequest();
    archivoRequest.nomArchivo = this.fileUpload.name;
    archivoRequest.archivo = this.fileUpload;
    archivoRequest.idProyecto = this.datos.idProyecto + "";
    archivoRequest.descripcion = this.archivoForm.get('descArchivoFrmCtrl').value;
    archivoRequest.tipoDoc = this.archivoForm.get('tipoDocArchivoFrmCtrl').value.cidCodigo;

    this.selectedFiles = false;
    this.btnEliminar = true;
    this.examinarFiles = true;


    this.proyectoService.subirArchivo(archivoRequest).subscribe(
      (response: WsApiOutResponse) => {
        /*    console.log(response);
           this.fileUploadRes = response;
             
           if(typeof this.fileUploadRes.message  !== 'undefined'){
             this.fileUploadRes.messageAux = (Number(this.fileUploadRes.message) * 2).toString();
           }
         
           console.log( ' this.fileUploadRes => ' + this.fileUploadRes); */
        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, null, this.mensaje, false, false);
          this.listadoArchivo();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        }

      }, error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, this.mensaje, null, true, false);
        console.error(error);
        this.selectedFiles = true;
        this.btnEliminar = true;
      });
  }



  upload() {
    const archivoRequest: ArchivoRequest = new ArchivoRequest();
    archivoRequest.nomArchivo = this.fileUpload.name;
    archivoRequest.archivo = this.fileUpload;
    archivoRequest.idProyecto = this.datos.idProyecto + "";
    archivoRequest.fidProyecto = this.datos.fidProyecto;
    archivoRequest.descripcion = this.archivoForm.get('descArchivoFrmCtrl').value;
    this.tipoDocArchivoAux = this.archivoForm.get('tipoDocArchivoFrmCtrl').value;

    this.selectedFiles = false;
    this.btnEliminar = true;
    this.examinarFiles = true;

    if (this.tipoDocArchivoAux.cidCodigo == '007' || this.tipoDocArchivoAux.cidCodigo == '008' ||
      this.tipoDocArchivoAux.cidCodigo == '009' || this.tipoDocArchivoAux.cidCodigo == '010') {
      this.validarDocumentoExcel(Number(archivoRequest.fidProyecto), this.tipoDocArchivoAux.idCodigo, archivoRequest, this.tipoDocArchivoAux.cidCodigo);
    } else {
      this.subirArchivo();
    }


  }




  validarDocumentoExcel(fidProyecto: number, tipoDoc: number, archivoRequest: ArchivoRequest, cidCodigoTipoDoc: string) {

    document.querySelector('#idFile').nodeValue = "";
    const inputNode: any = document.querySelector('#idFile').nodeValue = "";
    this.proyectoService.validarDocumentoExcel(fidProyecto, tipoDoc).subscribe(
      (response: WsApiOutResponse) => {

        if (response.codResultado == 1) {
          if (cidCodigoTipoDoc == '007') {
            this.cargarExcelPresupuesto(archivoRequest);

          } else if (cidCodigoTipoDoc == '008') {
            this.cargarExcelPartida(archivoRequest);

          } else if (cidCodigoTipoDoc == '009') {
            this.cargarExcelGastoGeneral(archivoRequest);

          } else if (cidCodigoTipoDoc == '010') {
            this.cargarExcelGastoSupervicion(archivoRequest);
          }
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;
        } else if (response.codResultado == 0) {

          this.reset();
          this.archivo = "";
          this.mensaje = response.msgResultado;
          this.openDialogMensaje("", this.mensaje, true, false, "error_validacion");

          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        }

      }, error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, this.mensaje, true, false, null);
        console.error(error);
        this.selectedFiles = true;
        this.btnEliminar = true;

      });


  }

  cargarExcelPresupuesto(archivoRequest: ArchivoRequest) {

    //this.proyectoService.cargarExcelPresupuesto(archivoRequest).pipe(delay(2000)).subscribe(
    this.proyectoService.cargarExcelPresupuesto(archivoRequest).subscribe(
      (response: WsApiOutResponse) => {

        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje("", this.mensaje, true, false, null);
          this.listadoArchivo();
          this.reset();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;


        } else if (response.codResultado == 0) {
          console.log('carga errorea');

          this.cargarExcelPartidaTxtError("listaErroresPresupuesto");
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          //this.listadoArchivo();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        } else if (response.codResultado == 2) {
          console.log('carga errorea');
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        }


      }, error => {

        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, this.mensaje, true, false, null);
        console.error(error);
        this.selectedFiles = true;
        this.btnEliminar = true;

      });

  }

  cargarExcelPartida(archivoRequest: ArchivoRequest) {

    this.proyectoService.cargarExcelPartida(archivoRequest).subscribe(
      (response: WsApiOutResponse) => {
        /*   console.log(response);
          this.fileUploadRes = response;
            
          if(typeof this.fileUploadRes.message  !== 'undefined'){
            this.fileUploadRes.messageAux = (Number(this.fileUploadRes.message) * 2).toString();
          }
        
          console.log( ' this.fileUploadRes => ' + this.fileUploadRes); */
        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje("", this.mensaje, true, false, null);

          this.listadoArchivo();
          this.reset();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        } else if (response.codResultado == 0) {
          console.log('carga errorea');
          this.cargarExcelPartidaTxtError("listaErroresPartida");
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          //this.listadoArchivo();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;


        } else if (response.codResultado == 2) {
          console.log('carga errorea');
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        }


      }, error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(this.mensaje);


      });
  }


  cargarExcelPartidaTxtError(errorPartida: string) {
    this.proyectoService.cargarExcelPartidaTxtError(errorPartida);
  }


  cargarExcelGastoGeneral(archivoRequest: ArchivoRequest) {
    this.proyectoService.cargarExcelGastoGeneral(archivoRequest).subscribe(
      (response: WsApiOutResponse) => {
        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje("", this.mensaje, true, false, null);
          this.listadoArchivo();
          this.reset();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        } else if (response.codResultado == 0) {
          console.log('carga errorea');
          this.cargarExcelPartidaTxtError("listaErroresGG");
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          //this.listadoArchivo();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;
        } else if (response.codResultado == 2) {
          console.log('carga errorea');
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        }


      }, error => {

        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(null, this.mensaje, true, false, null);
        console.error(error);
        this.selectedFiles = true;
        this.btnEliminar = true;

      });

  }

  cargarExcelGastoSupervicion(archivoRequest: ArchivoRequest) {

    this.proyectoService.cargarExcelGastoSupervicion(archivoRequest).subscribe(
      (response: WsApiOutResponse) => {
        if (response.codResultado == 1) {
          console.log('carga exitosa');
          this.mensaje = MENSAJES.ARCHIVO_INFO_SUCCESS;
          this.openDialogMensaje("", this.mensaje, true, false, null);
          this.reset();
          this.listadoArchivo();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        } else if (response.codResultado == 0) {
          console.log('carga errorea');
          this.cargarExcelPartidaTxtError("listaErroresGS");
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          //this.listadoArchivo();
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        } else if (response.codResultado == 2) {
          console.log('carga errorea');
          this.openDialogMensaje(null, response.msgResultado, true, false, null);
          this.reiniciar();
          this.selectedFiles = false;
          this.btnEliminar = false;
          this.examinarFiles = false;

        }


      }, error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, this.mensaje, true, false, null);
        console.error(error);
        this.selectedFiles = true;
        this.btnEliminar = true;

      });

  }

  public listadoArchivo(): void {
    this.dataSource = null;
    this.archivoResponse = [];
    this.proyectoService.listarArchivo(this.datos.idProyecto)
      .subscribe(
        (wsResponseArchivo: WsResponseArchivo) => {

          if (wsResponseArchivo.codResultado == 1) {
            this.archivoResponse = (wsResponseArchivo.response != null) ? wsResponseArchivo.response : [];
            this.total = (wsResponseArchivo.total != 0) ? wsResponseArchivo.total : 0;
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
    this.proyectoService.downloadFile(idCodigoArchivo, fileName)
      .subscribe(data => {
        //Guarda en la pc del cliente.
        saveAs(new Blob([data], { type: MimeType[EXT] }), fileName);
      })
  }

  eliminarArchivo(idArchivo: number, nombreArchivo: string, cidNombreEstado: string) {

    this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    this.dialogRefVariable.componentInstance.message = `¿Seguro que desea eliminar el archivo ${nombreArchivo}?`;

    this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {

      if (confirm) {
        this.proyectoService.eliminarArchivo(idArchivo).subscribe(

          (wsResponseArchivo: WsResponseArchivo) => {

            if (wsResponseArchivo.codResultado == 1) {
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

  cargarTablaPrefactibilidad(): void {
    if (this.archivoResponse != null && this.archivoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.archivoResponse);
    }
  }

  visualizarArchivoExcelFinal(fidProyecto: number, cidTipoArchivo: string, idCodigoArchivo: number, estadoCarga: string) {
    if (cidTipoArchivo == "007") {
      this.visualizarArchivoExcelPresupuestoFinal(fidProyecto, idCodigoArchivo, estadoCarga);
    } else if (cidTipoArchivo == "008") {
      this.visualizarArchivoExcelPartidaFinal(fidProyecto, idCodigoArchivo, estadoCarga);
    } else if (cidTipoArchivo == "009") {
      this.visualizarArchivoExcelGeneralFinal(fidProyecto, idCodigoArchivo, estadoCarga);
    } else if (cidTipoArchivo == "010") {
      this.visualizarArchivoExcelSupervisionFinal(fidProyecto, idCodigoArchivo, estadoCarga);
    }
  }


  visualizarArchivoExcelPresupuestoFinal(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    let idPadre = 0;
    this.proyectoService.visualizarArchivoExcelPresupuestoFinal(fidProyecto, idPadre)
      .subscribe(
        (wsResponseExcelVisualizarResponse: WsResponseExcelVisualizarResponse) => {
          if (wsResponseExcelVisualizarResponse.codResultado == 1) {
            this.excelVisualizarResponse = (wsResponseExcelVisualizarResponse.response != null) ? wsResponseExcelVisualizarResponse.response : [];
            const dialogReg: MatDialogRef<PresupuestoFinalComponent> = this.dialog.open(PresupuestoFinalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              //height: '0%',
              data: {
                fidProyecto,
                archivoExcel: this.excelVisualizarResponse,
                idCodigoArchivo,
                estadoCarga
              }
            });
            dialogReg.afterClosed().subscribe((conformidadRealizada: any) => {
              console.log(conformidadRealizada);
              if (typeof conformidadRealizada !== 'undefined' || conformidadRealizada !== null) {
                this.listadoArchivo();
              }
            });

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelVisualizarResponse.msgResultado, true, false, wsResponseExcelVisualizarResponse.codResultado);
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(error);
        }
      );
  }

  visualizarArchivoExcelPartidaFinal(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    let idPadre = 0;
    this.proyectoService.visualizarArchivoExcelPartidaFinal(fidProyecto, idPadre)
      .subscribe(
        (wsResponseExcelVisualizarResponse: WsResponseExcelVisualizarResponse) => {
          if (wsResponseExcelVisualizarResponse.codResultado == 1) {
            this.excelVisualizarResponse = (wsResponseExcelVisualizarResponse.response != null) ? wsResponseExcelVisualizarResponse.response : [];
            const dialogReg: MatDialogRef<AnalisisPrecioUnitarioFinalComponent> = this.dialog.open(AnalisisPrecioUnitarioFinalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              data: {
                fidProyecto,
                archivoExcelPartida: this.excelVisualizarResponse,
                idCodigoArchivo,
                estadoCarga
              }
            });
            dialogReg.afterClosed().subscribe((conformidadRealizada: any) => {
              console.log(conformidadRealizada);
              if (typeof conformidadRealizada !== 'undefined' || conformidadRealizada !== null) {
                this.listadoArchivo();
              }
            });

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelVisualizarResponse.msgResultado, true, false, wsResponseExcelVisualizarResponse.codResultado);
          }

        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(error);
        }
      );
  }

  visualizarArchivoExcelGeneralFinal(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    let idPadre = 0;
    this.proyectoService.visualizarArchivoExcelGeneralFinal(fidProyecto, idPadre)
      .subscribe(
        (wsResponseExcelGeneralVisualizarResponse: WsResponseExcelGeneralVisualizarResponse) => {
          if (wsResponseExcelGeneralVisualizarResponse.codResultado == 1) {
            this.excelGeneralVisualizarResponse = (wsResponseExcelGeneralVisualizarResponse.response != null) ? wsResponseExcelGeneralVisualizarResponse.response : [];
            const dialogReg: MatDialogRef<GastoGeneralFinalComponent> = this.dialog.open(GastoGeneralFinalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              data: {
                fidProyecto,
                archivoExcelGastoGeneral: this.excelGeneralVisualizarResponse,
                idCodigoArchivo,
                estadoCarga
              }
            });
            dialogReg.afterClosed().subscribe((conformidadRealizada: any) => {
              console.log(conformidadRealizada);
              if (typeof conformidadRealizada !== 'undefined' || conformidadRealizada !== null) {
                this.listadoArchivo();
              }
            });
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelGeneralVisualizarResponse.msgResultado, true, false, wsResponseExcelGeneralVisualizarResponse.codResultado);
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(error);
        }
      );
  }


  visualizarArchivoExcelSupervisionFinal(fidProyecto: number, idCodigoArchivo: number, estadoCarga: string) {
    let idPadre = 0;
    this.proyectoService.visualizarArchivoExcelSupervisionFinal(fidProyecto, idPadre)
      .subscribe(
        (wsResponseExcelSupervisionVisualizarResponse: WsResponseExcelSupervisionVisualizarResponse) => {
          if (wsResponseExcelSupervisionVisualizarResponse.codResultado == 1) {
            this.excelSupervisionResponse = (wsResponseExcelSupervisionVisualizarResponse.response != null) ? wsResponseExcelSupervisionVisualizarResponse.response : [];
            const dialogReg: MatDialogRef<GastoSupervisionFinalComponent> = this.dialog.open(GastoSupervisionFinalComponent, {
              panelClass: 'dialog-no-padding',
              width: '1400px',
              data: {
                fidProyecto,
                archivoExcelGastoSupervision: this.excelSupervisionResponse,
                idCodigoArchivo,
                estadoCarga
              }
            });
            dialogReg.afterClosed().subscribe((conformidadRealizada: any) => {
              console.log(conformidadRealizada);
              if (typeof conformidadRealizada !== 'undefined' || conformidadRealizada !== null) {
                this.listadoArchivo();
              }
            });

          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            this.openDialogMensaje(null, wsResponseExcelSupervisionVisualizarResponse.msgResultado, true, false, wsResponseExcelSupervisionVisualizarResponse.codResultado);
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(error);
        }
      );
  }


}

interface DatosExcelVisualizar {
  idProyecto: number;
  fidProyecto: number;
  archivoExcel: ExcelVisualizarResponse;
  archivoExcelPartida: ExcelVisualizarResponse;
  archivoExcelGeneral: ExcelGeneralVisualizarResponse;
  archivoExcelSupervision: ExcelSupervisionVisualizarResponse;
  idCodigoArchivo: number;
  estadoCarga: string;
}
