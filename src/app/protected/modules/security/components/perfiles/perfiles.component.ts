import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PerfilUsuariosComponent } from '../perfil-usuarios/perfil-usuarios.component';
import { PerfilMenusComponent } from '../perfil-menus/perfil-menus.component';

interface Perfil {
  id: number;
  nombre: string;
  modulos: number;
}

interface Modulo {
  id: number;
  nombre: string;
  usuarios: number;
}

@Component({
  selector: 'security-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent implements OnInit {

  perfiles: Perfil[] = [
    {
      id: 1,
      nombre: 'Perfil 1',
      modulos: 3
    },
    {
      id: 2,
      nombre: 'Perfil 2',
      modulos: 0
    },
    {
      id: 3,
      nombre: 'Perfil 3',
      modulos: 1
    },
    {
      id: 4,
      nombre: 'Perfil 4',
      modulos: 12
    },
    {
      id: 5,
      nombre: 'Perfil 5',
      modulos: 8
    },
    {
      id: 6,
      nombre: 'Perfil 6',
      modulos: 16
    }
  ];

  perfilSeleccionado: Perfil = null;

  modulos: Modulo[] = [
    {
      id: 1,
      nombre: 'Módulo 1',
      usuarios: 2
    },
    {
      id: 2,
      nombre: 'Módulo 2',
      usuarios: 0
    },
    {
      id: 3,
      nombre: 'Módulo 3',
      usuarios: 3
    },
    {
      id: 4,
      nombre: 'Módulo 4',
      usuarios: 4
    },
    {
      id: 5,
      nombre: 'Módulo 5',
      usuarios: 6
    }
  ];

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  seleccionarPerfil(perfil: Perfil) {
    if (this.perfilSeleccionado === perfil) {
      this.perfilSeleccionado = null;
      return;
    }

    this.perfilSeleccionado = perfil;
  }

  verUsuarios() {
    this.dialog.open(PerfilUsuariosComponent, {
      panelClass: ['dialog-no-padding', 'perfil-usuarios'],
      width: '500px'
    });
  }

  verMenus() {
    this.dialog.open(PerfilMenusComponent, {
      panelClass: ['dialog-no-padding', 'perfil-menus'],
      width: '500px'
    });
  }

}
