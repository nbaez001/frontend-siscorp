import {Component, ChangeDetectionStrategy, OnDestroy, Inject, OnInit } from '@angular/core';
import {MatTreeNestedDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject} from 'rxjs'
import { TreeItem } from '../../../../entities/tree.item';
import { ExcelVisualizarResponse, WsResponseExcelVisualizarResponse } from '../../../../dto/response/ExcelVisualizarResponse';
import { ProyectoService } from '../../../../services/proyecto.service';
import { MENSAJES } from 'app/common';
import { isProceduralRenderer } from '@angular/core/src/render3/interfaces/renderer';
import { WsResponseExcelPresupuestoHijoResponse, ExcelPresupuestoHijoResponse } from '../../../../dto/response/ExcelPresupuestoHijoResponse';
import { WsResponseExcelPartidaHijoResponse, ExcelPartidaHijoResponse } from '../../../../dto/response/ExcelPartidaHijoResponse';
import { TreeItemPartidaHijo } from '../../../../entities/TreeItemPartidaHijo';
import { TreeItemPartidaHijoAux } from '../../../../entities/TreeItemPartidaHijoAux';
import { WsResponseExcelPartidaHijoCategoriaResponse, ExcelPartidaHijoCategoriaResponse } from '../../../../dto/response/ExcelPartidaHijoCategoriaResponse';
import { WsResponseExcelPartidaCategoriaInsumoHijoResponse, ExcelPartidaCategoriaInsumoHijoResponse } from '../../../../dto/response/ExcelPartidaCategoriaInsumoHijoResponse';

@Component({
  selector: 'app-analisis-precio-unitario-final',
  templateUrl: './analisis-precio-unitario-final.component.html',
  styleUrls: ['./analisis-precio-unitario-final.component.scss']
})
export class AnalisisPrecioUnitarioFinalComponent implements OnInit {


  dataArchivo: any;
  dataRecibida: any;
  dataArchivoCabecera: any;
  treee1: TreeItemPartidaHijo;

  arrayTree: TreeItemPartidaHijo[];
  mensaje: any;
  excelPartidaHijoResponse: ExcelPartidaHijoResponse[];
  excelPartidaHijoCategoriaResponse:  ExcelPartidaHijoCategoriaResponse[];
  excelPartidaHijoInsumoResponse: ExcelPartidaCategoriaInsumoHijoResponse[];
  hijos: ExcelVisualizarResponse[];
  codPresupuesto: string;
  descPresupuesto: string;
  cliente: string;
  fechaPresupuesto: string;
  lugar: string;

