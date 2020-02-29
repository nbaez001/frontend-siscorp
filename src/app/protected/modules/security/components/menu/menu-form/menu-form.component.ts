import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Menu } from './../../../entities/menu';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'protected-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuFormComponent implements OnInit {

  menuForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MenuFormComponent>,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.menuForm = this.formBuilder.group({
      id_menu: this.data.menu.id_menu,
      id_menu_padre: this.data.menu.id_menu_padre,
      id_menu_hijo: [this.data.menu.id_menu_hijo || `${this.data.menu.id_menu_padre}.`, this.idMenuHijoValidators],
      menu_texto: [this.data.menu.menu_texto, [Validators.required]],
      accion_codigo: [this.data.menu.accion_codigo, [Validators.required, Validators.pattern('[a-z0-9]*')]],
      accion_icono: [this.data.menu.accion_icono, [Validators.required, Validators.pattern('[a-z0-9]*')]],
      menu_secuencia: [this.data.menu.menu_secuencia, [Validators.required]],
      estado: [this.data.menu.estado, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.menuForm.valid) {
      const data = this.menuForm.value;
      data.estado = data.estado ? 1 : 0;

      this.sendData(data).subscribe(() => {
        const response = this.data.option === 'CREAR' ? true : data;
        this.dialogRef.close(response);
      });

    } else {

      Object.values(this.menuForm.controls).forEach(c => c.markAsTouched());

    }
  }

  sendData(data: Menu) {
    return this.data.option === 'CREAR'
      ? this.menuService.createMenu(data)
      : this.menuService.editarMenu(data);
  }

  get idMenuHijoValidators(): Validators[] {
    const respValidators = [
      Validators.required,
      Validators.pattern('[a-z0-9.]*'),
    ];

    if (this.data.menu.id_menu_padre !== 'mnu.main') {
      respValidators.push(Validators.pattern(`^(${this.data.menu.id_menu_padre}.)+[a-z0-9]+`));
    }

    return respValidators;
  }

}

export interface DialogData {
  option: 'CREAR'|'EDITAR';
  menu: Menu;
}
