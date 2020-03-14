import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'plat-gestion-servicios',
    loadChildren: './modules/gest-serv/gest-serv.module#GestServModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtiRoutingModule { }
