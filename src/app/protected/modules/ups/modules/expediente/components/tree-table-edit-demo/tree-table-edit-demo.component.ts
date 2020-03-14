import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../services/node.service';

@Component({
  selector: 'app-tree-table-edit-demo',
  templateUrl: './tree-table-edit-demo.component.html',
  styleUrls: [ './tree-table-edit-demo.component.scss' ]
})
export class TreeTableEditDemoComponent implements OnInit {

  files: TreeNode[];

  totalRecords: number;
  loading: boolean;

  columna: any[];
  Frozencolumna: any[];
  Scrollcolumna: any[];
  
  selectedNodes: TreeNode[];

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    this.loading = true;
    this.Frozencolumna = [
      { field: 'item', header: 'Item' },
      { field: 'descripcion', header: 'Descripción' }
    ];

    this.Scrollcolumna = [
      { field: 'und', header: 'Unidad' },
      { field: 'cuadrilla', header: 'Cuadrilla' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'preciounitario', header: 'Precio Unitario' },
      { field: 'parcialunitario', header: 'Parcial Unitario' },
      { field: 'metrado', header: 'Metrado' },
      { field: 'precio', header: 'Precio' },
      { field: 'parcial', header: 'Parcial' },

      { field: 'metrado1', header: 'metrado1' },
      { field: 'soles1', header: 'soles1' },
      { field: 'porcentaje1', header: 'porcentaje1' },
      
      { field: 'metrado2', header: 'metrado2' },
      { field: 'soles2', header: 'soles2' },
      { field: 'porcentaje2', header: 'porcentaje2' },

      { field: 'metrado3', header: 'metrado3' },
      { field: 'soles3', header: 'soles3' },
      { field: 'porcentaje3', header: 'porcentaje3' },
      
      { field: 'metrado4', header: 'metrado4' },
      { field: 'soles4', header: 'soles4' },
      { field: 'porcentaje4', header: 'porcentaje4' }
     
    ];

  }

  cargaCronogramaPadre(event) {
    this.loading = true;
    this.nodeService.getCronoPadre().then(response => {
      this.totalRecords = 3;

      this.files = [];
      response.forEach(f => {
        let node = {
          data: {
            item: f.data.item,
            descripcion: f.data.descripcion,
            und: f.data.und,
            cuadrilla: f.data.cuadrilla,
            cantidad: f.data.cantidad,
            preciounitario: f.data.preciounitario,
            parcialunitario: f.data.parcialunitario,
            metrado: f.data.metrado,
            precio: f.data.precio,
            parcial: f.data.parcial,
            metrado1: f.data.metrado1,
            soles1: f.data.soles1,
            porcentaje1: f.data.porcentaje1,
            metrado2: f.data.metrado2,
            soles2: f.data.soles2,
            porcentaje2: f.data.porcentaje2,
            metrado3: f.data.metrado3,
            soles3: f.data.soles3,
            porcentaje3: f.data.porcentaje3,
            metrado4: f.data.metrado4,
            soles4: f.data.soles4,
            porcentaje4: f.data.porcentaje4
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
    this.nodeService.getCronoHijo().then(response => {
      node.children = response;
      this.files = [...this.files];
      this.loading = false;
    });
  }

  editar(event: { field: string, data: any }): void {
    // console.log(event.field);
    console.log(event.data);
  }

  selecciona(event): void {
    console.log(this.selectedNodes);
  }
  
  onMouseEnter(rowData): void {
    rowData.hover = true;
  }

  onMouseLeave(rowData): void {
    rowData.hover = false;
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