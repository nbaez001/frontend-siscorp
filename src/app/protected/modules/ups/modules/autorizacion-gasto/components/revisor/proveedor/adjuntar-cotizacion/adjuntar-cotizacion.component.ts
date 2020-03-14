import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
import { CotizacionProveedorRequest } from '../../../../dto/request/CotizacionProveedorRequest';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { FileRequest } from '../../../../dto/request/FileRequest';
import { WsApiOutResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/WsApiOutResponse';
import { MENSAJES } from 'app/common';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import * as _moment from 'moment';
import { WsResponseProyecto } from '../../../../dto/response/Proyecto';
import { CreateUpdateProveedorComponent } from '../crud-proveedor/create-update-proveedor/create-update-proveedor.component';
import { Sunat } from '../../../../dto/response/Sunat';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-adjuntar-cotizacion',
  templateUrl: './adjuntar-cotizacion.component.html',
  styleUrls: ['./adjuntar-cotizacion.component.scss']
})
export class AdjuntarCotizacionComponent implements OnInit {

  proyectoForm: FormGroup;
  cotizacion: CotizacionProveedorRequest = new CotizacionProveedorRequest();
  listFormaPago: any[];

  selectedCotizacion: boolean;
  fileUploadCotizacion: File;
  archivoCotizacion: string;
  fileUploadResCotizacion = { status: '', message: '', messageAux: '' };

  mensaje: any;

  // Tabla
  pagina = 1;
  cantidad = 2;
  total = 0;

  isLoading: boolean;
  columnas: string[] = [];

  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  proyectoResponse: any[];
  dialogRefMessage: MatDialogRef<any>;

