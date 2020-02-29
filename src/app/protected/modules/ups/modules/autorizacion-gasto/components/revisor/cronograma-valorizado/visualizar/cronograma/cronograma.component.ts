import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ParametroRequest } from 'app/protected/modules/ups/modules/expediente/dto/request/ParametroRequest';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent implements OnInit {

  obraForm: FormGroup;
  step: number = 0;
  files: TreeNode[];
  loading: boolean;
  totalRecords: number;
  Frozencolumna: any[];
  Scrollcolumna: any[];
  parametroRequest: ParametroRequest;
  scrollHeightConfig: string;



  constructor(private nodeService: NodeService,
    public dialogRef: MatDialogRef<CronogramaComponent>,
    @Inject(MAT_DIALOG_DATA)
    private datos: any) { }

  ngOnInit() {
    //this.generarTableCronograma();
    this.files = this.datos.filesDataCrono;
    //this.cargaCronogramaOriginalPadre();
    this.scrollHeightConfig = "710px";
  }

  setStep(index: number) {
    this.step = index;
  }

  generarTableCronograma(){
    this.loading = true;
    this.Frozencolumna = [
      { field: 'item', header: 'Item' },
      { field: 'descripcion', header: 'Descripción' }
    ];
    this.Scrollcolumna = [
      { field: 'und', header: 'Unidad' },
      { field: 'cuadrilla', header: 'Cuadrilla' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'preciounitario', header: 'Precio Unitario' },
      { field: 'parcialunitario', header: 'Parcial Unitario' },
      { field: 'metrado', header: 'Metrado' },
      { field: 'precio', header: 'Precio' },
      { field: 'parcial', header: 'Parcial' },
  
      { field: 'metrado1', header: 'metrado1' },
      { field: 'soles1', header: 'soles1' },
      { field: 'porcentaje1', header: '%' },
      
      { field: 'metrado2', header: 'metrado2' },
      { field: 'soles2', header: 'soles2' },
      { field: 'porcentaje2', header: '%' },
  
      { field: 'metrado3', header: 'metrado3' },
      { field: 'soles3', header: 'soles3' },
      { field: 'porcentaje3', header: '%' },
      
      { field: 'metrado4', header: 'metrado4' },
      { field: 'soles4', header: 'soles4' },
      { field: 'porcentaje4', header: '%' } 
    ];
   }

   cargaCronogramaOriginalPadre() {
    let idMovimientoProyecto = 27148;
    this.loading = true;
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idMovimientoProyecto = idMovimientoProyecto;
    //this.nodeService.getCrononogramaTotales().then(files => this.files = files);

   // this.files = this.datos.filesDataCrono;
   
    //this.nodeService.cronogramaJsonFullChildren(this.parametroRequest).then(files => this.files = files);

  } 


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

