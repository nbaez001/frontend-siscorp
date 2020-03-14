import { Component, OnInit } from '@angular/core';

interface Usuario {
  numero: number;
  nombre: string;
  perfiles: number;
}

const usuarios: Usuario[] = [
  {numero: 1, nombre: 'Hydrogen', perfiles: 2},
  {numero: 2, nombre: 'Helium', perfiles: 3},
  {numero: 3, nombre: 'Lithium', perfiles: 5},
  {numero: 4, nombre: 'Beryllium', perfiles: 7},
  {numero: 5, nombre: 'Boron', perfiles: 1},
  {numero: 6, nombre: 'Carbon', perfiles: 0},
  {numero: 7, nombre: 'Nitrogen', perfiles: 5},
  {numero: 8, nombre: 'Oxygen', perfiles: 7},
  {numero: 9, nombre: 'Fluorine', perfiles: 9},
  {numero: 10, nombre: 'Neon', perfiles: 33},
];

@Component({
  selector: 'security-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  columnas: string[] = ['numero', 'nombre', 'perfiles', 'botones'];
  usuarios = usuarios;

  constructor() { }

  ngOnInit() {
  }

}
