import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MatDialog } from '@angular/material';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { ProyectoEjecucionService } from '../../../../../service/proyecto-ejecucion.service';
import { WsResponseProyecto, Proyecto } from '../../../../../dto/response/Proyecto';
import { MENSAJES } from 'app/common';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { ItemComboService } from '../../../../../service/item-combo.service';
import { ItemBean, WsItemBeanResponse } from '../../../../../dto/response/ItemBean';
import { ArchivoResponse } from 'app/protected/modules/ups/modules/expediente/dto/response/ArchivoResponse';
import { ArchivoProyecto, WsResponseArchivoProyecto } from '../../../../../dto/response/ArchivoProyecto';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ArchivoRequest } from 'app/protected/modules/ups/modules/expediente/dto/request/ArchivoRequest';
import { TrabajadorService } from '../../../../../service/trabajador.service';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-informe-tecnico',
  templateUrl: './informe-tecnico.component.html',
  styleUrls: ['./informe-tecnico.component.scss']
})
export class InformeTecnicoComponent implements OnInit {



  @ViewChild('myInput')
  myInputVariable: ElementRef;
  
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
  archivoForm: FormGroup;
  columnas: string[];

  selectedFiles: boolean;
  fileUpload: File;
  archivo: string;
  srcResult: any;


  tipoDocArchivo: ItemBean[];
  tipoDocArchivoAux: ItemBean;
  file: File | null = null;

  @ViewChild('fileInput')
  fileInput;

  selectedIndexTab: any;


  // Tabla
  dataSource: MatTableDataSource<ArchivoProyecto>;

  archivoResponse : ArchivoProyecto[];
  total: number;

  dialogRefMessage: MatDialogRef<any>;


  public EditorAspectoTecnico = DecoupledEditor;
  public ckeditorAspectoTecnico: string = '<table><tbody><tr><td>valor1</td><td>valor2</td><td>500</td><td>300</td><td>1500</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>';

  public EditorAspectoImportancia = DecoupledEditor;
  public ckeditorAspectoImportancia: string = '<table><tbody><tr><td>valor2</td><td>xxxx</td><td>550</td><td>250</td><td>1500</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>';

  public EditorAspectoEconomico = DecoupledEditor;
  public ckeditorAspectoEconomico: string = '<table><tbody><tr><td>valor3</td><td>yyyyy</td><td>600</td><td>150</td><td>1500</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>';

  public EditorImpactoAmbiental = DecoupledEditor;
  public ckeditorImpactoAmbiental: string = '<table><tbody><tr><td>valor4</td><td>wwww</td><td>700</td><td>200</td><td>1500</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>';

  public EditorAspectoRelevante = DecoupledEditor;
  public ckeditorAspectoRelevante: string = '<table><tbody><tr><td>valor5</td><td>zzzzzz</td><td>800</td><td>100</td><td>1500</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>';
  btnEliminar: boolean;
  examinarFiles: boolean;

