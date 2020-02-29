import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ProyectoEjecucionService } from '../../../../service/proyecto-ejecucion.service';
import { CustomIconService } from 'app/protected/modules/ups/modules/expediente/services/custom-icon.service';
import { ItemComboService } from '../../../../service/item-combo.service';
// import { AuthService } from 'app/public/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ParametroRequest } from 'app/protected/modules/ups/modules/expediente/dto/request/ParametroRequest';
import { ItemBean } from '../../../../dto/response/ItemBean';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { PartidaInsumoComponent } from '../partida-insumo/partida-insumo.component';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-modal-cronograma-valorizado',
  templateUrl: './modal-cronograma-valorizado.component.html',
  styleUrls: ['./modal-cronograma-valorizado.component.scss']
})
export class ModalCronogramaValorizadoComponent implements OnInit {

  nombreTambo: string;

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
  dialogRefMessage: MatDialogRef<any>;

  obraFormulario() {
    this.obraForm = new FormGroup({
      estadoFrmCtrl: new FormControl(null),
    });
  }

  get estadoFrmCtrl() { return this.obraForm.get('estadoFrmCtrl'); }

  constructor(
    private proyectoEjecucionService: ProyectoEjecucionService,
    private customIconService: CustomIconService,
    private itemComboService: ItemComboService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalCronogramaValorizadoComponent>,
    @Inject(MAT_DIALOG_DATA)
    private datos: DatosModalCronogramaValorizado,
  ) {
    this.cargarDataFechaCronograma();
  }

  ngOnInit() {
    this.nombreTambo = this.datos.nombreTambo;
    this.ocultarNota = true;
    this.obraFormulario();
    this.customIconService.cargaIcono();
    this.cargaTablaCronogramaEjecucion();
    this.cargaTablaCronogramaInsumo();
    this.selectedIndexTab = "0";
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
      { field: 'INSUMO', header: 'RECURSO' },
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
      this.cantidadMesesCronogramaInsumo = +filesInsumo.numMeses;
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
    // this.dialogRefVariable = this.dialog.open(ConfirmMessageComponent);
    // this.dialogRefVariable.componentInstance.message = `¿Seguro que desea enviar al CRP?`;
    // this.dialogRefVariable.afterClosed().subscribe((confirm: boolean) => {
    //   if (confirm) {
    //     alert("enviado");
    //   }
    // });
    this.openDialogMensajeConfirm(`¿Seguro que desea enviar al SUPERVISOR?`, true);
    this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
      this.dialogRef.close(true);
    });
  }


  public openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
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
        width: '900px',
        data: {
          filesData: files,
          codigoPartida: '01.01.01',
          nombrePartida: 'MURO DE LADRILLO CABEZA KK 18 HUECOS C:A 1:5; JUNTA 1.5 CM'
        }
      });
    });
  }

  cargarDataFechaCronograma() {
    this.itemComboService.ObtenerFechaCronograma().subscribe(dataItem => {
      this.dataItemGronogramafecha = Object.assign({
        estados: dataItem.response
      });
    });
  }


}

interface DatosModalCronogramaValorizado {
  nombreTambo: string;
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
