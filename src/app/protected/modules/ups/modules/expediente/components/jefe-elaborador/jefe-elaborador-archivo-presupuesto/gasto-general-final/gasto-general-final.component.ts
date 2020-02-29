import {Component, ChangeDetectionStrategy, OnDestroy, Inject, OnInit } from '@angular/core';
import {MatTreeNestedDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject} from 'rxjs'
import { ExcelVisualizarResponse } from '../../../../dto/response/ExcelVisualizarResponse';
import { ProyectoService } from '../../../../services/proyecto.service';
import { MENSAJES } from 'app/common';
import { ExcelGeneralVisualizarResponse } from '../../../../dto/response/ExcelGeneralVisualizarResponse';
import { ExcelGastoGeneralHijoResponse, WsResponseExcelGastoGeneralHijoResponse } from '../../../../dto/response/ExcelGastoGeneralHijoResponse';
import { TreeItemGastoGeneral } from '../../../../entities/TreeItemGastoGeneral';


@Component({
  selector: 'app-gasto-general-final',
  templateUrl: './gasto-general-final.component.html',
  styleUrls: ['./gasto-general-final.component.scss']
})
export class GastoGeneralFinalComponent implements OnInit {
  dataArchivo: any;
  dataRecibida: any;
  treee1: TreeItemGastoGeneral;

  arrayTree: TreeItemGastoGeneral[];
  mensaje: any;
  excelGeneralHijoResponse: ExcelGastoGeneralHijoResponse[];
  hijos: ExcelVisualizarResponse[];
  codPresupuesto: string;
  cliente: string;
  fechaPresupuesto: string;
  lugar: string;

  constructor(public dialogRef: MatDialogRef<GastoGeneralFinalComponent>,
    private dialog: MatDialog, 
    private proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA)
    data: DatosArchivo) {
      
    this.treeSource = new MatTreeNestedDataSource<TreeItemGastoGeneral>();  
    console.log(data);
    console.log(data.archivoExcelGastoGeneral.gastoGeneralDetalle);

    this.dataRecibida = data;
    this.dataArchivo = data.archivoExcelGastoGeneral.gastoGeneralDetalle;

    // this dataSource is not required but its rly. helpfull to think reactive
    this.dataSource$ = new BehaviorSubject<TreeItemGastoGeneral[]>([]);
    this.dataSource$.subscribe(items => {
      this.treeSource.data = null;
      this.treeSource.data = items;
    });

    this.initData();
  }


  ngOnInit(): void {
    this.codPresupuesto = "0104174";
    this.codPresupuesto= "CREACION DEL CENTRO DE SERVICIOS - TAMBO EN EL CENTRO POBLADO QUILLE - OMACHA - PARURO - CUSCO";
    this.cliente = "MINISTERIO DE VIVIENDA, CONSTRUCCION Y SANEAMIENTO";
    this.fechaPresupuesto = "17/08/2015";
    this.lugar= "CUSCO - PARURO - OMACHA";
  }

  
  /** dummy for getting unique ids */
  private static _id = 0;


  /** tree source stuff */
  readonly dataSource$: BehaviorSubject<TreeItemGastoGeneral[]>;
  readonly treeSource: MatTreeNestedDataSource<TreeItemGastoGeneral>;
  /** tree control */
  readonly treeControl = new NestedTreeControl<TreeItemGastoGeneral>(node => node.children );

  readonly hasChild = (_: number, node: TreeItemGastoGeneral) => !!node.children && node.children.length > 0;

  readonly trackBy = (_: number, node: TreeItemGastoGeneral) => node.id;

  /** destroy */
  ngOnDestroy() {
    this.dataSource$.complete();
  }



  /** init tree data */
  initData() {
    
      //this.treee2 = this._createTreeItemGastoGeneral('Parent 1sss','xxxxxxxxxxxxx');
    //this.arrayTree = [ this.treee1,this.treee2 ];
    //"unidad": "", "metrado": "", "precio": "", "parcial": "89,844.67", "color": "", "idPadre": 40076, "cantidadHijo": 23, "children": null
    for(let i = 0; i <this.dataArchivo.length; i++){
      
      const roleNode  = this._createTreeItem( 0, this.dataArchivo[i].numero, this.dataArchivo[i].descripcion , 
                                              this.dataArchivo[i].unidad, this.dataArchivo[i].cantidadUnidad ,this.dataArchivo[i].costoUnitario ,
                                              this.dataArchivo[i].coefPart, this.dataArchivo[i].parcial , this.dataArchivo[i].subTotal, this.dataArchivo[i].total,
                                              this.dataArchivo[i].idPadre, this.dataArchivo[i].cantidadHijo);
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
  add(node?: TreeItemGastoGeneral) {
    console.log(node);
    console.log(node.children);
   if(node.children.length == 0){
    
    this.proyectoService.visualizarArchivoExcelGeneralFinalHijos(this.dataRecibida.fidProyecto, node.idPadre)
    .subscribe(
      (wsResponseExcelGastoGeneralHijoResponse : WsResponseExcelGastoGeneralHijoResponse)=> {
        
        if(wsResponseExcelGastoGeneralHijoResponse.codResultado == 1){
          
          this.excelGeneralHijoResponse = (wsResponseExcelGastoGeneralHijoResponse.response != null) ? wsResponseExcelGastoGeneralHijoResponse.response : [];         
          this.agregarHijos(node, this.excelGeneralHijoResponse);
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

  agregarHijos(node?: TreeItemGastoGeneral, hijoItem?: ExcelGastoGeneralHijoResponse[]): void{
    
    for(let i= 0; i < hijoItem.length; i++){
      //if(i == 0){
        GastoGeneralFinalComponent._id = node.id + 1;
      //}
      let cont = hijoItem[i].unidad = 'MET';
      const newItem = this._createTreeItem(GastoGeneralFinalComponent._id, hijoItem[i].numero, hijoItem[i].descripcion , cont,
                                            hijoItem[i].cantidadUnidad,hijoItem[i].costoUnitario, hijoItem[i].coefPart , 
                                            hijoItem[i].parcial,hijoItem[i].subTotal, hijoItem[i].total ,
                                            hijoItem[i].idPadre ,hijoItem[i].cantidadHijo);
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
  toggleNode(node: TreeItemGastoGeneral) {
    this.treeControl.toggle(node);
  }

  /** creates a new tree item */
  private _createTreeItem(id: number, numero: string, descripcion: string, 
                          unidad: string, cantidadUnidad: string, costoUnitario: string, coefPart: string, 
                          parcial: string, subTotal: string, total: string,
                          idPadre: number,  cantidadHijo: number,
                          ...children: TreeItemGastoGeneral[]): TreeItemGastoGeneral {
    return {
      id: id,
      numero: numero,
      descripcion: descripcion,
      unidad: unidad,
      cantidadUnidad: cantidadUnidad,
      costoUnitario: costoUnitario,
      coefPart: coefPart,
      parcial: parcial,
      subTotal: subTotal,
			total: total,
			idPadre: idPadre,
      cantidadHijo: cantidadHijo,
      children: children
    };
  }


}


interface DatosArchivo {
  fidProyecto: number;
  archivoExcelGastoGeneral: ExcelGeneralVisualizarResponse;
  idCodigoArchivo: number;
  estadoCarga: string;
}
