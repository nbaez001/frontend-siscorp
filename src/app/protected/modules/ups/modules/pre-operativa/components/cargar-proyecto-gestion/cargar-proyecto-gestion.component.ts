import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/protected/services/auth.service';
import { MENSAJES } from 'app/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-cargar-proyecto-gestion',
  templateUrl: './cargar-proyecto-gestion.component.html',
  styleUrls: ['./cargar-proyecto-gestion.component.scss']
})
export class CargarProyectoGestionComponent implements OnInit {
  proyectoForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    // private proyectoEjecucionService: ProyectoEjecucionService,
  
  ) {
   
    this.formulario();
    
    
  }

  ngOnInit() {
    
    this.tituloBandeja();
    
  }

  

  tituloBandeja() {
    this.authService.cabecera.next({
      titulo: MENSAJES.PREOPERATIVA.TITLE_PROYECTO,
      icono: ''
    });
  }

  formulario() {
    this.proyectoForm = this.formBuilder.group({
      nombreProyecto: [{ value: '', disabled: false }, [Validators.required]],
      nombreTambo: [{ value: '', disabled: false }, [Validators.required]],
      ubigeo: [{ value: '', disabled: false }, [Validators.required]],
      lugar: [{ value: '', disabled: true }, [Validators.required]],
     
      snip: [{ value: '', disabled: false }, [Validators.required]],
      montoviable: [{ value: '', disabled: false }, [Validators.required]],
      crp: [{ value: '', disabled: false }, [Validators.required]],
      cgp: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  

  ngOnDestroy() {
    this.authService.cabecera.next({
      titulo: '',
      icono: ''
    });
  }

  


}
