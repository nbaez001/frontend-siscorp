import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, PageEvent } from '@angular/material';
import { MENSAJES } from 'app/common';
import { CotizacionService } from '../../../../service/cotizacion.service';

@Component({
  selector: 'app-historial-autorizacion',
  templateUrl: './historial-autorizacion.component.html',
  styleUrls: ['./historial-autorizacion.component.scss']
})
export class HistorialAutorizacionComponent implements OnInit {

  numeroAutoGasto: string;

  columnas: string[] = [];
  isLoading: boolean;
  mensaje: string;
  pagina = 1;
  cantidad = 10;
  total = 0;
  dataSource: MatTableDataSource<any>;
  cotizacionResponse: any[];

  constructor(
    private cotizacionService: CotizacionService,
    public dialogRef: MatDialogRef<HistorialAutorizacionComponent>,
    @Inject(MAT_DIALOG_DATA)
    private datos: dataAutorizacionGasto,
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.numeroAutoGasto = this.datos.numeroAutoGasto;
    this.columnasHistorial();
    this.cargaDataHistorial();
  }

  columnasHistorial(): void {
    this.columnas = [
      'item',
      'origen',
      'destino',
      'fechEnvio',
      'nombreEstado',
    ];
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargaDataHistorial();
  }

  public cargarTablaHistorial(): void {
    if (this.cotizacionResponse != null && this.cotizacionResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.cotizacionResponse);
    }
  }

  public cargaDataHistorial(): void {
    this.dataSource = null;
    this.cotizacionResponse = [];
    this.isLoading = true;
    this.cotizacionService.listarHistorialAutorizacionGasto(this.datos.idAutorizacionGasto, this.pagina, this.cantidad).subscribe(
      (wsResponseRequerimiento: any) => {
        if (wsResponseRequerimiento.codResultado == 1) {
          this.cotizacionResponse = (wsResponseRequerimiento.response != null) ? wsResponseRequerimiento.response : [];
          this.total = (wsResponseRequerimiento.total != 0) ? wsResponseRequerimiento.total : 0;
          this.cargarTablaHistorial();
        } else {
          this.mensaje = MENSAJES.ERROR_NOFUNCION;
          // this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
        }
        this.isLoading = false;
      },
      error => {
        console.error(error);

      }
    );
  }



}

export class dataAutorizacionGasto {
  idAutorizacionGasto?: number;
  numeroAutoGasto?: string;
}


