import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CargarProyectoGestionComponent } from './components/cargar-proyecto-gestion/cargar-proyecto-gestion.component';
import { CargarProyectoCRPComponent } from './components/cargar-proyecto-crp/cargar-proyecto-crp.component';

const routes: Routes = [
  {
    path: 'bandejaGestion',
    component: CargarProyectoGestionComponent
    
  },
  {
    path: 'bandejaCRP',
    component: CargarProyectoCRPComponent
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreOperativaRoutingModule { }
