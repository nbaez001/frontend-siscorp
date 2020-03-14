import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { PerfilModuloService } from '../../../services/perfil-modulo.service';
import { Perfil } from '../../../entities/perfil';
import { MAT_DIALOG_DATA, MatDialogRef, MatListOption } from '@angular/material';

@Component({
  selector: 'security-perfil-modulo-form',
  templateUrl: './perfil-modulo-form.component.html',
  styleUrls: ['./perfil-modulo-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerfilModuloFormComponent implements OnInit {

  perfiles: Perfil[] = [];

  constructor(
    public dialogRef: MatDialogRef<PerfilModuloFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private codigoModulo: number,
    private perfilModuloService: PerfilModuloService
  ) { }

  ngOnInit() {
    this.cargarPerfiles();
  }

  cargarPerfiles() {
    this.perfilModuloService.perfiles(this.codigoModulo)
      .subscribe((perfiles) => this.perfiles = perfiles);
  }

  agregar(perfiles: MatListOption[]) {
    this.perfilModuloService.agregar({
      codigoModulo: this.codigoModulo,
      codigosPerfiles: perfiles.map(p => p.value.codigoPerfil)
    }).subscribe(() => this.dialogRef.close(true));
  }

}
