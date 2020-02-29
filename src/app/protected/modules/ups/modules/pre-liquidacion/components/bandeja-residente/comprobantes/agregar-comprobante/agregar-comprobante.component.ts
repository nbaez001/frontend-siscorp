import { Component, OnInit,ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ItemBean } from '../../../../dto/response/ItemBean';
import {MatDialogRef, MatTableDataSource, MatDialog} from '@angular/material';
import { ItemComboService } from '../../../../services/item-combo.service';
import { Gasto } from '../../../../entities/gasto';
import { GestionPreliquidacionService } from '../../../../services/gestion-preliquidacion.services';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { TrabajadorService } from 'app/protected/modules/ups/modules/autorizacion-gasto/service/trabajador.service';
import { Sunat } from 'app/protected/modules/ups/modules/autorizacion-gasto/dto/response/Sunat';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-agregar-comprobante',
  templateUrl: './agregar-comprobante.component.html',
  styleUrls: ['./agregar-comprobante.component.scss']
 // encapsulation: ViewEncapsulation.None
})
export class AgregarComprobanteComponent implements OnInit {

  titulo_requerimiento: string;
  formularioComprobanteGrp: FormGroup;
  formularioBienesGrp:FormGroup;
  formularioServiciosGrp:FormGroup;
  formularioViaticosGrp:FormGroup;
  mesesDeclarar: ItemBean[] = [];
  rubros: ItemBean[] = [];
  tipoComprobantes: ItemBean[] = [];
  departamentos: ItemBean[] = [];
  provincias: ItemBean[] = [];
  distritos: ItemBean[] = [];
  cargosNE: ItemBean[] = [];
  localidades: ItemBean[] = [];
  referencias: ItemBean[] = [];
  gastos: ItemBean[] = [];

  dataItemMes: ItemBean;
  dataItemRubro: ItemBean;
  dataItemTipoComprobante: ItemBean;

  dataItemDepartamento: ItemBean;
  dataItemProvincia: ItemBean;
  dataItemDistrito: ItemBean;
  dataItemLocalidad: ItemBean;

  dataItemCargoNE: ItemBean;
  dataItemReferencia: ItemBean;
  dataItemGasto: ItemBean;

  @ViewChild('fileInput')
  fileInput;
  selectedFiles: boolean;
  fileUpload: File;
  archivo: string;
  
