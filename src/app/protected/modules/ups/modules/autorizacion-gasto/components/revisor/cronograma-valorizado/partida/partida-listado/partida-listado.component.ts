import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MatTableDataSource, PageEvent, MatPaginator, MatRadioGroup, MatSelect, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl} from '@angular/forms';
import { ItemBean } from 'app/protected/modules/ups/modules/expediente/dto/response/ItemBean';
import { Insumo, WsResponseInsumo } from '../../../../../dto/response/Insumo';
import { ProyectoEjecucionService } from '../../../../../service/proyecto-ejecucion.service';
import { MENSAJES } from 'app/common';
import { Programacion, WsResponseProgramacion } from '../../../../../dto/response/Programacion';
import { filter, startWith, map } from 'rxjs/operators';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { Observable } from 'rxjs';
import { WsItemBeanResponse } from '../../../../../dto/response/ItemBean';
import { ItemComboService } from '../../../../../service/item-combo.service';
import {SelectionModel} from '@angular/cdk/collections';


@Component({
  selector: 'app-partida-listado',
  templateUrl: './partida-listado.component.html',
  styleUrls: ['./partida-listado.component.scss']
})
export class PartidaListadoComponent implements OnInit {


  partidaForm: FormGroup;
  insumoForm: FormGroup;
  programacionForm: FormGroup;

  filteredOptionsArquitecto: Observable<ItemBean[]>;
  filteredOptionsIngCivil: Observable<ItemBean[]>;
  filteredOptionslElectrico: Observable<ItemBean[]>;
  filteredOptionslSanitario: Observable<ItemBean[]>;

  profesionalArquitecto: ItemBean[];
  profesionalCivil: ItemBean[];
  profesionalElectrico: ItemBean[];
  profesionalSanitario: ItemBean[];




  dataItemNivel1: ItemBean;
  dataItemNivel2: ItemBean;
  dataItemNivel3: ItemBean;
  dataItemNivel4: ItemBean;
  dataItemTipoInsumo: any;
  dataItemMeses: any;

  columnasInsumo: string[] = [];
  columnasProgramacion: string[] = [];
  dataSource: MatTableDataSource<Insumo>;
  dataSourceProgramacion: MatTableDataSource<Programacion>;
  insumoResponse : Insumo[];
  programacionResponse: Programacion[];
  selection = new SelectionModel<Insumo>(true, []);

  mensaje: any;
  unidadPartida: string;
  metradoPartidad: number;
  precioPartida: number;
  parcialPartida: string;
  isDisabled = true;

  selectedOptionNivel01: string;
  selectedOptionNivel02: string;
  selectedOptionNivel03: string;
  selectedOptionNivel04: string;
  selectedOption: string;
  selectedOptionTipoInsumo: string;
  selectedOptionCodigoPartida: string;


  idPkInsumo: number;
  idPkProgramacion: number;

  indexInsumo: number = 0;
  indexProgramacion: number = 0;


 /*  pagina = 1;
  // cantidad = 2;
  total = 0; */
  dataItemCodigo: any;

  dialogRefMessage: MatDialogRef<any>;

  tabInsumo: boolean;
  tabProgramacion: boolean;
  selectedIndexTab: string;
  selectedIndexTabChange: string;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('cboTipoInsumo', null) cboTipoInsumo: MatSelect;

  dataListadoPartida: any;
  
  constructor(public dialogRef: MatDialogRef<PartidaListadoComponent>,
    private itemComboService: ItemComboService,
    private proyectoEjecucionService: ProyectoEjecucionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    private datos: any) {
      this.dataSource = new MatTableDataSource([]);
      this.dataSourceProgramacion = new MatTableDataSource([]);
      this.insumoResponse = [];
      this.programacionResponse = [];


      this.cargarDataNivel01();
      this.cargarDataNivel02();
      this.cargarDataNivel03();
      this.cargarDataNivel04();

      
      this.insumoResponse = this.datos.files;
      console.log(this.insumoResponse);
      this.cargarTablaInsumo();

   }

   cambiarPagina(event: PageEvent) {
    /*   this.pagina = event.pageIndex + 1;
      this.cantidad = event.pageSize;
      this.cargarInsumos(); */
  }

