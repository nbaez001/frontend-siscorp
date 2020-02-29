import { Component, OnInit } from '@angular/core';
import { GestionPreliquidacionService } from '../../../services/gestion-preliquidacion.services';
import { ResumenMovimiento } from '../../../dto/response/ResumenMovAlmacen';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-resumen-movimiento-almacen',
  templateUrl: './resumen-movimiento-almacen.component.html',
  styleUrls: ['./resumen-movimiento-almacen.component.scss']
})
export class ResumenMovimientoAlmacenComponent implements OnInit {

    formFiltrosGrp: FormGroup;
  dataSource:ResumenMovimiento[][];// MatTableDataSource<Gasto>;
  columnas: string[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;

  constructor( private gestionPreliquidacionService: GestionPreliquidacionService) { }

  ngOnInit() {
    this.crearFiltrosForm();
    this.cargarTabla();
  }

  crearFiltrosForm() {
    this.formFiltrosGrp = new FormGroup({
      fechaIniFrmCtrl: new FormControl(null),
      fechaFinFrmCtrl: new FormControl(null)
    });
  }

  cargarTabla() {
    this.columnas = [ 'colMaterial','colUnidad','colSaldoAnterior','colFechaIngreso','colProveedor','colCantidadIngreso','colAcumulado','colFechaEgreso','colPartida','colCantidadEgreso','colSaldo']; 

   //const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');
    this.gestionPreliquidacionService.listarResumenMovimientosAlmacen(
      this.pagina,
      this.cantidad
    ).subscribe(({response, total}) => {
      const filas = [];
       response.forEach(p => filas.push(  p    ));
     this.dataSource = filas;
      this.total = total;
    });
  }

  buscar(){
    console.log("buscar");
  }

  reiniciar(){
    console.log("reiniciar");
  }
  
  disableBuscar(){
    console.log("disableBuscar");
  }

}
