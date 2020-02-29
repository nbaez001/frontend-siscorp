import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MENSAJES } from 'app/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, PageEvent, MatSnackBar, MatDialog } from '@angular/material';
import { WsResponseProyecto } from '../../../../../dto/response/Proyecto';
import { TrabajadorService } from '../../../../../service/trabajador.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, isFuture, isPast, addHours } from 'date-fns';
import { CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-lista-asistencia-tareo',
  templateUrl: './lista-asistencia-tareo.component.html',
  styleUrls: ['./lista-asistencia-tareo.component.scss']
})
export class ListaAsistenciaTareoComponent implements OnInit {

  pagina = 1;
  cantidad = 2;
  total = 0;
  dialogRefMessage: MatDialogRef<any>;
  // Tabla
  dataSource: MatTableDataSource<any>;
  wsResponseProyecto: WsResponseProyecto;
  proyectoResponse: any[];
  objproyectoResponse: any;
  // Checked
  selectionAsistenciaTareo = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading: boolean;
  columnas: string[] = [];
  mensaje: string;

  constructor(
   
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private trabajadorService: TrabajadorService,
    public dialogRef: MatDialogRef<ListaAsistenciaTareoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos: DataTrabajador
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.generarCabeceraColumnas();
    this.cargarAsistenciaTareo();
  }

  // **************** BANDEJA ****************
  public cargarTablaTrabajador(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

  public cargarAsistenciaTareo(): void {

    this.dataSource = null;
    this.proyectoResponse = [];
    this.isLoading = true;

    this.trabajadorService.obtenerListadoAsistenciaTareoPorDia(this.pagina, this.cantidad, this.datos.dataListaTareoTrabajadorFecha)
      .subscribe(
        (wsResponseProyecto: WsResponseProyecto) => {
          if (wsResponseProyecto.codResultado == 1) {
            this.proyectoResponse = (wsResponseProyecto.response != null) ? wsResponseProyecto.response : [];
            this.total = (wsResponseProyecto.total != 0) ? wsResponseProyecto.total : 0;
            this.cargarTablaTrabajador();
          } else {
            this.mensaje = MENSAJES.ERROR_NOFUNCION;
            //this.openDialogMensaje(null,  wsResponseProyecto.msgResultado, true, false, wsResponseProyecto.codResultado);     
          }
          this.isLoading = false;
        },
        error => {
          console.error(error);
        }
      );
  }

  generarCabeceraColumnas(): void {
    this.columnas = [
      'nro',
      'nombre',
      'numeroDocumento',
      'tipo',
    ];
  }

  cambiarPagina(event: PageEvent) {
    this.pagina = event.pageIndex + 1;
    this.cantidad = event.pageSize;
    this.cargarAsistenciaTareo();
  }

  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  solicitarActivacion(){
    
    this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.SOLICITAR_ACTIVACION, true);
      this.dialogRefMessage.afterClosed()
        .pipe(filter(verdadero => !!verdadero))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.snackBar.open("Se envió la solicitud");
  
        });
  }


}



interface DataTrabajador {
  dataTrabajadorSelectedRegistro?: any;
  dataListaTareoTrabajadorFecha?: any;

 
}
