import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { ProyectoEjecucionService } from '../../../../../service/proyecto-ejecucion.service';
import { WsResponseProyecto, Proyecto } from '../../../../../dto/response/Proyecto';
import { MENSAJES } from 'app/common';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { ItemComboService } from '../../../../../service/item-combo.service';
import { TrabajadorService } from '../../../../../service/trabajador.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})



export class RegistrarComponent implements OnInit {


  autorizacionForm: FormGroup;
  step: number = 0;

  files: TreeNode[];
  filesGastoGeneral: TreeNode[];
  filesGastoSupervision: TreeNode[];

  totalRecords: number;
  loading: boolean;

  Frozencolumna: any[];
  Scrollcolumna: any[];
  selectedNodes: TreeNode[];


  FrozencolumnaGeneral: any[];
  ScrollcolumnaGeneral: any[];

  FrozencolumnaInsumo: any[];
  ScrollcolumnaInsumo: any[];

  FrozencolumnaSupervision: any[];
  ScrollcolumnaSupervision: any[];

  detalleProyectoResponse: Proyecto;
  mensaje: string;

  dataItemMeses: any;
  selectedOption: string;
  selectedDefault: string = '2';
  
  selectedIndexTab:any;
  dataItemPagoMensual: any;


  constructor(public dialogRef: MatDialogRef<RegistrarComponent>,
    private nodeService: NodeService,
    private proyectoEjecucionService: ProyectoEjecucionService,
    private itemComboService: ItemComboService,
    private trabajadorService: TrabajadorService) { }

  ngOnInit() {
    this.cargarMeses();
    this.cargarPagoMensual();
    this.crearAutorizacionForm();
    this.generarTableCronograma();
    this.generarTablaGastoGeneral();
    this.generarTablaGastoSupervision();
    this.visualizarDatosProyecto();
    
    //this.selectedOption = "1";
    //this.generarTableGastoGeneral();
  }


  crearAutorizacionForm() {
    this.autorizacionForm = new FormGroup({
      codigoObraFrmCtrl: new FormControl(null), 
      descripcionFrmCtrl: new FormControl(null),
      fechaAutorizacionFrmCtrl: new FormControl(null),
      nroConvenioFrmCtrl: new FormControl(null),
      montoConvenioFrmCtrl: new FormControl(null),
      montoAcumuladoFrmCtrl: new FormControl(null),
      saldoDisponibleFrmCtrl: new FormControl(null),
      mesFrmCtrl:  new FormControl(null)
    });
  }

  get codigoObraFrmCtrl() { return this.autorizacionForm.get('codigoObraFrmCtrl'); }
  get descripcionFrmCtrl(){ return this.autorizacionForm.get('descripcionFrmCtrl');}
  get fechaAutorizacionFrmCtrl() { return this.autorizacionForm.get('fechaAutorizacionFrmCtrl'); }
  get nroConvenioFrmCtrl() { return this.autorizacionForm.get('nroConvenioFrmCtrl'); }
  get montoConvenioFrmCtrl() { return this.autorizacionForm.get('montoConvenioFrmCtrl'); }
  get montoAcumuladoFrmCtrl() { return this.autorizacionForm.get('montoAcumuladoFrmCtrl'); }
  get saldoDisponibleFrmCtrl() { return this.autorizacionForm.get('saldoDisponibleFrmCtrl'); }
  get mesFrmCtrl() { return this.autorizacionForm.get('mesFrmCtrl'); }

  setStep(index: number) {
    this.step = index;
  }


  cargarMeses(){
    this.itemComboService.ObtenerMeses().subscribe(dataItem => {
      this.dataItemMeses = Object.assign({
        meses: dataItem.response
      });

      if(typeof this.dataItemMeses !== 'undefined'){
        this.autorizacionForm.get('mesFrmCtrl').setValue(this.dataItemMeses.meses[0]);
      }
    });
  }


  cargarPagoMensual(){
    this.itemComboService.ObtenerPagoMensual().subscribe(dataItem => {
      this.dataItemPagoMensual= Object.assign({
        meses: dataItem.response
      });

      if(typeof this.dataItemPagoMensual !== 'undefined'){
        this.autorizacionForm.get('mesFrmCtrl').setValue(this.dataItemPagoMensual.meses[0]);
      }
    });
  }

  public visualizarDatosProyecto(): void{

 
    this.proyectoEjecucionService.detalleProyecto(0,0,null)
    .subscribe(
      (wsResponseProyecto : WsResponseProyecto)=> {
        if(wsResponseProyecto.codResultado == 1){
          this.detalleProyectoResponse = (wsResponseProyecto.response[0] != null) ? wsResponseProyecto.response[0] : null;
          this.setearEleFormulario(this.detalleProyectoResponse);
        }
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(this.mensaje);
  
      }
    
    ); 
  
  }

  setearEleFormulario(detalleProyectoResponse: Proyecto){
    this.codigoObraFrmCtrl.setValue(detalleProyectoResponse.codigo);
    this.descripcionFrmCtrl.setValue(detalleProyectoResponse.descripcion);
    this.fechaAutorizacionFrmCtrl.setValue(detalleProyectoResponse.fecAutorizacion);
    this.nroConvenioFrmCtrl.setValue(detalleProyectoResponse.nroConvenio);
    this.montoConvenioFrmCtrl.setValue(detalleProyectoResponse.montoConvenio);
    this.montoAcumuladoFrmCtrl.setValue(detalleProyectoResponse.montoAcumulado);
    this.saldoDisponibleFrmCtrl.setValue(detalleProyectoResponse.saldoDisponible);
  }


  
   generarTableCronograma(){
    this.loading = true;
    this.Frozencolumna = [
/*       { field: 'item', header: 'NRO.' },
      { field: 'descripcion', header: 'INSUMO O SERVICIO' }, */
    ]; 

    this.Scrollcolumna = [
      { field: 'item', header: 'NRO.' },
      { field: 'descripcion', header: 'INSUMO O SERVICIO' },
      { field: 'unidad', header: 'UNIDAD' },
      { field: 'saldo', header: 'SALDO DISPONIBLE'},
      { field: 'cantidad', header: 'CANTIDAD' },
      { field: 'precioUnitario', header: 'PRECIO UNIT. S/.' },
      { field: 'importe', header: 'IMPORTE S/.' },
      { field: 'razonSocial', header: 'RAZÓN SOCIAL O NOMBRE DEL PROVEEDOR' },
      { field: 'formaPago', header: 'FORMA DE PAGO' },
      { field: 'sustento', header: 'SUSTENTO PAGO EFECTIVO' },
      { field: 'observacion', header: 'OBSERVACIONES' }
    ];
   } 

   generarTablaGastoGeneral(){

      this.loading = true;
      this.FrozencolumnaGeneral= [
        { field: 'item', header: 'NRO.' },
        { field: 'descripcion', header: 'INSUMO O SERVICIO' }
      ];
      this.ScrollcolumnaGeneral = [
        { field: 'unidad', header: 'UNIDAD' },
        { field: 'saldo', header: 'SALDO DISPONIBLE'},
        { field: 'cantidad', header: 'CANT.' },
        { field: 'precioUnitario', header: 'PRECIO UNIT. (S/.)' },
        { field: 'importe', header: 'IMPORTE (S/.)' }, 
        { field: 'razonSocial', header: 'RAZÓN SOCIAL O PROVEEDOR' },
        { field: 'formaPago', header: 'FORMA DE PAGO' },
        { field: 'sustento', header: 'SUSTENTO PAGO EFECTIVO' },
        { field: 'observacion', header: 'OBSERVACIONES' }
      ]; 
    }

    generarTablaGastoSupervision(){

      this.loading = true;
      this.FrozencolumnaSupervision = [
        { field: 'item', header: 'NRO.' },
        { field: 'descripcion', header: 'INSUMO O SERVICIO' }
      ];
      this.ScrollcolumnaSupervision = [
        { field: 'unidad', header: 'UNIDAD' },
        { field: 'saldo', header: 'SALDO DISPONIBLE'},
        { field: 'cantidad', header: 'CANT.' },
        { field: 'precioUnitario', header: 'PRECIO UNIT. (S/.)' },
        { field: 'importe', header: 'IMPORTE (S/.)' }, 
        { field: 'razonSocial', header: 'RAZÓN SOCIAL O PROVEEDOR' },
        { field: 'formaPago', header: 'FORMA DE PAGO' },
        { field: 'sustento', header: 'SUSTENTO PAGO EFECTIVO' },
        { field: 'observacion', header: 'OBSERVACIONES' }
      ]; 
    }


