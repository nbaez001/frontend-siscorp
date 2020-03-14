import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MENSAJES } from 'app/common';
import { PageEvent, MatTableDataSource, MatPaginator, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { WsResponseProyecto } from '../../../../dto/response/Proyecto';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomIconService } from 'app/protected/modules/ups/modules/expediente/services/custom-icon.service';
import { CotizacionService } from '../../../../service/cotizacion.service';
import { WsResponseCotizacion, Cotizacion } from '../../../../dto/response/Cotizacion';
import { filter } from 'rxjs/operators';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { ResumenConfirmacionComponent } from './resumen-confirmacion/resumen-confirmacion.component';
import { CreateUpdateInsumoComponent } from '../../cronograma-valorizado/partida-insumo/create-update-insumo/create-update-insumo.component';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { CreateInsumoComponent } from './../../cronograma-valorizado/partida-insumo/create-insumo/create-insumo.component';
import { UpdateInsumoComponent } from './../../cronograma-valorizado/partida-insumo/update-insumo/update-insumo.component';
import { ModalFormaPagoComponent } from './modal-forma-pago/modal-forma-pago.component';
import { CalculoPagoComponent } from '../../trabajador/calculo-pago/calculo-pago.component';
import { TrabajadorService } from '../../../../service/trabajador.service';
import { DataSharedService } from '../../../../service/data-shared.service';

@Component({
  selector: 'app-generar-requerimiento',
  templateUrl: './generar-requerimiento.component.html',
  styleUrls: ['./generar-requerimiento.component.scss']
})
export class GenerarRequerimientoComponent implements OnInit {

  pagina = 1;
  cantidad = 2;
  total = 0;

  dialogRefMessage: MatDialogRef<any>;
  mensaje: string;
  titulo_requerimiento: string;
  arrayCantidadesModificadas: any[];

  cantidadPalabraRecursoCostoDirecto: number = 39;
  cantidadPalabraRecursoGastosGenerales: number = 50;
  cantidadPalabraRecursoNE: number = 55;
  cantidadPalabraRecursoGastoSupervision: number = 55;
  selectedCostoDirectoNode: any;
  idCodigoInsumoSelected: number = 0;

  //dinamico
  dataCostoDirecto: any;
  totalDataCostoDirecto: totalDataAutoGasto = new totalDataAutoGasto();
  cantidadDataCostoDirecto: any;
  frozenColsCostoDirecto: any[];
  scrollableColsCostoDirecto: any[];

  dataGastosGenerales: any;
  totalDataGastosGenerales: totalDataAutoGasto = new totalDataAutoGasto();
  frozenColsGastosGenerales: any[];
  scrollableColsGastosGenerales: any[];

  dataGastosResidente: any;
  totalDataGastosResidente: totalDataAutoGasto = new totalDataAutoGasto();
  frozenColsGastosResidente: any[];
  scrollableColsGastosResidente: any[];

  dataGastosSupervision: any;
  totalDataGastosSupervision: any;
  frozenColsGastosSupervision: any[];
  scrollableColsGastosSupervision: any[];

  dataGastosFinanciero: any;
  totalDataGastosFinanciero: any;
  frozenColsGastosFinanciero: any[];
  scrollableColsGastosFinanciero: any[];

  dataGastosNucleo: any;
  totalDataGastosNucleo: any;
  frozenColsGastosNucleo: any[];
  scrollableColsGastosNucleo: any[];

  cargandoTablaCostoDirecto: boolean;
  cargandoTablaGastosGenerales: boolean;
  cargandoTablaGastosResidente: boolean;

  filtrosRequestCostoDirecto: busquedaRequestCostoDirecto = new busquedaRequestCostoDirecto();
  busquedaRecurso: string;

  registroAutorizacionGasto: registroAutorizacionGasto = new registroAutorizacionGasto();
  idRegistroAutorizacionGasto: number = 0;

  constructor(
    private dataShared: DataSharedService,
    public dialogRef: MatDialogRef<GenerarRequerimientoComponent>,
    private dialog: MatDialog,
    private nodeService: NodeService,
    private cotizacionService: CotizacionService,
    private customIconService: CustomIconService,
    private snackBar: MatSnackBar,
    private trabajadorService: TrabajadorService,
    @Inject(MAT_DIALOG_DATA)
    public datos: any
  ) {
    this.arrayCantidadesModificadas = [];
    if (this.datos.flag == 0) {
      this.titulo_requerimiento = "REGISTRAR AUTORIZACIÓN DE GASTO";
    }
    else if (this.datos.flag == 1) {
      this.titulo_requerimiento = "MOFIFICAR AUTORIZACIÓN DE GASTO";
    }
  }

