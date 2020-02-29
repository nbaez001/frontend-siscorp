import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  {
    path: 'gestion-plataformas',
    loadChildren: './modules/gest-plataformas/gest-plataformas.module#GestPlataformasModule'
  },
  {
    path: 'expediente',
    loadChildren: './modules/expediente/expediente.module#ExpedienteModule'
  },
  {
    path: 'autorizacion',
    loadChildren: './modules/autorizacion-gasto/autorizacion-gasto.module#AutorizacionGastoModule'
  },
  {
    path: 'pre-liquidacion',
    loadChildren: './modules/pre-liquidacion/pre-liquidacion.module#PreLiquidacionModule'
  },
  {
    path: 'pre-operativa',
    loadChildren: './modules/pre-operativa/pre-operativa.module#PreOperativaModule'
  }
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpsRoutingModule { }

