import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatTableDataSource, PageEvent, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WsResponse, WsApiOutResponse, ArchivoRequest, ARCHIVOS_EXCEL } from '../../../dto/archivo-pendiente';
import { ArchivoExpedienteService } from '../../../service/archivo-expediente.service';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { MENSAJES } from 'app/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-adjuntar-archivo-expediente',
  templateUrl: './adjuntar-archivo-expediente.component.html',
  styleUrls: ['./adjuntar-archivo-expediente.component.scss']
})
export class AdjuntarArchivoExpedienteComponent implements OnInit {

  mensaje: string = "ADJUNTAR ARCHIVOS DEL EXPEDIENTE TÉCNICO";

  archivoForm: FormGroup;

  comboTipoModalidad: WsResponse[];
  idcomboTipoModalidad: any;
  comboTipoDocumento: WsResponse[];
  idcomboTipoDocumento: any;
  selectedDefault: string = '2';

  selectedFiles: boolean;
  fileUpload: File;
  dialogRefMessage: MatDialogRef<any>;

  //############# BANDEJA #############
  pagina = 1;
  cantidad = 2;
  total = 0;

  columnas: string[] = [];
  dataSource: MatTableDataSource<any>;
  dataArchivo: any[];
  disableBuscar: boolean;
  isLoading: boolean;

  bloquear: boolean = true;

  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private archivoExpedienteService: ArchivoExpedienteService,
    public dialogRef: MatDialogRef<AdjuntarArchivoExpedienteComponent>,
    @Inject(MAT_DIALOG_DATA)
    private datos: datosModalArchivo,
  ) { }

  ngOnInit() {
    this.crearFormulario();
    this.obtenerTipoModalidad();

    this.generarCabeceraColumnas();
    this.cargarDataTablaArchivos();
  }

  crearFormulario(): void {
    this.archivoForm = this.formBuilder.group({
      idTipoModalidadFrmCtrl: [''],
      idTipoDocumentoFrmCtrl: [''],
      nombreArchivo: [''],
      fechaRdFrmCtrl: [''],
      presupuestoAprobado: [''],
    });
  }

  obtenerTipoModalidad() {
    this.archivoExpedienteService.obtenerTipoModalidad().subscribe(response => {
      this.comboTipoModalidad = response.response;
    });
    this.archivoExpedienteService.obtenerTipoDocumento().subscribe(response => {
      this.comboTipoDocumento = response.response;
    });
  }

  seleccion($event) {
    if ($event.cidCodigo == ARCHIVOS_EXCEL.RD_EXPEDIENTE_TECNICO) {
      this.bloquear = false;
    } else {
      this.archivoForm.get('fechaRdFrmCtrl').setValue("");
      this.archivoForm.get('presupuestoAprobado').setValue("");
      this.bloquear = true;
    }
  }

  //############################################################################################
  //########################################### BANDEJA #########################################
  generarCabeceraColumnas(): void {
    this.columnas = [
      'item',
      'nombreTipoArchivo',
      'nombreArchivo',
      'acciones'
    ];
  }

  public cargarTablaArchivos(): void {
    if (this.dataArchivo != null && this.dataArchivo.length > 0) {
      this.dataSource = new MatTableDataSource(this.dataArchivo);
    }
  }

  public cargarDataTablaArchivos(): void {
    this.dataSource = null;
    this.disableBuscar = true;
    this.dataArchivo = [];
    this.isLoading = true;
    this.archivoExpedienteService.listadoArchivoXlsProyecto(this.datos.idProyecto).subscribe((wsResponse: WsResponse) => {
      if (wsResponse.codResultado == 1) {
        this.dataArchivo = (wsResponse.response != null) ? wsResponse.response : [];
        this.total = (wsResponse.total != 0) ? wsResponse.total : 0;
        this.cargarTablaArchivos();
        this.isLoading = false;
        this.disableBuscar = false;
      } else {
        this.isLoading = false;
        this.disableBuscar = false;
      }
    }
    );
  }

  //############################################################################################
  //########################################### FILE ###########################################
  public buscarArchivo(evt): void {
    document.getElementById('archivo').click();
  }

  public cargarArchivo(event) {
    this.selectedFiles = true;
    this.fileUpload = event.target.files[0];
    this.archivoForm.get('nombreArchivo').setValue(event.target.files[0].name);
  }

  validarSubidaArchivo($event) {
    $event.preventDefault();
    if (this.archivoForm.get('idTipoModalidadFrmCtrl').value == null || (this.archivoForm.get('idTipoDocumentoFrmCtrl').value == null)) {
      this.openDialogMensaje('ARCHIVO REQUERIDO', true);
      return false;
    } else {
      this.upload();
    }
  }

  download(idCodigoArchivo: number, fileName: string) {
    this.spinner.show();
    const EXT = fileName.substr(fileName.lastIndexOf('.') + 1);
    this.archivoExpedienteService.downloadFile(idCodigoArchivo).subscribe(data => {
      //Guarda en la pc del cliente.
      saveAs(new Blob([data], { type: MimeType[EXT] }), fileName);
      this.spinner.hide();
    })
  }

  upload() {
    this.spinner.show();
    this.idcomboTipoModalidad = this.archivoForm.get('idTipoModalidadFrmCtrl').value;
    const archivoRequest: ArchivoRequest = new ArchivoRequest();
    archivoRequest.nomArchivo = this.fileUpload.name;
    archivoRequest.archivo = this.fileUpload;
    archivoRequest.idProyecto = this.datos.idProyecto;
    archivoRequest.fidProyecto = this.datos.idProyecto;
    archivoRequest.idTipoModalidad = this.idcomboTipoModalidad.idCodigo;
    this.idcomboTipoDocumento = this.archivoForm.get('idTipoDocumentoFrmCtrl').value;
    this.selectedFiles = false;

    if (this.idcomboTipoDocumento.cidCodigo == ARCHIVOS_EXCEL.PRESUPUESTO ||
      this.idcomboTipoDocumento.cidCodigo == ARCHIVOS_EXCEL.PARTIDA ||
      this.idcomboTipoDocumento.cidCodigo == ARCHIVOS_EXCEL.GASTOS_GENERALES ||
      this.idcomboTipoDocumento.cidCodigo == ARCHIVOS_EXCEL.GASTOS_SUPERVISION ||
      this.idcomboTipoDocumento.cidCodigo == ARCHIVOS_EXCEL.RD_EXPEDIENTE_TECNICO
    ) {
      this.validarDocumentoExcel(+archivoRequest.fidProyecto, this.idcomboTipoDocumento.idCodigo, archivoRequest, this.idcomboTipoDocumento.cidCodigo);
    }
  }

  validarDocumentoExcel(fidProyecto: number, tipoDoc: number, archivoRequest: ArchivoRequest, cidCodigoTipoDoc: string) {
    document.querySelector('#archivo').nodeValue = "";
    this.archivoExpedienteService.validarDocumentoExcel(fidProyecto, tipoDoc).subscribe((response: WsApiOutResponse) => {
      // console.log(response);
      if (response.codResultado == 1) {
        if (cidCodigoTipoDoc == ARCHIVOS_EXCEL.PRESUPUESTO) {
          this.cargarExcelPresupuesto(archivoRequest);
        } else if (cidCodigoTipoDoc == ARCHIVOS_EXCEL.PARTIDA) {
          this.cargarExcelPartida(archivoRequest);
        } else if (cidCodigoTipoDoc == ARCHIVOS_EXCEL.GASTOS_GENERALES) {
          this.cargarExcelGastoGeneral(archivoRequest);
        } else if (cidCodigoTipoDoc == ARCHIVOS_EXCEL.GASTOS_SUPERVISION) {
          this.cargarExcelGastoSupervicion(archivoRequest);
        } else if (cidCodigoTipoDoc == ARCHIVOS_EXCEL.RD_EXPEDIENTE_TECNICO) {
          this.cargarRdExpedienteTecnico(archivoRequest);
        }
        this.reiniciar();
        this.selectedFiles = false;
      } else if (response.codResultado == 0) {
        this.archivoForm.get('nombreArchivo').setValue("");
        this.selectedFiles = false;
        this.spinner.hide();
        this.openDialogMensaje(response.msgResultado, true);
      }
    }, error => {
      this.openDialogMensaje('ADJUNTAR ARCHIVO', true);
      this.selectedFiles = true;
    });
  }

  cargarRdExpedienteTecnico(archivoRequest: ArchivoRequest) {
    this.archivoExpedienteService.cargarRdExpedienteTecnico(archivoRequest).subscribe((response: WsApiOutResponse) => {
      if (response.codResultado == 1) {
        this.openDialogMensaje(MENSAJES.ARCHIVO_INFO_SUCCESS, true);
        this.cargarDataTablaArchivos();
        this.reiniciar();
        this.spinner.hide();
        this.selectedFiles = false;
      } else if (response.codResultado == 2) {
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      }
    }, error => {
      this.openDialogMensaje(MENSAJES.ERROR_SERVICIO, true);
      this.selectedFiles = true;
      this.spinner.hide();
    });
  }

  cargarExcelPresupuesto(archivoRequest: ArchivoRequest) {
    this.archivoExpedienteService.cargarExcelPresupuesto(archivoRequest).subscribe((response: WsApiOutResponse) => {
      if (response.codResultado == 1) {
        this.openDialogMensaje(MENSAJES.ARCHIVO_INFO_SUCCESS, true);
        this.cargarDataTablaArchivos();
        this.reiniciar();
        this.spinner.hide();
        this.selectedFiles = false;
      } else if (response.codResultado == 0) {
        this.cargarExcelPartidaTxtError("listaErroresPresupuesto");
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      } else if (response.codResultado == 2) {
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      }
    }, error => {
      this.openDialogMensaje(MENSAJES.ERROR_SERVICIO, true);
      this.selectedFiles = true;
      this.spinner.hide();
    });
  }

  cargarExcelPartida(archivoRequest: ArchivoRequest) {
    this.archivoExpedienteService.cargarExcelPartida(archivoRequest).subscribe((response: WsApiOutResponse) => {
      if (response.codResultado == 1) {
        this.openDialogMensaje(MENSAJES.ARCHIVO_INFO_SUCCESS, true);
        this.cargarDataTablaArchivos();
        this.reiniciar();
        this.spinner.hide();
        this.selectedFiles = false;
      } else if (response.codResultado == 0) {
        this.cargarExcelPartidaTxtError("listaErroresPartida");
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      } else if (response.codResultado == 2) {
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      }
    }, error => {
      this.openDialogMensaje(MENSAJES.ERROR_SERVICIO, true);
      this.selectedFiles = true;
      this.spinner.hide();
    });
  }

  cargarExcelGastoGeneral(archivoRequest: ArchivoRequest) {
    this.archivoExpedienteService.cargarExcelGastoGeneral(archivoRequest).subscribe((response: WsApiOutResponse) => {
      if (response.codResultado == 1) {
        this.openDialogMensaje(MENSAJES.ARCHIVO_INFO_SUCCESS, true);
        this.cargarDataTablaArchivos();
        this.reiniciar();
        this.spinner.hide();
        this.selectedFiles = false;
      } else if (response.codResultado == 0) {
        this.cargarExcelPartidaTxtError("listaErroresGG");
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      } else if (response.codResultado == 2) {
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      }
    }, error => {
      this.openDialogMensaje(MENSAJES.ERROR_SERVICIO, true);
      this.selectedFiles = true;
      this.spinner.hide();
    });
  }

  cargarExcelGastoSupervicion(archivoRequest: ArchivoRequest) {
    this.archivoExpedienteService.cargarExcelGastoSupervicion(archivoRequest).subscribe((response: WsApiOutResponse) => {
      if (response.codResultado == 1) {
        this.openDialogMensaje(MENSAJES.ARCHIVO_INFO_SUCCESS, true);
        this.cargarDataTablaArchivos();
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      } else if (response.codResultado == 0) {
        this.cargarExcelPartidaTxtError("listaErroresGS");
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      } else if (response.codResultado == 2) {
        this.openDialogMensaje(response.msgResultado, true);
        this.reiniciar();
        this.selectedFiles = false;
        this.spinner.hide();
      }
    }, error => {
      this.openDialogMensaje(MENSAJES.ERROR_SERVICIO, true);
      this.selectedFiles = true;
      this.spinner.hide();
    });
  }

  cargarExcelPartidaTxtError(errorPartida: string) {
    this.archivoExpedienteService.cargarExcelPartidaTxtError(errorPartida);
  }

  reiniciar() {
    this.archivoForm.reset('');
    // this.archivoForm.get('nombreArchivo').setValue("");
  }

  public openDialogMensaje(message: string, alerta: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, alerta: alerta }
    });
  }

}


interface datosModalArchivo {
  idProyecto?: number;
}