  constructor(public dialogRef: MatDialogRef<InformeTecnicoComponent>,
    private nodeService: NodeService,
    private proyectoEjecucionService: ProyectoEjecucionService,
    private itemComboService: ItemComboService,
    private trabajadorService: TrabajadorService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.columnas = ['nro', 'archivo', 'tipoDoc', 'descripcion', 'accion'];

    this.cargarMeses();
    this.crearAutorizacionForm();
    this.generarTableCronograma();
    this.generarTablaGastoGeneral();
    this.generarTablaGastoSupervision();
    this.visualizarDatosProyecto();
    this.cargarTipoDocArchivo();
    this.crearFormulario();
    this.listadoArchivo();

  }


  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }




  crearAutorizacionForm() {
    this.autorizacionForm = new FormGroup({
      codigoObraFrmCtrl: new FormControl({ value: '', disabled: true}), 
      descripcionFrmCtrl: new FormControl({value: '',disabled: true}),
      fechaAutorizacionFrmCtrl: new FormControl(null),
      nroConvenioFrmCtrl: new FormControl({value: '',disabled: true}),
      montoConvenioFrmCtrl: new FormControl(null),
      montoAcumuladoFrmCtrl: new FormControl(null),
      saldoDisponibleFrmCtrl: new FormControl({value: '',disabled: true}),
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


  validarSubidaArchivo($event) {
    $event.preventDefault();
    if (this.archivoForm.get('tipoDocArchivoFrmCtrl').value == '' || (this.archivoForm.get('tipoDocArchivoFrmCtrl').value == null)) {
      this.openDialogMensaje(MENSAJES.ARCHIVO_TITLE, true);
      return false;
    } else {
      this.upload();
    }
  }

  upload() {
    const archivoRequest: ArchivoRequest = new ArchivoRequest();
    archivoRequest.nomArchivo = this.fileUpload.name;
    archivoRequest.archivo = this.fileUpload;
    /* archivoRequest.idProyecto = this.datos.idProyecto + "";
    archivoRequest.fidProyecto = this.datos.fidProyecto; */
    archivoRequest.descripcion = this.archivoForm.get('descArchivoFrmCtrl').value;
    this.tipoDocArchivoAux = this.archivoForm.get('tipoDocArchivoFrmCtrl').value;

    this.selectedFiles = false;
    this.btnEliminar = true;
    this.examinarFiles = true;

      this.subirArchivo();
    }


      // carga de archivo original
  subirArchivo() {
/*
    archivoRequest.descripcion = this.archivoForm.get('descArchivoFrmCtrl').value;
    archivoRequest.tipoDoc = this.archivoForm.get('tipoDocArchivoFrmCtrl').value.cidCodigo;

    this.selectedFiles = false;
    this.btnEliminar = true;
    this.examinarFiles = true;


    this.proyectoService.subirArchivo(archivoRequest).subscribe(
      (response: WsApiOutResponse) => {

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
          console.error(error);

      }); */
  }


  
  
  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }


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
    this.itemComboService
      .obtenerTipoDocumentoArchivo()
      .subscribe(
        (data: WsItemBeanResponse) => {
          if (data.codResultado == 1) {
            this.tipoDocArchivo = data.response;
          /*   if(typeof this.tipoDocArchivo !== 'undefined'){
              this.autorizacionForm.get('mesFrmCtrl').setValue(this.tipoDocArchivo[0]);
            } */
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




/* 
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

  } */


  public listadoArchivo(): void{
    this.dataSource = null;
    this.archivoResponse = [];
    this.proyectoEjecucionService.listarArchivoInforme(0,0,null)
    .subscribe(
      (wsResponseArchivoProyecto : WsResponseArchivoProyecto)=> {
        if(wsResponseArchivoProyecto.codResultado == 1){
          this.archivoResponse = (wsResponseArchivoProyecto.response != null) ? wsResponseArchivoProyecto.response : [];
          this.total = (wsResponseArchivoProyecto.total!=0)? wsResponseArchivoProyecto.total : 0;
          this.cargarTablaArchivoProyecto();
        }
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        this.openDialogMensaje(this.mensaje, true);


      }  
    ); 
  }

  public cargarTablaArchivoProyecto(): void {
    if (this.archivoResponse != null && this.archivoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.archivoResponse);
    }
  }

  
  
  public openDialogMensajeConfirm(message: string,confirmacion: boolean): void {

    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: {message: message, confirmacion: confirmacion}
    });
  }


  public openDialogMensaje(message: string, alerta: boolean): void {

    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: {message: message, alerta: alerta}
    });
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
            cantidad: f.data.cantidad,
            precioUnitario: f.data.precioUnitario,
            importe: f.data.importe,
            razonSocial: f.data.razonSocial,
            formaPago: f.data.formaPago,
            sustento: f.data.sustento,
            observacion: f.data.observacion   
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
            cantidad: f.data.cantidad,
            precioUnitario: f.data.precioUnitario,
            importe: f.data.importe,
            razonSocial: f.data.razonSocial,
            formaPago: f.data.formaPago,
            sustento: f.data.sustento,
            observacion: f.data.observacion   
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
            cantidad: f.data.cantidad,
            precioUnitario: f.data.precioUnitario,
            importe: f.data.importe,
            razonSocial: f.data.razonSocial,
            formaPago: f.data.formaPago,
            sustento: f.data.sustento,
            observacion: f.data.observacion
          },
          leaf: f.leaf
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


  guardarInsumoCotizacionSinEnviar(){

  }

  enviarInsumoCotizacion(){

  }

  vistaPreviaInsumoCotizacion(){
    this.trabajadorService.generaReporteInformeTecnico().subscribe(response => {

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


