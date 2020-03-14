import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'app/protected/services/auth.service';
import { GestionPreliquidacionService } from '../../../services/gestion-preliquidacion.services';
import { WsResponseValorizacionAvance } from '../../../dto/response/ValorizacionAvance';
import { WsResponseRegistroComprobante, RegistroComprobante } from '../../../dto/response/RegistroComprobante';
import { MatTableDataSource, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { ItemBean } from '../../../dto/response/ItemBean';
import { ItemComboService } from '../../../services/item-combo.service';
import { SelectionModel } from '@angular/cdk/collections';
import { InfoMessageComponent } from '@shared/components/info-message/info-message.component';
import { filter } from 'rxjs/operators';
import { RegistroComprobanteSubTotal, WsResponseRegistroComprobanteSubTotal } from '../../../dto/response/RegistroComprobanteSubTotal';

@Component({
  selector: 'app-registrar-comprobante',
  templateUrl: './registrar-comprobante.component.html',
  styleUrls: ['./registrar-comprobante.component.scss']
})
export class RegistrarComprobanteComponent implements OnInit {

  
  frmFiltrosGrp=new FormGroup({
    frmRecurso: new FormControl(null),
    frmComprobante:new FormControl(null),
    frmNumero: new FormControl(null)
  });

  dataSource: MatTableDataSource<RegistroComprobante>;
  datosResponse : RegistroComprobante[];
  columnas: string[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;

  dataSourceSubtotal:MatTableDataSource<RegistroComprobanteSubTotal>;
  datosResponseSubtotal : RegistroComprobanteSubTotal[];
  columnasSub: string[] = [];
  dataSourceTotal:MatTableDataSource<RegistroComprobanteSubTotal>;
  datosResponseTotal : RegistroComprobanteSubTotal[];

  //COMBOS
  comprobantes: ItemBean[] = [];
  dataItemComprobante: ItemBean;

  // Checked
    selectionRegistro = new SelectionModel<any>(true, []);
  //selection = new SelectionModel<RegistroComprobante>(true, []);
  
  dialogRefMessage: MatDialogRef<any>;
  
  constructor( 
    private authService: AuthService,
    private gestionPreliquidacionService:GestionPreliquidacionService,
    private itemComboService:ItemComboService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.cargarCombosFormulario();
    this.cargarTabla();
    this.cargarTablaSubTotal();
  }

  
 
  seleccionarRegistro(fila) {
    this.selectionRegistro.toggle(fila);
  }

  cantidadSeleccionados(): number {
    const numRows = this.dataSource.data.length;
    let contadorCheck : number=0 ;
    this.dataSource.data.forEach(ele => {
      if (ele.checked=== true) {
        contadorCheck+=1;
      }
    });
    return contadorCheck;
  }
  
  fraccionarInsumo(){
    if(this.selectionRegistro.selected.length == 1){ 
      this.openDialogMensajeConfirm("¿Está seguro de fraccionar insumo? ", true);

      this.dialogRefMessage.afterClosed().pipe(filter(verdadero => !!verdadero)) .subscribe(() => { 
        console.log(JSON.stringify(this.selectionRegistro.selected));
           this.dialogRefMessage.close();
        }); 
    } else if(this.selectionRegistro.selected.length >= 2){ 
      this.snackBar.open("Sólo debe seleccionar un registro "); 
    } else {
      this.snackBar.open("Seleccionar al menos un insumo ");
    }
  }

  cargarCombosFormulario() {
  
    //let dataItemComprobante:ItemBean;
    this.itemComboService.ObtenerComprobantes().subscribe(dataItem => {
      this.dataItemComprobante = Object.assign({
        comprobantes: dataItem.response
      });
    });
  }
  cargarTabla(){
    this.columnas = ['colCheck','colNro','colRecurso','colUnidadAut','colCantidadAut','colPreUniAut','colImporteAut','colProveedorAut','colNumAgAut','colCantidadRen','colPrecioUnitRen','colImporteRen','colComprobanteRen', 'colNumComprobanteRen','colCantidadDif','colPrecioUnitDif','colImporteDif','colObservacion']; 

      this.gestionPreliquidacionService.listarRegistroComprobante(this.pagina,this.cantidad)
      .subscribe(
        (wsResponseRegistroComprobante : WsResponseRegistroComprobante)=> {
          if(wsResponseRegistroComprobante.codResultado == 1){
            this.datosResponse = (wsResponseRegistroComprobante.response != null) ? wsResponseRegistroComprobante.response : [];
            this.total = (wsResponseRegistroComprobante.total!=0)? wsResponseRegistroComprobante.total : 0;
            if (this.datosResponse != null && this.datosResponse.length > 0) {
              this.dataSource = new MatTableDataSource(this.datosResponse);
            }
          }
        },
        error => {
          console.error(error);
        }   
      ); 
  }

  cargarTablaSubTotal(){
    this.columnasSub = ['colDescSub','colImporteAutSub','colImporteRenSub','colImporteDifSub','colObsSub']; 

      this.gestionPreliquidacionService.listarRegistroComprobanteSubTotal(this.pagina,this.cantidad)
      .subscribe(
        (wsResponseRegistroComprobanteSubTotal : WsResponseRegistroComprobanteSubTotal)=> {
          if(wsResponseRegistroComprobanteSubTotal.codResultado == 1){
            this.datosResponseSubtotal = (wsResponseRegistroComprobanteSubTotal.response != null) ? wsResponseRegistroComprobanteSubTotal.response : [];
            this.total = (wsResponseRegistroComprobanteSubTotal.total!=0)? wsResponseRegistroComprobanteSubTotal.total : 0;
            if (this.datosResponseSubtotal != null && this.datosResponseSubtotal.length > 0) {
              this.dataSourceSubtotal = new MatTableDataSource(this.datosResponseSubtotal);
            }
          }
        },
        error => {
          console.error(error);
        }   
      ); 
  }
 
  //DIALOGO DE CONFIRMACION
  openDialogMensajeConfirm(message: string, confirmacion: boolean): void {
    this.dialogRefMessage = this.dialog.open(InfoMessageComponent, {
      width: '400px',
      disableClose: true,
      data: { message: message, confirmacion: confirmacion }
    });
  }

  reiniciar(){
    console.log("limpiar campos");
  }

}