   ngOnInit() {
    this.partidaFormulario();

    this.insumoFormulario();
    this.programacionFormulario();
    this.cargarDataNivel01();
    //this.generarCabeceraTablaInsumo();
    this.generarTablaPartida();

    this.cargarTipoInsumo();
    this.cargarMeses();

    this.selectedOptionNivel01 = "-1";
    this.selectedOptionNivel02 = "-1";
    this.selectedOptionNivel03 = "-1";
    this.selectedOptionNivel04 = "-1";
    this.selectedOption = "-1";
    this.selectedOptionTipoInsumo = "-1";
    this.selectedOptionCodigoPartida = "-1";

    this.tabInsumo = true;
    this.tabProgramacion = true;
    this.selectedIndexTab = "0";

    this.cargarDataInsumo();
    
    console.log(this.cboTipoInsumo);

  }


 




  changeTipoInsumoPartida($event){
    this.cargarCodigoPartida();
    
    let tipoInsumo = this.tipoInsumoFrmCtrl.value;
    console.log(tipoInsumo);
    if(tipoInsumo.idCodigo == 1){
      this.insumoForm.get('cuadrillaFrmCtrl').enable();      
    }else{
      this.insumoForm.get('cuadrillaFrmCtrl').disable();
    }
  }



  generarTablaPartida(){
    //this.columnasInsumo = ['select','nro','codigo','descripcion']; 
    this.columnasInsumo = ['nro','cantidadInsumo','codigo','descripcion']; 
  }



  public cargarTablaInsumo(): void {
    
    if (this.insumoResponse != null && this.insumoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.insumoResponse);
      this.dataSource.paginator = this.paginator;
      
    }
  }

  public cargarTablaProgramacion(): void {
    if (this.programacionResponse != null && this.programacionResponse.length > 0) {
      this.dataSourceProgramacion = new MatTableDataSource(this.programacionResponse);
    }
  }


  

  tab_click($event){
    if($event == 0){
      this.selectedIndexTab = "0";
      this.tabInsumo = true;
      this.tabProgramacion = true;
    }else if($event == 1){
      this.selectedIndexTab = "1";
      this.tabProgramacion = true;
    }else if($event == 2){
      this.selectedIndexTab = "2";
    }
    console.log($event);
  }

  public cargarInsumos() : void{
    
    this.dataSource = null;

    //let encontrado = this.buscarInsumo();

    //let insu = this.agregarInsumo();
    
    this.proyectoEjecucionService.insumoListar(0,0,null)//this.pagina,this.cantidad,null)
    .subscribe(
      (wsResponseInsumo : WsResponseInsumo)=> {
         
        if(wsResponseInsumo.codResultado == 1){
        

        
          //this.insumoResponse = (wsResponseInsumo.response != null) ? wsResponseInsumo.response : [];
          //this.total = (wsResponseInsumo.total!=0)? wsResponseInsumo.total : 0;
         
           /*  if(encontrado == false){
              this.insumoResponse.push(insu);
            } */
            
          //  this.total = this.insumoResponse.length;
          
          
          //this.cargarTablaInsumo();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.error(this.mensaje);
        }
      
      },
      error => {
        console.error(error);
      }   
    ); 
  }




  public cargarProgramacion() : void{
    this.dataSource = null;

    this.proyectoEjecucionService.programacionListar(0,0,null)//this.pagina,this.cantidad,null)
    .subscribe(
      (wsResponseProgramacion : WsResponseProgramacion)=> {
         
        if(wsResponseProgramacion.codResultado == 1){
          this.programacionResponse = (wsResponseProgramacion.response != null) ? wsResponseProgramacion.response : [];
          //this.total = (wsResponseProgramacion.total!=0)? wsResponseProgramacion.total : 0;
          this.cargarTablaProgramacion();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.error(this.mensaje);
        }
      
      },
      error => {
        console.error(error);
      }   
    ); 
  }



