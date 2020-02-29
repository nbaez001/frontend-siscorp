import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatRadioGroup, MatDialogRef, MatDialog } from '@angular/material';
import { NodeService } from '../../../../expediente/services/node.service';
import { CustomIconService } from '../../../../expediente/services/custom-icon.service';
import { PartidaComponent } from './partida/partida.component';
import { CronogramaComponent } from './visualizar/cronograma/cronograma.component';
import { InsumoComponent } from './visualizar/insumo/insumo.component';
import { ModificacionComponent } from './visualizar/modificacion/modificacion.component';
import { WsResponseProyecto } from '../../../../expediente/dto/response/ProyectoResponse';
import { MENSAJES } from 'app/common';
import { WsResponseCronograma, Cronograma } from '../../../dto/response/Cronograma';
import { ParametroRequest } from '../../../../expediente/dto/request/ParametroRequest';
import { PartidaInsumoComponent } from './partida-insumo/partida-insumo.component';
import { AuthService } from 'app/protected/services/auth.service';
import { ItemBean } from '../../../dto/response/ItemBean';
import { ItemComboService } from '../../../service/item-combo.service';
import { PartidaListadoComponent } from './partida/partida-listado/partida-listado.component';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { ProyectoService } from '../../../../expediente/services/proyecto.service';
import { ProyectoEjecucionService } from '../../../service/proyecto-ejecucion.service';

@Component({
  selector: 'app-cronograma-valorizado',
  templateUrl: './cronograma-valorizado.component.html',
  styleUrls: ['./cronograma-valorizado.component.scss']
})
export class CronogramaValorizadoComponent implements OnInit {

  idMovimientoPrueba: number = 27398;
  obraForm: FormGroup;
  step: number = 0;
  dataCronogramaEjecucion: TreeNode[];
  dataCronogramaInsumo: TreeNodeInsumo[];
  dataCronogramaEjecucionTotal: any;
  dataCronogramaInsumoTotal: any;
  loading: boolean;
  ocultarNota: boolean;
  selectedIndexTab: string;
  ocultarCamposTabInsumo: boolean = false;
  parametroRequest: ParametroRequest;
  dataItemGronogramafecha: ItemBean;

  frozenCols: any[];
  scrollableColsCronogramaEjecucion: any[];
  scrollableColsCronogramaInsumo: any[];
  cantidadPalabra: number = 44;

  cantidadMesesCronogramaEjecucion: number;
  cantidadMesesCronogramaInsumo: number;

  dialogRefVariable: MatDialogRef<any>;

  obraFormulario() {
    this.obraForm = new FormGroup({
      // codObraFrmCtrl: new FormControl({ value: '', disabled: true }),
      // desObraFrmCtrl: new FormControl({ value: '', disabled: true }),
      // nroConvenioFrmCtrl: new FormControl({ value: '', disabled: true }),
      estadoFrmCtrl: new FormControl(null),
      // insumoBuscarFrmCtrl: new FormControl(null)
    });
  }

  // get codObraFrmCtrl() { return this.obraForm.get('codObraFrmCtrl'); }
  // get desObraFrmCtrl() { return this.obraForm.get('desObraFrmCtrl'); }
  // get nroConvenioFrmCtrl() { return this.obraForm.get('nroConvenioFrmCtrl'); }
  get estadoFrmCtrl() { return this.obraForm.get('estadoFrmCtrl'); }
  // get insumoBuscarFrmCtrl() { return this.obraForm.get('insumoBuscarFrmCtrl'); }


  constructor(private proyectoEjecucionService: ProyectoEjecucionService,
    private customIconService: CustomIconService,
    private itemComboService: ItemComboService,
    private dialog: MatDialog,
    private authService: AuthService) {
    this.cargarDataFechaCronograma();
  }

  ngOnInit() {
    this.ocultarNota = true;
    this.obraFormulario();
    this.customIconService.cargaIcono();
    this.cargaTablaCronogramaEjecucion();
    this.cargaTablaCronogramaInsumo();
    this.tituloCronogramaValorizado();
    this.selectedIndexTab = "0";
  }