  dataSource:Gasto[][];// MatTableDataSource<Gasto>;
  columnas: string[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;

  flagReferencia: boolean= true;
   dialogRefMessage: MatDialogRef<any>;

  constructor( private itemComboService: ItemComboService,
     public dialogRef: MatDialogRef<AgregarComprobanteComponent>,
     private dialog: MatDialog,
     private gestionPreliquidacionService: GestionPreliquidacionService,
     public trabajadorService: TrabajadorService,
     private spinner: NgxSpinnerService //para el loadding
    ) { 

      this.titulo_requerimiento = "AGREGAR COMPROBANTE";
    }

  ngOnInit() {
    this.crearForm();
    this.cargarCombosFormulario();
    this.cargarTabla();
    this.formularioViaticosGrp.get('frmReferenciaVia').disable();//deshabilitar caja texto referencia (pestaña viatico)
  }

  crearForm() {
    this.formularioComprobanteGrp = new FormGroup({
     
      frmMesDeclarar: new FormControl(null),
      frmRubro: new FormControl(null),
      frmNumRuc: new FormControl("10440999358"),
      frmEstado: new FormControl(null),
      frmCondicion: new FormControl(null),
      frmRazonSocial: new FormControl(null),
      frmTipoComprobante: new FormControl(null),
      frmNumComprobante: new FormControl(null),
      frmFechaComprobante: new FormControl(null),
      frmImporte: new FormControl(null),
      frmInsumo: new FormControl(null),
      frmComprobante: new FormControl(null),
      frmObsComprobante: new FormControl(null)
      
    });

    this.formularioBienesGrp = new FormGroup({
     
      frmMesDeclararB: new FormControl(null),
      frmRubroB: new FormControl(null),
      frmNro: new FormControl(null),
      frmFechaBien: new FormControl(null),
      frmDepartamento: new FormControl(null),
      frmProvincia: new FormControl(null),
      frmDistrito: new FormControl(null),
      frmLocalidad: new FormControl(null),
      frmNombreProv: new FormControl(null),
      frmDni: new FormControl(null),
      frmMaterial: new FormControl(null),
      frmCantidad: new FormControl(null),
      frmPrecioUni: new FormControl(null),
      frmTotal: new FormControl(null),
      frmComprobante: new FormControl(null),
      frmObsBien: new FormControl(null)
    });

    this.formularioServiciosGrp = new FormGroup({
     
      frmMesDeclararSer: new FormControl(null),
      frmRubroSer: new FormControl(null),
      frmNroSer: new FormControl(null),
      frmFechaSer: new FormControl(null),
      frmDepartamentoSer: new FormControl(null),
      frmProvinciaSer: new FormControl(null),
      frmDistritoSer: new FormControl(null),
      frmLocalidadSer: new FormControl(null),
      frmNombreProvSer: new FormControl(null),
      frmDniSer: new FormControl(null),
      frmActividadSer: new FormControl(null),
      frmLugarSer: new FormControl(null),
      frmCantidadSer: new FormControl(null),
      frmPrecioUniSer: new FormControl(null),
      frmTotalSer: new FormControl(null),
      frmObsServicio: new FormControl(null)
    });

    this.formularioViaticosGrp = new FormGroup({
     
      frmMesDeclararVia: new FormControl(null),
      frmRubroVia: new FormControl(null),
      frmNroVia: new FormControl(null),
      frmLocalidadVia: new FormControl(null),
      frmFechaVia: new FormControl(null),
      frmCargoVia: new FormControl(null),
      frmComboReferenciaVia: new FormControl(null),
      frmReferenciaVia: new FormControl(null),
      frmGastoVia: new FormControl(null),
      frmDetalleVia: new FormControl(null),
      frmMontoVia: new FormControl(null),
      frmFechaDetalleVia: new FormControl(null),
      frmObsViatico: new FormControl(null)
     });

  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }
  selectFile(event) {  
    this.selectedFiles = true;
    this.fileUpload = event.target.files[0];
    this.archivo = event.target.files[0].name;
  }

  cargarCombosFormulario() {
    this.itemComboService.ObtenerMesADeclarar().subscribe(dataItem => {
      this.dataItemMes = Object.assign({
        mesesDeclarar: dataItem.response
      });
    });

    this.itemComboService.ObtenerRubroProyecto().subscribe(dataItem => {
      this.dataItemRubro = Object.assign({
        rubros: dataItem.response
      });
    });

   
    this.itemComboService.ObtenerComprobantes().subscribe(dataItem => {
      this.dataItemTipoComprobante = Object.assign({
        tipoComprobantes: dataItem.response
      });
    });

    this.itemComboService.listarDepartamentos().subscribe(dataItem => {
      this.dataItemDepartamento = Object.assign({
        departamentos: dataItem.response
      });
    });

    this.itemComboService.listarcargosNe().subscribe(dataItem => {
      this.dataItemCargoNE = Object.assign({
        cargosNE: dataItem.response
      });
    });
    this.itemComboService.listarReferencias().subscribe(dataItem => {
      this.dataItemReferencia = Object.assign({
        referencias: dataItem.response
      });
    });
    this.itemComboService.listarGastos().subscribe(dataItem => {
      this.dataItemGasto = Object.assign({
        gastos: dataItem.response
      });
    });
 } 

 wsSunatRuc() {
  debugger;
  let numero = this.formularioComprobanteGrp.get('frmNumRuc').value;
  if (numero && numero.length == 11) {
   
            this.trabajadorService.obtenerDataWsSunat(numero).subscribe(
              (wsResponseSunat: Sunat) => {
                if (wsResponseSunat.mensaje == 'OK') {
                  this.spinner.hide()
                  this.formularioComprobanteGrp.controls['frmEstado'].setValue(wsResponseSunat.sunat.estado);
                  this.formularioComprobanteGrp.controls['frmCondicion'].setValue(wsResponseSunat.sunat.esHabido?"HABIDO":"NO  HABIDO");
                  this.formularioComprobanteGrp.controls['frmRazonSocial'].setValue(wsResponseSunat.sunat.razonSocial);
                } else if (wsResponseSunat.retorno == '01') {
                  this.rptaMensaje('El número de RUC no existe.');
                  this.formularioComprobanteGrp.get('frmEstado').reset();
                  this.formularioComprobanteGrp.get('frmCondicion').reset();
                  this.formularioComprobanteGrp.get('frmRazonSocial').reset();
                }
              },
              error => {
                console.error(error);
                this.spinner.hide()
              }
            );

  }else{
    this.rptaMensaje('Numero de digitos inválido. Favor de ingresar un numero de 11 dígitos');
    this.formularioComprobanteGrp.get('frmEstado').reset();
    this.formularioComprobanteGrp.get('frmCondicion').reset();
    this.formularioComprobanteGrp.get('frmRazonSocial').reset();
  }
}

rptaMensaje(mensaje){
  this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
    width: '400px',
    disableClose: true,
    data: {
      message: mensaje,
      alerta: true,
      confirmacion: false
    }
  });
}



  guardar(){
    console.log("guardar");
  }

  agregarViatico(){
    console.log("agregar Viatico");
  }
  
  cargarTabla() {
     this.columnas = [ 'colGasto','colDetalle','colMonto','colFecha','acciones']; 
 
    //const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');
     this.gestionPreliquidacionService.gastosViaticos(
       this.pagina,
       this.cantidad
     ).subscribe(({response, total}) => {
       const filas = [];
        response.forEach(p => filas.push(  p    ));
      this.dataSource = filas;
       this.total = total;
     });
   }

   listarProvincias(idDepartamento: number) {
    this.itemComboService.listarProvincias(idDepartamento).subscribe(dataItem => {
      this.dataItemProvincia = Object.assign({
        provincias: dataItem.response
      });
    });
  }

  listarDistritos(idProvincia: number) {
    this.itemComboService.listarDistritos(idProvincia).subscribe(data => {
      this.dataItemDistrito = Object.assign({
        distritos: data.response
      });
      
    });
  }

  listarLocalidades(idDistrito: number) {
    this.itemComboService.listarLocalidades(idDistrito).subscribe(data => {
      this.dataItemLocalidad = Object.assign({
        localidades: data.response
      });
      
    });
  }

  habilitarReferencia(id: number) {
    if(id==4){
      this.formularioViaticosGrp.get('frmReferenciaVia').enable();
    }else{
      this.formularioViaticosGrp.get('frmReferenciaVia').reset();
      this.formularioViaticosGrp.get('frmReferenciaVia').disable();
    }
    
  }


}
