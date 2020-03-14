import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Menu } from './../../entities/menu';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';

@Component({
  selector: 'security-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  flatNodeMap = new Map<number, Menu>();

  treeControl: FlatTreeControl<Menu>;

  treeFlattener: MatTreeFlattener<Menu, Menu>;

  dataSource: MatTreeFlatDataSource<Menu, Menu>;

  constructor(
    private matDialog: MatDialog,
    private menuService: MenuService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<Menu>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    menuService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {}

  getLevel = (menu: Menu) => menu.nivel;
  isExpandable = (menu: Menu) => menu.cantidad_hijos > 0;
  getChildren = (menu: Menu): Menu[] => menu.hijos;

  transformer = (menu: Menu, level: number) => {
    this.flatNodeMap.set(menu.id_menu, menu);
    return menu;
  }

  open(menu: Menu) {
    const parentMenu = this.flatNodeMap.get(menu.id_menu);
    this.menuService.loadHijos(parentMenu, menu.nivel + 1);
  }

  addMenu(menu: Menu) {
    const dialogReg: MatDialogRef<MenuFormComponent> = this.matDialog.open(MenuFormComponent, {
      panelClass: 'menu-form-dialog',
      data: {
        option: 'CREAR',
        menu: { id_menu_padre: menu.id_menu_hijo }
      }
    });

    dialogReg.afterClosed().subscribe((guarded: boolean) => {
      if (guarded) {
        const parentMenu = this.flatNodeMap.get(menu.id_menu);
        this.menuService.loadHijos(parentMenu, menu.nivel + 1);
        this.treeControl.expand(menu);
      }
    });
  }

  editMenu(menu: Menu) {
    const dialogEdit: MatDialogRef<MenuFormComponent> = this.matDialog.open(MenuFormComponent, {
      panelClass: 'menu-form-dialog',
      data: {
        option: 'EDITAR',
        menu
      }
    });

    dialogEdit.afterClosed().subscribe((newMenu: any) => {
      if (typeof newMenu === 'object') {
        Object.assign(this.flatNodeMap.get(menu.id_menu), newMenu);
        this.menuService.reloadData();
      }
    });
  }

  deleteMenu(menu: Menu) {
    const dialogDel: MatDialogRef<ConfirmMessageComponent> = this.matDialog.open(ConfirmMessageComponent);
    dialogDel.componentInstance.message = '¿Está seguro que desea eliminar este menu?';

    dialogDel.afterClosed().subscribe((confirm: boolean) => {

      if (confirm) {
        this.menuService.deleteMenu(menu.id_menu).subscribe(() => {
          const menuParent = this.getParentMenu(menu);
          this.menuService.loadHijos(menuParent, menu.nivel);
          this.treeControl.expand(menu);
        });
      }

    });
  }

  getParentMenu(menu: Menu): Menu | null {
    const currentLevel = this.getLevel(menu);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(menu) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

}
