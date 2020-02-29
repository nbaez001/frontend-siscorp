import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ItemComboService } from '../../../../../service/item-combo.service';

@Component({
  selector: 'app-modal-forma-pago',
  templateUrl: './modal-forma-pago.component.html',
  styleUrls: ['./modal-forma-pago.component.scss']
})
export class ModalFormaPagoComponent implements OnInit {

  proyectoForm: FormGroup;
  listPagoJornal: any[];
  
  constructor(
    private itemComboService: ItemComboService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalFormaPagoComponent>,
  ) { }

  ngOnInit() {
    this.cargarCombos();
    this.formulario();
  }

  formulario(){
    this.proyectoForm = this.formBuilder.group({
      pagoJornal: [''],
    });
  }

  cargarCombos() {
    this.itemComboService.ObtenerComboPagoJornal().subscribe(data => {
      this.listPagoJornal = data.response
    });
  }

  aceptar(){
    this.dialogRef.close();
  }

}