/*   selectNivel01($event){
    if($event != -1){
      console.log($event);
      this.cargarDataNivel02();
    }
  
  }

  selectNivel02($event){
    if($event != -1){
    console.log($event);
    this.cargarDataNivel03();
    }
  }

  selectNivel03($event){
    if($event != -1){
    console.log($event);
    this.cargarDataNivel04();
    }
  } */


  datosPartida($event){
    if($event.value != -1){
    console.log($event);
    this.unidadFrmCtrl.setValue("pz.");
    this.metradoFrmCtrl.setValue("4.00");
    this.precioFrmCtrl.setValue("10.00");
    this.parcialFrmCtrl.setValue("40.00");
    }

  }

  cargarDataInsumo(){
    this.codInsumoFrmCtrl.setValue("0101010003");
    this.descripcionInsumoFrmCtrl.setValue("VALVULA ENTRADA DESCARGA P/TANQUE BAJO ACERO PLASTICO");
    this.unidadInsumoFrmCtrl.setValue("hh");
    this.cantidadFrmCtrl.setValue("4.00");
    this.precioInsumoFrmCtrl.setValue("2.50");
    this.parcialInsumoFrmCtrl.setValue("6.50");
    
    
  }
  

   partidaFormulario() {
    this.partidaForm = new FormGroup({
      totalSubPresupuestoFrmCtrl: new FormControl({ value: ''}), 
      subTotalDeSubPresupuestoFrmCtrl: new FormControl({ value: ''}),
      subTotalDePartidaFrmCtrl: new FormControl({ value: ''}),
      nombrePartidaFrmCtrl: new FormControl({value: ''}),
      unidadFrmCtrl: new FormControl({value: '',disabled: true}),
      metradoFrmCtrl: new FormControl(),
      precioFrmCtrl: new FormControl({value: '',disabled: true}),
      parcialFrmCtrl: new FormControl({value: '',disabled: true})

    });
  }

  get totalSubPresupuestoFrmCtrl() { return this.partidaForm.get('totalSubPresupuestoFrmCtrl'); }
  get subTotalDeSubPresupuestoFrmCtrl(){ return this.partidaForm.get('subTotalDeSubPresupuestoFrmCtrl');}
  get subTotalDePartidaFrmCtrl() { return this.partidaForm.get('subTotalDePartidaFrmCtrl'); }
  get nombrePartidaFrmCtrl() { return this.partidaForm.get('nombrePartidaFrmCtrl'); }
  get unidadFrmCtrl(){ return this.partidaForm.get('unidadFrmCtrl');}
  get metradoFrmCtrl() { return this.partidaForm.get('metradoFrmCtrl'); }
  get precioFrmCtrl(){ return this.partidaForm.get('precioFrmCtrl');}
  get parcialFrmCtrl() { return this.partidaForm.get('parcialFrmCtrl'); }

   
  
  insumoFormulario() {
      this.insumoForm = new FormGroup({
      tipoInsumoFrmCtrl: new FormControl({ value: ''}), 
      codInsumoFrmCtrl: new FormControl({ value: '',disabled: true}), 
      descripcionInsumoFrmCtrl: new FormControl({ value: '',disabled: true}),
      unidadInsumoFrmCtrl: new FormControl({value: '',disabled: true}),
      cuadrillaFrmCtrl: new FormControl({ value: '',disabled: true}),
      cantidadFrmCtrl: new FormControl({ value: '',disabled: false}),
      precioInsumoFrmCtrl: new FormControl({ value: '',disabled: true}),
      parcialInsumoFrmCtrl: new FormControl({value: '',disabled: true})
    }); 
  }

  get tipoInsumoFrmCtrl() { return this.insumoForm.get('tipoInsumoFrmCtrl'); }
  get codInsumoFrmCtrl() { return this.insumoForm.get('codInsumoFrmCtrl'); }
  get descripcionInsumoFrmCtrl(){ return this.insumoForm.get('descripcionInsumoFrmCtrl');}
  get unidadInsumoFrmCtrl() { return this.insumoForm.get('unidadInsumoFrmCtrl'); }
  get cuadrillaFrmCtrl() { return this.insumoForm.get('cuadrillaFrmCtrl'); }
  get cantidadFrmCtrl(){ return this.insumoForm.get('cantidadFrmCtrl');}
  get precioInsumoFrmCtrl() { return this.insumoForm.get('precioInsumoFrmCtrl'); }
  get parcialInsumoFrmCtrl(){ return this.insumoForm.get('parcialInsumoFrmCtrl');}
  

  programacionFormulario(){
    this.programacionForm = new FormGroup({
      mesFrmCtrl: new FormControl({ value: ''}), 
      metradoProgFrmCtrl: new FormControl({ value: ''}),
      precioProgFrmCtrl: new FormControl({value: ''}),
      porcentajeFrmCtrl: new FormControl({value: ''}),
      sustentoFrmCtrl: new FormControl({value: ''})
    });
  }

  get mesFrmCtrl() { return this.programacionForm.get('mesFrmCtrl'); }
  get metradoProgFrmCtrl(){ return this.programacionForm.get('metradoProgFrmCtrl');}
  get precioProgFrmCtrl() { return this.programacionForm.get('precioProgFrmCtrl'); }
  get porcentajeFrmCtrl() { return this.programacionForm.get('porcentajeFrmCtrl'); }
  get sustentoFrmCtrl() { return this.programacionForm.get('sustentoFrmCtrl'); }
 
  
 /*  cargarDataNivel01() {
    this.itemComboService.ObtenerNivel1().subscribe(dataItem => {
      this.dataItemNivel1 = Object.assign({
        nivel01: dataItem.response
      });
    });
  } 

  cargarDataNivel02() {
    this.itemComboService.ObtenerNivel2().subscribe(dataItem => {
      this.dataItemNivel2 = Object.assign({
        nivel02: dataItem.response
      });
    });
  } 

  cargarDataNivel03() {
    this.itemComboService.ObtenerNivel3().subscribe(dataItem => {
      this.dataItemNivel3 = Object.assign({
        nivel03: dataItem.response
      });
    });
  } 

  cargarDataNivel04() {
    this.itemComboService.ObtenerNivel4().subscribe(dataItem => {
      this.dataItemNivel4 = Object.assign({
        nivel04: dataItem.response
      });
    });
  }  */

  cargarDataNivel01() {
    this.profesionalArquitecto = [];
    this.itemComboService.ObtenerNivel1().subscribe(
    (wsItemBeanResponse: WsItemBeanResponse) =>{
      if(wsItemBeanResponse.codResultado == 1){
        this.profesionalArquitecto = (wsItemBeanResponse.response != null) ? wsItemBeanResponse.response : []; 
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

  cargarDataNivel02() {
    this.profesionalCivil = [];
    this.itemComboService.ObtenerNivel2().subscribe(
    (wsItemBeanResponse: WsItemBeanResponse) =>{
      if(wsItemBeanResponse.codResultado == 1){
        this.profesionalCivil = (wsItemBeanResponse.response != null) ? wsItemBeanResponse.response : []; 
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


  cargarDataNivel03() {
    this.profesionalElectrico = [];
    this.itemComboService.ObtenerNivel3().subscribe(
    (wsItemBeanResponse: WsItemBeanResponse) =>{
      if(wsItemBeanResponse.codResultado == 1){
        this.profesionalElectrico = (wsItemBeanResponse.response != null) ? wsItemBeanResponse.response : []; 
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


  cargarDataNivel04() {
    this.profesionalSanitario = [];
    this.itemComboService.ObtenerNivel4().subscribe(
    (wsItemBeanResponse: WsItemBeanResponse) =>{
      if(wsItemBeanResponse.codResultado == 1){
        this.profesionalSanitario = (wsItemBeanResponse.response != null) ? wsItemBeanResponse.response : []; 
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


  cargarTipoInsumo(){
    this.itemComboService.ObtenerTipoInsumo().subscribe(dataItem => {
      this.dataItemTipoInsumo = Object.assign({
        tipoInsumo: dataItem.response
      });
      /*      
      if(typeof this.dataItemTipoInsumo !== 'undefined'){
        this.insumoForm.get('tipoInsumoFrmCtrl').setValue(this.dataItemTipoInsumo.tipoInsumo[0]);
      } */
    });  
   
  }

  cargarMeses(){
    this.itemComboService.ObtenerMeses().subscribe(dataItem => {
      this.dataItemMeses = Object.assign({
        meses: dataItem.response
      });
    });
  }

  cargarCodigoPartida(){
    this.itemComboService.ObtenerCodigoPartida().subscribe(dataItem => {
      this.dataItemCodigo = Object.assign({
        codigoPart: dataItem.response
      });
    });
  }

  changeCodigoPartida($event){
    this.cargarDataInsumo();

    if($event.cidCodigo == "001"){
      this.descripcionInsumoFrmCtrl.setValue("TUBO DE ABASTO ALUMINIO TRENZADO 1/2 X5/8 35cm P/INODORO");
    }else if($event.cidCodigo == "002"){
      this.descripcionInsumoFrmCtrl.setValue("ALAMBRE NEGRO RECOCIDO N° 8");
    }else if($event.cidCodigo == "003"){
      this.descripcionInsumoFrmCtrl.setValue("CALAMINA GALVANIZADA 1.83mx0.83mx0.14mm");
    }else if($event.cidCodigo == "004"){
      this.descripcionInsumoFrmCtrl.setValue("CEMENTO PORTLAND TIPO I (42.5 kg)");
    }else if($event.cidCodigo == "005"){
      this.descripcionInsumoFrmCtrl.setValue("MADERA CORRIENTE");
    }
    this.insumoForm.get('cantidadFrmCtrl').enable();
    this.insumoForm.get('precioInsumoFrmCtrl').enable();
   
  }
  
    tabPartidaGuardar(){
      let seleccionPartida = this.nombrePartidaFrmCtrl.value;
      if(seleccionPartida != "-1"){
     
        this.tabInsumo = false;
        this.selectedIndexTab = "1";
      }else{
        this.openDialogMensaje(MENSAJES.CRONOGRAMA.VALIDAR_PARTIDA, true);
      }
     
    }

    tabInsumoGuardar(){
      if(this.insumoResponse.length>0){
      
      this.tabProgramacion = false;
      this.selectedIndexTab = "2";
      }else{
        this.openDialogMensaje(MENSAJES.CRONOGRAMA.VALIDAR_INSUMO, true);
      }
  
    }

    Grabar(){

      if(this.programacionResponse.length>0 && this.sustentoFrmCtrl.value.value != ""){
        this.openDialogMensajeConfirm(MENSAJES.CRONOGRAMA.GRABAR_PARTIDA, true);
        this.dialogRefMessage.afterClosed()
          .pipe(filter(verdadero => !!verdadero))
          .subscribe(() => {
            this.snackBar.open("La partida fue agregada al cronograma");
            this.dialogRefMessage.close();
            this.dialogRef.close();
          });
      }else if(this.programacionResponse.length <= 0){
        this.openDialogMensaje(MENSAJES.CRONOGRAMA.VALIDAR_PROGRAMACION, true);
      }else if(this.sustentoFrmCtrl.value.value == ""){
        this.openDialogMensaje(MENSAJES.CRONOGRAMA.VALIDAR_SUSTENTO, true);
      }
     
      
    }


  agregarInsumo() {
    let encontro = this.buscarInsumo();
    if(encontro == false){
    let insumo = new  Insumo();
    if(typeof insumo !== 'undefined'){
      insumo.item = this.indexInsumo++;
      insumo.cidCodigoPart = this.codInsumoFrmCtrl.value.cidCodigo;
      insumo.codigoPart = this.codInsumoFrmCtrl.value.cidNombre;
      insumo.cidCodigo = this.tipoInsumoFrmCtrl.value.cidCodigo;
      insumo.tipoInsumo = this.tipoInsumoFrmCtrl.value.cidNombre;
      insumo.descripcion = this.descripcionInsumoFrmCtrl.value;
      insumo.unidad = this.unidadInsumoFrmCtrl.value;
      insumo.cuadrilla = this.cuadrillaFrmCtrl.value;
      insumo.cantidad = this.cantidadFrmCtrl.value;
      insumo.precio = this.precioInsumoFrmCtrl.value;
      insumo.parcial = this.parcialInsumoFrmCtrl.value;

      this.insumoResponse.push(insumo);
      this.cargarTablaInsumo();    
      this.limpiarFormularioInsumo();
      }
    }
  }

  limpiarFormularioInsumo(){

    this.selectedOptionTipoInsumo = "-1";
    this.selectedOptionCodigoPartida = "-1"
    //this.dataItemCodigo = [];

    this.descripcionInsumoFrmCtrl.setValue("");
    this.unidadInsumoFrmCtrl.setValue("");
    this.cuadrillaFrmCtrl.setValue("");
    this.cantidadFrmCtrl.setValue("");
    this.precioInsumoFrmCtrl.setValue("");
    this.parcialInsumoFrmCtrl.setValue("");
   
  }

  limpiarFormularioProgramacion(){

    this.selectedOption = "-1";
    this.metradoProgFrmCtrl.setValue("");
    this.porcentajeFrmCtrl.setValue("");
    this.precioProgFrmCtrl.setValue("");

  }

  agregarProgramacion(){
    let encontro = this.buscarProgramacion();
    if(encontro == false){
    let prog = new  Programacion();
    if(typeof prog !== 'undefined'){ 
      prog.item = this.indexProgramacion++;
      prog.cidCodigoMes = this.mesFrmCtrl.value.cidCodigo;
      prog.mes = this.mesFrmCtrl.value.cidNombre;
      prog.metrado = this.metradoProgFrmCtrl.value;
      prog.porcentaje = this.porcentajeFrmCtrl.value;
      prog.precio = this.precioProgFrmCtrl.value;
      this.programacionResponse.push(prog);

      this.cargarTablaProgramacion();    
      this.limpiarFormularioProgramacion();
      }
    }
  }

  buscarInsumo() : boolean{

    if(this.insumoResponse.length > 0 && typeof this.idPkInsumo !== "undefined"){
    let ins = new Insumo();
    ins = this.insumoResponse.find(c => c.item == this.idPkInsumo);

     if(typeof ins !== 'undefined'){
    ins.cidCodigoPart = this.codInsumoFrmCtrl.value.cidCodigo;
    ins.codigoPart = this.codInsumoFrmCtrl.value.cidNombre;
    ins.cidCodigo = this.tipoInsumoFrmCtrl.value.cidCodigo;
    ins.tipoInsumo = this.tipoInsumoFrmCtrl.value.cidNombre;
    ins.descripcion = this.descripcionInsumoFrmCtrl.value;
    ins.unidad = this.unidadInsumoFrmCtrl.value;
    ins.cuadrilla = this.cuadrillaFrmCtrl.value;
    ins.cantidad = this.cantidadFrmCtrl.value;
    ins.precio = this.precioInsumoFrmCtrl.value;
    ins.parcial = this.parcialInsumoFrmCtrl.value;
  
    this.idPkInsumo = -1;
    this.cargarTablaInsumo();
    this.limpiarFormularioInsumo();

      return true;
     }else{
       return false;
     }
    }
    return false;
  }

  buscarProgramacion(): boolean{
    if(this.programacionResponse.length >0 && typeof this.idPkProgramacion !== "undefined"){
      let prog = new Programacion();
      prog = this.programacionResponse.find(p => p.item == this.idPkProgramacion);
      if(typeof prog !== 'undefined'){
        prog.cidCodigoMes = this.mesFrmCtrl.value.cidCodigo;
        prog.mes = this.mesFrmCtrl.value.cidNombre;
        prog.metrado = this.metradoProgFrmCtrl.value;
        prog.porcentaje = this.porcentajeFrmCtrl.value;
        prog.precio = this.precioProgFrmCtrl.value;
 
        this.idPkProgramacion = -1;
        this.cargarTablaProgramacion(); 
        this.limpiarFormularioProgramacion();
          return true;
         }else{
           return false;
         }
        }
        return false;
  }

  editarInsumo(viewInsumo: Insumo){
    console.log(viewInsumo.item);
    this.idPkInsumo = viewInsumo.item;

    if(viewInsumo.cidCodigo == "001"){
      this.tipoInsumoFrmCtrl.setValue(this.dataItemTipoInsumo.tipoInsumo[0]);
    }else if(viewInsumo.cidCodigo == "002"){
      this.tipoInsumoFrmCtrl.setValue(this.dataItemTipoInsumo.tipoInsumo[1]);
    }else if(viewInsumo.cidCodigo == "003"){
      this.tipoInsumoFrmCtrl.setValue(this.dataItemTipoInsumo.tipoInsumo[2]);
    }
    if(viewInsumo.cidCodigoPart == "001"){
      this.codInsumoFrmCtrl.setValue(this.dataItemCodigo.codigoPart[0]);
    }else if(viewInsumo.cidCodigoPart == "002"){
      this.codInsumoFrmCtrl.setValue(this.dataItemCodigo.codigoPart[1]);
    }else if(viewInsumo.cidCodigoPart == "003"){
      this.codInsumoFrmCtrl.setValue(this.dataItemCodigo.codigoPart[2]);
    }else if(viewInsumo.cidCodigoPart == "004"){
      this.codInsumoFrmCtrl.setValue(this.dataItemCodigo.codigoPart[3]);
    }else if(viewInsumo.cidCodigoPart == "005"){
      this.codInsumoFrmCtrl.setValue(this.dataItemCodigo.codigoPart[4]);
    }
   
    this.descripcionInsumoFrmCtrl.setValue(viewInsumo.descripcion);
    this.unidadInsumoFrmCtrl.setValue(viewInsumo.unidad);
    this.cuadrillaFrmCtrl.setValue(viewInsumo.cuadrilla);
    this.cantidadFrmCtrl.setValue(viewInsumo.cantidad);
    this.precioInsumoFrmCtrl.setValue(viewInsumo.precio);
    this.parcialInsumoFrmCtrl.setValue(viewInsumo.parcial);
  }
 
  eliminarInsumo(viewInsumo: Insumo){

    this.openDialogMensajeConfirm(MENSAJES.CRONOGRAMA.ELIMINAR_INSUMO_CONFIRM + ' ' + viewInsumo.descripcion + '?', true);

    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.snackBar.open("Insumo " + viewInsumo.descripcion + " eliminado");
        viewInsumo.item = this.indexInsumo--;
        this.insumoResponse.splice(this.insumoResponse.indexOf(viewInsumo), 1);
        this.dataSource = new MatTableDataSource(this.insumoResponse);
        this.dataSource.paginator = this.paginator;
      });
      this.limpiarFormularioInsumo();
    }


    editarProgramacion(viewProgramacion: Programacion){
      console.log(viewProgramacion.item);
      this.idPkProgramacion = viewProgramacion.item;
      if(viewProgramacion.cidCodigoMes == "001"){
        this.mesFrmCtrl.setValue(this.dataItemMeses.meses[0]);
      }else if(viewProgramacion.cidCodigoMes == "002"){
        this.mesFrmCtrl.setValue(this.dataItemMeses.meses[1]);
      }else if(viewProgramacion.cidCodigoMes == "003"){
        this.mesFrmCtrl.setValue(this.dataItemMeses.meses[2]);
      }else if(viewProgramacion.cidCodigoMes == "004"){
        this.mesFrmCtrl.setValue(this.dataItemMeses.meses[3]);
      }
   
      this.metradoProgFrmCtrl.setValue(viewProgramacion.metrado);
      this.porcentajeFrmCtrl.setValue(viewProgramacion.porcentaje);
      this.precioProgFrmCtrl.setValue(viewProgramacion.precio);

    }
  
    eliminarProgramacion(viewProgramacion: Programacion){
  
      this.openDialogMensajeConfirm(MENSAJES.CRONOGRAMA.ELIMINAR_PROGRAMACION_CONFIRM + ' ' + viewProgramacion.mes + '?', true);
  
      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.snackBar.open("Programación del mes " + viewProgramacion.mes + " eliminada");
          viewProgramacion.item = this.indexProgramacion--;
          this.programacionResponse.splice(this.programacionResponse.indexOf(viewProgramacion), 1);
          this.dataSourceProgramacion = new MatTableDataSource(this.programacionResponse);
          //this.dataSourceProgramacion.paginator = this.paginator;
        });
        this.limpiarFormularioProgramacion();
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


  onMouseEnterCantidad($event){
    let suma = parseFloat(this.cantidadFrmCtrl.value) * parseFloat(this.precioInsumoFrmCtrl.value);
    this.parcialInsumoFrmCtrl.setValue(suma);
  }

  onMouseEnterPrecio($event){
    let suma = parseFloat(this.cantidadFrmCtrl.value) * parseFloat(this.precioInsumoFrmCtrl.value);
    this.parcialInsumoFrmCtrl.setValue(suma);
  }
 
  onMouseEnterMetradoPartida(event){
    let suma = parseFloat(this.metradoFrmCtrl.value) * parseFloat(this.precioFrmCtrl.value);
    this.parcialFrmCtrl.setValue(suma);

  }
  onMouseEnterPrecioPartida(event){
    let suma = parseFloat(this.metradoFrmCtrl.value) * parseFloat(this.precioFrmCtrl.value);
    this.parcialFrmCtrl.setValue(suma);

  }
  

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Insumo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.item + 1}`;
  }




  actualizarInsumo(){
   /*  const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de actualizar la cantidad del insumo?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      
      if (confirm) {
        
        this.dialogRef.close(100);
     
      }
    }); */
   /*  let insumo = new Insumo();
    insumo = this.insumoResponse.find(p => p.fidInsumo == this.idPkProgramacion); */
  }


  deleteInsumo(){
   /*  const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
    dialogMessage.componentInstance.message = '¿Está seguro de eliminar el insumo?';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      
      if (confirm) {
        
        this.dialogRef.close(100);
     
      }
    }); */
   /*  let insumo = new Insumo();
    insumo = this.insumoResponse.find(p => p.fidInsumo == this.idPkProgramacion); */
  }





}
