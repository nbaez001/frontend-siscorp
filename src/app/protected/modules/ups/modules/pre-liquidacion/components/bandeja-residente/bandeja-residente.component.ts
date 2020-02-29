import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Proyecto, WsResponseProyecto } from '../../dto/response/Proyecto';
//import { AuthService } from 'app/public/services/auth.service';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';
import { GestionPreliquidacionService } from '../../services/gestion-preliquidacion.services';
import { P } from '@angular/cdk/keycodes';
import { ItemComboService } from '../../services/item-combo.service';
import { ItemBean } from '../../dto/response/ItemBean';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bandeja-residente',
  templateUrl: './bandeja-residente.component.html',
  styleUrls: ['./bandeja-residente.component.scss']
})
export class BandejaResidenteComponent implements OnInit {

  filtrosForm: FormGroup;
 
  estados: any[];
  dataItemEstado: ItemBean;
  
  columnas: string[] = [];
  dataSource2: Proyecto[] = []; //tabla jimy
  dataSource: MatTableDataSource<Proyecto>;// Tabla ROCA
  pagina = 1;
  cantidad = 10;
  total = 0;
  
  proyectoResponse : Proyecto[];
  isLoading: boolean;
  mensaje: string;
  disableBuscar: boolean;

  formulario: FormGroup;

  constructor( 
    private authService: AuthService,
    private gestionPreliquidacionService: GestionPreliquidacionService,// ProyectoEjecucionService,
    private itemComboService: ItemComboService,
    private router: Router
    ) {
   // this.dataSource = new MatTableDataSource([]);
   }

  ngOnInit() {
    this.tituloBandejaProyecto();
    this.crearFiltrosForm();
    this.cargarDataEstado() ;
    this.generarCabeceraColumnasEncargado();
    this.cargarBandejaR();//carga la bandeja roca
    this.cargarBandejaJ(); //carga la bandeja jimy
  }

  
  tituloBandejaProyecto() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PROYECTO.TITLE_BANDEJA_PROYECTO,
      icono: ''
    });
  }

  crearFiltrosForm() {
    this.filtrosForm = new FormGroup({
      codDocFrmCtrl: new FormControl('convenio 001', [
        Validators.required,
        Validators.minLength(3)
      ]), 
      desProyectoFrmCtrl: new FormControl("78"),
      fechaRegDesdeFrmCtrl: new FormControl(null),
      fechaRegHastaFrmCtrl: new FormControl(null),
      estadoFrmCtrl: new FormControl(null)
    });
  }

  cargarDataEstado() {
    this.itemComboService.ObtenerEstadoProyecto().subscribe(dataItem => {
      this.dataItemEstado = Object.assign({
        estados: dataItem.response
      });
    });
  } 

  /* 
  get codDocFrmCtrl() { return this.filtrosForm.get('codDocFrmCtrl'); }
  get desProyectoFrmCtrl(){ return this.filtrosForm.get('desProyectoFrmCtrl');}
  get fechaRegDesdeFrmCtrl() { return this.filtrosForm.get('fechaRegDesdeFrmCtrl'); }
  get fechaRegHastaFrmCtrl() { return this.filtrosForm.get('fechaRegHastaFrmCtrl'); }
  get estadoFrmCtrl() { return this.filtrosForm.get('estadoFrmCtrl'); }
*/
  generarCabeceraColumnasEncargado(): void{
    this.columnas = [
      'colNro','colConvenio','colDescripcion','colTiempo','colFechaInicio',
      'colFechaFin','colFechaActualizacion','colSupervisor','colEstado','colDiasTrans','acciones']; 
  }

  
  cargarBandejaJ() {
    //const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');
    this.gestionPreliquidacionService.proyectoPreliquidacionFiltros(
      this.pagina,
      this.cantidad,
      null
    ).subscribe(({response, total}) => {
      const filas = [];
      console.log(total);
       response.forEach(p => filas.push(
        p/*,
        {  item: p.item,
          codigo: p.codigo,
          nroConvenio: p.nroConvenio,
          descripcion: p.descripcion,
          tiempoEjecucion: p.tiempoEjecucion,
          fecInicioEjecucion: p.fecInicioEjecucion,
          fecFinEjecucion: p.fecFinEjecucion,
          fecUltimaActualizacion: p.fecUltimaActualizacion,
          supervisor: p.supervisor,
          estado: p.estado,
          cidEstado: p.cidEstado,
          numPlazo: p.numPlazo,
          color: p.color,
          fecAutorizacion: p.fecAutorizacion,
          montoConvenio: p.montoConvenio,
          montoAcumulado: p.montoAcumulado,
          saldoDisponible: p.saldoDisponible,
          fidProyecto: p.fidProyecto

        }*/
      ));
     this.dataSource2 = filas;
      this.total = total;
    });
  }

  
  public cargarBandejaR() : void{
    this.dataSource = null;
    this.gestionPreliquidacionService.proyectoPreliquidacionFiltros(this.pagina,this.cantidad,null)
    .subscribe(
      (wsResponseProyecto : WsResponseProyecto)=> {
        if(wsResponseProyecto.codResultado == 1){
          this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
          this.total = (wsResponseProyecto.total!=0)? wsResponseProyecto.total : 0;
          this.cargarBandejaPrincipal();
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
        }
        this.isLoading = false;
        this.disableBuscar = false;
      },
      error => {
        console.error(error);
      }   
    ); 
  }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  public cargarBandejaPrincipal(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  verComprobantes(idProyecto: number): void{    
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/pre-liquidacion/comprobante', {idProy: idProyectoEncriptado}]);
  }

  
  generarInformePreliquidacion(idProyecto: number): void{    
    let idProyectoEncriptado = btoa(idProyecto+""); 
    this.router.navigate(['/ups/pre-liquidacion/informe-preliquidacion', {idProy: idProyectoEncriptado}]);
  }

  verValorizacionAvance(idProyecto: number): void{  
  let idProyectoEncriptado = btoa(idProyecto+""); 
  this.router.navigate(['/ups/pre-liquidacion/valorizacion-avance', {idProy: idProyectoEncriptado}]);
}



verResumenMovimiento(idProyecto: number): void{  
  let idProyectoEncriptado = btoa(idProyecto+""); 
  this.router.navigate(['/ups/pre-liquidacion/resumen-mov-almacen', {idProy: idProyectoEncriptado}]);
}

registrarComprobantes(idProyecto: number): void{    
  let idProyectoEncriptado = btoa(idProyecto+""); 
  this.router.navigate(['/ups/pre-liquidacion/registrar-comprobante', {idProy: idProyectoEncriptado}]);
}

  buscar(): void{
   console.log("buscar");
  }

  reiniciar(): void{
    console.log("reiniciar");
   }


  
}