  constructor(public dialogRef: MatDialogRef<AnalisisPrecioUnitarioFinalComponent>,
    private dialog: MatDialog, 
    private proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA)
    data: DatosArchivo) {
      
    this.treeSource = new MatTreeNestedDataSource<TreeItemPartidaHijo>();  
    console.log(data);
    console.log(data.archivoExcelPartida.presupuestoDetalle);

    this.dataRecibida = data;
    this.dataArchivoCabecera =  data.archivoExcelPartida.presupuestoCabecera;
    this.dataArchivo = data.archivoExcelPartida.presupuestoDetalle;

    // this dataSource is not required but its rly. helpfull to think reactive
    this.dataSource$ = new BehaviorSubject<TreeItemPartidaHijo[]>([]);
    this.dataSource$.subscribe(items => {
      this.treeSource.data = null;
      this.treeSource.data = items;
    });

    this.initData();

    //data.archivoExcelPartida.presupuestoCabecera.costo;   
    data.archivoExcelPartida.presupuestoCabecera.codigoPresupuesto;
    data.archivoExcelPartida.presupuestoCabecera.nombreProyecto;
    data.archivoExcelPartida.presupuestoCabecera.cliente;
    data.archivoExcelPartida.presupuestoCabecera.lugarProyecto;
    data.archivoExcelPartida.presupuestoCabecera.costo;


  }

  ngOnInit(): void {
    this.codPresupuesto = this.dataArchivoCabecera.codigoPresupuesto;
    //this.descPresupuesto = this.dataArchivoCabecera.descPresupuesto;
    this.descPresupuesto = "CREACION DEL CENTRO DE SERVICIOS - TAMBO EN EL CENTRO POBLADO QUILLE - OMACHA - PARURO - CUSCO";
    this.cliente = this.dataArchivoCabecera.cliente;
    this.fechaPresupuesto = this.dataArchivoCabecera.costo;
    this.lugar= this.dataArchivoCabecera.lugarProyecto;
  }

  


  /** dummy for getting unique ids */
  private static _id = 0;

  //visualizarArchivoExcelPresupuestoFinalHijos
  
  /** tree source stuff */
  readonly dataSource$: BehaviorSubject<TreeItemPartidaHijo[]>;
  readonly treeSource: MatTreeNestedDataSource<TreeItemPartidaHijo>;
  /** tree control */
  readonly treeControl = new NestedTreeControl<TreeItemPartidaHijo>(node => node.children );

  readonly hasChild = (_: number, node: TreeItemPartidaHijo) => !!node.children && node.children.length > 0;

  readonly trackBy = (_: number, node: TreeItemPartidaHijo) => node.id;

  /** destroy */
  ngOnDestroy() {
    this.dataSource$.complete();
  }




  /** init tree data */
  initData() {

    for(let i = 0; i <this.dataArchivo.length; i++){
      const roleNode  = this._createTreeItem( 0, this.dataArchivo[i].codigoItem, this.dataArchivo[i].descripcion , 
                                              this.dataArchivo[i].unidad, this.dataArchivo[i].metrado ,
                                              this.dataArchivo[i].precio, this.dataArchivo[i].parcial ,
                                              this.dataArchivo[i].idPadre, this.dataArchivo[i].nivel, this.dataArchivo[i].cantidadHijo,
                                             "", "", "", "", "", "", "", "",
                                             0,"",0,"","","","","","","","","","","","","","","", "SubPresupuesto", ""
                                              );


      if(i==0){
        this.arrayTree = [roleNode];
      }else{
        this.arrayTree.push(roleNode);
      }
    }

    this.dataArchivo.forEach(element => {
      element.id = 1;
    });

    this.dataSource$.next(this.arrayTree)
  }

  /** add */
  add(node?: TreeItemPartidaHijo) {
    console.log(node);
    console.log(node.children);
    
   if(node.children.length == 0){

    if(node.idPadre > 0){

    this.proyectoService.visualizarArchivoExcelPartidaFinalHijoPartida(this.dataRecibida.fidProyecto, node.idPadre)
    .subscribe(
      (wsResponseExcelPartidaHijoResponse : WsResponseExcelPartidaHijoResponse)=> {
        
        if(wsResponseExcelPartidaHijoResponse.codResultado == 1){       
          this.excelPartidaHijoResponse = (wsResponseExcelPartidaHijoResponse.response != null) ? wsResponseExcelPartidaHijoResponse.response : [];         
          this.agregarHijos(node, this.excelPartidaHijoResponse);
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.info(this.mensaje);
          //this.openDialogMensaje(null,  wsResponseExcelVisualizarResponse.msgResultado, true, false, wsResponseExcelVisualizarResponse.codResultado);
        }
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(error);
      }   
    ); 
    }else if(node.idCodigo !== "" && node.idPadre == 0 && (typeof node.idCategoria === "undefined" || node.idCategoria === 0)){

    this.proyectoService.visualizarArchivoExcelPartidaFinalHijoCategoria(Number(node.idCodigo))
      .subscribe(
      (wsResponseExcelPartidaHijoCategoriaResponse : WsResponseExcelPartidaHijoCategoriaResponse)=> {
        
        if(wsResponseExcelPartidaHijoCategoriaResponse.codResultado == 1){       
          this.excelPartidaHijoCategoriaResponse = (wsResponseExcelPartidaHijoCategoriaResponse.response != null) ? wsResponseExcelPartidaHijoCategoriaResponse.response : [];         
          this.agregarHijosCategoria(node, this.excelPartidaHijoCategoriaResponse);
        }else{
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          console.info(this.mensaje);
          //this.openDialogMensaje(null,  wsResponseExcelVisualizarResponse.msgResultado, true, false, wsResponseExcelVisualizarResponse.codResultado);
        }
      },
      error => {
        this.mensaje = MENSAJES.ERROR_SERVICIO;
        console.error(error);
      }   
    ); 
    }else if(node.idCodigo === ""  && typeof node.idCategoria !== "undefined" ){

      this.proyectoService.visualizarArchivoExcelPartidaFinalHijoInsumo(Number(node.idPartida), Number(node.idCategoria))
        .subscribe(
        (wsResponseExcelPartidaCategoriaInsumoHijoResponse : WsResponseExcelPartidaCategoriaInsumoHijoResponse)=> {
          
          if(wsResponseExcelPartidaCategoriaInsumoHijoResponse.codResultado == 1){       
            this.excelPartidaHijoInsumoResponse = (wsResponseExcelPartidaCategoriaInsumoHijoResponse.response != null) ? wsResponseExcelPartidaCategoriaInsumoHijoResponse.response : [];         
            this.agregarHijosCategoriaInsumo(node, this.excelPartidaHijoInsumoResponse);
          }else{
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            console.info(this.mensaje);
            //this.openDialogMensaje(null,  wsResponseExcelVisualizarResponse.msgResultado, true, false, wsResponseExcelVisualizarResponse.codResultado);
          }
        },
        error => {
          this.mensaje = MENSAJES.ERROR_SERVICIO;
          console.error(error);
        }   
      ); 
    }
    
  }
}

  agregarHijos(node?: TreeItemPartidaHijo, hijoItem?: ExcelPartidaHijoResponse[]): void{
    
    for(let i= 0; i < hijoItem.length; i++){
      //if(i == 0){
        AnalisisPrecioUnitarioFinalComponent._id = node.id + 1;
      //}
      const newItem = this._createTreeItem(AnalisisPrecioUnitarioFinalComponent._id,  "", "", "","", "", "", 0, "",  hijoItem[i].cantidadHijo, 
        hijoItem[i].idCodigo, hijoItem[i].codigoPartida, hijoItem[i].nombrePartida  ,hijoItem[i].rendimiento, hijoItem[i].manoObra, hijoItem[i].equipo , 
        hijoItem[i].costoUnitario , hijoItem[i].subTotalPartida, 0,"",0,"","","","","","","","","","","","","","","", "Partida", "");
                                                                 
                                                            
      // add as child
      if (node) {
        node.children = [...(node.children || []), newItem];
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
        }
      }

      this.dataSource$.next(this.dataSource$.value);
        
    }
  }

  agregarHijosCategoria(node?: TreeItemPartidaHijo, hijoItem?: ExcelPartidaHijoCategoriaResponse[]): void{
    

    const newItem = this._createTreeItem(5,  "", "", "","", "", "", 0, "",  0, 
        "","", "", "", "", "", "", "", 0,  "",  0, "CÓDIGO", "DESCRIPCIÓN RECURSO", "UNID.", "CUADRILLAS", "CANTIDAD", "PRECIO S/.", "PARCIAL S/.");

      // add as child
      if (node) {
        node.children = [...(node.children || []), newItem];
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
        }
      }

      this.dataSource$.next(this.dataSource$.value);
    for(let i= 0; i < hijoItem.length; i++){

      AnalisisPrecioUnitarioFinalComponent._id = node.id + 1;

      const newItem = this._createTreeItem(AnalisisPrecioUnitarioFinalComponent._id,  "", "", "","", "", "", 0, "",  hijoItem[i].cantidadHijo, 
        "","", "", "", "", "", "", "",hijoItem[i].idCategoria,  hijoItem[i].nombrecategoria,  hijoItem[i].idPartida);

      // add as child
      if (node) {
        node.children = [...(node.children || []), newItem];
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
        }
      }

      this.dataSource$.next(this.dataSource$.value);
        
    }
  }



  agregarHijosCategoriaInsumo(node?: TreeItemPartidaHijo, hijoItem?: ExcelPartidaCategoriaInsumoHijoResponse[]): void{
    

    for(let i= 0; i < hijoItem.length; i++){
      let cont = hijoItem[i].unidad = 'MET';
      AnalisisPrecioUnitarioFinalComponent._id = node.id + 1;

      const newItem = this._createTreeItem(AnalisisPrecioUnitarioFinalComponent._id,  "", "", "","", "", "", 0, "",  hijoItem[i].cantidadHijo, 
        "","", "", "", "", "", "", "", 0, "", 0,"","", "", "", "", "", "", hijoItem[i].codigoPartida, hijoItem[i].descripcionInsumo, hijoItem[i].categoriaInsumo, cont
                                               , hijoItem[i].cuadrilla, hijoItem[i].cantidad, hijoItem[i].precio, hijoItem[i].parcial);

      // add as child
      if (node) {
        node.children = [...(node.children || []), newItem];
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
        }
      }

      this.dataSource$.next(this.dataSource$.value);
        
    }
  }

  /** toggle node */
  toggleNode(node: TreeItemPartidaHijo) {
    this.treeControl.toggle(node);
  }

  /** creates a new tree item */
  private _createTreeItem(id: number, name: string, descripcion: string, 
                          unidad: string, metrado: string, 
                          precio: string, parcial: string,
                          idPadre: number,  nivel: string, cantidadHijo: number,
                          idCodigo: string, codigoPartida: string, 
                          nombrePartida: string, rendimiento: string, 
                          manoObra: string, equipo: string,
                          costoUnitario: string,  subTotalPartida: string,
                          idCategoria?: number,
                          nombrecategoria?: string,
                          idPartida?: number,
                          codigoHeader?: string, descripcionHeader?: string,
                          unidadHeader?: string, cuadrillaHeader?: string,
                          cantidadHeader?: string, precioHeader?: string, 
                          parcialHeader?: string, 
                          codigoPartidaDet?: string, descripcionInsumoDet?: string, categoriaInsumoDet?: string, unidadDet?: string,
                          cuadrillaDet?: string, cantidadDet?: string, precioDet?: string, parcialDet?: string,
                          nombreSubPresupuestoLabel?: string, nombrePartidaLabel?: string,
                          ...children: TreeItemPartidaHijo[]): TreeItemPartidaHijo {
    return { 
      id: id,
      name: name,
      descripcion: descripcion,
      unidad: unidad,
			metrado: metrado,
			precio: precio,
			parcial: parcial,
			idPadre: idPadre,
      cantidadHijo: cantidadHijo,
      nivel: nivel,
      idCodigo: idCodigo,
      codigoPartida: codigoPartida,
      nombrePartida: nombrePartida,
			rendimiento: rendimiento,
			manoObra: manoObra,
			equipo: equipo,
			costoUnitario: costoUnitario,
      subTotalPartida: subTotalPartida,
      idCategoria: idCategoria,
      nombrecategoria: nombrecategoria,
      idPartida: idPartida,
      codigoHeader: codigoHeader,
      descripcionHeader: descripcionHeader,
      unidadHeader: unidadHeader,
      cuadrillaHeader: cuadrillaHeader,

      cantidadHeader: cantidadHeader,
      precioHeader: precioHeader,
      parcialHeader: parcialHeader,
      codigoPartidaDet: codigoPartidaDet,
      descripcionInsumoDet: descripcionInsumoDet,
      categoriaInsumoDet: categoriaInsumoDet,
      unidadDet: unidadDet,
      cuadrillaDet: cuadrillaDet,
      cantidadDet: cantidadDet,
      precioDet: precioDet,
      parcialDet: parcialDet,

      nombreSubPresupuestoLabel: nombreSubPresupuestoLabel,
      nombrePartidaLabel: nombrePartidaLabel,
      children: children
    };
  }


/*   private _createTreeItemHijo(id: number,
    idCodigo: string, codigoPartida: string, 
    nombrePartida: string, rendimiento: string, 
    manoObra: string, equipo: string,
    costoUnitario: string,  subTotalPartida: string,
    ...children: TreeItemPartidaHijoAux[]): TreeItemPartidaHijoAux {
      return {
      id: id,
      idCodigo: idCodigo,
      codigoPartida: codigoPartida,
      nombrePartida: nombrePartida,
      rendimiento: rendimiento,
      manoObra: manoObra,
      equipo: equipo,
      costoUnitario: costoUnitario,
      subTotalPartida: subTotalPartida,
      children: children

      };
    } */
}


interface DatosArchivo {
  fidProyecto: number;
  archivoExcelPartida: ExcelVisualizarResponse;
  idCodigoArchivo: number;
  estadoCarga: string;
}

