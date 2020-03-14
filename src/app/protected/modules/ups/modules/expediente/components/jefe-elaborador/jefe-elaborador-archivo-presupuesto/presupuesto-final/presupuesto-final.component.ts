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


@Component({
  selector: 'app-presupuesto-final',
  templateUrl: './presupuesto-final.component.html',
  styleUrls: ['./presupuesto-final.component.scss']
})
export class PresupuestoFinalComponent implements OnInit {


  dataArchivo: any;
  dataRecibida: any;
  treee1: TreeItem;

  arrayTree: TreeItem[];
  mensaje: any;
  excelPresupuestoHijoResponse: ExcelPresupuestoHijoResponse[];
  hijos: ExcelVisualizarResponse[];
  codPresupuesto: string;
  cliente: string;
  fechaPresupuesto: string;
  lugar: string;

  constructor(public dialogRef: MatDialogRef<PresupuestoFinalComponent>,
    private dialog: MatDialog, 
    private proyectoService: ProyectoService,
    @Inject(MAT_DIALOG_DATA)
    data: DatosArchivo) {
      
    this.treeSource = new MatTreeNestedDataSource<TreeItem>();  
    console.log(data);
    console.log(data.archivoExcel.presupuestoDetalle);

    this.dataRecibida = data;
    this.dataArchivo = data.archivoExcel.presupuestoDetalle;

    // this dataSource is not required but its rly. helpfull to think reactive
    this.dataSource$ = new BehaviorSubject<TreeItem[]>([]);
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

  //visualizarArchivoExcelPresupuestoFinalHijos
  
  /** tree source stuff */
  readonly dataSource$: BehaviorSubject<TreeItem[]>;
  readonly treeSource: MatTreeNestedDataSource<TreeItem>;
  /** tree control */
  readonly treeControl = new NestedTreeControl<TreeItem>(node => node.children );

  readonly hasChild = (_: number, node: TreeItem) => !!node.children && node.children.length > 0;

  readonly trackBy = (_: number, node: TreeItem) => node.id;

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
                                              this.dataArchivo[i].idPadre, this.dataArchivo[i].nivel, this.dataArchivo[i].cantidadHijo);
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
  add(node?: TreeItem) {
    console.log(node);
    console.log(node.children);
   if(node.children.length == 0){

    this.proyectoService.visualizarArchivoExcelPresupuestoFinalHijos(this.dataRecibida.fidProyecto, node.idPadre, node.nivel)
    .subscribe(
      (wsResponseExcelPresupuestoHijoResponse : WsResponseExcelPresupuestoHijoResponse)=> {
        
        if(wsResponseExcelPresupuestoHijoResponse.codResultado == 1){
          
          this.excelPresupuestoHijoResponse = (wsResponseExcelPresupuestoHijoResponse.response != null) ? wsResponseExcelPresupuestoHijoResponse.response : [];         
          this.agregarHijos(node, this.excelPresupuestoHijoResponse);
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

  agregarHijos(node?: TreeItem, hijoItem?: ExcelPresupuestoHijoResponse[]): void{
    
    for(let i= 0; i < hijoItem.length; i++){
      //if(i == 0){
        PresupuestoFinalComponent._id = node.id + 1;
      //}
      const newItem = this._createTreeItem(PresupuestoFinalComponent._id, hijoItem[i].codigoItem, hijoItem[i].descripcion , hijoItem[i].unidad  ,hijoItem[i].metrado,
                                           hijoItem[i].precio, hijoItem[i].parcial , hijoItem[i].idPadre , hijoItem[i].nivel,  hijoItem[i].cantidadHijo);

      // add as child
      if (node) {
        node.children = [...(node.children || []), newItem];
        if (!this.treeControl.isExpanded(node)) {
          this.treeControl.expand(node);
        }
      }
      // add to root
    /*   else {
        this.dataSource$.next([
          ...this.dataSource$.value,
          newItem
        ]);
      } */
      this.dataSource$.next(this.dataSource$.value);
        
    }
  }

  /** toggle node */
  toggleNode(node: TreeItem) {
    this.treeControl.toggle(node);
  }

  /** creates a new tree item */
  private _createTreeItem(id: number, name: string, descripcion: string, 
                          unidad: string, metrado: string, 
                          precio: string, parcial: string,
                          idPadre: number,  nivel: string, cantidadHijo: number,
                          ...children: TreeItem[]): TreeItem {
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
      children: children
    };
  }



}


interface DatosArchivo {
  fidProyecto: number;
  archivoExcel: ExcelVisualizarResponse;
  idCodigoArchivo: number;
  estadoCarga: string;
}

