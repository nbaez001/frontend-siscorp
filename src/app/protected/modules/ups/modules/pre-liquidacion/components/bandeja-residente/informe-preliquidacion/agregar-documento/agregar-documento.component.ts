import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ItemBean } from '../../../../dto/response/ItemBean';
import { GestionPreliquidacionService } from '../../../../services/gestion-preliquidacion.services';
import { ItemComboService } from '../../../../services/item-combo.service';

@Component({
  selector: 'app-agregar-documento',
  templateUrl: './agregar-documento.component.html',
  styleUrls: ['./agregar-documento.component.scss']
})
export class AgregarDocumentoComponent implements OnInit {

  
  formularioDocumentoGrp: FormGroup;
  dataItemTipoDoc:ItemBean;
  tipodocs: ItemBean[] = [];
  archivo: string;

  selectedFiles: boolean;
  fileUpload: File;
  @ViewChild('fileInput')  fileInput;

  dataSource:any[][];// MatTableDataSource<Gasto>;
  columnas: string[] = [];
  pagina = 1;
  cantidad = 10;
  total = 0;
  
  titulo_requerimiento: string;
  constructor(
    public dialogRef: MatDialogRef<AgregarDocumentoComponent>,
    private gestionPreliquidacionService: GestionPreliquidacionService,
    private itemComboService: ItemComboService
    ) { 
    this.titulo_requerimiento = "ADJUNTAR DOCUMENTOS SUSTENTATORIOS";
  }

  ngOnInit() {
    this.crearForm();
    this.cargarTabla(); 
    this.cargarCombos();
  }

  crearForm() {
    this.formularioDocumentoGrp = new FormGroup({
     
      frmTipoDoc: new FormControl(null)
      
    });
  }

  cargarCombos(){
    this.itemComboService.ObtenerDocumentos().subscribe(dataItem => {
      this.dataItemTipoDoc = Object.assign({
        tipodocs: dataItem.response
      });
    });
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }
  selectFile(event) {  
    this.selectedFiles = true;
    this.fileUpload = event.target.files[0];
    this.archivo = event.target.files[0].name;
  }


  cargarTabla() {
    this.columnas = ['id', 'colDescripcion','colArchivo','acciones']; 

   //const filtros = Object.entries(this.formulario.value).map(([i, v]) => `${i}=${v}`).join('&');
    this.gestionPreliquidacionService.documentosTabla(
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
    console.log("agregarDocumento");
  }

  
  guardar(){
    console.log("guardar");
  }
}