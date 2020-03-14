import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../services/node.service';

@Component({
  selector: 'app-tree-table-insumo-demo',
  templateUrl: './tree-table-insumo-demo.component.html',
  styleUrls: ['./tree-table-insumo-demo.component.scss']
})
export class TreeTableInsumoDemoComponent implements OnInit {

  files: TreeNode[];

  totalRecords: number;
  loading: boolean;

  columna: any[];
  Frozencolumna: any[];
  Scrollcolumna: any[];

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    this.loading = true;
    this.Frozencolumna = [
      { field: 'item', header: 'Recurso' }
    ];
    this.Scrollcolumna = [
      { field: 'unidad', header: 'Unidad' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'precio', header: 'Precio' },
      { field: 'parcial', header: 'Parcial' },

      { field: 'metrado1', header: 'metrado1' },
      { field: 'costo1', header: 'costo1' },
      
      { field: 'metrado2', header: 'metrado2' },
      { field: 'costo2', header: 'costo2' },

      { field: 'metrado3', header: 'metrado3' },
      { field: 'costo3', header: 'costo3' },
      
      { field: 'metrado4', header: 'metrado4' },
      { field: 'costo4', header: 'costo4' }
     
    ];
  }

  cargaInsumoPadre(event) {
    this.loading = true;
    this.nodeService.getInsumoPadre(1).then(response => {
      this.totalRecords = 3;

      this.files = [];
      response.forEach(f => {
        let node = {
          data: {
            item: f.data.item,
            recurso: f.data.recurso,
            unidad: f.data.unidad,
            cantidad: f.data.cantidad,
            precio: f.data.precio,
            parcial: f.data.parcial,
            metrado1: f.data.metrado1,
            costo1: f.data.costo1,
            metrado2: f.data.metrado2,
            costo2: f.data.costo2,
            metrado3: f.data.metrado3,
            costo3: f.data.costo3,
            metrado4: f.data.metrado4,
            costo4: f.data.costo4,
          },
          leaf: f.leaf
        };
        this.files.push(node);
      });
      this.loading = false;
    });
  }

  cargaInsumoHijo(event) {
    //Obtienes valor del nodo seleccionado
    console.log(event.node.data);

    this.loading = true;
    const node = event.node;
    this.nodeService.getInsumoHijo().then(response => {
      node.children = response;
      this.files = [...this.files];
      this.loading = false;
    });
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