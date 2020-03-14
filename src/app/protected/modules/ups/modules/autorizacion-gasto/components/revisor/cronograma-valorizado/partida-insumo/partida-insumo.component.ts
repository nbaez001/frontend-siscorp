import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { ParametroRequest } from '../../../../../expediente/dto/request/ParametroRequest';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { CreateUpdateInsumoComponent } from './create-update-insumo/create-update-insumo.component';
import { filter } from 'rxjs/operators';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';

@Component({
  selector: 'app-partida-insumo',
  templateUrl: './partida-insumo.component.html',
  styleUrls: ['./partida-insumo.component.scss']
})
export class PartidaInsumoComponent implements OnInit {

  files: TreeNode[];
  scrollHeightConfig: string;
  parametroRequest: ParametroRequest;
  selectedNodes: TreeNode;
  idCodigoInsumo: number = 0;
  cidNombreInsumo: string = "";
  dialogRefMessage: MatDialogRef<any>;

  constructor(
    private snackBar: MatSnackBar,
    private nodeService: NodeService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<PartidaInsumoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public datos: any,
    @Inject(MAT_DIALOG_DATA)
    public datosPartida: DatosPartida,
  ) { }

  ngOnInit() {
    this.scrollHeightConfig = "200px";
    this.files = this.datos.filesData;
  }

  // editarInsumoPorFila(event: { field: string, data: any }): void {
  //   console.log(event.data);
  // }

  agregarInsumo() {
    const dialogReg: MatDialogRef<CreateUpdateInsumoComponent> = this.dialog.open(CreateUpdateInsumoComponent, {
      disableClose: true,
      panelClass: 'dialog-no-padding',
      width: '65%',
      autoFocus: false,
      data: {}
    });
    dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {
      let idMovimientoProyecto = 27148;
      this.parametroRequest = new ParametroRequest();
      this.parametroRequest.idMovimientoProyecto = idMovimientoProyecto;
      this.nodeService.getInsumoTotales().then(files => {
        this.files = files;
      });
    });
  }

  // seleccionaNode($event): void {
  //   this.idCodigoInsumo = +$event.node.data.ID_CODIGO;
  //   this.cidNombreInsumo = $event.node.data.DESCRIP_UND;
  // }

  dataTransferInsumo: any;
  editarInsumo() {
    /* if (this.selectedNodes != null && this.idCodigoInsumo != 0) { */
      this.nodeService.obtenerInsumo().then(files => {
        const dialogReg: MatDialogRef<CreateUpdateInsumoComponent> = this.dialog.open(CreateUpdateInsumoComponent, {
          disableClose: true,
          panelClass: 'dialog-no-padding',
          width: '65%',
          autoFocus: false,
          data: {
            dataTransferInsumo: files[0],
            flag: 1
          }
        });
        dialogReg.afterClosed().pipe(filter(r => !!r)).subscribe(() => {
          let idMovimientoProyecto = 27148;
          this.parametroRequest = new ParametroRequest();
          this.parametroRequest.idMovimientoProyecto = idMovimientoProyecto;
          this.nodeService.getInsumoTotales().then(files => {
            this.files = files;
          });
        });
      });
   /*  } */
  }

  // eliminarInsumo() {
  //    if (this.selectedNodes != null && this.idCodigoInsumo != 0) {
  //     this.openDialogMensajeConfirm("¿Está seguro de eliminar el insumo " + this.cidNombreInsumo + "?", true);
  //     this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)).subscribe(() => {
  //       this.snackBar.open("Insumo " + this.cidNombreInsumo + " eliminado");
  //       let idMovimientoProyecto = 27148;
  //       this.parametroRequest = new ParametroRequest();
  //       this.parametroRequest.idMovimientoProyecto = idMovimientoProyecto;
  //       this.nodeService.getInsumoTotales().then(files => {
  //         this.files = files;
  //       });
  //     });
  //     }
  // }

  // openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
  //   this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
  //     width: '400px',
  //     disableClose: true,
  //     data: { message: message, confirmacion: confirmacion }
  //   });
  // }

  // onMouseEnter(rowData): void {
  //   rowData.hover = true;
  // }

  // onMouseLeave(rowData): void {
  //   rowData.hover = false;
  // }

}

export interface DatosPartida {
  codigoPartida?: string;
  nombrePartida?: string;
}

export interface TreeNode {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}