  tituloCronogramaValorizado() {
    this.authService.cabecera.next({
      titulo: MENSAJES.CRONOGRAMA.TITLE_CRONOGRAMA_EJECUCION + " - " + 'TAMBO QUILLE',
      icono: ''
    });
  }

  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
  }

  rdbHabilitar() {
    this.ocultarNota = (this.ocultarNota == false) ? true : false;
  }

  generarTablaFrozenScrollableEjecucion() {
    this.loading = true;
    this.frozenCols = [
      { field: 'ITEM', header: 'ITEM' },
      { field: 'DESCRIP_UND', header: 'DESCRIPCIÓN' }
    ];
    this.scrollableColsCronogramaEjecucion = [
      { field: 'TXT_UNIDAD', header: 'UNID.' },
      { field: 'DEC_METRADO', header: 'METRADO' },
      { field: 'DEC_PRECIO', header: 'PRECIO (S/.)' },
      { field: 'DEC_PARCIAL', header: 'PARCIAL (S/.)' },
    ];

    for (var i = 1; i <= this.cantidadMesesCronogramaEjecucion; i++) {
      this.scrollableColsCronogramaEjecucion.push(
        { field: `METRADO_${i}`, header: 'METRADO' },
        { field: `MONEDA_${i}`, header: 'S/.' },
        { field: `PORCENTAJE_${i}`, header: '%' },
      );
    }
  }

  generarTablaFrozenScrollableInsumo() {
    this.scrollableColsCronogramaInsumo = [
      { field: 'ITEM', header: 'ITEM' },
      { field: 'INSUMO', header: 'DESCRIPCIÓN' },
      { field: 'UNIDAD', header: 'UNID.' },
      { field: 'DEC_CANTIDAD', header: 'CANTIDAD' },
      { field: 'DEC_PRECIO', header: 'PRECIO' },
      { field: 'DEC_PARCIAL', header: 'PARCIAL' },
    ];

    for (var i = 1; i <= this.cantidadMesesCronogramaInsumo; i++) {
      this.scrollableColsCronogramaInsumo.push(
        { field: `DEC_METRADO_${i}`, header: 'METRADO' },
        { field: `DEC_COSTO_${i}`, header: 'COSTO' },
      );
    }
  }


  editar(event: { field: string, data: any }): void {
    console.log(event.data);
  }
  onEditInit(event) {
    console.log(event.field);
  }

  cargaTablaCronogramaEjecucion() {
    this.loading = true;
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idMovimientoProyecto = this.idMovimientoPrueba;
    this.proyectoEjecucionService.cronogramaJsonFullChildren(this.parametroRequest).then(files => {
      console.log(files.numMeses);
      this.cantidadMesesCronogramaEjecucion = files.numMeses;
      this.dataCronogramaEjecucion = files.data;
      this.proyectoEjecucionService.obtenerTotalCronogramaEjecucion().then(total => {
        this.dataCronogramaEjecucionTotal = total.response;
        this.generarTablaFrozenScrollableEjecucion();
      });
    });

  }

  cargaTablaCronogramaInsumo() {
    this.loading = true;
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idMovimientoProyecto = this.idMovimientoPrueba;
    this.proyectoEjecucionService.insumoJsonFullChildren(this.parametroRequest).then(filesInsumo => {
      console.log(filesInsumo.numMeses);
      this.cantidadMesesCronogramaInsumo = filesInsumo.numMeses;
      this.dataCronogramaInsumo = filesInsumo.data;
      this.proyectoEjecucionService.obtenerTotalCronogramaInsumo().then(total => {
        this.dataCronogramaInsumoTotal = total.response;
        this.generarTablaFrozenScrollableInsumo();
      });

    });
  }

  onMouseEnter(rowData): void {
    rowData.hover = true;
  }
  onMouseLeave(rowData): void {
    rowData.hover = false;
  }

  onMouseEnterInsumo(rowData): void {
    rowData.hover = true;
  }

  onMouseLeaveInsumo(rowData): void {
    rowData.hover = false;
  }


  tab_click($event) {
    this.selectedIndexTab = $event;
    if (this.selectedIndexTab == '0') {
      this.ocultarNota = true;
      this.ocultarCamposTabInsumo = false;
    } else if (this.selectedIndexTab == '1') {
      this.ocultarCamposTabInsumo = true;
    }
  }

  verModificacion() {
    this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    this.dialogRefVariable.componentInstance.message = `¿Seguro que desea enviar al CRP?`;
    this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        alert("enviado");
      }
    });

    // const dialogReg: MatDialogRef<ModificacionComponent> = this.dialog.open(ModificacionComponent, {
    //   disableClose: true,
    //   panelClass: 'dialog-no-padding',
    //   width: '800px',
    //   data: {}
    // });
  }

  filesData: TreeNode[];
  codigoPartida: string;
  nombrePartida: string;
  verInsumo($event) {
    let idMovimientoProyecto = 27398;
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idMovimientoProyecto = idMovimientoProyecto;
    this.proyectoEjecucionService.getInsumoTotales().then(files => {
      const dialogReg: MatDialogRef<PartidaInsumoComponent> = this.dialog.open(PartidaInsumoComponent, {
        disableClose: true,
        panelClass: 'dialog-no-padding',
        width: '60%',
        height: '80%',
        data: {
          filesData: files,
          codigoPartida: '01.01.01',
          nombrePartida: 'MURO DE LADRILLO CABEZA KK 18 HUECOS C:A 1:5; JUNTA 1.5 CM'
        }
      });
    });
    // this.nodeService.cronogramaJsonFullChildren(this.parametroRequest).then(
    //   files => {
    //     const dialogReg: MatDialogRef<PartidaInsumoComponent> = this.dialog.open(PartidaInsumoComponent, {
    //       disableClose: true,
    //       panelClass: 'dialog-no-padding',
    //       width: '80%',
    //       data: {
    //         filesData: files
    //       }
    //     });
    //   }
    // );
  }

  cargarDataFechaCronograma() {
    this.itemComboService.ObtenerFechaCronograma().subscribe(dataItem => {
      this.dataItemGronogramafecha = Object.assign({
        estados: dataItem.response
      });
    });
  }

}

export interface TreeNode {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}

export interface TreeNodeInsumo {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNodeInsumo[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNodeInsumo;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}
