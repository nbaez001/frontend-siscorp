import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';
import { FormGroup, FormControl } from '@angular/forms';
import { InformePre } from '../../../entities/informe-pre';
import { GestionPreliquidacionService } from '../../../services/gestion-preliquidacion.services';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AgregarDocumentoComponent } from './agregar-documento/agregar-documento.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-informe-preliquidacion',
  templateUrl: './informe-preliquidacion.component.html',
  styleUrls: ['./informe-preliquidacion.component.scss']
})
export class InformePreliquidacionComponent implements OnInit {

  titulo:string;
  formularioInformeGrp:FormGroup;
  dataSource:InformePre[][];// MatTableDataSource<Gasto>;
  columnas: string[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;

  constructor(
    private authService: AuthService,
    private gestionPreliquidacionService: GestionPreliquidacionService,
    public dialog: MatDialog
  ) { 
    this.titulo="INFORME PRE LIQUIDACIÓN"
  }


  ngOnInit() {
    this.tituloBandejaProyecto();
     this.crearForm();
    this.cargarTabla() ;
    // this.generarCabeceraColumnasEncargado();
    // this.cargarBandejaR();//carga la bandeja roca
    // this.cargarBandejaJ(); //carga la bandeja jimy
  }

  
  tituloBandejaProyecto() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PRE_LIQUIDACION.TITULO_BANDEJA_INFORME_PL,
      icono: ''
    });
  }
  
  crearForm() {
    this.formularioInformeGrp = new FormGroup({
      frmNroHoja: new FormControl(null),
      frmNroInforme: new FormControl(null),
      frmDestinatario: new FormControl(null),
      frmFechaInforme: new FormControl(null),
      frmAsunto: new FormControl(null),
      frmProyecto: new FormControl(null),
      frmNumConvenio: new FormControl(null),
      frmAspectosGen: new FormControl(null),
      frmAnalisis: new FormControl(null),
      frmSituacion: new FormControl(null),
      frmConclusion: new FormControl(null),
      frmRecomendacion: new FormControl(null)
    });
  }  
    
  cargarTabla() {
    this.columnas = [ 'colNro','colDescripcion','colArchivo','acciones']; 

   //const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');
    this.gestionPreliquidacionService.documentosSuntentatorios(
      this.pagina,
      this.cantidad
    ).subscribe(({response, total}) => {
      const filas = [];
       response.forEach(p => filas.push(  p    ));
     this.dataSource = filas;
      this.total = total;
    });
  }


 
  agregarDocumento(){
    console.log("agregar doc");
    const dialogReg: MatDialogRef<AgregarDocumentoComponent> = this.dialog.open(AgregarDocumentoComponent, {
      panelClass: 'dialog-no-padding',
      width: '1000px',
     //height:'800px',
      disableClose: true,
      data: {flag: 0}
  });

  dialogReg.afterClosed().pipe(filter(verdadero => !!verdadero))
    .subscribe(() => {
      this.cargarTabla();
      dialogReg.close(true);
    });
  }


  guardar(){
    console.log("guardar");
  }
  enviar(){
    console.log("enviar");
  }
  vistaPrevia(){
    console.log("vista previa");
  }

}
