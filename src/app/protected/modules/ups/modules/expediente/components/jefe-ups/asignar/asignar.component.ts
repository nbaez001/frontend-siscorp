import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSnackBar, PageEvent, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';

import {map, startWith} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';
//import { State , states} from '../../../entities/state';
import { Personal } from '../../../entities/personal';
import { ConfirmMessageComponent } from '@shared/components/confirm-message/confirm-message.component';
import { AlertMessageComponent } from '@shared/components/alert-message/alert-message.component';



@Component({
  selector: 'app-asignar',
  templateUrl: './asignar.component.html',
  styleUrls: ['./asignar.component.scss']
})
export class AsignarComponent implements OnInit {

  atencionForm: FormGroup;

  title:String;
  names:any;
  nombre: string;

  search(){
    
    if(this.nombre != ""){
      this.personalDisponible = this.personalDisponible.filter(res =>{
        return res.nombre.toLocaleLowerCase().match(this.nombre.toLocaleLowerCase());
      });
    }else if(this.nombre == ""){
      this.ngOnInit();
    }
  }


  @ViewChild('noAcciones') noAcciones: ElementRef;
  @ViewChild('acciones') acciones: ElementRef;


  /*states$: Observable<State[]>;
  filteredStates$: Observable<State[]>;
  filter: FormControl;
  filter$: Observable<string>;*/

  personalDisponible: Personal[] = [
  {posicion:0,codigo: 1, nombre: "Raul Gustavo"},
  {posicion:1,codigo: 2, nombre: "Luis Benito"},
  {posicion:2,codigo: 3, nombre: "Miguel sanches"}
  ]


  dataPersonalDisponible(){
    this.personalDisponible  = [
      {posicion:0,codigo: 1, nombre: "Raul Gustavo"},
      {posicion:1,codigo: 2, nombre: "Luis Benito"},
      {posicion:2,codigo: 3, nombre: "Miguel sanches"}
    ]

 
     let cont=0;
      
      for (let i = 0; i < this.personalDisponible.length; i++) {
        this.personalDisponible.length;
        if(this.personalDisponible[i].codigo !=null){
          for(let j = 0; j < this.personalAsignado.length; j++){
           
            if(this.personalDisponible[i].codigo == this.personalAsignado[j].codigo){
              this.datos = this.personalDisponible[i];
              this.personalDisponible.splice(i,1);
              cont++;
            }
          
            if(cont>0){

              if(this.personalDisponible[i].codigo == this.personalAsignado[j].codigo){
                this.datos = this.personalDisponible[i];
                this.personalDisponible.splice(this.datos.posicion,1);
               
              }
            }
          }
        }   
      }
  }


  personalAsignado: Personal[] = [];

  
  states$: Observable<Personal[]>; 
  filteredStates$: Observable<Personal[]>;
  filter: FormControl;
  filter$: Observable<string>;

  datos : Personal;
  seleccionados: number[] = [];



  buscarPorCodigo(codigo: number = null){
    for (let i = 0; i < this.personalDisponible.length; i++) {
      if(this.personalDisponible[i].codigo == codigo){
          this.datos = this.personalDisponible[i];
      }
    }
  }

  agregar(index: number) {
    
    if(this.personalAsignado.length==0){
    this.personalAsignado.push(
      this.personalDisponible[index]
    );

    this.personalDisponible.splice(index, 1);
    }else{
      this.derivarAsignacion();
    }

  }


  

  quitar(index: number) {
    
    
      this.personalDisponible.push(
        this.personalAsignado[index]
      );
  
      this.personalAsignado.splice(index, 1);
   
   
  }


  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<AsignarComponent>,private dialog: MatDialog) {


    this.states$ = of(this.personalDisponible);
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.filteredStates$ = combineLatest(this.states$, this.filter$).pipe(
      map(([states, filterString]) => states.filter(state => state.nombre.indexOf(filterString) !== -1))
    );
   }

  ngOnInit() {
    this.crearFiltrosForm();
    this.dataPersonalDisponible();
  }


  crearFiltrosForm() {
    this.atencionForm = this.formBuilder.group({
      nombre: '',
      idEstado01:'',
      idEstado02:''
 
    });
  }


  derivarAsignacion():void{
    const dialogMessage: MatDialogRef<AlertMessageComponent> = this.dialog.open(AlertMessageComponent);
    dialogMessage.componentInstance.message = 'Sólo puede asignar un personal como coordinador';
    dialogMessage.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
     
      }
    });
  }

  registrarAsignacion(): void{
    
    if (this.personalAsignado.length>0) {
      const dialogMessage: MatDialogRef<ConfirmMessageComponent> = this.dialog.open(ConfirmMessageComponent);
      dialogMessage.componentInstance.message = '¿Asignar Coordinador al Proyecto?';
      dialogMessage.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          console.log('coordinador ' + this.personalAsignado[0].nombre);
          this.dialogRef.close(this.personalAsignado[0].nombre);
         
        }else{

        }
      });

    } else {
      
    }

  }


  onSelect(event: any, arrayTo: string, arrayFrom: string) {
    console.log('metodo onSelect');
    const options = event.target;
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        const accion = JSON.parse(options[i].value);

        /** QUITA EL ELEMENTO DE SU ARRAY DE ORIGEN */
        const moduloIndexFrom = this[arrayFrom].map(m => m.id_modulo).indexOf(accion.id_modulo);
        const accionIndexFrom = this[arrayFrom][moduloIndexFrom].acciones.map(a => a.id_accion).indexOf(accion.id_accion);

        if (moduloIndexFrom >= 0 && accionIndexFrom >= 0) {
          this[arrayFrom][moduloIndexFrom].acciones.splice(accionIndexFrom, 1);
        }

        /** AGREGA EL ELEMENTO */
        const moduloIndexTo = this[arrayTo].map(m => m.id_modulo).indexOf(accion.id_modulo);

        if (moduloIndexTo >= 0) {
          this[arrayTo][moduloIndexTo].acciones.push(accion);
        } else {
          this[arrayTo].push({
            id_modulo: this[arrayFrom][moduloIndexFrom].id_modulo,
            modulo_descripcion: this[arrayFrom][moduloIndexFrom].modulo_descripcion,
            acciones: [
              accion
            ]
          });
        }
      }
    }
  }





}
