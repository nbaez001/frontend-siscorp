import { Component, OnInit, Inject } from '@angular/core';
import { GestionTambosService } from '../../services/gestion-tambos.service';
import { MatDialogRef, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { Plataforma } from '../../entities/plataforma';
import { Prefactibilidad } from '../../entities/prefactibilidad';

@Component({
  selector: 'ups-subestado-plataformas',
  templateUrl: './subestado-plataformas.component.html',
  styleUrls: ['./subestado-plataformas.component.scss']
})
export class SubestadoPlataformasComponent implements OnInit {

  plataformas: Plataforma[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;

  columnas = ['nro', 'plataforma', 'unidad_territorial'];

  constructor(
    public matDialogRef: MatDialogRef<SubestadoPlataformasComponent>,
    @Inject(MAT_DIALOG_DATA) public detalleSubEstado: Prefactibilidad,
    private gestPlat: GestionTambosService
  ) { }

  ngOnInit() {
    this.cargarTambos();
  }

  cargarTambos() {
    this.gestPlat.tambos(
      this.pagina,
      this.cantidad,
      'ssubEstado=' + this.detalleSubEstado.idCodigo
    ).subscribe(({plataformas, total}) => {
      this.plataformas = plataformas;
      this.total = total;
    });
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarTambos();
  }

}