  /* CARGAR DATA TABLA GASTO GENERAL INICIO */
  cargaGastoGeneralPadre(event) {
    this.loading = true;
    this.nodeService.getGastoGeneralPadre().then(response => {
      this.totalRecords = 3;
      this.filesGastoGeneral = [];
      response.forEach(f => {
        let node = {
          data: {
            item: f.data.item,
            descripcion: f.data.descripcion,
            unidad: f.data.unidad,
            saldo: f.data.saldo,
            cantidad: f.data.cantidad,
            precioUnitario: f.data.precioUnitario,
            importe: f.data.importe,
            razonSocial: f.data.razonSocial,
            formaPago: f.data.formaPago,
            sustento: f.data.sustento,
            observacion: f.data.observacion,
            flagPadre: f.data.flagPadre  
          },
          leaf: f.leaf
        };
        this.filesGastoGeneral.push(node);
        console.log(this.filesGastoGeneral);
      });
      this.loading = false;
    });
  }

  cargaGastoGeneralHijo(event) {
    //Obtienes valor del nodo seleccionado
    console.log(event.node.data);
    this.loading = true;
    const node = event.node;
    this.nodeService.getGastoGeneralHijo().then(response => {
      node.children = response;
      this.filesGastoGeneral = [...this.filesGastoGeneral];
      this.loading = false;
    });
  }
   /* CARGAR DATA TABLA GASTO GENERAL FIN */




  /* CARGAR DATA TABLA GASTO SUPERVISION INICIO */
  cargaGastoSupervisionPadre(event) {
    this.loading = true;
    this.nodeService.getGastoSupervisionPadre().then(response => {
      this.totalRecords = 3;
      this.filesGastoSupervision = [];
      response.forEach(f => {
        let node = {
          data: {
            item: f.data.item,
            descripcion: f.data.descripcion,
            unidad: f.data.unidad,
            saldo: f.data.saldo,
            cantidad: f.data.cantidad,
            precioUnitario: f.data.precioUnitario,
            importe: f.data.importe,
            razonSocial: f.data.razonSocial,
            formaPago: f.data.formaPago,
            sustento: f.data.sustento,
            observacion: f.data.observacion,
            flagPadre: f.data.flagPadre  
          },
          leaf: f.leaf
        };
        this.filesGastoSupervision.push(node);
        console.log(this.filesGastoSupervision);
      });
      this.loading = false;
    });
  }

  cargaGastoSupervisionHijo(event) {
    //Obtienes valor del nodo seleccionado
    console.log(event.node.data);
    this.loading = true;
    const node = event.node;
    this.nodeService.getGastoSupervisionHijo().then(response => {
      node.children = response;
      this.filesGastoSupervision = [...this.filesGastoSupervision];
      this.loading = false;
    });
  }
   /* CARGAR DATA TABLA GASTO GENERAL FIN */


  tab_click($event){

  }



  cargaCronogramaPadre(event) {
    this.loading = true;
    this.nodeService.getAutorizacionCostoDirectoPadre().then(response => {
      this.totalRecords = 3;

      this.files = [];
      response.forEach(f => {
        let node = {
          data: {
            item: f.data.item,
            descripcion: f.data.descripcion,
            unidad: f.data.unidad,
            saldo: f.data.saldo,
            cantidad: f.data.cantidad,
            precioUnitario: f.data.precioUnitario,
            importe: f.data.importe,
            razonSocial: f.data.razonSocial,
            formaPago: f.data.formaPago,
            sustento: f.data.sustento,
            observacion: f.data.observacion
          },
          leaf: f.leaf,
          expanded: f.expanded
        };
        this.files.push(node);
      });
      this.loading = false;
    });
  } 

  cargaCronogramaHijo(event) {
    //Obtienes valor del nodo seleccionado
    console.log(event.node.data);
    this.loading = true;
    const node = event.node;
    this.nodeService.getAutorizacionCostoDirectoHijo().then(response => {
      node.children = response;
      this.files = [...this.files];
      this.loading = false;
    });
  }



  selecciona(event): void {
    console.log(this.selectedNodes);
  }

  editar(event: { field: string, data: any }): void {
    // console.log(event.field);
    console.log(event.data);
  }
  
  onMouseEnter(rowData): void {
    rowData.hover = true;
  }

  onMouseLeave(rowData): void {
    rowData.hover = false;
  }

    
  generarAutorizacion(): void{
    this.trabajadorService.generaReporteAutorizacionGasto().subscribe(response => {
      let pdf = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdf);
      window.open(url, "_blank");
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


export interface TreeNodeGeneral {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNodeGeneral[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNodeGeneral;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}