  existencia: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AdjuntarCotizacionComponent>,
    private formBuilder: FormBuilder,
    private trabajadorService: TrabajadorService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataAdjuntarCotizacion
  ) {
    this.formulario();
  }

  ngOnInit() {
    this.cargarCombos();
    this.generarCabeceraColumnas();
    this.cargarCotizacion();
    if (this.datos.dataAdjuntarCotizacion) {
      this.cotizacion = this.datos.dataAdjuntarCotizacion[0];
    }
  }

  formulario() {
    this.proyectoForm = this.formBuilder.group({
      // nombreRazonSocial: [''],
      numeroDocumento: [''],
      fechaCotizacion: [''],
      vigenciaCotizacion: [''],
      plazoEntrega: [''],
      formaPago: [''],
      sustento: [''],
      activo: [''],
      condicion: ['']
    });
  }

  cargarCombos() {
    this.trabajadorService.obtenerFormaPago().subscribe(data => {
      this.listFormaPago = data.response
    });
  }

  // **************** BANDEJA ****************
  public cargaTablaCotizacion(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  public cargarCotizacion(): void {

    this.dataSource = null;
    this.proyectoResponse = [];
    this.isLoading = true;

    this.trabajadorService.obtenerListadoCotizacion(this.pagina, this.cantidad, "")
      .subscribe(
        (wsResponseProyecto: WsResponseProyecto) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargaTablaCotizacion();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
          }
          this.isLoading = false;
        },
        error => {
          console.error(error);
        }
      );
  }

  generarCabeceraColumnas(): void {
    this.columnas = [
      'nro',
      'fechaCotizacion',
      'vigenciaCotizacion',
      'plazoEntrega',
      'formaPago',
      'nombreArchivo',
      'acciones'
    ];
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarCotizacion();
  }
  //--------------------------------------
  verCotizacion(idCodigoArchivo: number, nombreArchivo: string) {
    alert("descargando");
    /*
    const EXT = nombreArchivo.substr(nombreArchivo.lastIndexOf('.') + 1);
    this.trabajadorService.downloadFile(idCodigoArchivo, nombreArchivo)
      .subscribe(data => {
        //Guarda en la pc del cliente.
        saveAs(new Blob([data], { type: MimeType[EXT] }), nombreArchivo);
      })
    */
  }

  // ************** ARCHIVO
  seleccionaCotizacion(event) {
    this.selectedCotizacion = true;
    this.fileUploadCotizacion = event.target.files[0];
    this.archivoCotizacion = event.target.files[0].name;
  }

  subirCotizacion() {
    const cotizacionFileRequest: FileRequest = new FileRequest();
    cotizacionFileRequest.nomArchivo = this.fileUploadCotizacion.name;
    cotizacionFileRequest.archivo = this.fileUploadCotizacion;

    this.trabajadorService.subirCotizacion(cotizacionFileRequest).subscribe(
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
    // dialogRef.afterClosed().subscribe((ok: number) => {
    //   if (ok == 0) {

    //   }
    // });
  }

  guardarCotizacion() {
    // this.subirCotizacion();
    this.cotizacion.fechaCotizacion = _moment(this.proyectoForm.get('fechaCotizacion').value).format('DD-MM-YYYY');
    console.log(this.cotizacion);
    // if(this.cotizacion){

    // }
    this.resetFormulario();
    this.cargarCotizacion();
  }

  resetFormulario() {
    this.proyectoForm.get('fechaCotizacion').setValue(null);
    this.proyectoForm.get('vigenciaCotizacion').setValue("");
    this.proyectoForm.get('plazoEntrega').setValue("");
    this.proyectoForm.get('formaPago').setValue("");
    this.proyectoForm.get('sustento').setValue("");
  }

  //****************** */
  wsSunat() {
    let numero = this.proyectoForm.get('numeroDocumento').value;
    if (numero && numero.length == 11) {
      this.cotizacion.estado = "";
      this.cotizacion.condicion = "";
      this.trabajadorService.busquedaDataProveedor(numero).subscribe(
        (wsResponseProyecto: any) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.existencia = wsResponseProyecto.response[0].existencia;

            this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
              width: '400px',
              disableClose: true,
              data: {
                message: 'El número de RUC no existe, se procederá a registrar al proveedor',
                alerta: true,
                confirmacion: false
              }
            });
            
            this.dialogRefMessage.afterClosed().subscribe(() => {
              this.spinner.show();
              this.trabajadorService.obtenerDataWsSunat(numero).subscribe(
                (wsResponseSunat: Sunat) => {
                  if (wsResponseSunat.mensaje == 'OK') {
                    this.spinner.hide()
                  /*   const dialogReg: MatDialogRef<CreateUpdateProveedorComponent> = this.dialog.open(CreateUpdateProveedorComponent, {
                      panelClass: 'dialog-no-padding',
                      width: '40%',
                      height: '85%',
                      disableClose: true,
                      data: {
                        dataProveedor: wsResponseSunat.sunat,
                        bloqueaCampo: false
                      }
                    }); */

                    this.cotizacion.estado = wsResponseSunat.sunat.estado;
                    this.cotizacion.condicion = ((wsResponseSunat.sunat.esHabido == true) ? "HABIDO" : "NO HABIDO");

                  } else if (wsResponseSunat.retorno == '01') {
                    this.spinner.hide()
                    // const dialogMessage2: MatDialogRef<AlertMessageComponent> = this.dialog.open(AlertMessageComponent);
                    // dialogMessage2.componentInstance.message = 'NO SE HA ENCONTRADO INFORMACIÓN PARA EL NÚMERO DE RUC';
                    // dialogMessage2.afterClosed().subscribe((confirm: boolean) => {
                    //   if (confirm) {

                    //   }
                    // });
                  }
                },
                error => {
                  console.error(error);
                  this.spinner.hide()
                }
              );

            });
          }
        },
        error => {
          // alert("Verificar el ws Sunat");
          console.error(error);

        }
      );
    }
  }

}

interface DataAdjuntarCotizacion {
  dataAdjuntarCotizacion?: any
}
