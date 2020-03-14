import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatTreeFlatDataSource, MatTreeFlattener, MatTree } from '@angular/material';

import {FlatTreeControl} from '@angular/cdk/tree';

interface FoodNode {
  name: string;
  pertenece: boolean;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Seguridad',
    pertenece: false,
    children: [
      {name: 'Aplicaciones', pertenece: false},
      {name: 'Perfiles', pertenece: false},
      {name: 'Usuarios', pertenece: false},
    ]
  },
  {
    name: 'UPS',
    pertenece: false,
    children: [
      {
        name: 'Gest. Platf.',
        pertenece: true,
        children: [
          {name: 'Registro', pertenece: true},
          {name: 'Resumen', pertenece: true},
        ]
      },
      {
        name: 'Expediente',
        pertenece: false,
        children: [
          {name: 'Bandeja operador', pertenece: false},
          {name: 'Bandeja coordinador', pertenece: false},
        ]
      },
    ]
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'security-perfil-menus',
  templateUrl: './perfil-menus.component.html',
  styleUrls: ['./perfil-menus.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerfilMenusComponent implements OnInit, AfterViewInit {

  @ViewChild('tree') tree: MatTree<any>;

  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      pertenece: node.pertenece,
      level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    public dialogRef: MatDialogRef<PerfilMenusComponent>
  ) {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tree.treeControl.expandAll();
  }

  expandAll() {
    this.ngAfterViewInit();
  }

}
