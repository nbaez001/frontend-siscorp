import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { WsResponseProyecto } from '../../../../../dto/response/Proyecto';
import { SelectionModel } from '@angular/cdk/collections';
import { TrabajadorService } from '../../../../../service/trabajador.service';
import { MENSAJES } from 'app/common';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-registro-asistencia-tareo',
  templateUrl: './registro-asistencia-tareo.component.html',
  styleUrls: ['./registro-asistencia-tareo.component.scss']
})
export class RegistroAsistenciaTareoComponent implements OnInit {

  pagina = 1;
  cantidad = 2;
  total = 0;

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
    private trabajadorService: TrabajadorService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RegistroAsistenciaTareoComponent>,
    private snackBar: MatSnackBar,
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


   // **************** Carga de trabajadores en la tabla ****************
  public cargarTablaTrabajador(): void {
    if (this.proyectoResponse != null && this.proyectoResponse.length > 0) {
      this.dataSource = new MatTableDataSource(this.proyectoResponse);
    }
  }

   // **************** Carga la lista de asistencia ****************
  public cargarAsistenciaTareo(): void {

    this.dataSource = null;
    this.proyectoResponse = [];
    this.isLoading = true;

    this.trabajadorService.obtenerListadoAsistenciaTareo(this.pagina, this.cantidad, this.datos.dataTrabajadorSelectedRegistro)
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
      'tipo',
      'numeroDocumento',
      'asistencia1',
      // 'asistencia2',
      //'jornal'
    ];
  }

  // cambiarPagina(event: PageEvent) {
  //   this.pagina = event.pageIndex + 1;
  //   this.cantidad = event.pageSize;
  //   this.cargarAsistenciaTareo();
  // }

  seleccionarTrabajadorAsistenciaTareo(trabajador) {
    this.selectionAsistenciaTareo.toggle(trabajador);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectionAsistenciaTareo.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectionAsistenciaTareo.clear() :
      this.dataSource.data.forEach(row => this.selectionAsistenciaTareo.select(row));
  }

  guardarAsistenciaTareo() {
    if (this.selectionAsistenciaTareo.selected.length != 0) {
      let id = "";
      this.selectionAsistenciaTareo.selected.forEach(response => {
        id = id + response.idCodigo + ',';
      });
      console.log(id.substr(0, id.length - 1));
      // Registrar
      this.dialogRef.close();
    }

    this.openDialogMensajeConfirm(MENSAJES.TRABAJADOR.GUARDAR_TRABAJADOR_CONFIRM, true);
    this.dialogRefMessage.afterClosed()
      .pipe(filter(verdadero => !!verdadero))
      .subscribe(() => {
        this.dialogRef.close(true);
        this.snackBar.open("Asistencia guardada");
        
      });
  }

  dialogRefMessage: MatDialogRef<any>;
  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

}

interface DataTrabajador {
  dataTrabajadorSelectedRegistro?: any;
  dataTrabajadorSelectedFecha?: any;
}
