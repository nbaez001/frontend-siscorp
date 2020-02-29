import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NodeService } from 'app/protected/modules/ups/modules/expediente/services/node.service';
import { MatDialogRef } from '@angular/material';
import { ParametroRequest } from 'app/protected/modules/ups/modules/expediente/dto/request/ParametroRequest';

@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss']
})
export class InsumoComponent implements OnInit {

  obraForm: FormGroup;
  step: number = 0;
  filesInsumo: TreeNode[];
  loading: boolean;
  totalRecords: number;
  FrozencolumnaInsumo: any[];
  ScrollcolumnaInsumo: any[];
  parametroRequest: ParametroRequest;
  scrollHeightConfigInsumo: string;

  files: TreeNode[];




  constructor(private nodeService: NodeService,
    public dialogRef: MatDialogRef<InsumoComponent>,) { }

  ngOnInit() {
    this.generarTablaInsumo();
    //this.generarTableCronograma();
    this.cargaInsumoMensualizadoOriginal();
    this.scrollHeightConfigInsumo = "710px";
  }

  setStep(index: number) {
    this.step = index;
  }

  generarTablaInsumo() {
    this.loading = true;
    this.FrozencolumnaInsumo = [
      { field: 'item', header: 'Item' },
      { field: 'recurso', header: 'Recurso' }
    ];
    this.ScrollcolumnaInsumo = [
      { field: 'unidad', header: 'Unidad' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'precio', header: 'Precio' },
      { field: 'parcial', header: 'Parcial' },

      { field: 'metrado1', header: 'metrado1' },
      { field: 'costo1', header: 'costo1' },

      { field: 'metrado2', header: 'metrado2' },
      { field: 'costo2', header: 'costo2' },

      { field: 'metrado3', header: 'metrado3' },
      { field: 'costo3', header: 'costo3' },

      { field: 'metrado4', header: 'metrado4' },
      { field: 'costo4', header: 'costo4' }

    ];
  }

  cargaInsumoMensualizadoOriginal() {
    let idMovimientoProyecto = 27148;
    this.loading = true;
    this.parametroRequest = new ParametroRequest();
    this.parametroRequest.idMovimientoProyecto = idMovimientoProyecto;
    this.nodeService.getInsumoPadre(this.parametroRequest).then(files => this.files = files);
   
    //this.nodeService.cronogramaJsonFullChildren(this.parametroRequest).then(files => this.files = files);

  } 



  generarTableCronograma(){
    this.loading = true;
    this.FrozencolumnaInsumo = [
      { field: 'item', header: 'Item' },
      { field: 'descripcion', header: 'Descripción' }
    ];
    this.ScrollcolumnaInsumo = [
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
   
    this.nodeService.cronogramaJsonFullChildren(this.parametroRequest).then(files => this.files = files);

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