  ngOnInit() {
    this.customIconService.cargaIcono();
    this.cargarDataCostoDirecto();
    this.cargarDataGastosGenerales();
    this.cargarDataGastosResidente();
    this.cargarDataGastosFinanciero();
    this.cargarDataGastosNucleo();
    this.cargarDataGastosSupervision();
    this.generarTablaFrozenScrollableCostoDirecto();
    this.generarTablaFrozenScrollableGastosGenerales();
    this.generarTablaFrozenScrollableGastosResidente();
    this.generarTablaFrozenScrollableGastosFinanciero();
    this.generarTablaFrozenScrollableGastosNucleo();
    this.generarTablaFrozenScrollableGastosSupervision();
  }

  onMouseEnterTabla(rowData): void {
    rowData.hover = true;
  }
  onMouseLeaveTabla(rowData): void {
    rowData.hover = false;
  }

  //##########################################################################
  //### COSTO DIRECTO #####################################################
  generarTablaFrozenScrollableCostoDirecto() {
    this.frozenColsCostoDirecto = [
      { field: 'recurso', header: 'RECURSO' },
    ];

    this.scrollableColsCostoDirecto = [
      { field: 'unidad', header: 'UNID.' },
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'precio', header: 'PRECIO S/.' },
      { field: 'parcial', header: 'PARCIAL S/.' },
    ];
    for (var i = 1; i <= this.cantidadDataCostoDirecto; i++) {
      this.scrollableColsCostoDirecto.push(
        { field: `cantidadMes_${i}`, header: `Cantidad Mes ${i}` },
      );
    }
    this.scrollableColsCostoDirecto.push(
      { field: 'cantidadAcumulado', header: 'CANTIDAD' },
      { field: 'costoUnitario', header: 'COSTO UNITARIO S/.' },
      { field: 'precioAcumulado', header: 'PARCIAL S/.' },
      { field: 'cantidadSolicitado', header: 'CANTIDAD' },
      { field: 'precioSolicitado', header: 'PARCIAL S/.' },
      { field: 'saldoDisponible', header: 'CANTIDAD' },
      { field: 'precioDisponible', header: 'PARCIAL S/.' },
    );
  }

  reiniciar() {
    if (this.busquedaRecurso != undefined) {
      this.busquedaRecurso = "";
      this.filtrosRequestCostoDirecto = new busquedaRequestCostoDirecto();
      this.cargarDataCostoDirecto();
    }
  }

  buscarRecurso() {
    if (this.busquedaRecurso != undefined) {
      this.filtrosRequestCostoDirecto.nombreRecurso = this.busquedaRecurso;
      this.cargarDataCostoDirecto();
    }
  }

  public cargarDataCostoDirecto(): void {
    this.cargandoTablaCostoDirecto = true;
    this.cotizacionService.listarCargarDataCostoDirecto(this.datos.idProyecto, this.datos.idCodigoAutoGasto, this.filtrosRequestCostoDirecto).subscribe((wsResponseCotizacion: WsResponseCotizacion) => {
      if (wsResponseCotizacion.codResultado == 1) {
        this.dataCostoDirecto = wsResponseCotizacion.response;
        this.cantidadDataCostoDirecto = wsResponseCotizacion.total;
        this.generarTablaFrozenScrollableCostoDirecto();
        this.totalDataCostoDirecto.totalAcumulado = wsResponseCotizacion.totalAcumulado;
        this.totalDataCostoDirecto.totalDisponible = wsResponseCotizacion.totalDisponible;
        this.totalDataCostoDirecto.totalSolicitado = wsResponseCotizacion.totalSolicitado;
        this.cargandoTablaCostoDirecto = false;
      } else {
        this.mensaje = MENSAJES.ERROR_NOFUNCION;
      }
    },
      error => {
        console.error(error);
      }
    );
  }

  onEditInitCostoDirecto(event) {
    if (event.data.manoObra == 1) {
      this.openDialogMensajeConfirm(`¿Requiere calcular el pago de jornal del ${event.data.recurso}?`, true);
      this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
        const dialogReg: MatDialogRef<ModalFormaPagoComponent> = this.dialog.open(ModalFormaPagoComponent, {
          disableClose: true,
          width: '400px',
          autoFocus: false,
          data: {}
        });
      });
    }
  }

  onEditCompleteCostoDirecto(event) {
    if (event.originalEvent.key) {
      if (event.data.cantidadSolicitado.length != 0) {
        if (event.data.manoObra == 0) {
          if (+event.data.cantidadSolicitado > +event.data.saldoDisponible) {
            this.openDialogMensajeConfirm(`El recurso " ${event.data.recurso} " 
          no cuenta con la cantidad solicitada, ¿Requiere modificarlo?`, true);
            this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
              // this.nodeService.obtenerInsumo().then(files => {
              const dialogReg: MatDialogRef<UpdateInsumoComponent> = this.dialog.open(UpdateInsumoComponent, {
                disableClose: true,
                width: '800px',
                autoFocus: false,
                data: {
                  dataInsumoSelected: event.data,
                  flag: 1,
                  idProyecto: this.datos.idProyecto
                }
              });
              dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {

              });
              // });
            });
          } else if (+event.data.precioDisponible == 0) {
            this.openDialogMensajeConfirm(`El recurso " ${event.data.recurso} "
          no cuenta con saldo disponible, ¿Requiere modificarlo?`, true);
            this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
              // this.nodeService.obtenerInsumo().then(files => {
              const dialogReg: MatDialogRef<UpdateInsumoComponent> = this.dialog.open(UpdateInsumoComponent, {
                disableClose: true,
                width: '800px',
                autoFocus: false,
                data: {
                  dataInsumoSelected: event.data,
                  flag: 1,
                  idProyecto: this.datos.idProyecto
                }
              });
              dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {

              });
              // });
            });
          } else {
            event.data.precioSolicitado = (+event.data.cantidadSolicitado) * (+event.data.precio);
            event.data.saldoDisponible = (+event.data.cantidad) - ((+event.data.cantidadAcumulado) + (+event.data.cantidadSolicitado));
            event.data.precioDisponible = (+event.data.parcial) - ((+event.data.precioAcumulado) + (+event.data.precioSolicitado));
            event.data.flgConCambios = 1;

            this.registroAutorizacionGasto.idProyecto = this.datos.idProyecto;
            this.registroAutorizacionGasto.idAutoGasto = (this.datos.flag == 1) ? this.datos.idCodigoAutoGasto : this.idRegistroAutorizacionGasto;
            this.registroAutorizacionGasto.idRecurso = +event.data.idCodigo;
            this.registroAutorizacionGasto.cantidadSolicitada = +event.data.cantidadSolicitado
            console.log(this.registroAutorizacionGasto);
            this.cotizacionService.registroAutorizacionGasto(this.registroAutorizacionGasto).subscribe(response => {
              console.log(response);

              //envia variable al otro componente en caso de ser un nuevo registro (0)
              this.dataShared.enviarIdAutoGenerado(+this.idRegistroAutorizacionGasto);

              this.idRegistroAutorizacionGasto = response.idAutoGasto;
              this.totalDataCostoDirecto.totalAcumulado = response.totalAcumulado;
              this.totalDataCostoDirecto.totalSolicitado = response.totalSolicitado;
              this.totalDataCostoDirecto.totalDisponible = response.totalDisponible;

            });
          }
        }
      }
    }
  }

  crearRecurso() {
    const dialogReg: MatDialogRef<CreateInsumoComponent> = this.dialog.open(CreateInsumoComponent, {
      disableClose: true,
      width: '800px',
      autoFocus: false,
      data: {
        idProyecto: this.datos.idProyecto
      }
    });
    dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {

    });
  }

  modificarRecurso() {
    if (this.selectedCostoDirectoNode != null && this.selectedCostoDirectoNode.cantidad != "") {
      // console.log(this.selectedCostoDirectoNode);
      // this.nodeService.obtenerInsumo().then(files => {
      const dialogReg: MatDialogRef<UpdateInsumoComponent> = this.dialog.open(UpdateInsumoComponent, {
        disableClose: true,
        width: '800px',
        autoFocus: false,
        data: {
          dataInsumoSelected: this.selectedCostoDirectoNode,
          flag: 1,
          idProyecto: this.datos.idProyecto
        }
      });
      dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {

      });
      // });
    }
  }

  //##########################################################################
  //### GASTOS GENERALES #####################################################
  generarTablaFrozenScrollableGastosGenerales() {
    this.frozenColsGastosGenerales = [
      { field: 'recurso', header: 'RECURSO' },
    ];

    this.scrollableColsGastosGenerales = [
      { field: 'unidad', header: 'UNID.' },
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'precio', header: 'PRECIO S/.' },
      { field: 'parcial', header: 'PARCIAL S/.' },
      { field: 'cantidadAcumulado', header: 'CANTIDAD' },
      { field: 'avanceObraMesAcumulado', header: 'AVANCE OBRA MES' },
      { field: 'precioAcumulado', header: 'PARCIAL S/.' },
      { field: 'cantidadSolicitado', header: 'CANTIDAD' },
      { field: 'avanceObraMesSolicitado', header: 'AVANCE OBRA MES' },
      { field: 'precioSolicitado', header: 'PARCIAL S/.' },
      { field: 'saldoDisponible', header: 'CANTIDAD' },
      { field: 'avanceObraMesSaldoDisponible', header: 'AVANCE OBRA MES' },
      { field: 'precioDisponible', header: 'PARCIAL S/.' },
    ];
  }

  public cargarDataGastosGenerales(): void {
    this.cargandoTablaGastosGenerales = true;
    this.cotizacionService.listarCargarDataGastosGenerales(this.datos.idProyecto).subscribe((wsResponseCotizacion: WsResponseCotizacion) => {
      if (wsResponseCotizacion.codResultado == 1) {
        this.dataGastosGenerales = wsResponseCotizacion.response;
        this.generarTablaFrozenScrollableGastosGenerales();
        this.totalDataGastosGenerales.totalAcumulado = wsResponseCotizacion.totalAcumulado;
        this.totalDataGastosGenerales.totalDisponible = wsResponseCotizacion.totalDisponible;
        this.totalDataGastosGenerales.totalSolicitado = wsResponseCotizacion.totalSolicitado;
        this.cargandoTablaGastosGenerales = false;
      } else {
        this.mensaje = MENSAJES.ERROR_NOFUNCION;
      }
    },
      error => {
        console.error(error);
      }
    );
  }

  onEditInitGastosGenerales(event) { console.log("onEditInit", event); }
  onEditCompleteGastosGenerales(event) {
    if (+event.data.tipo == 1) {
      this.openDialogMensajeConfirm(`¿Requiere el cálculo de pago mensual de   "${event.data.recurso}"?`, true);
      this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
        this.trabajadorService.obtenerTrabajadorCalculoPagoMensual(2020).subscribe(data => {
          const dialogReg: MatDialogRef<CalculoPagoComponent> = this.dialog.open(CalculoPagoComponent, {
            width: '800px',
            disableClose: true,
            data: {
              dataPagoMensualTrabajador: data.response
            }
          });
        });
      });
    }
  }

  //##########################################################################
  //### GASTOS RESIDENTES #####################################################
  generarTablaFrozenScrollableGastosResidente() {
    this.frozenColsGastosResidente = [
      { field: 'recurso', header: 'RECURSO' },
    ];
    this.scrollableColsGastosResidente = [
      { field: 'unidad', header: 'UNID.' },
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'precio', header: 'PRECIO S/.' },
      { field: 'parcial', header: 'PARCIAL S/.' },
      { field: 'cantidadAcumulado', header: 'CANTIDAD' },
      { field: 'avanceObraMesAcumulado', header: 'AVANCE OBRA MES' },
      { field: 'precioAcumulado', header: 'PARCIAL S/.' },
      { field: 'cantidadSolicitado', header: 'CANTIDAD' },
      { field: 'avanceObraMesSolicitado', header: 'AVANCE OBRA MES' },
      { field: 'precioSolicitado', header: 'PARCIAL S/.' },
      { field: 'saldoDisponible', header: 'CANTIDAD' },
      { field: 'avanceObraMesSaldoDisponible', header: 'AVANCE OBRA MES' },
      { field: 'precioDisponible', header: 'PARCIAL S/.' },
    ];
  }

  public cargarDataGastosResidente(): void {
    this.cargandoTablaGastosResidente = true;
    this.cotizacionService.listarCargarDataGastosResidente(this.datos.idProyecto).subscribe((wsResponseCotizacion: WsResponseCotizacion) => {
      if (wsResponseCotizacion.codResultado == 1) {
        this.dataGastosResidente = wsResponseCotizacion.response;
        this.generarTablaFrozenScrollableGastosResidente();
        this.totalDataGastosResidente.totalAcumulado = wsResponseCotizacion.totalAcumulado;
        this.totalDataGastosResidente.totalDisponible = wsResponseCotizacion.totalDisponible;
        this.totalDataGastosResidente.totalSolicitado = wsResponseCotizacion.totalSolicitado;
        this.cargandoTablaGastosResidente = false;
      } else {
        this.mensaje = MENSAJES.ERROR_NOFUNCION;
      }
    },
      error => {
        console.error(error);
      }
    );
  }

  onEditInitGastosResidente(event) { console.log("onEditInit", event); }
  onEditCompleteGastosResidente(event) { console.log("onEditComplete", event); }

  //##########################################################################
  //### GASTOS FINANCIEROS #####################################################
  generarTablaFrozenScrollableGastosFinanciero() {
    this.frozenColsGastosFinanciero = [
      { field: 'recurso', header: 'RECURSO' },
    ];
    this.scrollableColsGastosFinanciero = [
      { field: 'unidad', header: 'UNID.' },
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'precio', header: 'PRECIO S/.' },
      { field: 'parcial', header: 'PARCIAL S/.' },
      { field: 'cantidadAcumulado', header: 'CANTIDAD' },
      { field: 'precioAcumulado', header: 'PARCIAL S/.' },
      { field: 'cantidadSolicitado', header: 'CANTIDAD' },
      { field: 'precioSolicitado', header: 'PARCIAL S/.' },
      { field: 'saldoDisponible', header: 'CANTIDAD' },
      { field: 'precioDisponible', header: 'PARCIAL S/.' },
    ];
  }

  public cargarDataGastosFinanciero(): void {
    this.cotizacionService.listarCargarDataGastosFinanciero(this.pagina, this.cantidad, null).subscribe(
      (wsResponseCotizacion: WsResponseCotizacion) => {
        if (wsResponseCotizacion.codResultado == 1) {
          this.dataGastosFinanciero = wsResponseCotizacion.response;
          this.generarTablaFrozenScrollableGastosFinanciero();

          this.cotizacionService.totalCargarDataGastosFinanciero(2020).subscribe(
            (wsResponseCotizacion: WsResponseCotizacion) => {
              if (wsResponseCotizacion.codResultado == 1) {
                this.totalDataGastosFinanciero = wsResponseCotizacion.response;
              }
            },
            error => {
              console.error(error);
            }
          );

        } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  onEditInitGastosFinanciero(event) { console.log("onEditInit", event); }
  onEditCompleteGastosFinanciero(event) { console.log("onEditComplete", event); }

  //##########################################################################
  //### GASTOS NUCLEO #####################################################
  generarTablaFrozenScrollableGastosNucleo() {
    this.frozenColsGastosNucleo = [
      { field: 'recurso', header: 'RECURSO' },
    ];
    this.scrollableColsGastosNucleo = [
      { field: 'unidad', header: 'UNID.' },
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'precio', header: 'PRECIO S/.' },
      { field: 'parcial', header: 'PARCIAL S/.' },
      { field: 'cantidadAcumulado', header: 'CANTIDAD' },
      { field: 'precioAcumulado', header: 'PARCIAL S/.' },
      { field: 'cantidadSolicitado', header: 'CANTIDAD' },
      { field: 'precioSolicitado', header: 'PARCIAL S/.' },
      { field: 'saldoDisponible', header: 'CANTIDAD' },
      { field: 'precioDisponible', header: 'PARCIAL S/.' },
    ];
  }

  public cargarDataGastosNucleo(): void {
    this.cotizacionService.listarCargarDataGastosNucleo(this.pagina, this.cantidad, null).subscribe(
      (wsResponseCotizacion: WsResponseCotizacion) => {
        if (wsResponseCotizacion.codResultado == 1) {
          this.dataGastosNucleo = wsResponseCotizacion.response;
          this.generarTablaFrozenScrollableGastosNucleo();

          this.cotizacionService.totalCargarDataGastosNucleo(2020).subscribe(
            (wsResponseCotizacion: WsResponseCotizacion) => {
              if (wsResponseCotizacion.codResultado == 1) {
                this.totalDataGastosNucleo = wsResponseCotizacion.response;
              }
            },
            error => {
              console.error(error);
            }
          );

        } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  onEditInitGastosNucleo(event) { console.log("onEditInit", event); }
  onEditCompleteGastosNucleo(event) { console.log("onEditComplete", event); }

  //##########################################################################
  //#### GASTOS SUPERVISION ####################################################
  generarTablaFrozenScrollableGastosSupervision() {
    this.frozenColsGastosSupervision = [
      { field: 'recurso', header: 'RECURSO' },
    ];
    this.scrollableColsGastosSupervision = [
      { field: 'unidad', header: 'UNID.' },
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'precio', header: 'PRECIO S/.' },
      { field: 'parcial', header: 'PARCIAL S/.' },
      { field: 'cantidadAcumulado', header: 'CANTIDAD' },
      { field: 'avanceObraMesAcumulado', header: 'AVANCE OBRA MES' },
      { field: 'precioAcumulado', header: 'PARCIAL S/.' },
      { field: 'cantidadSolicitado', header: 'CANTIDAD' },
      { field: 'avanceObraMesSolicitado', header: 'AVANCE OBRA MES' },
      { field: 'precioSolicitado', header: 'PARCIAL S/.' },
      { field: 'saldoDisponible', header: 'CANTIDAD' },
      { field: 'avanceObraMesSaldoDisponible', header: 'AVANCE OBRA MES' },
      { field: 'precioDisponible', header: 'PARCIAL S/.' },
    ];
  }

  public cargarDataGastosSupervision(): void {
    this.cotizacionService.listarCargarDataGastosSupervision(this.pagina, this.cantidad, null).subscribe(
      (wsResponseCotizacion: WsResponseCotizacion) => {
        if (wsResponseCotizacion.codResultado == 1) {
          this.dataGastosSupervision = wsResponseCotizacion.response;
          this.generarTablaFrozenScrollableGastosSupervision();

          this.cotizacionService.totalCargarDataGastosSupervision(2020).subscribe(
            (wsResponseCotizacion: WsResponseCotizacion) => {
              if (wsResponseCotizacion.codResultado == 1) {
                this.totalDataGastosSupervision = wsResponseCotizacion.response;
              }
            },
            error => {
              console.error(error);
            }
          );

        } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  onEditInitGastosSupervision(event) { console.log("onEditInit", event); }
  onEditCompleteGastosSupervision(event) { console.log("onEditComplete", event); }

  //##########################################################################
  //########################################################

  generarRequerimiento() {
    const dialogReg: MatDialogRef<ResumenConfirmacionComponent> = this.dialog.open(ResumenConfirmacionComponent, {
      width: '600px',
      data: {
        arregloCantidadModificada: this.arrayCantidadesModificadas,
        idProyecto: 2020
      }
    });
    dialogReg.afterClosed().subscribe((valor: any) => {
      if (valor != "cerrado") {
        this.dialogRef.close();
      }
    });
  }

  eliminarAutorizacion() {
    this.openDialogMensajeConfirm(MENSAJES.COTIZACION.ELIMINAR_COTIZACION_CONFIRM, true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Autorización de Gasto eliminada");
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

  // generarSolicitudCotizacion() {
  //   this.cotizacionService.generaInsumoCotizacion().subscribe(response => {
  //     let pdf = new Blob([response], { type: 'application/pdf' });
  //     const url = window.URL.createObjectURL(pdf);
  //     window.open(url, "_blank");
  //   });
  // }

  // onMouseEnterCantidad(event, objInsumo) {
  //   let totalSolicitado = objInsumo.solicitadoCantidad * objInsumo.solicitadoPrecio;
  //   this.insumoAux.tabCostoDirecto = "COSTO DIRECTO";
  //   this.insumoAux.cantidadAcumulada += totalSolicitado;
  //   event.target.blur();
  //   this.arrayCantidadesModificadas.push(this.insumoAux);
  //   console.log(this.arrayCantidadesModificadas);
  //   console.log('----------------');
  //   console.log(objInsumo);
  //   console.log('----------------');
  // }


}

export class registroAutorizacionGasto {
  idProyecto?: number;
  idAutoGasto?: number;
  idRecurso?: number;
  cantidadSolicitada?: number;
}

export class busquedaRequestCostoDirecto {
  nombreRecurso?: string;
}

export class totalDataAutoGasto {
  totalAcumulado?: string;
  totalSolicitado?: string;
  totalDisponible?: string;
}